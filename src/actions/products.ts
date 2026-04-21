"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

import type {
  AdminProduct,
  ContentType,
  ProductRow,
  ProductWithDetail,
  PublicProduct,
  PublicProductRow,
  SponsorshipDetailRow,
} from "@/types";

// TODO: src/types/action.ts로 이동 필요
export type ActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

/** 메인페이지에서 제공할 제품 공개 리스트 */
export async function getPublicProducts(): Promise<PublicProduct[]> {
  const supabase = await createClient();

  // rpc 호출
  const { data, error } = await supabase.rpc("get_public_products");

  if (error) {
    console.error("Error fetching public products:", error);
    return [];
  }

  return (data || []).map((item: PublicProductRow) => ({
    id: item.id,
    title: item.title,
    imageUrl: item.image_url,
    description: item.description,
    purchaseUrl: item.purchase_url,
  }));
}

/** 제품 저장 (신규/수정) */
export async function saveProduct(formData: FormData): Promise<ActionState> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, message: "로그인이 필요한 서비스입니다." };
  }

  const actionType = formData.get("actionType") as string; // 'new' | 'edit'
  const productId = formData.get("id") as string;

  // --- products 테이블 데이터 ---
  const productType = formData.get("productType") as string;
  const title = formData.get("title") as string;
  const brandName = formData.get("brandName") as string;
  const description = formData.get("description") as string | null;
  const purchaseUrl = formData.get("purchaseUrl") as string | null;
  const uploadedDate = formData.get("uploadedDate") ? String(formData.get("uploadedDate")) : null;
  const memo = formData.get("memo") as string | null;
  const isPublic = formData.get("isPublic") === "true";

  // --- sponsorship_details 테이블 데이터 (productType === 'SPONSORED'일 때만 사용) TODO:이후에 수정 필요 ---
  const sponsorshipType = formData.get("sponsorshipType") as string;
  const guideUrl = formData.get("guideUrl") as string | null;
  const contentType = formData.getAll("contentType") as ContentType[];
  const receivedDate = formData.get("receivedDate") ? String(formData.get("receivedDate")) : null;
  const uploadDeadline = formData.get("uploadDeadline")
    ? String(formData.get("uploadDeadline"))
    : null;
  const deadlineDays = formData.get("deadlineDays") ? Number(formData.get("deadlineDays")) : null;
  const retentionMonths = formData.get("retentionMonths")
    ? Number(formData.get("retentionMonths"))
    : null;
  const status = formData.get("status") ? String(formData.get("status")) : "WAITING";

  // --- 이미지 처리 ---
  const imageFile = formData.get("image") as File | null;
  const existingImageUrl = formData.get("imageUrl") as string | null;

  let finalImageUrl: string | null = null;

  if (imageFile && imageFile.size > 0) {
    // [Case A] 새 이미지 파일이 업로드된 경우
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${user.id}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, imageFile);

    if (uploadError) {
      return { success: false, message: "이미지 업로드 실패: " + uploadError.message };
    }

    const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(uploadData.path);

    finalImageUrl = urlData.publicUrl;
  } else if (existingImageUrl && existingImageUrl.trim() !== "") {
    // [Case B] 기존 이미지 URL 유지
    finalImageUrl = existingImageUrl;
  }
  // [Case C] 파일도 URL도 없으면 null 유지

  // --- products 저장 ---
  const productData = {
    user_id: user.id,
    product_type: productType,
    title,
    brand_name: brandName,
    description: description || null,
    image_url: finalImageUrl,
    purchase_url: purchaseUrl || null,
    uploaded_date: uploadedDate,
    memo: memo || null,
    is_public: isPublic,
  };

  let savedProductId: number;

  if (actionType === "edit" && productId) {
    const { error: updateError } = await supabase
      .from("products")
      .update(productData)
      .eq("id", productId)
      .eq("user_id", user.id); // RLS 이중 방어

    if (updateError) {
      console.error("Products update error:", updateError);
      return { success: false, message: "DB 저장에 실패했습니다." };
    }

    savedProductId = Number(productId);
  } else {
    const { data: insertedProduct, error: insertError } = await supabase
      .from("products")
      .insert(productData)
      .select("id")
      .single();

    if (insertError || !insertedProduct) {
      console.error("Products insert error:", insertError);
      return { success: false, message: "DB 저장에 실패했습니다." };
    }

    savedProductId = insertedProduct.id;
  }

  // --- sponsorship_details 저장 (SPONSORED 타입일 때만) ---
  if (productType === "SPONSORED") {
    const detailData = {
      product_id: savedProductId,
      sponsorship_type: sponsorshipType,
      guide_url: guideUrl || null,
      content_type: contentType,
      received_date: receivedDate,
      deadline_days: deadlineDays,
      upload_deadline: uploadDeadline,
      retention_months: retentionMonths,
      status,
    };

    // 신규/수정 모두 upsert로 처리 (product_id unique 제약 조건 기반)
    const { error: detailError } = await supabase
      .from("sponsorship_details")
      .upsert(detailData, { onConflict: "product_id" });

    if (detailError) {
      console.error("Sponsorship details upsert error:", detailError);
      return { success: false, message: "협찬 상세 저장에 실패했습니다." };
    }
  }

  revalidatePath("/sponsorship");

  return { success: true, message: "성공적으로 저장되었습니다." };
}

/** admin 제품 리스트 조회 */
export async function getAdminProducts(): Promise<AdminProduct[]> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("인증되지 않은 사용자입니다.");
    return [];
  }

  const { data, error } = await supabase
    .from("products")
    .select("id, title, product_type, created_at, sponsorship_details(content_type, status)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("데이터를 불러오는 중 에러 발생:", error);
    return [];
  }

  return (data || []).map((item) => {
    const detail = Array.isArray(item.sponsorship_details)
      ? item.sponsorship_details[0]
      : item.sponsorship_details;

    return {
      id: item.id,
      title: item.title,
      productType: item.product_type,
      contentType: detail?.content_type ?? null,
      status: detail?.status ?? null,
      createdAt: item.created_at,
    };
  });
}

/** 제품 삭제
 * @param productId 제품 PK
 */
export async function deleteProduct(productId: number): Promise<ActionState> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, message: "로그인이 필요한 서비스입니다." };
  }

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Product delete error:", error);
    return { success: false, message: "제품 삭제에 실패했습니다." };
  }

  /**
   * 목록 조회를 TanStack Query(useAdminProducts)로 하고 있음
   * => 실질적인 UI 갱신은 invalidateQueries가 담당
   * revalidatePath는 SSR/RSC 레이어의 캐시를 위한 추가 방어선 역할
   */
  revalidatePath("/sponsorship");

  return { success: true, message: "성공적으로 삭제되었습니다." };
}

/** admin 제품 개별 데이터 조회 */
export async function getProductById(productId: number): Promise<ProductWithDetail | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("인증되지 않은 사용자입니다.");
    return null;
  }

  const { data, error } = await supabase
    .from("products")
    .select("*, sponsorship_details(*)")
    .eq("id", productId)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("상세 데이터를 불러오는 중 에러 발생", error);
    return null;
  }

  const { sponsorship_details, ...productRow } = data as ProductRow & {
    sponsorship_details: SponsorshipDetailRow | SponsorshipDetailRow[] | null;
  };

  const detail = Array.isArray(sponsorship_details)
    ? (sponsorship_details[0] ?? null)
    : sponsorship_details;

  return {
    id: productRow.id,
    userId: productRow.user_id,
    productType: productRow.product_type,
    title: productRow.title,
    brandName: productRow.brand_name,
    description: productRow.description,
    imageUrl: productRow.image_url,
    purchaseUrl: productRow.purchase_url,
    uploadedDate: productRow.uploaded_date,
    memo: productRow.memo,
    isPublic: productRow.is_public,
    createdAt: productRow.created_at,
    updatedAt: productRow.updated_at,
    sponsorshipDetail: detail
      ? {
          id: detail.id,
          productId: detail.product_id,
          sponsorshipType: detail.sponsorship_type,
          guideUrl: detail.guide_url,
          contentType: detail.content_type,
          receivedDate: detail.received_date,
          deadlineDays: detail.deadline_days,
          uploadDeadline: detail.upload_deadline,
          retentionMonths: detail.retention_months,
          status: detail.status,
        }
      : null,
  };
}
