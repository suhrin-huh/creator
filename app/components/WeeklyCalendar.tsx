"use client";

import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ko"; // 한글 요일 표시를 위해 로드

dayjs.locale("ko");

const WeeklyCalendar = ({
  selectedDate,
  onSelectDate,
}: {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}) => {
  const [weekOffset, setWeekOffset] = useState(0);

  // 현재 주 계산
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = dayjs().startOf("week").add(weekOffset, "week").add(i, "day");
    return {
      date: day.format("YYYY-MM-DD"), // 날짜 (YYYY-MM-DD)
      dayOfWeek: day.format("dd"), // 요일 (월, 화, 수 ...)
    };
  });

  function resetDate() {
    setWeekOffset(0);
    onSelectDate(dayjs().format("YYYY-MM-DD"));
  }
  return (
    <div
      style={{
        textAlign: "center",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "30px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 오늘 날짜로 돌아가기 버튼 */}
      <button
        onClick={resetDate}
        style={{
          padding: "5px 10px",
          fontSize: "16px",
          cursor: "pointer",
          borderRadius: "5px",
          backgroundColor: "#6200ea",
          color: "#fff",
          border: "none",
        }}
      >
        오늘 날짜로 돌아가기
      </button>

      {/* 주간 이동 및 날짜 선택 버튼 */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => setWeekOffset((prev) => prev - 1)}
          style={{
            background: "none",
            border: "none",
            padding: "5px",
            color: "#6200ea",
            fontSize: "25px",
            fontWeight: "bolder",
            cursor: "pointer",
          }}
        >
          {"<"}
        </button>

        {/* 날짜 및 요일 표시 */}
        {weekDays.map(({ date, dayOfWeek }) => (
          <div
            key={date}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
            }}
          >
            {/* 요일 (한글) */}
            <span style={{ fontSize: "14px", fontWeight: "bold" }}>
              {dayOfWeek}
            </span>
            {/* 날짜 버튼 */}
            <button
              style={{
                backgroundColor: date === selectedDate ? "#6200ea" : "#ffffff",
                color: date === selectedDate ? "#ffffff" : "#000000",
                border:
                  date === selectedDate
                    ? "2px solid #6200ea"
                    : "1px solid #ccc",
                borderRadius: "5px",
                padding: "10px",
                fontSize: "16px",
                cursor: "pointer",
                transition: "background-color 0.2s, color 0.2s, border 0.2s",
              }}
              onClick={() => onSelectDate(date)}
            >
              {dayjs(date).format("DD")}
            </button>
          </div>
        ))}

        <button
          onClick={() => setWeekOffset((prev) => prev + 1)}
          style={{
            border: "none",
            padding: "5px",
            color: "#6200ea",
            fontSize: "25px",
            fontWeight: "bolder",
            cursor: "pointer",
            background: "none",
          }}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default WeeklyCalendar;
