"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "../../lib/react-query";

import axios from "axios";

const fetchReservations = async (selectedDate: string) => {
  console.log("📌 Sending request to API with date:", selectedDate);
  const response = await fetch(`/api/reservations?date=${selectedDate}`);
  console.log(response);
  const data = await response.json();
  console.log("📌 Response from API:", data);
  return data;
};

const TimeSelector = ({
  selectedDate,
}: // onSelectDate,
{
  selectedDate: string;
  // onSelectDate: (date: string) => void;
}) => {
  // const queryClient = useQueryClient();
  const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM">("AM");
  const [selectedHour, setSelectedHour] = useState<number | null>(null);

  // ✅ 예약된 시간 불러오기 (React Query)
  const { data: reservedTimes = [] } = useQuery({
    queryKey: ["reservations", selectedDate],
    queryFn: () => fetchReservations(selectedDate),
    staleTime: 0, // ✅ 항상 최신 데이터를 불러오기
    // cacheTime: 0, // ✅ 캐시를 사용하지 않도록 설정
  });

  // ✅ 예약 요청 (React Query Mutation)
  const mutation = useMutation({
    mutationFn: async () => {
      await axios.post("/api/reservations", {
        date: selectedDate, // ✅ 올바른 날짜를 전송
        period: selectedPeriod,
        hour: selectedHour,
      });
    },
    onSuccess: () => {
      if (selectedDate) {
        queryClient.invalidateQueries({
          queryKey: ["reservations", selectedDate], // ✅ 예약 후 정확한 date로 갱신
        });
      }

      setSelectedHour(null);
      // onSelectDate(""); // ❌ 여기서 selectedDate를 초기화하면 안됨 (주석 처리)
    },
  });

  const handleReserve = () => {
    if (selectedHour !== null) {
      mutation.mutate();
    }
  };

  const hours = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "15px",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          width: "300px",
          backgroundColor: "#fff",
        }}
      >
        {/* AM/PM 선택 버튼 */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setSelectedPeriod("AM")}
            style={{
              padding: "10px 20px",
              borderRadius: "5px",
              border:
                selectedPeriod === "AM"
                  ? "2px solid #6200ea"
                  : "1px solid #ccc",
              backgroundColor: selectedPeriod === "AM" ? "#6200ea" : "#fff",
              color: selectedPeriod === "AM" ? "#fff" : "#000",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "background-color 0.2s, color 0.2s, border 0.2s",
            }}
          >
            AM
          </button>
          <button
            onClick={() => setSelectedPeriod("PM")}
            style={{
              padding: "10px 20px",
              borderRadius: "5px",
              border:
                selectedPeriod === "PM"
                  ? "2px solid #6200ea"
                  : "1px solid #ccc",
              backgroundColor: selectedPeriod === "PM" ? "#6200ea" : "#fff",
              color: selectedPeriod === "PM" ? "#fff" : "#000",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "background-color 0.2s, color 0.2s, border 0.2s",
            }}
          >
            PM
          </button>
        </div>

        {/* 시간 선택 버튼 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "10px",
          }}
        >
          {hours.map((hour) => (
            <button
              key={hour}
              style={{
                width: "50px",
                height: "40px",
                borderRadius: "5px",
                fontSize: "16px",
                cursor: "pointer",
                border: reservedTimes.some(
                  (t: { period: string; hour: number }) =>
                    t.period === selectedPeriod && t.hour === hour
                )
                  ? "1px solid #ccc"
                  : "2px solid rgb(209, 176, 255)",
                backgroundColor: reservedTimes.some(
                  (t: { period: string; hour: number }) =>
                    t.period === selectedPeriod && t.hour === hour
                )
                  ? "#ddd"
                  : selectedHour === hour
                  ? "#6200ea"
                  : "#fff",
                color: reservedTimes.some(
                  (t: { period: string; hour: number }) =>
                    t.period === selectedPeriod && t.hour === hour
                )
                  ? "#999"
                  : selectedHour === hour
                  ? "#fff"
                  : "#000",
                pointerEvents: reservedTimes.some(
                  (t: { period: string; hour: number }) =>
                    t.period === selectedPeriod && t.hour === hour
                )
                  ? "none"
                  : "auto",
                transition: "background-color 0.2s, color 0.2s, border 0.2s",
              }}
              disabled={reservedTimes.some(
                (t: { period: string; hour: number }) =>
                  t.period === selectedPeriod && t.hour === hour
              )}
              onClick={() => setSelectedHour(hour)}
            >
              {hour}
            </button>
          ))}
        </div>

        {/* 예약 버튼 */}
        <button
          onClick={handleReserve}
          disabled={selectedHour === null || mutation.isPending}
          style={{
            padding: "10px 20px",
            borderRadius: "5px",
            backgroundColor: selectedHour === null ? "#ccc" : "#6200ea",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "bold",
            border: "none",
            cursor: selectedHour === null ? "not-allowed" : "pointer",
            transition: "background-color 0.2s, color 0.2s",
            width: "100%",
          }}
        >
          {mutation.isPending ? "예약 중..." : "예약하기"}
        </button>
      </div>
    </div>
  );
};

export default TimeSelector;
