"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import { Dayjs } from "dayjs";
import "dayjs/locale/ko";

// 서버 액션
import { saveSponsorship } from "@/actions/sponsorship";

// component
import {
  FormInput,
  FormSelect,
  FormDatePicker,
  FormImageUpload,
} from "@/components/common/FormInputs";

interface SponsorshipFormData {
  title: string; // 협찬 건 제목
  brand: string; // 브랜드명
  guideLink: string; // 체험단 안내 글 링크
  purchaseLink: string; // 제품 구매 링크
  contentType: "FEED" | "REEL" | "STORY" | ""; // 제품 홍보 유형
  receivedDate: Dayjs | null; // 제품 수령일
  uploadPeriodDays: number | ""; // 제품 홍보 글 업로드 기간
  uploadDeadline: Dayjs | null; // 업로드 마감일
  status: "WAITING" | "RECEIVED" | "COMPLETED"; // 진행상태
  contentRetentionMonths: number | ""; // 컨텐츠 유지 기한
  description: string; // 제품 상세 설명
  comment: string; // 추가 코멘트
  existingImageUrl?: string | null; // 기존 이미지 URL(edit용)
}

const initialFormData: SponsorshipFormData = {
  title: "",
  brand: "",
  guideLink: "",
  purchaseLink: "",
  contentType: "",
  receivedDate: null,
  uploadPeriodDays: "",
  uploadDeadline: null,
  status: "WAITING",
  contentRetentionMonths: "",
  description: "",
  comment: "",
  existingImageUrl: null,
};

// [옵션 데이터 정의] Select box용
const CONTENT_TYPE_OPTIONS = [
  { label: "피드", value: "FEED" },
  { label: "릴스", value: "REEL" },
  { label: "스토리", value: "STORY" },
];

const STATUS_OPTIONS = [
  { label: "대기중", value: "WAITING" },
  { label: "수령완료", value: "RECEIVED" },
  { label: "업로드완료", value: "COMPLETED" },
];

export default function SponsorshipDetailModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const action = searchParams.get("action");
  const sponsorshipId = searchParams.get("sponsorshipId");
  const isNewMode = action === "new";
  const isEditMode = action === "edit" && sponsorshipId;

  // State 관리
  const [formData, setFormData] = useState<SponsorshipFormData>(initialFormData);
  const [imageFile, setImageFile] = useState<File | null>(null); // 업로드할 파일 객체
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // 미리보기 URL
  const [errors, setErrors] = useState<Partial<Record<keyof SponsorshipFormData, string>>>({});
  
  // useTransition: 서버 액션 실행 중 로딩 상태 관리
  const [isPending, startTransition] = useTransition();

  // action == 'edit'일 경우 기존 데이터 호출
  useEffect(() => {
    if (isEditMode && sponsorshipId) {
      // TODO: API 호출 - GET /api/v1/sponsorships/${sponsorshipId}
      // const fetchProduct = async () => {
      //   const response = await fetch(`/api/v1/sponsorships/${sponsorshipId}`);
      //   const data = await response.json();
      //   setFormData({
      //     ...data,
      //     receivedDate: data.receivedDate ? dayjs(data.receivedDate) : null,
      //     uploadDeadline: data.uploadDeadline ? dayjs(data.uploadDeadline) : null,
      //   });
      // };
      // fetchProduct();
      
      // 임시: 콘솔에만 출력
      console.log(`편집 모드: 상품 ID ${sponsorshipId} 데이터 불러오기`);
    } else if (isNewMode) {
      // 새 모드일 때는 폼 초기화
      setFormData(initialFormData);
      setImageFile(null);
      setPreviewUrl(null);
      setErrors({});
    }
  }, [isEditMode, isNewMode, sponsorshipId]);

  // 모달 닫기 핸들러
  const handleClose = () => {
    // form 초기화
    setFormData(initialFormData);
    setImageFile(null);
    setPreviewUrl(null);
    setErrors({});

    const params = new URLSearchParams(searchParams.toString());
    params.delete("action");
    params.delete("sponsorshipId");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // 필드 변경 핸들러
  // 추가 로직 => 제품 수령일, 업로드 기한, 업로드 마감일 연결되어 변경
  const handleChange = (field: keyof SponsorshipFormData) => (
    e: React.ChangeEvent<HTMLInputElement> | { target: { value: unknown } }
  ) => {
    const value = e.target.value;
    
    setFormData((prev) => {

      // 변경 적용한 새로운 상태 객체 생성
      const nextState = {
        ...prev,
        [field]: value,
      };

      // 자동 계산 로직
      if (field === 'uploadPeriodDays') {
        const {receivedDate, uploadPeriodDays} = nextState
        
        if (receivedDate && uploadPeriodDays !== '') {
          nextState.uploadDeadline = receivedDate.add(Number(uploadPeriodDays), 'day');
        }
      }

      return nextState;
    });
    
    // 에러 초기화
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // 날짜 변경 핸들러
  const handleDateChange = (field: "receivedDate" | "uploadDeadline") => (date: Dayjs | null) => {
    setFormData((prev) => {
      // 변경 적용한 새로운 상태 객체 생성
      const nextState = {
        ...prev,
        [field]: date,
      };

      // 자동 계산 로직
      if (field === 'receivedDate') {
        const {receivedDate, uploadPeriodDays} = nextState
        
        if (receivedDate && uploadPeriodDays !== '') {
          nextState.uploadDeadline = receivedDate.add(Number(uploadPeriodDays), 'day');
        }
      }

      return nextState;
    });
  };

// 이미지 파일 선택 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    // 미리보기 URL 생성
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    }
  };

// 폼 제출 핸들러 (서버 액션 호출)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();


    // 클라이언트 유효성 검사
     const newErrors: Partial<Record<keyof SponsorshipFormData, string>> = {};
     if (!formData.title.trim()) newErrors.title = "제목을 입력해주세요.";
     if (!formData.brand.trim()) newErrors.brand = "브랜드명을 입력해주세요.";
     if (!formData.contentType) newErrors.contentType = "유형을 선택해주세요.";
     if (!formData.status) newErrors.status = "진행상태를 선택해주세요.";

     if (Object.keys(newErrors).length > 0) {
       setErrors(newErrors);
       return;
     }

    // FormData 생성 (서버로 보낼 데이터 포장)
     const submitFormData = new FormData();
     submitFormData.append("actionType", isEditMode ? "edit" : "new");
     if (sponsorshipId) submitFormData.append("id", sponsorshipId);
     submitFormData.append("title", formData.title);
     submitFormData.append("brand", formData.brand);
     submitFormData.append("contentType", formData.contentType);
     submitFormData.append("status", formData.status);
     submitFormData.append("guideLink", formData.guideLink);
     submitFormData.append("purchaseLink", formData.purchaseLink);
     submitFormData.append("description", formData.description);
     submitFormData.append("comment", formData.comment);
  
  // 숫자 필드 (빈 값이면 보내지 않거나 빈 문자열로 처리됨 -> 서버에서 처리)
     submitFormData.append("uploadPeriodDays", String(formData.uploadPeriodDays));
     submitFormData.append("contentRetentionMonths", String(formData.contentRetentionMonths));

  // 날짜 필드 (Dayjs -> string YYYY-MM-DD 변환)
  if (formData.receivedDate) {
    submitFormData.append("receivedDate", formData.receivedDate.format("YYYY-MM-DD"));
  }
  if (formData.uploadDeadline) {
    submitFormData.append("uploadDeadline", formData.uploadDeadline.format("YYYY-MM-DD"));
  }

  // 이미지 파일 처리
  if (imageFile) {
    submitFormData.append("image", imageFile); // 새로 업로드한 파일
  }
  // 기존 이미지가 있고 새 파일이 없을 때 유지하기 위해 (필요시)
  if (formData.existingImageUrl) {
    submitFormData.append("existingImageUrl", formData.existingImageUrl);
  }

  // 3. 서버 액션 실행 (Transition 사용)
    startTransition(async () => {
      try {
        const result = await saveSponsorship(null, submitFormData);
      
        if (result.success) {
          alert(result.message);
          handleClose();
        } else {
        alert(result.message); // 실패 메시지
        }
      } catch (error) {
        console.error(error);
      alert("저장 중 오류가 발생했습니다.");
      }
    });
  };

  // action이 없으면 아무것도 렌더링하지 않음
  if (!action) return null;

  return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      >
        <form
          onSubmit={handleSubmit}
          onClick={(e) => e.stopPropagation()}
          className="relative w-[90%] min-w-[600px] min-h-[600px] max-h-[85vh] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50 shrink-0">
            <h2 className="text-xl font-bold text-gray-800">
              {isNewMode ? "새 상품 추가" : "상품 상세 정보"}
            </h2>
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              &times;
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            {/* 이미지 업로드 */}
            <FormImageUpload
              label="대표 이미지"
              previewUrl={previewUrl}
              onChange={handleImageChange}
            />

            {/* 기본 정보 */}
            <div className="flex flex-col gap-4">
              <FormInput
                label="협찬 건 제목"
                required
                value={formData.title}
                onChange={handleChange("title")}
                errorMessage={errors.title}
                placeholder="제목을 입력하세요"
              />
              <FormInput
                label="브랜드명"
                required
                value={formData.brand}
                onChange={handleChange("brand")}
                errorMessage={errors.brand}
                placeholder="브랜드명을 입력하세요"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <FormSelect
                label="유형"
                required
                value={formData.contentType}
                onChange={(e) => handleChange("contentType")(e as any)}
                options={CONTENT_TYPE_OPTIONS}
                errorMessage={errors.contentType}
              />
              <FormSelect
                label="진행 상태"
                required
                value={formData.status}
                onChange={(e) => handleChange("status")(e as any)}
                options={STATUS_OPTIONS}
                errorMessage={errors.status}
              />
                            <FormInput
                label="컨텐츠 유지 기간 (개월)"
                type="number"
                value={formData.contentRetentionMonths}
                onChange={handleChange("contentRetentionMonths")}
                placeholder="예: 6"
              />
              <FormDatePicker
                label="제품 수령일"
                value={formData.receivedDate}
                onChange={handleDateChange("receivedDate")}
                errorMessage={errors.receivedDate}
              />
              <FormInput
                label="업로드 기한 (일수)"
                type="number"
                value={formData.uploadPeriodDays}
                onChange={handleChange("uploadPeriodDays")}
                placeholder="예: 7"
              />
              <FormDatePicker
                label="업로드 마감일"
                value={formData.uploadDeadline}
                onChange={handleDateChange("uploadDeadline")}
              />

            </div>

            {/* 링크 및 상세 정보 */}
            <div className="flex flex-col gap-4">
              <FormInput
                label="가이드 링크"
                value={formData.guideLink}
                onChange={handleChange("guideLink")}
              />
              <FormInput
                label="구매 링크"
                value={formData.purchaseLink}
                onChange={handleChange("purchaseLink")}
              />
              <FormInput
                label="제품 설명"
                multiline
                rows={3}
                value={formData.description}
                onChange={handleChange("description")}
                placeholder="기억해야 할 사항을 적어주세요."
              />
              <FormInput
                label="메모 / 코멘트"
                multiline
                rows={3}
                value={formData.comment}
                onChange={handleChange("comment")}
                placeholder="기억해야 할 사항을 적어주세요."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t bg-gray-50 flex justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={handleClose}
              disabled={isPending}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors"
            >
              {isPending ? "저장 중..." : "저장하기"}
            </button>
          </div>
        </form>
      </div>
  );
}