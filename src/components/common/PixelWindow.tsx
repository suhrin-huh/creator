interface TitlebarDecoProps {
  className?: string;
}

function TitlebarDeco({ className }: TitlebarDecoProps) {
  return (
    <div className={`flex shrink-0 items-center gap-1 ${className ?? ""}`}>
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="bg-primary h-[10px] w-2 [clip-path:polygon(20%_0%,80%_0%,80%_40%,100%_40%,100%_60%,80%_60%,80%_100%,20%_100%,20%_60%,0%_60%,0%_40%,20%_40%)]"
        />
      ))}
    </div>
  );
}

interface WinButtonsProps {
  onClose?: () => void;
}

/* 윈도우 버튼 공통 */
const PIXEL_WINDOW_BTN_STYLE = [
  "flex items-center justify-center", // 레이아웃
  "border-pixel border", // border 기본 설정
  "text-[6px] font-bold",
  "leading-none cursor-pointer",
  // "shadow-[inset_1px_1px_0_rgba(255,255,255,0.85),inset_-1px_-1px_0_rgba(80,100,180,0.18) ",
  "image-rendering:pixelated",
  "hover:bg-[#d0daff]",
].join(" ");

function WinButtons({ onClose }: WinButtonsProps) {
  return (
    <div className="gap-xs flex">
      {/* 최소화 */}
      <button
        className={`${PIXEL_WINDOW_BTN_STYLE} border-primary bg-primary-light text-foreground-main h-3.5 w-3.5 text-[6px]`}
      >
        _
      </button>
      {/* 최대화 */}
      <button
        className={`${PIXEL_WINDOW_BTN_STYLE} border-primary bg-primary-light text-foreground-main h-3.5 w-3.5 text-[6px]`}
      >
        □
      </button>
      {/* 닫기 */}
      <button
        className={`${PIXEL_WINDOW_BTN_STYLE} bg-danger border-danger-outlined hover:bg-danger-active h-3.5 w-3.5 text-[6px] text-white`}
        onClick={onClose}
        aria-label="창 닫기"
      >
        ✕
      </button>
    </div>
  );
}

// ── StatusBar ──────────────────
interface StatusBarProps {
  children: React.ReactNode;
}

export function StatusBar({ children }: StatusBarProps) {
  return (
    <div className="gap-md border-t-pixel py-xs px-sm border-primary text-foreground-muted font-pixel flex bg-[#dde4f8] text-[6px]">
      {children}
    </div>
  );
}

// ── PixelWindow (메인 export) ──
interface PixelWindowProps {
  title: string;
  children: React.ReactNode;
  statusBar?: React.ReactNode;
  onClose?: () => void;
  className?: string;
  id?: string;
}

/**
 * PixelWindow — 재사용 가능한 윈도우 껍데기, UI만 담당, 비즈니스로직 X
 * @param title (required) 상단 타이틀
 * @param className 추가 스타일
 * @param statusBar 하단 상태바
 * @param onClose 닫침 버튼 핸들러
 * @param id
 * @param children (required)
 * @returns
 */

export default function PixelWindow({
  title,
  children,
  statusBar,
  onClose,
  className,
  id,
}: PixelWindowProps) {
  return (
    <section
      className={`bg-primary-light border-pixel border-primary-outlined-light shadow-[inset_-2px_-2px_0_#fff,inset_2px_2px_0_rgba(255,255,255,0.85),5px_5px_0_rgba(90,110,180,0.15)] ${className ?? ""}`}
      id={id}
    >
      {/* 타이틀바 */}
      <div className="gap-sm border-b-pixel border-primary flex cursor-default items-center justify-between bg-[#aabbee] px-[7px] py-[5px] select-none">
        <TitlebarDeco />
        <span className="font-pixel text-foreground-main flex-1 text-center text-[7px] tracking-[0.5px]">
          {title}
        </span>
        <WinButtons onClose={onClose} />
      </div>
      {/* 본문 */}
      <div>{children}</div>
      {/* 상태바 (옵션) */}
      {statusBar && <StatusBar>{statusBar}</StatusBar>}
    </section>
  );
}
