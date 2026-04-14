import type { Dayjs } from "dayjs";

// 공통 리터럴 타입 분리
type ContentType = "FEED" | "REEL" | "STORY";
export type Status = "WAITING" | "RECEIVED" | "COMPLETED";

// Master 타입
export interface Sponsorship {
  id: number;
  title: string;
  brandName: string;
  description: string | null;
  imageUrl: string | null;
  guideUrl: string | null;
  purchaseUrl: string | null;
  contentType: ContentType;
  receivedDate: string | null;
  deadlineDays: number | null;
  uploadDeadline: string | null;
  retentionMonths: number | null;
  uploadedDate: string | null;
  isPublic: boolean;
  status: Status;
  memo: string;
}

// Public 리스트용 타입
export interface PublicSponsorship extends Pick<Sponsorship, "id" | "title"> {
  imageUrl: string;
  description: string;
  purchaseUrl: string;
}

// Form 데이터용 타입
export interface SponsorshipFormData extends Omit<
  Sponsorship,
  | "id"
  | "contentType"
  | "receivedDate"
  | "uploadDeadline"
  | "uploadedDate"
  | "deadlineDays"
  | "retentionMonths"
> {
  contentType: ContentType | "";
  receivedDate: Dayjs | null;
  uploadDeadline: Dayjs | null;
  uploadedDate: Dayjs | null;
  deadlineDays: number | "";
  retentionMonths: number | "";
}

// admin 협찬 리스트 목록 조회
export interface AdminSponsorship {
  id: number;
  title: string;
  contentType: ContentType;
  status: Status;
  createdDate: string;
}

/** DB Row 타입 (DB 매핑용, Snake Case) */

// Master 타입
export interface SponsorshipRow {
  id: number; // required
  user_id: number; // required
  title: string; // required
  brand_name: string;
  description: string | null;
  image_url: string | null;
  guide_url: string | null;
  purchase_url: string | null;
  content_type: ContentType;
  received_date: string | null;
  deadline_days: number | null;
  upload_deadline: string | null;
  retention_months: number | null;
  status: Status;
  memo: string | null;
  created_at: string;
  updated_at: string;
  uploaded_date: string | null;
  is_public: boolean;
}

// 공개 리스트
export interface PublicSponsorshipRow {
  id: number;
  title: string;
  image_url: string | null;
  description: string | null;
  purchase_url: string | null;
}

// admin 협찬 리스트 목록 조회
export interface AdminSponsorshipRow {
  id: number;
  title: string;
  content_type: ContentType;
  status: Status;
  created_at: string;
}
