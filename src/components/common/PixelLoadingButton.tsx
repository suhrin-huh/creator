"use client";

import { useEffect, useRef, useState } from "react";

const PIXEL_BTN_BASE =
  "inline-flex items-center justify-center gap-1.5 py-2 px-4.5 " +
  "bg-primary-outlined text-white font-pixel text-[7px] " +
  "border-2 border-[#4a6c1c] " +
  "shadow-[inset_1px_1px_0_rgba(255,255,255,0.35),2px_2px_0_rgba(50,80,20,0.25),4px_4px_0_rgba(0,0,0,0.1)] " +
  "cursor-pointer no-underline relative [image-rendering:pixelated] " +
  "transition-[transform,box-shadow] duration-[60ms] " +
  "before:content-[''] before:absolute before:top-0.75 before:left-0.75 before:right-0.75 before:h-0.5 before:bg-white/35 before:pointer-events-none before:z-10 " +
  "hover:-translate-x-px hover:-translate-y-px " +
  "hover:shadow-[inset_1px_1px_0_rgba(255,255,255,0.35),3px_3px_0_rgba(50,80,20,0.3),5px_5px_0_rgba(0,0,0,0.1)] " +
  "active:translate-x-0.5 active:translate-y-0.5 active:shadow-none " +
  "disabled:cursor-not-allowed disabled:opacity-85 disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-[inset_1px_1px_0_rgba(255,255,255,0.35),2px_2px_0_rgba(50,80,20,0.25),4px_4px_0_rgba(0,0,0,0.1)]";

function BouncingText({ chars, isAnimating }: { chars: string[]; isAnimating: boolean }) {
  return (
    <span className="relative z-10 flex">
      {chars.map((char, i) => (
        <span
          key={`${char}-${i}`}
          className="inline-block"
          style={
            isAnimating
              ? {
                  animation: "pixelBounce 0.65s ease-in-out infinite",
                  animationDelay: `${i * 0.07}s`,
                }
              : undefined
          }
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

interface PixelLoadingButtonProps {
  idleText: string;
  loadingText?: string;
  bgColor?: string;
  borderColor?: string;
  shadowColor?: string;
  fillColor?: string;
  className?: string;
  // useActionState의 isPending을 직접 받음
  isLoading: boolean;
  disabled?: boolean;
}

export default function PixelLoadingButton({
  idleText,
  loadingText = "LOADING...",
  bgColor,
  borderColor,
  shadowColor = "rgba(50,80,20,0.3)",
  fillColor = "rgba(255,255,255,0.2)",
  className = "",
  isLoading,
  disabled = false,
}: PixelLoadingButtonProps) {
  const [fillProgress, setFillProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const FILL_DURATION = 3000;

  const startFill = () => {
    // 이전 raf가 남아있으면 정리
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startTimeRef.current = null;

    const animate = (ts: number) => {
      if (!startTimeRef.current) startTimeRef.current = ts;
      const elapsed = ts - startTimeRef.current;
      const raw = Math.min(elapsed / FILL_DURATION, 0.95);
      const snapped = Math.floor(raw * 25) / 25;
      setFillProgress(snapped);

      if (raw < 0.95) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  };

  const completeFill = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    // 100%로 꽉 채웠다가 300ms 후 리셋
    setFillProgress(1);
    setTimeout(() => setFillProgress(0), 300);
  };

  // ════════════════════════════════
  //  핵심: isPending 변화를 감지해서 fill 연동
  //  true  → fill 시작
  //  false → fill 완료 처리
  // ════════════════════════════════
  useEffect(() => {
    if (isLoading) {
      startFill();
    } else {
      // 처음 마운트 시(fillProgress === 0)에는 completeFill 호출 안 함
      if (fillProgress > 0 || rafRef.current) {
        completeFill();
      }
    }
    // isLoading 변화에만 반응
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  // unmount 시 raf 정리
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const overrideStyle: React.CSSProperties = {
    ...(bgColor && { background: bgColor }),
    ...(borderColor && { borderColor: borderColor }),
    ...(bgColor && {
      boxShadow: `inset 1px 1px 0 rgba(255,255,255,0.35), 2px 2px 0 ${shadowColor}, 4px 4px 0 rgba(0,0,0,0.1)`,
    }),
  };

  return (
    <button
      type="submit"
      disabled={isLoading || disabled}
      className={[PIXEL_BTN_BASE, "overflow-hidden", className].filter(Boolean).join(" ")}
      style={overrideStyle}
    >
      {/* fill 바 */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] origin-left"
        style={{
          background: `repeating-linear-gradient(
            90deg,
            ${fillColor} 0px,
            ${fillColor} 3px,
            transparent 3px,
            transparent 4px
          )`,
          transform: `scaleX(${fillProgress})`,
          transition: fillProgress === 0 ? "transform 0.15s ease-in" : "transform 0.08s steps(1)",
        }}
      />

      <BouncingText
        chars={(isLoading ? loadingText : idleText).split("")}
        isAnimating={isLoading}
      />
    </button>
  );
}
