"use client";

import { useActionState } from "react"; // Next.js 14라면 'react-dom'의 useFormState 사용
import { login } from "@/actions/auth";

const initialState = {
  success: false,
  message: "",
};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <div className="hide-scrollbar bg-primary relative flex max-w-175 min-w-75 flex-1 flex-col overflow-scroll md:rounded-lg md:shadow-xl">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4 md:rounded-t-lg">
        <div className="logo text-xl font-bold text-gray-900">Creator Admin</div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center p-4">
        <div className="flex h-[300px] w-[500px] flex-col items-center justify-center rounded-lg border border-gray-300 bg-white p-8">
          <h1 className="text-primary-dark mb-6 text-center text-2xl font-bold">ADMIN ACCESS</h1>

          <form action={formAction} className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="hidden text-sm font-medium text-gray-600">
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="h-12 w-full rounded-lg border border-gray-300 px-4 text-gray-900 placeholder-gray-400 transition-all focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:outline-none"
                placeholder="비밀번호를 입력하세요"
              />
            </div>

            {/* 에러 메시지 표시 */}
            {state?.message && (
              <p className="text-sm font-medium text-red-500 text-center animate-pulse">
                {state.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="h-12 w-full rounded-lg bg-gray-500 font-bold text-white transition-all hover:bg-gray-700 hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isPending ? "접속 중..." : "접속하기"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
