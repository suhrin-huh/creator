import type { ProductFormData, SponsorshipDetailFormData } from "@/types";

export const INITIAL_PRODUCT_FORM_DATA: ProductFormData = {
  productType: "SPONSORED",
  title: "",
  brandName: "",
  description: null,
  imageUrl: null,
  purchaseUrl: null,
  uploadedDate: null,
  memo: null,
  isPublic: false,
};

export const INITIAL_SPONSORSHIP_DETAIL_FORM_DATA: SponsorshipDetailFormData = {
  sponsorshipType: "SPONSORSHIP", // 현재 협찬받은 제품만 작성되어 있음.
  guideUrl: null,
  contentType: [],
  receivedDate: null,
  deadlineDays: "",
  uploadDeadline: null,
  retentionMonths: "",
  status: "WAITING",
};

export const PRODUCT_TYPE_OPTIONS = [
  { label: "직접 구매", value: "SELF_PURCHASED" },
  { label: "협찬/체험단", value: "SPONSORED" },
];

export const SPONSORSHIP_TYPE_OPTIONS = [
  { label: "협찬", value: "SPONSORSHIP" },
  { label: "체험단", value: "TRIAL" },
];

export const SPONSORSHIP_CONTENT_TYPE_OPTIONS = [
  { label: "피드", value: "FEED" },
  { label: "릴스", value: "REEL" },
  { label: "스토리", value: "STORY" },
];

export const SPONSORSHIP_STATUS_OPTIONS = [
  { label: "대기중", value: "WAITING" },
  { label: "수령완료", value: "RECEIVED" },
  { label: "업로드완료", value: "COMPLETED" },
];
