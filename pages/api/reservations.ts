import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase"; // Supabase 설정 파일 import

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Content-Type", "application/json");

  try {
    if (req.method === "GET") {
      return await getReservations(req, res);
    }
    if (req.method === "POST") {
      return await createReservation(req, res);
    }
    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("❌ API Handler Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// 📌 예약 조회 (GET)
async function getReservations(req: NextApiRequest, res: NextApiResponse) {
  const { date } = req.query;

  if (!date || Array.isArray(date) || typeof date !== "string") {
    return res
      .status(400)
      .json({ error: "Date parameter is required and must be a valid string" });
  }

  console.log("📌 Fetching reservations for date:", date);

  // ✅ Supabase에서 예약 조회
  const { data, error } = await supabase
    .from("reservations")
    .select("date, period, hour")
    .eq("date", date);

  if (error) {
    console.error("❌ Error fetching reservations:", error.message);
    return res.status(500).json({ error: "Failed to fetch reservations" });
  }

  // ✅ Supabase에서 반환된 데이터가 `null`이면 빈 배열 반환
  return res.status(200).json(data ?? []);
}

// 📌 예약 생성 (POST)
async function createReservation(req: NextApiRequest, res: NextApiResponse) {
  const { date, period, hour } = req.body;

  if (!date || !period || hour === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  console.log("📌 Creating reservation:", { date, period, hour });

  // ✅ 기존 예약 확인
  const { data: existingReservation, error: checkError } = await supabase
    .from("reservations")
    .select("id")
    .eq("date", date)
    .eq("period", period)
    .eq("hour", hour)
    .single();

  if (checkError && checkError.code !== "PGRST116") {
    console.error("❌ Supabase Query Error:", checkError.message);
    return res
      .status(500)
      .json({ error: "Error checking existing reservation" });
  }

  if (existingReservation) {
    return res
      .status(409)
      .json({ error: "This time slot is already reserved" });
  }

  // ✅ 예약 추가
  const { data, error } = await supabase
    .from("reservations")
    .insert([{ date, period, hour }])
    .select(); // ✅ 삽입 후 데이터 반환

  if (error) {
    console.error("❌ Error inserting reservation:", error.message);
    return res.status(500).json({ error: "Failed to create reservation" });
  }

  // ✅ `data`가 `null`일 경우 빈 객체 반환
  return res
    .status(201)
    .json({ message: "Reservation created", data: data ?? {} });
}
