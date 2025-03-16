"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const CancelReservation = ({ selectedDate }: { selectedDate: string }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM">("AM");
  const [reservedTimes, setReservedTimes] = useState<
    { period: string; hour: number }[]
  >([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get(
          `/api/reservations?date=${selectedDate}`
        );
        setReservedTimes(response.data);
      } catch (error) {
        console.error("Failed to fetch reservations:", error);
      }
    };
    fetchReservations();
  }, [selectedDate]);

  const handleCancel = async (hour: number) => {
    try {
      await axios.delete("/api/cancel-reservation", {
        data: { date: selectedDate, period: selectedPeriod, hour },
      });

      setReservedTimes(
        reservedTimes.filter(
          (t) => !(t.period === selectedPeriod && t.hour === hour)
        )
      );
    } catch (error) {
      console.error("Failed to cancel reservation:", error);
    }
  };

  return (
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
      <h3>예약 취소</h3>

      {/* AM/PM 선택 버튼 */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={() => setSelectedPeriod("AM")}
          style={{
            padding: "10px 20px",
            borderRadius: "5px",
            border:
              selectedPeriod === "AM" ? "2px solid #6200ea" : "1px solid #ccc",
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
              selectedPeriod === "PM" ? "2px solid #6200ea" : "1px solid #ccc",
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

      {/* 예약된 시간 목록 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
        }}
      >
        {reservedTimes
          .filter((t) => t.period === selectedPeriod)
          .map((t) => (
            <button
              key={`${t.period}-${t.hour}`}
              style={{
                width: "50px",
                height: "40px",
                borderRadius: "5px",
                fontSize: "16px",
                backgroundColor: "#f44336",
                color: "#fff",
                cursor: "pointer",
                border: "none",
              }}
              onClick={() => handleCancel(t.hour)}
            >
              {t.hour}
            </button>
          ))}
      </div>

      {reservedTimes.filter((t) => t.period === selectedPeriod).length ===
        0 && <p style={{ color: "#666" }}>예약된 시간이 없습니다.</p>}
    </div>
  );
};

export default CancelReservation;
