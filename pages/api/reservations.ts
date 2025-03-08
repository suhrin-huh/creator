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
  let { date } = req.query;

  // ✅ date 값이 배열인지 확인 후 문자열로 변환
  if (!date || Array.isArray(date)) {
    return res
      .status(400)
      .json({ error: "Date parameter is required and must be a string" });
  }

  // ✅ 날짜 형식을 'YYYY-MM-DD'로 변환
  const formattedDate = new Date(date).toISOString().split("T")[0];

  console.log("Fetching reservations for date:", formattedDate); // 디버깅 로그

  const { data, error } = await supabase
    .from("reservations")
    .select("date, period, hour")
    .eq("date", formattedDate); // ✅ date는 text이므로 그대로 비교

  if (error) {
    console.error("Error fetching reservations:", error.message);
    return res.status(500).json({ error: error.message });
  }

  // if (!data || data.length === 0) {
  //   return res
  //     .status(404)
  //     .json({ message: "No reservations found for this date" });
  // }

  return res.status(200).json(data);
}

// 📌 예약 생성 (POST)
async function createReservation(req: NextApiRequest, res: NextApiResponse) {
  const { date, period, hour } = req.body;

  if (!date || !period || hour === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // 이미 예약된 시간인지 확인
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

  // 예약 추가
  const { data, error } = await supabase
    .from("reservations")
    .insert([{ date, period, hour }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json({ message: "Reservation created", data });
}
