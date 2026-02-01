"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import "dayjs/locale/ko";

// 서버 액션 import
import { saveSponsorship } from "@/actions/sponsorship";


// 폼 데이터 타입 정의
interface SponsorshipFormData {
  title: string;
  brand: string;
  guideLink: string;
  purchaseLink: string;
  contentType: "FEED" | "REEL" | "STORY" | "";
  receivedDate: Dayjs | null;
  uploadPeriodDays: number | "";
  uploadDeadline: Dayjs | null;
  status: "WAITING" | "RECEIVED" | "COMPLETED";
  contentRetentionMonths: number | "";
  description: string;
  comment: string;
  // 기존 이미지 URL (수정 모드용)
  existingImageUrl?: string | null; 
}

// 초기 폼 데이터
const initialFormData: SponsorshipFormData = {
  title: "", // 협찬 건 제목
  brand: "", // 브랜드명
  guideLink: "", // 체험단 안내 글 링크
  purchaseLink: "", // 제품 구매 링크
  contentType: "", // 제품 홍보 유형
  receivedDate: null, // 제품 수령일
  uploadPeriodDays: "", // 제품 홍보 글 업로드 기간
  uploadDeadline: null, // 업로드 마감일
  status: "WAITING", // 진행상태
  contentRetentionMonths: "", // 컨텐츠 유지 기한
  description: "", // 제품 상세 설명
  comment: "", // 추가 코멘트
  // 기존 이미지 URL (수정 모드용)
  existingImageUrl:null
};

export default function SponsorshipDetailModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // URL 쿼리 파라미터 처리
  const action = searchParams.get("action"); // "new" | "edit" | null
  const sponsorshipId = searchParams.get("sponsorshipId"); // 편집 모드일 때만 존재

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
  const handleChange = (field: keyof SponsorshipFormData) => (
    e: React.ChangeEvent<HTMLInputElement> | { target: { value: unknown } }
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
    setFormData((prev) => ({
      ...prev,
      [field]: date,
    }));
  };

// ★ 이미지 파일 선택 핸들러
const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setImageFile(file);
    // 미리보기 URL 생성
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  }
};

// ★ 폼 제출 핸들러 (서버 액션 호출)
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  // console.table(formData);

  // return;

  // 1. 클라이언트 유효성 검사
  const newErrors: Partial<Record<keyof SponsorshipFormData, string>> = {};
  // if (!formData.title.trim()) newErrors.title = "제목을 입력해주세요.";
  // if (!formData.brand.trim()) newErrors.brand = "브랜드명을 입력해주세요.";
  // if (!formData.contentType) newErrors.contentType = "유형을 선택해주세요.";
  // // status는 기본값이 있어서 체크 생략 가능하지만 안전하게
  // if (!formData.status) newErrors.status = "진행상태를 선택해주세요.";

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    console.log("123")
    return;
  }

  // 2. FormData 생성 (서버로 보낼 데이터 포장)
  const submitFormData = new FormData();
  
  // 기본 필드 추가
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
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs"
        onClick={handleClose}
      >
        <form
          onSubmit={handleSubmit}
          onClick={(e) => e.stopPropagation()}
          className="min-h-0 shrink-0 relative w-4/5 max-w-[900px] max-h-4/5 bg-white rounded-lg shadow-lg flex flex-col overflow-scroll hide-scrollbar p-lg"
        >
          {/* Form Header */}
          <div
            className="flex items-center justify-between py-md"
          >
            <p className="text-h3 font-bold">
              {isNewMode ? "새 상품 추가" : "상품 상세 정보"}
            </p>
            <button type="button" onClick={handleClose}>
              X
            </button>
          </div>
          {/* 메인 form */}
          <div className="flex flex-col gap-y-md overflow-scroll hide-scrollbar">
            {/* (1) text */}
            <div className="flex flex-col gap-y-sm">
              <p className="font-semibold text-body-md">
                협찬 건 제목 <span className="text-danger">*</span>
              </p>
              <TextField
                fullWidth
                value={formData.title}
                onChange={handleChange("title")}
                error={!!errors.title}
                placeholder="협찬 건 제목을 입력하세요"
                size="small"
              />
              {errors.title && (
                <p className="text-caption font-semibold text-danger">
                  {errors.contentType}
                </p>
              )}
            </div>
            {/* (2) select */}
            <div className="flex min-w-[250px] flex-col gap-y-sm">
              <p className="text-body-md font-semibold">
                유형 <span className="text-danger">*</span>
              </p>
              <FormControl fullWidth size="small" error={!!errors.contentType}>
                <Select
                  value={formData.contentType}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      contentType: e.target.value as SponsorshipFormData["contentType"],
                    }));
                    if (errors.contentType) {
                      setErrors((prev) => ({
                        ...prev,
                        contentType: undefined,
                      }));
                    }
                  }}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    None
                  </MenuItem>
                  <MenuItem value="FEED">피드</MenuItem>
                  <MenuItem value="REEL">릴스</MenuItem>
                  <MenuItem value="STORY">스토리</MenuItem>
                </Select>
                {errors.contentType && (
                  <p className="text-caption font-semibold text-danger">
                    {errors.contentType}
                  </p>
                )}
              </FormControl>
            </div>
            {/* (3) date picker */}
            <div className="flex min-w-[250px] flex-col gap-y-sm">
              <p className="text-body-md font-semibold">
                제품 수령일 <span className="text-danger">*</span>
              </p>
              <DatePicker
                value={formData.receivedDate}
                onChange={handleDateChange("receivedDate")}
                format="YYYY-MM-DD"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                    placeholder: "yyyy-mm-dd",
                  },
                }}
              />
                {errors.receivedDate && (
                  <p className="text-caption font-semibold text-danger">
                    {errors.receivedDate}
                  </p>
                )}
            </div>
            {/* 업로드 버튼 영역 */}
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-sm text-gray-700">대표 이미지</span>
              <div className="flex items-start gap-4">
                {/* 미리보기 영역 */}
                <div className="w-24 h-24 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">No Image</span>
                  )}
                </div>

                {/* 버튼 및 안내 문구 */}
                <div className="flex flex-col gap-1">
                  {/* [수정 포인트] 
                    button -> label로 변경하고 cursor-pointer 클래스 추가 
                    이렇게 하면 라벨을 클릭했을 때 내부의 input type="file"이 실행됩니다.
                  */}
                  <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    이미지 선택
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                  <span className="text-xs text-gray-500 ml-1">
                    jpg, png, webp (최대 5MB)
                  </span>
                </div>
              </div>
            </div>
            {/* Footer button */}
            <div
              className="flex justify-end gap-md p-md"
              >
              <button type="button" onClick={handleClose}>
                취소
              </button>
              <button type="submit">
                저장
              </button>
            </div>
          </div>
        </form>
      </div>
    </LocalizationProvider>
  );
}
