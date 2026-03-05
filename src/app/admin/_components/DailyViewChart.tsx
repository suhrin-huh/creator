/**
 * 조회수 그래프 (Card UI)
 * 후에 다른 통계 자료도 추가 된다면 DashboardAnalytics 등 다른명으로 바꾸어도 좋을 듯
 */

"use client";

import { LineChart } from "@mui/x-charts/LineChart";

// 현재에는 목데이터
const pData = [10, 100, 90, 38, 48, 38, 43, 10, 10, 10];
const xLabels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

export default function DailyViewChart() {
  // 데이터의 최댓값을 구하고, 상단에 20% 여백 확보
  const dataMax = Math.max(...pData);
  const chartMax = Math.round(dataMax * 1.2);
  return (
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
  );
}
