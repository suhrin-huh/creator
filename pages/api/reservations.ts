import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase"; // Supabase 설정 파일 import

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Content-Type", "application/json");

  if (req.method === "GET") {
    return await getReservations(req, res);
  }
  if (req.method === "POST") {
    return await createReservation(req, res);
  }
  return res.status(405).json({ message: "Method not allowed" });
}

// 📌 예약 조회 (GET)
async function getReservations(req: NextApiRequest, res: NextApiResponse) {
  const { date } = req.query;

  if (!date || Array.isArray(date)) {
    return res
      .status(400)
      .json({ error: "Date parameter is required and must be a string" });
  }

  // ✅ 날짜 형식 확인 및 변환
  const formattedDate = date.toString(); // 변환 필요

  console.log("📌 Fetching reservations for date:", formattedDate); // 디버깅 로그

  const { data, error } = await supabase
    .from("reservations")
    .select("date, period, hour")
    .eq("date", formattedDate);

  if (error) {
    console.error("❌ Error fetching reservations:", error.message);
    return res.status(500).json({ error: error.message });
  }

  // ✅ Supabase에서 반환된 데이터가 `null`이면 빈 배열 반환
  if (!data) {
    return res.status(200).json([]); // `null` 대신 빈 배열 반환
  }

  return res.status(200).json(data);
}

// 📌 예약 생성 (POST)
async function createReservation(req: NextApiRequest, res: NextApiResponse) {
  const { date, period, hour } = req.body;

  if (!date || !period || hour === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // ✅ 기존 예약 확인
  const { data: existingReservation, error: checkError } = await supabase
    .from("reservations")
    .select("id")
    .eq("date", date)
    .eq("period", period)
    .eq("hour", hour)
    .single();

  if (checkError && checkError.code !== "PGRST116") {
    return res.status(500).json({ error: checkError.message });
  }

  if (existingReservation) {
    return res
      .status(409)
      .json({ error: "This time slot is already reserved" });
  }

  // ✅ 예약 추가
  const { data, error } = await supabase
    .from("reservations")
    .insert([{ date, period, hour }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // ✅ `data`가 `null`일 경우 빈 객체 반환
  return res
    .status(201)
    .json({ message: "Reservation created", data: data || {} });
}
