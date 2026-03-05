/**
 * 현재에는 빠른 관리 메뉴 중 "협찬 관리"만 활성화되어있음
 */
"use client";

import { useRouter } from "next/navigation";

export default function QuickActions() {
  const router = useRouter();

  return (
    <section>
      <div className="grid h-48 grid-cols-2 gap-4">
        {/* Button 1: Product Management (Active) */}
        <button
          onClick={() => router.push("/admin/sponsorships")}
          className="group hover:border-primary flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
        >
          {/* Icon: Accent Color로 포인트 */}
          <span className="text-accent mb-2 text-3xl transition-transform duration-300 group-hover:scale-110">
            📦
          </span>
          {/* Text: 평소엔 Gray-700, Hover시 Primary-dark */}
          <span className="group-hover:text-primary-dark font-bold text-gray-700 transition-colors">
            협찬 관리
          </span>
        </button>

        {/* Button 2: Disabled (준비 중) */}
        <button
          disabled
          className="flex cursor-not-allowed flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-100 text-gray-400"
        >
          <span className="mb-2 text-2xl opacity-70 grayscale">🔒</span>
          <span className="font-medium text-gray-400">준비 중</span>
        </button>

        {/* Button 3: Disabled (설정) */}
        <button
          disabled
          className="flex cursor-not-allowed flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-100 text-gray-400"
        >
          <span className="mb-2 text-2xl opacity-70 grayscale">⚙️</span>
          <span className="font-medium text-gray-400">설정</span>
        </button>

        {/* Button 4: Disabled (통계) */}
        <button
          disabled
          className="flex cursor-not-allowed flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-100 text-gray-400"
        >
          <span className="mb-2 text-2xl opacity-70 grayscale">📊</span>
          <span className="font-medium text-gray-400">통계</span>
        </button>
      </div>
    </section>
  );
}
