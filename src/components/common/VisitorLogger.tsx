"use client";

import { useEffect, useRef, useState } from "react";
import { recordActiveView } from "@/actions/logs";

export default function VisitorLogger() {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  // 현재 페이지 로드(새로고침 포함) 상태에서 이미 카운트했는지 확인하는 상태
  const [hasCountedInThisLoad, setHasCountedInThisLoad] = useState(false);
  const VIEW_THRESHOLD = 3000; // 3초

  useEffect(() => {
    const startTimer = () => {
      // 이미 이 페이지 로드에서 카운트했다면 타이머를 시작하지 않음
      if (hasCountedInThisLoad) return;

      if (!timerRef.current) {
        timerRef.current = setTimeout(async () => {
          const result = await recordActiveView();
          if (result?.success) {
            // 이번 로드에서 카운트 완료됨을 표시
            setHasCountedInThisLoad(true);
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

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        startTimer();
      } else {
        // 다른 탭으로 이동하거나 화면을 가리면 타이머 중지
        stopTimer();
      }
    };

    // 초기 진입 시 실행
    if (document.visibilityState === "visible") {
      startTimer();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopTimer();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [hasCountedInThisLoad]); // hasCountedInThisLoad가 변할 때 타이머 로직 제어

  return null;
}
