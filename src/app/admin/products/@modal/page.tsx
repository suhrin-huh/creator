"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState } from "react";
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

// 폼 데이터 타입 정의
interface ProductFormData {
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
}

// 초기 폼 데이터
const initialFormData: ProductFormData = {
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
};

export default function ProductDetailModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const productId = searchParams.get("productId");

  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});

  // 모달 닫기 핸들러
  const handleClose = () => {
    // form 초기화
    setFormData(initialFormData)
    setErrors({})

    const params = new URLSearchParams(searchParams.toString());
    params.delete("productId");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // 필드 변경 핸들러
  const handleChange = (field: keyof ProductFormData) => (
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

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 필수값 검증
    const newErrors: Partial<Record<keyof ProductFormData, string>> = {};
    if (!formData.title.trim()) {
      newErrors.title = "협찬 건 제목을 입력해주세요.";
    }
    if (!formData.brand.trim()) {
      newErrors.brand = "브랜드명을 입력해주세요.";
    }
    if (!formData.contentType) {
      newErrors.contentType = "유형을 선택해주세요.";
    }
    if (!formData.status) {
      newErrors.status = "진행상태를 선택해주세요.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 폼 데이터 처리 (여기서는 콘솔에 출력)
    console.log("Form Data:", {
      ...formData,
      receivedDate: formData.receivedDate?.format("YYYY-MM-DD") || null,
      uploadDeadline: formData.uploadDeadline?.format("YYYY-MM-DD") || null,
    });

    // TODO: API 호출 또는 상태 업데이트
    alert("저장되었습니다!");
  };

  // productId가 없으면 아무것도 렌더링하지 않음
  if (!productId) return null;

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
              상품 상세 정보
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
                      contentType: e.target.value as ProductFormData["contentType"],
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
