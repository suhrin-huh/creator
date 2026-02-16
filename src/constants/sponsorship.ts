import { SponsorshipFormData } from "@/types";

export const INITIAL_FORM_DATA: SponsorshipFormData = {
  title: "",
  brandName: "",
  guideUrl: "",
  purchaseUrl: "",
  contentType: "",
  receivedDate: null,
  deadlineDays: "",
  uploadDeadline: null,
  status: "WAITING",
  retentionMonths: "",
  description: "",
  memo: "",
  imageUrl: null,
};

export const CONTENT_TYPE_OPTIONS = [
  { label: "피드", value: "FEED" },
  { label: "릴스", value: "REEL" },
  { label: "스토리", value: "STORY" },
];

export const STATUS_OPTIONS = [
  { label: "대기중", value: "WAITING" },
  { label: "수령완료", value: "RECEIVED" },
  { label: "업로드완료", value: "COMPLETED" },
];
