"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // 실제 인증 로직 추가 필요!
    if (password == "1234") {
      router.push("/admin"); // 어드민 페이지로 이동
    }
  };

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

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="hidden text-sm font-medium text-gray-600">
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                className="h-12 w-full rounded border border-gray-300 px-4 transition-colors focus:border-gray-900 focus:outline-none"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="h-12 w-full rounded bg-gray-900 font-medium text-white transition-colors hover:bg-gray-700"
            >
              접속하기
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
