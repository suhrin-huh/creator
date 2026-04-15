// 사이즈 및 컬러 타입 정의
type ButtonSize = "xs" | "sm" | "md" | "lg" | "full";

type ButtonColor =
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "neutral"
  | "outlined";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  colorTheme?: ButtonColor;
}

/**
 * @param size = 'full'
 * @param colorTheme = 'primary'
 * @param className = ''
 * @param children
 */
export default function Button({
  size = "full", // default는 full
  colorTheme = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  // 공통 기본 스타일 (정렬, 트랜지션, 비활성화 상태, 둥글기, 그림자)
  const baseStyles =
    "inline-flex items-center justify-center transition-colors duration-200 rounded-md shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none";

  // 사이즈 스타일 (브레이크 포인트 : md)
  const sizeStyles: Record<ButtonSize, string> = {
    xs: "px-sm py-xs text-caption md:px-md md:py-sm md:text-body-xs",
    sm: "px-md py-sm text-body-xs md:px-lg md:py-md md:text-body-sm",
    md: "px-lg py-md text-body-sm md:px-xl md:py-lg md:text-body-md",
    lg: "px-xl py-lg text-body-md md:px-2xl md:py-xl md:text-body-lg",
    full: "w-full px-lg py-sm text-body-sm md:px-xl md:py-lg md:text-body-md",
  };

  // 컬러 테마 스타일
  const colorStyles: Record<ButtonColor, string> = {
    primary:
      "bg-primary text-white hover:bg-primary-hover active:bg-primary-active focus-visible:ring-primary-focus",
    secondary:
      "bg-secondary text-white hover:bg-secondary-hover active:bg-secondary-active focus-visible:ring-secondary",
    accent:
      "bg-accent text-white hover:bg-accent-hover active:bg-accent-active focus-visible:ring-accent-light",
    success: "bg-success text-white hover:brightness-95 active:brightness-90", // hover 색상이 따로 없어 밝기 조절 활용
    warning: "bg-warning text-gray-900 hover:brightness-95 active:brightness-90",
    danger: "bg-danger text-white hover:brightness-95 active:brightness-90",
    neutral:
      "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 border border-gray-200", // 흰색/회색 계열 서브 버튼용
    outlined:
      "border border-1 border-gray-300 hover:border-gray-800 active:border-gray-500 text-gray-800",
  };

  // 스타일 결합
  const combinedClassName =
    `${baseStyles} ${sizeStyles[size]} ${colorStyles[colorTheme]} ${className}`.trim();

  return (
    <button className={combinedClassName} type="button" {...props}>
      {children}
    </button>
  );
}
