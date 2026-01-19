"use client";

import { useRouter } from "next/navigation";
import { LineChart } from "@mui/x-charts/LineChart";

// components
import Footer from "@/components/common/Footer";

// 데이터는 그대로 사용
const pData = [10, 100, 90, 38, 48, 38, 43, 10, 10, 10];
const xLabels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

export default function AdminPage() {
  const router = useRouter();

  // [핵심 로직] 데이터의 최댓값을 구하고, 20% 정도의 여유 공간(Buffer)을 더해줍니다.
  const dataMax = Math.max(...pData);
  const chartMax = Math.round(dataMax * 1.2); // 1.2를 곱해 상단에 20% 여백 확보
  return (
    <div className="hide-scrollbar bg-primary relative flex max-w-175 min-w-75 flex-1 flex-col overflow-scroll md:rounded-lg md:shadow-xl">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4 md:rounded-t-lg">
        <div className="logo text-xl font-bold text-gray-900">Creator Admin</div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col gap-6 p-6">
        {/* Section 1 : 조회수 그래프 (Card UI) */}
        <section className="flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          {/* 차트 헤더 (타이틀 + 요약) */}
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800">일별 조회수</h2>
              <p className="mt-1 text-sm text-gray-500">최근 10일간의 트렌드</p>
            </div>
            <div className="text-right">
              <span className="text-primary-dark block text-3xl font-bold">397</span>
              <span className="text-xs font-medium text-gray-400">Total Views</span>
            </div>
          </div>

          {/* 차트 영역 */}
          <div className="h-[300px] w-full">
            <LineChart
              series={[
                {
                  data: pData,
                  label: "조회수",
                  area: true, // 1. 아래 영역 채우기
                  showMark: false, // 2. 점(dot) 제거 (깔끔하게)
                  color: "#c1d48e", // Tailwind blue-600 색상
                  curve: "catmullRom", // 3. 부드러운 곡선 처리
                },
              ]}
              xAxis={[{ scaleType: "point", data: xLabels, height: 30 }]}
              // [여기서 수정됨] yAxis 설정 TODO: 최댓값이 축의 최댓값과 동일할 때 잘리는 현상 발생
              yAxis={[
                {
                  // min: 0, // 필요하다면 0부터 시작 강제
                  max: chartMax, // 계산된 넉넉한 최댓값 적용

                  // 스타일링 (기존 유지)
                  width: 30, // 축 공간 확보 (숫자가 잘리지 않게)
                  disableLine: true, // 축 선 숨기기 (sx 대신 prop으로도 가능)
                  disableTicks: true, // 눈금 숨기기
                },
              ]}
              grid={{ horizontal: true }} // 4. 가로 격자만 표시
              sx={{
                // 5. 차트 내부 스타일 커스텀 (CSS-in-JS)
                ".MuiLineElement-root": {
                  strokeWidth: 2, // 선 두께
                },
                ".MuiAreaElement-root": {
                  fillOpacity: 0.1, // 채우기 투명도 조절
                },
                ".MuiChartsAxis-line": {
                  display: "none", // 지저분한 축의 선(Line) 숨김
                },
                ".MuiChartsAxis-tick": {
                  display: "none", // 축의 눈금(Tick) 숨김
                },
                ".MuiChartsAxis-tickLabel": {
                  fill: "#9ca3af", // 글자 색상 (gray-400)
                  fontSize: "0.75rem",
                },
                ".MuiChartsGrid-line": {
                  stroke: "#f3f4f6", // 격자 색상 연하게 (gray-100)
                },
              }}
              margin={{ left: 30, right: 30, top: 30, bottom: 30 }} // 여백 확보
            />
          </div>
        </section>

        {/* Section 2 : 빠른 관리 (수정됨) */}
        <section>
          <div className="grid h-48 grid-cols-2 gap-4">
            {/* Button 1: Product Management (Active) */}
            <button
              onClick={() => router.push("/admin/products")}
              className="group hover:border-primary flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
            >
              {/* Icon: Accent Color로 포인트 */}
              <span className="text-accent mb-2 text-3xl transition-transform duration-300 group-hover:scale-110">
                📦
              </span>
              {/* Text: 평소엔 Gray-700, Hover시 Primary-dark */}
              <span className="group-hover:text-primary-dark font-bold text-gray-700 transition-colors">
                상품 관리
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
        {/* Section 3 : Placeholder */}
        <section className="flex h-40 items-center justify-center rounded-lg border border-gray-200 bg-white p-6 text-gray-400 shadow-sm">
          Section 3 준비 중
        </section>
      </main>
      <Footer />
    </div>
  );
}
