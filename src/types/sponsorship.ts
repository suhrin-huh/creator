import { Dayjs } from "dayjs";

/** TODO: 업로드 완료 건의 경우 아래의 항목이 모두 작성되었다는 전제 */
export interface PublicSponsorship {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  purchaseUrl: string;
}

export interface SponsorshipFormData {
  title: string; // 협찬 건 제목
  brandName: string; // 브랜드명
  description: string; // 제품 상세 설명
  imageUrl: string | null; // 기존 이미지 URL(edit용)
  guideUrl: string; // 체험단 안내 글 링크
  purchaseUrl: string; // 제품 구매 링크
  contentType: "FEED" | "REEL" | "STORY" | ""; // 제품 홍보 유형
  receivedDate: Dayjs | null; // 제품 수령일
  deadlineDays: number | ""; // 제품 홍보 글 업로드 기간
  uploadDeadline: Dayjs | null; // 업로드 마감일
  retentionMonths: number | ""; // 컨텐츠 유지 기한
  uploadedDate: Dayjs | null; // 실제 업로드 날짜
  isPublic: boolean; // 공개 여부
  status: "WAITING" | "RECEIVED" | "COMPLETED"; // 진행상태
  memo: string; // 추가 코멘트
}
