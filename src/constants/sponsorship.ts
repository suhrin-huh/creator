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
  uploadedDate: null,
  isPublic: false,
};

export const STATUS_OPTIONS = [
  { label: "대기중", value: "WAITING" },
  { label: "수령완료", value: "RECEIVED" },
  { label: "업로드완료", value: "COMPLETED" },
];
