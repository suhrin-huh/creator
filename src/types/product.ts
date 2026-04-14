import type { Dayjs } from "dayjs";

// ----------------------------------------------------------------
// Enum 리터럴 타입
// ----------------------------------------------------------------

export type ProductType = "SELF_PURCHASED" | "SPONSORED"; // 직접 구매 | 협찬 / 체험단
export type SponsorshipType = "SPONSORSHIP" | "TRIAL"; // 협찬 | 체험단
export type ContentType = "FEED" | "REEL" | "STORY"; // 피드 | 릴스 | 스토리
export type SponsorshipStatus = "WAITING" | "RECEIVED" | "COMPLETED"; // 대기중 | 수령완료 | 업로드완료

// ----------------------------------------------------------------
// 앱 레이어 타입 (camelCase)
// ----------------------------------------------------------------

export interface Product {
  id: number;
  userId: string;
  productType: ProductType;
  title: string;
  brandName: string;
  description: string | null;
  imageUrl: string | null;
  purchaseUrl: string | null;
  uploadedDate: string | null;
  memo: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SponsorshipDetail {
  id: number;
  productId: number;
  sponsorshipType: SponsorshipType;
  guideUrl: string | null;
  contentType: ContentType[];
  receivedDate: string | null;
  deadlineDays: number | null;
  uploadDeadline: string | null;
  retentionMonths: number | null;
  status: SponsorshipStatus;
}

// 상세 페이지용 조인 타입
export interface ProductWithDetail extends Product {
  sponsorshipDetail: SponsorshipDetail | null;
}

// 공개 리스트용 타입 (products + sponsorship_details 조인)
export interface PublicProduct {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  purchaseUrl: string;
}

// Admin 리스트용 타입
export interface AdminProduct {
  id: number;
  title: string;
  productType: ProductType;
  contentType: ContentType[] | null;
  status: SponsorshipStatus | null;
  createdAt: string;
}

// ----------------------------------------------------------------
// Form 데이터 타입
// ----------------------------------------------------------------

export interface ProductFormData extends Omit<
  Product,
  "id" | "userId" | "createdAt" | "updatedAt" | "uploadedDate"
> {
  uploadedDate: Dayjs | null;
}

export interface SponsorshipDetailFormData extends Omit<
  SponsorshipDetail,
  "id" | "productId" | "receivedDate" | "uploadDeadline" | "deadlineDays" | "retentionMonths"
> {
  receivedDate: Dayjs | null;
  uploadDeadline: Dayjs | null;
  deadlineDays: number | "";
  retentionMonths: number | "";
}

// ----------------------------------------------------------------
// DB Row 타입 (snake_case)
// ----------------------------------------------------------------

export interface ProductRow {
  id: number;
  user_id: string;
  product_type: ProductType;
  title: string;
  brand_name: string;
  description: string | null;
  image_url: string | null;
  purchase_url: string | null;
  uploaded_date: string | null;
  memo: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface SponsorshipDetailRow {
  id: number;
  product_id: number;
  sponsorship_type: SponsorshipType;
  guide_url: string | null;
  content_type: ContentType[];
  received_date: string | null;
  deadline_days: number | null;
  upload_deadline: string | null;
  retention_months: number | null;
  status: SponsorshipStatus;
}

// 공개 리스트 조회용 (products + sponsorship_details 조인)
export interface PublicProductRow {
  id: number;
  title: string;
  image_url: string | null;
  description: string | null;
  purchase_url: string | null;
}

// Admin 리스트 조회용 (products + sponsorship_details 조인)
export interface AdminProductRow {
  id: number;
  title: string;
  product_type: ProductType;
  content_type: ContentType[] | null;
  status: SponsorshipStatus | null;
  created_at: string;
}
