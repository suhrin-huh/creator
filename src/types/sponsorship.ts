import type { Dayjs } from "dayjs";

// 공통 리터럴 타입 분리
export type ContentType = "FEED" | "REEL" | "STORY";
export type SponsorshipStatus = "WAITING" | "RECEIVED" | "COMPLETED";

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
  status: SponsorshipStatus;
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

/** DB Row 타입 (DB 매핑용, Snake Case) */
export interface PublicSponsorshipRow {
  id: number;
  title: string;
  image_url: string | null;
  description: string | null;
  purchase_url: string | null;
}
