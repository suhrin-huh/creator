// components/common/PixelButton.tsx
// ════════════════════════════════
//  PixelButton — 픽셀아트 버튼 primitive
// ════════════════════════════════

import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

// ── variant별 색상 토큰 ──────────────────────
// 각 variant는 { bg, border, shadow, hover shadow } 세트로 정의
// bgColor/borderColor override는 유지 (특수 케이스 대응)
export type PixelButtonVariant =
  | "primary" // 파랑 — 주요 CTA (저장, 확인, 제출)
  | "secondary" // 초록 — 보조 액션 (이동, 링크)
  | "danger" // 빨강 — 파괴적 액션 (삭제, 취소)
  | "warning" // 노랑 — 주의 필요 액션 (수정, 임시저장)
  | "ghost" // 반투명 — 강조 없는 액션 (닫기, 뒤로가기)
  | "muted" // disabled 상태 또는 비활성 UI에 사용, hover/active 효과 없음 — 의도적으로 상호작용 불가 느낌 표현
  | "outlined"; // 테두리만 존재하는 버튼
// TODO: outlined 버튼도 만들면 좋을듯!

const VARIANT_STYLES: Record<PixelButtonVariant, { classes: string }> = {
  primary: {
    classes:
      "bg-primary-dark border-primary text-white " +
      "shadow-[inset_1px_1px_0_rgba(255,255,255,0.35),2px_2px_0_rgba(40,50,120,0.25),4px_4px_0_rgba(0,0,0,0.1)] " +
      "hover:shadow-[inset_1px_1px_0_rgba(255,255,255,0.35),3px_3px_0_rgba(40,50,120,0.3),5px_5px_0_rgba(0,0,0,0.1)]",
  },
  secondary: {
    classes:
      "bg-secondary border-secondary-dark text-white " +
      "shadow-[inset_1px_1px_0_rgba(255,255,255,0.35),2px_2px_0_rgba(50,80,20,0.25),4px_4px_0_rgba(0,0,0,0.1)] " +
      "hover:shadow-[inset_1px_1px_0_rgba(255,255,255,0.35),3px_3px_0_rgba(50,80,20,0.3),5px_5px_0_rgba(0,0,0,0.1)]",
  },
  danger: {
    classes:
      "bg-danger border-danger-dark text-white " +
      "shadow-[inset_1px_1px_0_rgba(255,255,255,0.35),2px_2px_0_rgba(120,20,20,0.25),4px_4px_0_rgba(0,0,0,0.1)] " +
      "hover:shadow-[inset_1px_1px_0_rgba(255,255,255,0.35),3px_3px_0_rgba(120,20,20,0.3),5px_5px_0_rgba(0,0,0,0.1)]",
  },
  warning: {
    classes:
      "bg-warning border-warning-dark text-foreground-main " +
      "shadow-[inset_1px_1px_0_rgba(255,255,255,0.35),2px_2px_0_rgba(120,80,0,0.25),4px_4px_0_rgba(0,0,0,0.1)] " +
      "hover:shadow-[inset_1px_1px_0_rgba(255,255,255,0.35),3px_3px_0_rgba(120,80,0,0.3),5px_5px_0_rgba(0,0,0,0.1)]",
  },
  ghost: {
    classes:
      "bg-white/15 border-primary-outlined-light text-foreground-main " +
      "shadow-[inset_1px_1px_0_rgba(255,255,255,0.5),2px_2px_0_rgba(90,110,180,0.15),4px_4px_0_rgba(0,0,0,0.06)] " +
      "hover:shadow-[inset_1px_1px_0_rgba(255,255,255,0.5),3px_3px_0_rgba(90,110,180,0.2),5px_5px_0_rgba(0,0,0,0.06)] " +
      "hover:bg-white/25",
  },
  muted: {
    classes:
      "bg-muted border-muted-dark text-foreground-main " +
      "shadow-[inset_1px_1px_0_rgba(255,255,255,0.2),2px_2px_0_rgba(0,0,0,0.15),4px_4px_0_rgba(0,0,0,0.08)] " +
      "cursor-not-allowed pointer-events-none",
  },
  outlined: {
    classes:
      "bg-primary-light border-primary text-foreground-main" +
      "shadow-[inset_1px_1px_0_rgba(255,255,255,0.5),2px_2px_0_rgba(90,110,180,0.15),4px_4px_0_rgba(0,0,0,0.06)] " +
      "hover:shadow-[inset_1px_1px_0_rgba(255,255,255,0.5),3px_3px_0_rgba(90,110,180,0.2),5px_5px_0_rgba(0,0,0,0.06)] ",
  },
};

// ── 공통 베이스 클래스 (색상 제외) ──────────
const PIXEL_BTN_BASE =
  "inline-flex items-center gap-1.5 py-2 px-4.5 " +
  "font-pixel text-[7px] border-2 " +
  "cursor-pointer no-underline relative [image-rendering:pixelated] " +
  "transition-[transform,box-shadow] duration-[60ms] " +
  "before:content-[''] before:absolute before:top-0.75 before:left-0.75 before:right-0.75 " +
  "before:h-0.5 before:bg-white/35 before:pointer-events-none " +
  "hover:-translate-x-px hover:-translate-y-px " +
  "active:translate-x-0.5 active:translate-y-0.5 active:shadow-none " +
  "disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0";

// ── Props ───────────────────────────────────
interface BaseProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
  variant?: PixelButtonVariant;
  // bgColor/borderColor: variant로 표현 안 되는 특수 케이스용 escape hatch
  bgColor?: string;
  borderColor?: string;
  className?: string;
}

type LinkProps = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { as: "a" };
type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { as?: "button" };
type PixelButtonProps = LinkProps | ButtonProps;

// ── Component ───────────────────────────────
export default function PixelButton(props: PixelButtonProps) {
  const {
    icon,
    children,
    variant = "primary",
    bgColor,
    borderColor,
    className = "",
    as = "button",
    ...rest
  } = props;

  const variantClasses = VARIANT_STYLES[variant].classes;

  // bgColor/borderColor override가 있으면 인라인 스타일로 덮어쓰기
  const overrideStyle: React.CSSProperties = {
    ...(bgColor && { background: bgColor }),
    ...(borderColor && { borderColor: borderColor }),
    ...(bgColor && {
      boxShadow: `inset 1px 1px 0 rgba(255,255,255,0.35), 2px 2px 0 color-mix(in srgb, ${bgColor} 60%, black), 4px 4px 0 rgba(0,0,0,0.1)`,
    }),
  };

  const classes = [PIXEL_BTN_BASE, variantClasses, className].filter(Boolean).join(" ");

  const content = (
    <>
      {icon && (
        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/25 text-[10px]">
          {icon}
        </span>
      )}
      {children}
    </>
  );

  if (as === "a") {
    const { href, target, rel, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a
        href={href}
        target={target}
        rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
        className={classes}
        style={overrideStyle}
        {...(anchorRest as object)}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      className={classes}
      style={overrideStyle}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}
