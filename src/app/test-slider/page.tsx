"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";

gsap.registerPlugin(Observer);

const slidesData = [
  { id: 1, imageUrl: "/slides/slide-01.jpg" },
  { id: 2, imageUrl: "/slides/slide-02.jpg" },
  { id: 3, imageUrl: "/slides/slide-03.jpg" },
  { id: 4, imageUrl: "/slides/slide-04.jpg" },
  { id: 5, imageUrl: "/slides/slide-05.jpg" },
  { id: 6, imageUrl: "/slides/slide-06.jpg" },
  { id: 7, imageUrl: "/slides/slide-07.jpg" },
  { id: 8, imageUrl: "/slides/slide-08.jpg" },
  { id: 9, imageUrl: "/slides/slide-09.jpg" },
  { id: 10, imageUrl: "/slides/slide-10.jpg" },
  { id: 11, imageUrl: "/slides/slide-11.jpg" },
];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function TestSliderPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement[]>([]);
  const rafId = useRef<number | null>(null);

  const state = useRef({
    current: 0,       // 目前顯示的 Slide 索引
    pending: -1,      // 動畫中的目標索引（-1 = 無）
    targetDrag: 0,    // 拖曳目標量（-1 ~ 1）
    currentDrag: 0,   // Lerp 後的拖曳量
    animating: false,
  });

  useEffect(() => {
    if (!containerRef.current) return;
    const total = slidesData.length;
    const mod = (n: number) => ((n % total) + total) % total;

    // 殺掉所有 Slide 上的 GSAP 動畫
    const killAll = () => {
      slidesRef.current.forEach((s) => {
        if (!s) return;
        gsap.killTweensOf(s);
        const bg = s.querySelector(".bg-image");
        if (bg) gsap.killTweensOf(bg);
      });
      gsap.killTweensOf(state.current);
    };

    // 重置：只有 currentSlide 可見
    const reset = () => {
      slidesRef.current.forEach((s, i) => {
        if (!s) return;
        const bg = s.querySelector(".bg-image");
        if (i === state.current.current) {
          gsap.set(s, { yPercent: 0, zIndex: 1 });
          gsap.set(bg, { yPercent: 0 });
        } else {
          gsap.set(s, { yPercent: 100, zIndex: 0 });
          gsap.set(bg, { yPercent: 0 });
        }
      });
    };
    reset();

    // 渲染迴圈：處理拖曳期間的即時視覺更新
    const render = () => {
      if (!state.current.animating) {
        state.current.currentDrag = lerp(state.current.currentDrag, state.current.targetDrag, 0.1);
        const d = state.current.currentDrag;
        const c = state.current.current;

        if (Math.abs(d) > 0.001) {
          const cs = slidesRef.current[c];
          const cb = cs?.querySelector(".bg-image");
          gsap.set(cs, { yPercent: d * -100, zIndex: 1 });
          gsap.set(cb, { yPercent: d * 20 });

          if (d > 0) {
            const ni = mod(c + 1);
            const ns = slidesRef.current[ni];
            const nb = ns?.querySelector(".bg-image");
            gsap.set(ns, { yPercent: (1 - d) * 100, zIndex: 2 });
            gsap.set(nb, { yPercent: (1 - d) * -20 });
          } else {
            const pi = mod(c - 1);
            const ps = slidesRef.current[pi];
            const pb = ps?.querySelector(".bg-image");
            gsap.set(ps, { yPercent: -(1 + d) * 100, zIndex: 2 });
            gsap.set(pb, { yPercent: (1 + d) * 20 });
          }
        }
      }
      rafId.current = requestAnimationFrame(render);
    };
    rafId.current = requestAnimationFrame(render);

    // 命令式過場：支援中斷
    const goTo = (dir: 1 | -1) => {
      // 若正在動畫中 → 強制完成後再啟動新過場
      if (state.current.animating && state.current.pending >= 0) {
        killAll();
        state.current.current = state.current.pending;
        state.current.pending = -1;
        state.current.animating = false;
        state.current.targetDrag = 0;
        state.current.currentDrag = 0;
        reset();
      }

      state.current.animating = true;
      state.current.targetDrag = 0;
      state.current.currentDrag = 0;

      const curr = state.current.current;
      const target = mod(curr + dir);
      state.current.pending = target;

      const cs = slidesRef.current[curr];
      const ts = slidesRef.current[target];
      const cb = cs.querySelector(".bg-image");
      const tb = ts.querySelector(".bg-image");

      gsap.set(cs, { zIndex: 1 });
      gsap.set(ts, { yPercent: dir === 1 ? 100 : -100, zIndex: 2 });
      gsap.set(tb, { yPercent: dir === 1 ? -20 : 20 });

      gsap.to(cs, { yPercent: dir === 1 ? -100 : 100, duration: 0.8, ease: "power3.out" });
      gsap.to(cb, { yPercent: dir === 1 ? 20 : -20, duration: 0.8, ease: "power3.out" });
      gsap.to(ts, { yPercent: 0, duration: 0.8, ease: "power3.out" });
      gsap.to(tb, {
        yPercent: 0, duration: 0.8, ease: "power3.out",
        onComplete: () => {
          state.current.current = target;
          state.current.pending = -1;
          state.current.animating = false;
          reset();
        },
      });
    };

    // 拖曳釋放：判斷是否過場或彈回
    const snap = () => {
      const d = state.current.currentDrag;
      if (d > 0.15) {
        goTo(1);
      } else if (d < -0.15) {
        goTo(-1);
      } else {
        state.current.targetDrag = 0;
      }
    };

    const observer = Observer.create({
      target: window,
      type: "touch,pointer",
      onDown: () => {
        if (state.current.animating) return;
      },
      onChangeY: (self) => {
        if (state.current.animating) return;
        state.current.targetDrag += self.deltaY * -0.003;
        state.current.targetDrag = Math.max(-1, Math.min(1, state.current.targetDrag));
      },
      onUp: () => {
        if (state.current.animating) return;
        snap();
      },
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") goTo(1);
      else if (e.key === "ArrowUp" || e.key === "ArrowLeft") goTo(-1);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      killAll();
      observer.kill();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={containerRef} className="h-screen w-full overflow-hidden relative bg-zinc-900 select-none touch-none">
      {slidesData.map((slide, index) => (
        <div
          key={slide.id}
          ref={(el) => { if (el) slidesRef.current[index] = el; }}
          className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden"
        >
          <div className="relative w-full h-full bg-black flex flex-col justify-center">
            <div
              className="absolute left-3 md:left-6 top-0 bottom-0 w-2 md:w-4"
              style={{ backgroundImage: "repeating-linear-gradient(to bottom, transparent, transparent 12px, #555 12px, #555 24px)" }}
            />
            <div
              className="absolute right-3 md:right-6 top-0 bottom-0 w-2 md:w-4"
              style={{ backgroundImage: "repeating-linear-gradient(to bottom, transparent, transparent 12px, #555 12px, #555 24px)" }}
            />
            <div className="w-full px-6 md:px-12 lg:px-20 h-[88vh] md:h-[92vh] flex flex-col justify-center">
              <div className="img-container w-full h-full relative overflow-hidden rounded-sm">
                <div
                  className="bg-image absolute inset-0 w-full h-[140%] -top-[20%] bg-cover bg-center"
                  style={{ backgroundImage: `url(${slide.imageUrl})` }}
                />
                <div className="absolute inset-0 bg-black/10" />
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-50 text-zinc-500 text-xs tracking-widest">
        拖曳或使用方向鍵瀏覽
      </div>
    </div>
  );
}
