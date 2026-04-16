"use client";

// library
import { useActionState } from "react"; // Next.js 14라면 'react-dom'의 useFormState 사용

// components
import PixelWindow from "@/components/common/PixelWindow";

// action
import { login } from "@/actions/auth";
import PixelLoadingButton from "@/components/common/PixelLoadingButton";
import { PixelFormInput } from "@/components/common/PixelFormInput";

const initialState = {
  success: false,
  message: "",
};

export default function LoginContainer() {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <main className="m-auto h-100 max-w-125 min-w-78">
      <PixelWindow title="LOGIN.EXE" statusBar={<p>Please~~</p>}>
        <div className="gap-md p-md flex flex-col">
          <h1 className="text-text-main text-body-lg font-pixel mb-6 text-center">ADMIN ACCESS</h1>
          <div className="flex justify-center">
            <LockIcon />
          </div>
          <form action={formAction} className="gap-sm flex w-full flex-col">
            <div className="flex flex-col gap-1">
              <PixelFormInput
                label={"비밀번호"}
                type="password"
                id="password"
                name="password"
                required
                placeholder="비밀번호를 입력하세요"
                errorMessage={state?.message}
              />
            </div>
            <PixelLoadingButton idleText="LOGIN" loadingText="LOADING..." isLoading={isPending} />
          </form>
        </div>
      </PixelWindow>
    </main>
  );
}

// ── 픽셀 자물쇠 아이콘 ──────────
function LockIcon() {
  return (
    <svg
      width="32"
      height="36"
      viewBox="0 0 32 36"
      shapeRendering="crispEdges"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="8" y="0" width="16" height="2" fill="#8899cc" />
      <rect x="6" y="2" width="2" height="2" fill="#8899cc" />
      <rect x="24" y="2" width="2" height="2" fill="#8899cc" />
      <rect x="4" y="4" width="2" height="10" fill="#8899cc" />
      <rect x="26" y="4" width="2" height="10" fill="#8899cc" />
      <rect x="6" y="14" width="4" height="2" fill="#8899cc" />
      <rect x="22" y="14" width="4" height="2" fill="#8899cc" />
      <rect x="2" y="16" width="28" height="2" fill="#6677aa" />
      <rect x="2" y="16" width="2" height="18" fill="#6677aa" />
      <rect x="28" y="16" width="2" height="18" fill="#6677aa" />
      <rect x="2" y="32" width="28" height="2" fill="#6677aa" />
      <rect x="4" y="18" width="24" height="14" fill="#aabbee" />
      <rect x="13" y="22" width="6" height="4" fill="#2a3a6e" />
      <rect x="14" y="24" width="4" height="5" fill="#2a3a6e" />
      <rect x="4" y="18" width="4" height="2" fill="rgba(255,255,255,0.35)" />
    </svg>
  );
}
