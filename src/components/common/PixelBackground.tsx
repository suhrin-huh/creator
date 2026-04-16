"use client";

// ════════════════════════════════
//  PixelBackground — 별 + 구름 배경 레이어
//  fixed 포지션, z-index 0
// ════════════════════════════════

import { useEffect, useRef } from "react";

const STAR_CHARS = ["✦", "✧", "✩", "✫", "✬", "·"];

const CLOUD_DEFS = [
  { type: "sm" as const, top: "6%", dur: 26, delay: 0 },
  { type: "md" as const, top: "12%", dur: 38, delay: 7 },
  { type: "lg" as const, top: "4%", dur: 52, delay: 16 },
  { type: "sm" as const, top: "20%", dur: 22, delay: 21 },
  { type: "md" as const, top: "65%", dur: 44, delay: 4 },
  { type: "lg" as const, top: "75%", dur: 56, delay: 11 },
  { type: "sm" as const, top: "82%", dur: 30, delay: 18 },
  { type: "md" as const, top: "50%", dur: 48, delay: 28 },
];

// 픽셀 구름 SVG 생성
function makeCloudSVG(type: "sm" | "md" | "lg"): string {
  const configs = {
    sm: {
      w: 90,
      h: 44,
      fill: "rgba(255,255,255,0.82)",
      stroke: "rgba(180,200,240,0.5)",
      path: "M18,34 H72 V26 H60 V18 H44 V10 H28 V18 H16 V26 H8 V34 Z",
    },
    md: {
      w: 130,
      h: 58,
      fill: "rgba(230,240,255,0.78)",
      stroke: "rgba(170,190,230,0.45)",
      path: "M22,46 H108 V36 H94 V24 H74 V14 H50 V24 H34 V36 H20 V46 Z M10,46 H22 V38 H14 V46 Z M108,46 H120 V38 H108 V46 Z",
    },
    lg: {
      w: 170,
      h: 70,
      fill: "rgba(210,225,255,0.72)",
      stroke: "rgba(160,185,230,0.4)",
      path: "M28,58 H142 V46 H124 V32 H102 V18 H72 V32 H50 V46 H26 V58 Z M10,58 H28 V48 H16 V58 Z M142,58 H160 V48 H142 V58 Z",
    },
  };
  const c = configs[type];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${c.w}" height="${c.h}" viewBox="0 0 ${c.w} ${c.h}" shape-rendering="crispEdges"><path d="${c.path}" fill="${c.fill}" stroke="${c.stroke}" stroke-width="2"/></svg>`;
}

export default function PixelBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = ref.current;
    if (!layer) return;

    // 별 생성
    for (let i = 0; i < 55; i++) {
      const s = document.createElement("span");
      s.className = "bg-star";
      s.textContent = STAR_CHARS[Math.floor(Math.random() * STAR_CHARS.length)];
      const sz = 6 + Math.random() * 10;
      s.style.cssText = [
        `left:${Math.random() * 100}%`,
        `top:${Math.random() * 100}%`,
        `--sz:${sz}px`,
        `--dur:${1.4 + Math.random() * 3}s`,
        `--delay:${Math.random() * 4}s`,
        `--peak:${0.4 + Math.random() * 0.5}`,
      ].join(";");
      layer.appendChild(s);
    }

    // 구름 생성
    CLOUD_DEFS.forEach((def) => {
      const div = document.createElement("div");
      div.className = "bg-cloud";
      div.style.cssText = [
        `top:${def.top}`,
        `--cdur:${def.dur}s`,
        `--cdelay:-${def.delay}s`,
        "--from:-180px",
        "--to:calc(100vw + 200px)",
      ].join(";");
      div.innerHTML = makeCloudSVG(def.type);
      layer.appendChild(div);
    });

    // cleanup
    return () => {
      if (layer) layer.innerHTML = "";
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    />
  );
}
