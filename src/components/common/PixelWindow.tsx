// ════════════════════════════════
// PixelWindow — 재사용 가능한 윈도우 껍데기, UI만 담당, 비즈니스로직 X
// @param title (required) 상단 타이틀
// @param statusBar 하단 상태바
// @param onClose 닫침 버튼 핸들러
// @param className 추가 스타일
// @param id
// @param children (required)
// ════════════════════════════════

interface TitlebarDecoProps {
  className?: string;
}

function TitlebarDeco({ className }: TitlebarDecoProps) {
  return (
    <div className={`flex shrink-0 items-center gap-1 ${className ?? ""}`}>
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-[10px] w-2 opacity-45"
          style={{
            background: "var(--color-title-text)", // TODO: 이 부분 수정 필요
            clipPath:
              "polygon(20% 0%,80% 0%,80% 40%,100% 40%,100% 60%,80% 60%,80% 100%,20% 100%,20% 60%,0% 60%,0% 40%,20% 40%)",
          }}
        />
      ))}
    </div>
  );
}

interface WinButtonsProps {
  onClose?: () => void;
}

function WinButtons({ onClose }: WinButtonsProps) {
  return (
    <div className="flex gap-[3px]">
      {/* 최소화 */}
      <button className="pixel-btn h-[14px] w-[14px] text-[6px]">_</button>
      {/* 최대화 */}
      <button className="pixel-btn h-[14px] w-[14px] text-[6px]">□</button>
      {/* 닫기 */}
      <button
        className="pixel-btn pixel-btn-close h-[14px] w-[14px] text-[6px]"
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
  return <div className="pixel-statusbar flex gap-3">{children}</div>;
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

export default function PixelWindow({
  title,
  children,
  statusBar,
  onClose,
  className,
  id,
}: PixelWindowProps) {
  return (
    <section className={`pixel-win ${className ?? ""}`} id={id}>
      {/* 타이틀바 */}
      <div className="pixel-titlebar">
        <TitlebarDeco />
        <span className="pixel-title-text">{title}</span>
        <WinButtons onClose={onClose} />
      </div>
      {/* 본문 */}
      <div className="pixel-win-content">{children}</div>
      {/* 상태바 (옵션) */}
      {statusBar && <StatusBar>{statusBar}</StatusBar>}
    </section>
  );
}
