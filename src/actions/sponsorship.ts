// 실질적인 컨트롤러

"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

import { PublicSponsorship } from "@/types";

export type ActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

/** 메인페이지에서 제공할 협찬 리스트 */
export async function getPublicSponsorships(): Promise<PublicSponsorship[]> {
  const supabase = await createClient();

  // rpc 호출
  const { data, error } = await supabase.rpc("get_public_sponsorships");

  if (error) {
    console.error("Error fetching public sponsorships:", error);
    return [];
  }

  return (data || []).map((item: any) => ({
    id: item.id,
    title: item.title,
    imageUrl: item.image_url,
    description: item.description,
    purchaseUrl: item.purchase_url,
  }));
}

/** 협찬 관련 내용 저장 */
export async function saveSponsorship(
  prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();

  // 현재 로그인한 사용자 확인
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, message: "로그인이 필요한 서비스입니다." };
  }

  // 데이터 추출
  const actionType = formData.get("actionType") as string; // 'new' | 'edit'
  const sponsorshipId = formData.get("id") as string; // 수정 시 사용

  const title = formData.get("title") as string;
  const brandName = formData.get("brandName") as string;
  const contentType = formData.get("contentType") as string;
  const status = formData.get("status") ? String(formData.get("status")) : "WAITING";

  // 날짜/숫자 데이터 처리 (빈 문자열이면 null로 처리)
  const receivedDate = formData.get("receivedDate") ? String(formData.get("receivedDate")) : null;
  const uploadDeadline = formData.get("uploadDeadline")
    ? String(formData.get("uploadDeadline"))
    : null;

  const deadlineDays = formData.get("deadlineDays")
    ? Number(formData.get("uploadPeriodDays"))
    : null;
  const retentionMonths = formData.get("retentionMonths")
    ? Number(formData.get("contentRetentionMonths"))
    : null;

  const description = formData.get("description") as string;
  const memo = formData.get("memo") as string;
  const guideUrl = formData.get("guideUrl") as string;
  const purchaseUrl = formData.get("purchaseUrl") as string;
  const uploadedDate = formData.get("uploadedDate") ? String(formData.get("uploadedDate")) : null;
  const isPublic = formData.get("isPublic");

  /**
   * 이미지 처리 로직
   */
  const imageFile = formData.get("image") as File | null;
  const existingImageUrl = formData.get("imageUrl") as string | null;

  let finalImageUrl: string | null = null;

  if (imageFile && imageFile.size > 0) {
    // [Case A] 새 이미지 파일이 업로드된 경우 -> 스토리지 업로드
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${user.id}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("sponsorship-images")
      .upload(fileName, imageFile);

    if (uploadError) {
      return { success: false, message: "이미지 업로드 실패: " + uploadError.message };
    }

    const { data: urlData } = supabase.storage
      .from("sponsorship-images")
      .getPublicUrl(uploadData.path);

    finalImageUrl = urlData.publicUrl;
  } else if (existingImageUrl && existingImageUrl.trim() !== "") {
    // [Case B] 새 파일은 없지만, 기존 이미지 URL이 있는 경우 -> 유지
    finalImageUrl = existingImageUrl;
  } else {
    // [Case C] 파일도 없고 URL도 없음 -> NULL
    finalImageUrl = null;
  }

  // DB 저장 데이터 매핑
  const dbData = {
    user_id: user.id,
    title,
    status: status,
    description,
    memo,
    // Snake Case 변환
    brand_name: brandName,
    image_url: finalImageUrl,
    content_type: contentType,
    guide_url: guideUrl,
    purchase_url: purchaseUrl,
    received_date: receivedDate,
    upload_deadline: uploadDeadline,
    deadline_days: deadlineDays,
    retention_months: retentionMonths,
    uploaded_date: uploadedDate,
    is_public: isPublic,
  };

  let error;

  if (actionType === "edit" && sponsorshipId) {
    // UPDATE: 내 글인지 확인 / 조건은 RLS가 처리하지만 명시적으로 eq 추가
    const { error: updateError } = await supabase
      .from("sponsorships")
      .update(dbData)
      .eq("id", sponsorshipId)
      .eq("user_id", user.id); // 타인 데이터 수정 방지 (RLS와 이중 방어)

    error = updateError;
  } else {
    // INSERT: user_id가 포함된 data 저장
    const { error: insertError } = await supabase.from("sponsorships").insert(dbData);

    error = insertError;
  }

  if (error) {
    console.error("Database Error:", error);
    return { success: false, message: "DB 저장에 실패했습니다." };
  }

  // 캐시 갱신
  revalidatePath("/sponsorship");

  return { success: true, message: "성공적으로 저장되었습니다." };
}
