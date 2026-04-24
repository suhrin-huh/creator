"use client";

import { useEffect, useRef } from "react";
import { recordActiveView } from "@/actions/logs";

export default function VisitorLogger() {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const VIEW_THRESHOLD = 3000; // 실제 사용으로 간주할 머무르는 시간 (3초)

  useEffect(() => {
    // 중복 방지 : 이번 세션에서 이미 카운트했다면 종료
    if (sessionStorage.getItem("has_counted_view")) return;

    const startTimer = () => {
      if (!timerRef.current) {
        timerRef.current = setTimeout(async () => {
          const result = await recordActiveView();
          if (result.success) {
            sessionStorage.setItem("has_counted_view", "true");
          }
        }, VIEW_THRESHOLD);
      }
    };

    const stopTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    // 모바일 대응 : 실제 화면을 보고 있을 때에만 타이머 작동
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        startTimer();
      } else {
        stopTimer(); // 화면을 가리면 타이머 중지
      }
    };

    // 초기 실행

    if (document.visibilityState === "visible") startTimer();

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopTimer();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return null;
}
