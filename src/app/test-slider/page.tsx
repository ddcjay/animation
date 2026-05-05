"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";

gsap.registerPlugin(Observer);

const slidesData = [
  { id: 1, title: "01", imageUrl: "/slides/slide-01.jpg" },
  { id: 2, title: "02", imageUrl: "/slides/slide-02.jpg" },
  { id: 3, title: "03", imageUrl: "/slides/slide-03.jpg" },
  { id: 4, title: "04", imageUrl: "/slides/slide-04.jpg" },
  { id: 5, title: "05", imageUrl: "/slides/slide-05.jpg" },
  { id: 6, title: "06", imageUrl: "/slides/slide-06.jpg" },
  { id: 7, title: "07", imageUrl: "/slides/slide-07.jpg" },
  { id: 8, title: "08", imageUrl: "/slides/slide-08.jpg" },
  { id: 9, title: "09", imageUrl: "/slides/slide-09.jpg" },
  { id: 10, title: "10", imageUrl: "/slides/slide-10.jpg" },
  { id: 11, title: "11", imageUrl: "/slides/slide-11.jpg" },
];

// Lerp 函式：用於平滑插值
const lerp = (start: number, end: number, factor: number) => {
  return start + (end - start) * factor;
};

export default function TestSliderPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const rafId = useRef<number | null>(null);
  
  // 狀態管理
  const state = useRef({
    targetProgress: 0,
    currentProgress: 0,
    isSnapping: false,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const totalSlides = slidesData.length;
    const tl = gsap.timeline({ paused: true });
    timelineRef.current = tl;

    // 初始化：第 0 張在原位，其餘全部推到螢幕下方
    slidesRef.current.forEach((slide, i) => {
      if (!slide) return;
      const bgImage = slide.querySelector(".bg-image");
      if (i === 0) {
        gsap.set(slide, { yPercent: 0 });
        gsap.set(bgImage, { yPercent: 0 });
      } else {
        gsap.set(slide, { yPercent: 100 });
        gsap.set(bgImage, { yPercent: -20 });
      }
    });

    // 建立 Master Timeline：處理膠捲的 Y 軸位移與內部照片的視差
    for (let i = 0; i < totalSlides - 1; i++) {
      const currentSlide = slidesRef.current[i];
      const nextSlide = slidesRef.current[i + 1];
      if (!currentSlide || !nextSlide) continue;

      const currentBg = currentSlide.querySelector(".bg-image");
      const nextBg = nextSlide.querySelector(".bg-image");

      // 在時間軸位置 i 的這 1 秒內：
      // 當前張往上退出 + 下一張從下方進入
      tl.to(currentSlide, { yPercent: -100, ease: "none", duration: 1 }, i);
      tl.to(currentBg, { yPercent: 20, ease: "none", duration: 1 }, i);
      tl.to(nextSlide, { yPercent: 0, ease: "none", duration: 1 }, i);
      tl.to(nextBg, { yPercent: 0, ease: "none", duration: 1 }, i);
    }

    // 渲染迴圈
    const render = () => {
      state.current.targetProgress = Math.max(0, Math.min(totalSlides - 1, state.current.targetProgress));
      state.current.currentProgress = lerp(state.current.currentProgress, state.current.targetProgress, 0.08);

      // 更新 Timeline 控制 Y 軸
      tl.progress(state.current.currentProgress / (totalSlides - 1));

      rafId.current = requestAnimationFrame(render);
    };
    rafId.current = requestAnimationFrame(render);

    const snapToNearest = () => {
      state.current.isSnapping = true;
      const nearestIndex = Math.round(state.current.targetProgress);
      gsap.to(state.current, {
        targetProgress: nearestIndex,
        duration: 0.8,
        ease: "power3.out",
        onComplete: () => {
          state.current.isSnapping = false;
        }
      });
    };

    const observer = Observer.create({
      target: window,
      type: "wheel,touch,pointer",
      wheelSpeed: -1,
      onDown: () => {
        gsap.killTweensOf(state.current);
        state.current.isSnapping = false;
      },
      onChangeY: (self) => {
        if (state.current.isSnapping) return;
        const delta = self.deltaY * -0.002;
        state.current.targetProgress += delta;
      },
      onUp: () => {
        if (!state.current.isSnapping) snapToNearest();
      },
      onWheel: (self) => {
        if (state.current.isSnapping) return;
        const delta = self.deltaY * 0.0015;
        state.current.targetProgress += delta;
        
        gsap.killTweensOf(snapToNearest);
        gsap.delayedCall(0.15, snapToNearest);
      }
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      gsap.killTweensOf(state.current);
      const currentIndex = Math.round(state.current.targetProgress);
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        gsap.to(state.current, {
          targetProgress: Math.min(totalSlides - 1, currentIndex + 1),
          duration: 0.8,
          ease: "power3.out"
        });
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        gsap.to(state.current, {
          targetProgress: Math.max(0, currentIndex - 1),
          duration: 0.8,
          ease: "power3.out"
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      observer.kill();
      tl.kill();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    // 外層容器設定為暗灰色 (zinc-900)，這樣才能突顯出黑色的膠捲
    <div ref={containerRef} className="h-screen w-full overflow-hidden relative bg-zinc-900 select-none touch-none">
      {slidesData.map((slide, index) => (
        <div
          key={slide.id}
          ref={(el) => {
            if (el) slidesRef.current[index] = el;
          }}
          // 每個 Slide 是 100vh，內部置中放置膠捲
          className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden"
          style={{ zIndex: index, y: index === 0 ? 0 : "100%" }}
        >
          {/* 黑色的連續膠捲主體 (高度 100% 滿版，無縫連接) */}
          <div className="relative w-full h-full bg-black flex flex-col justify-center">
            
            {/* 膠捲左側齒孔 (Sprockets) - 縮窄並靠邊 */}
            <div 
              className="absolute left-1 md:left-3 top-0 bottom-0 w-2 md:w-4" 
              style={{ backgroundImage: "repeating-linear-gradient(to bottom, transparent, transparent 12px, #18181b 12px, #18181b 24px)" }} 
            />
            {/* 膠捲右側齒孔 (Sprockets) */}
            <div 
              className="absolute right-1 md:right-3 top-0 bottom-0 w-2 md:w-4" 
              style={{ backgroundImage: "repeating-linear-gradient(to bottom, transparent, transparent 12px, #18181b 12px, #18181b 24px)" }} 
            />

            {/* 膠捲內部的照片容器 - 邊框變窄，照片佔比變大 (RWD 設定) */}
            <div className="w-full px-6 md:px-12 lg:px-20 h-[80vh] md:h-[85vh] flex flex-col justify-center">
              <div className="img-container w-full h-full relative overflow-hidden rounded-sm">
                <div
                  className="bg-image absolute inset-0 w-full h-[140%] -top-[20%] bg-cover bg-center"
                  style={{ backgroundImage: `url(${slide.imageUrl})` }}
                />
                <div className="absolute inset-0 bg-black/10" />
                
                {/* 標題疊加在照片上 */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <h2 className="font-bold text-5xl md:text-8xl lg:text-[9rem] text-white tracking-widest mix-blend-overlay">
                    {slide.title}
                  </h2>
                </div>
              </div>
            </div>

          </div>
        </div>
      ))}
      
      {/* 操作提示 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 text-zinc-500 text-xs tracking-widest uppercase font-mono">
        Drag or Scroll
      </div>
    </div>
  );
}

