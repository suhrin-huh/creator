// ════════════════════════════════
//  PixelButton — 픽셀아트 버튼 primitive
// ════════════════════════════════

import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

interface BaseProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
  variant?: "default" | "heart";
  bgColor?: string;
  borderColor?: string;
  className?: string;
}

// 링크형
type LinkProps = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { as: "a" };

// 버튼형
type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { as?: "button" };

type PixelButtonProps = LinkProps | ButtonProps;

export default function PixelButton(props: PixelButtonProps) {
  const {
    icon,
    children,
    variant = "default",
    bgColor,
    borderColor,
    className = "",
    as = "button",
    ...rest
  } = props;

  const baseStyle = {
    background: bgColor,
    borderColor: borderColor,
    boxShadow: bgColor ? `2px 2px 0 color-mix(in srgb, ${bgColor} 60%, black)` : undefined,
  };

  const pixelBtnLink =
    "inline-flex items-center gap-1.5 py-2 px-4.5 bg-green text-white font-pixel text-[7px] border-2 border-[#4a6c1c] shadow-[inset_1px_1px_0_rgba(255,255,255,0.35),2px_2px_0_rgba(50,80,20,0.25),4px_4px_0_rgba(0,0,0,0.1)] cursor-pointer no-underline relative [image-rendering:pixelated] transition-[transform,box-shadow] duration-[60ms] before:content-[''] before:absolute before:top-0.75 before:left-0.75 before:right-0.75 before:h-0.5 before:bg-white/35 before:pointer-events-none hover:-translate-x-px hover:-translate-y-px hover:shadow-[inset_1px_1px_0_rgba(255,255,255,0.35),3px_3px_0_rgba(50,80,20,0.3),5px_5px_0_rgba(0,0,0,0.1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none";

  const classes = [pixelBtnLink, variant === "heart" ? "pixel-btn-heart" : "", className]
    .filter(Boolean)
    .join(" ");

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
        style={baseStyle}
        {...(anchorRest as object)}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      className={classes}
      style={baseStyle}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}
