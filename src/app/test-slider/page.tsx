"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

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
    current: 0,
    pending: -1,
    drag: 0,
    smoothDrag: 0,
    animating: false,
    dragging: false,
    startY: 0,
  });

  useEffect(() => {
    if (!containerRef.current) return;
    const total = slidesData.length;
    const mod = (n: number) => ((n % total) + total) % total;
    const vh = () => window.innerHeight;

    const killAll = () => {
      slidesRef.current.forEach((s) => {
        if (!s) return;
        gsap.killTweensOf(s);
        const bg = s.querySelector(".bg-image");
        if (bg) gsap.killTweensOf(bg);
      });
    };

    const reset = () => {
      slidesRef.current.forEach((s, i) => {
        if (!s) return;
        const bg = s.querySelector(".bg-image");
        if (i === state.current.current) {
          gsap.set(s, { yPercent: 0, zIndex: 1, willChange: "transform" });
          gsap.set(bg, { yPercent: 0, willChange: "transform" });
        } else {
          gsap.set(s, { yPercent: 100, zIndex: 0, willChange: "auto" });
          gsap.set(bg, { yPercent: 0 });
        }
      });
    };
    reset();

    // 依據 drag 值更新兩張 Slide 的位置
    const updateDragVisual = (d: number) => {
      const c = state.current.current;
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
      } else if (d < 0) {
        const pi = mod(c - 1);
        const ps = slidesRef.current[pi];
        const pb = ps?.querySelector(".bg-image");
        gsap.set(ps, { yPercent: -(1 + d) * 100, zIndex: 2 });
        gsap.set(pb, { yPercent: (1 + d) * 20 });
      }
    };

    // 渲染迴圈
    const render = () => {
      if (!state.current.animating) {
        state.current.smoothDrag = lerp(state.current.smoothDrag, state.current.drag, 0.12);
        if (Math.abs(state.current.smoothDrag) > 0.001) {
          updateDragVisual(state.current.smoothDrag);
        } else if (Math.abs(state.current.smoothDrag) > 0 && !state.current.dragging) {
          state.current.smoothDrag = 0;
          state.current.drag = 0;
          reset();
        }
      }
      rafId.current = requestAnimationFrame(render);
    };
    rafId.current = requestAnimationFrame(render);

    // 拖曳釋放後的過場動畫（從當前位置繼續，不重設）
    const animateTransition = (dir: 1 | -1) => {
      state.current.animating = true;
      state.current.drag = 0;
      state.current.smoothDrag = 0;

      const curr = state.current.current;
      const target = mod(curr + dir);
      state.current.pending = target;

      const cs = slidesRef.current[curr];
      const ts = slidesRef.current[target];
      const cb = cs.querySelector(".bg-image");
      const tb = ts.querySelector(".bg-image");

      gsap.to(cs, { yPercent: dir === 1 ? -100 : 100, duration: 0.8, ease: "power2.out" });
      gsap.to(cb, { yPercent: dir === 1 ? 20 : -20, duration: 0.8, ease: "power2.out" });
      gsap.to(ts, { yPercent: 0, duration: 0.8, ease: "power2.out" });
      gsap.to(tb, {
        yPercent: 0, duration: 0.8, ease: "power2.out",
        onComplete: () => {
          state.current.current = target;
          state.current.pending = -1;
          state.current.animating = false;
          reset();
        },
      });
    };

    // 彈回原位動畫
    const snapBack = () => {
      state.current.animating = true;
      const c = state.current.current;
      const cs = slidesRef.current[c];
      const cb = cs?.querySelector(".bg-image");

      const d = state.current.smoothDrag;
      const neighborIdx = d > 0 ? mod(c + 1) : mod(c - 1);
      const ns = slidesRef.current[neighborIdx];
      const nb = ns?.querySelector(".bg-image");
      const neighborTarget = d > 0 ? 100 : -100;

      state.current.drag = 0;
      state.current.smoothDrag = 0;

      gsap.to(cs, { yPercent: 0, duration: 0.5, ease: "power2.inOut" });
      gsap.to(cb, { yPercent: 0, duration: 0.5, ease: "power2.inOut" });
      gsap.to(ns, { yPercent: neighborTarget, duration: 0.5, ease: "power2.inOut" });
      gsap.to(nb, {
        yPercent: 0, duration: 0.5, ease: "power2.inOut",
        onComplete: () => {
          state.current.animating = false;
          reset();
        },
      });
    };

    // 鍵盤過場（支援中斷）
    const goTo = (dir: 1 | -1) => {
      if (state.current.animating && state.current.pending >= 0) {
        killAll();
        state.current.current = state.current.pending;
        state.current.pending = -1;
        state.current.animating = false;
        reset();
      }

      state.current.animating = true;
      state.current.drag = 0;
      state.current.smoothDrag = 0;

      const curr = state.current.current;
      const target = mod(curr + dir);
      state.current.pending = target;

      const cs = slidesRef.current[curr];
      const ts = slidesRef.current[target];
      const cb = cs.querySelector(".bg-image");
      const tb = ts.querySelector(".bg-image");

      gsap.set(cs, { zIndex: 1 });
      gsap.set(ts, { yPercent: dir === 1 ? 100 : -100, zIndex: 2, willChange: "transform" });
      gsap.set(tb, { yPercent: dir === 1 ? -20 : 20, willChange: "transform" });

      gsap.to(cs, { yPercent: dir === 1 ? -100 : 100, duration: 1, ease: "power2.inOut" });
      gsap.to(cb, { yPercent: dir === 1 ? 20 : -20, duration: 1, ease: "power2.inOut" });
      gsap.to(ts, { yPercent: 0, duration: 1, ease: "power2.inOut" });
      gsap.to(tb, {
        yPercent: 0, duration: 1, ease: "power2.inOut",
        onComplete: () => {
          state.current.current = target;
          state.current.pending = -1;
          state.current.animating = false;
          reset();
        },
      });
    };

    // Pointer 事件：直接追蹤 Y 座標
    const el = containerRef.current;

    const onPointerDown = (e: PointerEvent) => {
      if (state.current.animating) return;
      state.current.dragging = true;
      state.current.startY = e.clientY;
      state.current.drag = 0;
      state.current.smoothDrag = 0;
      el.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!state.current.dragging || state.current.animating) return;
      const deltaY = e.clientY - state.current.startY;
      // 向上拖曳 (deltaY < 0) → drag 正值 → 顯示下一張
      // 向下拖曳 (deltaY > 0) → drag 負值 → 顯示上一張
      state.current.drag = Math.max(-1, Math.min(1, -deltaY / vh()));
    };

    const onPointerUp = () => {
      if (!state.current.dragging) return;
      state.current.dragging = false;
      if (state.current.animating) return;

      const d = state.current.smoothDrag;
      if (d > 0.15) {
        animateTransition(1);
      } else if (d < -0.15) {
        animateTransition(-1);
      } else if (Math.abs(d) > 0.01) {
        snapBack();
      } else {
        state.current.drag = 0;
        state.current.smoothDrag = 0;
      }
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") goTo(1);
      else if (e.key === "ArrowUp" || e.key === "ArrowLeft") goTo(-1);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      killAll();
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
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
        上下拖曳或使用方向鍵瀏覽
      </div>
    </div>
  );
}
