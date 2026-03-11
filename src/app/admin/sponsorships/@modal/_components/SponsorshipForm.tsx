/**
 * sponsorship 등록을 위한 form UI
 */

"use client";

// component
import {
  FormInput,
  FormSelect,
  FormDatePicker,
  FormImageUpload,
  FormCheckbox,
} from "@/components/common/FormInputs";

import Button from "@/components/common/Button";

import "dayjs/locale/ko";

// types
import type { Dayjs } from "dayjs";
import type { SelectChangeEvent } from "@mui/material";
import { SponsorshipFormData } from "@/types";

// constants
import { CONTENT_TYPE_OPTIONS, STATUS_OPTIONS } from "@/constants";

interface SponsorshipFormProps {
  formData: SponsorshipFormData;
  previewUrl: string | null;
  fileSize: number | null;
  errors: Partial<Record<keyof SponsorshipFormData, string>>;
  isPending: boolean;
  isNewMode: boolean;
  // 핸들러들
  onChange: (
    field: keyof SponsorshipFormData,
  ) => (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string | number>,
  ) => void;
  onDateChange: (
    field: "receivedDate" | "uploadDeadline" | "uploadedDate",
  ) => (date: Dayjs | null) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function SponsorshipForm({
  formData,
  previewUrl,
  fileSize,
  errors,
  isPending,
  isNewMode,
  onChange,
  onDateChange,
  onImageChange,
  onImageRemove,
  onSubmit,
  onCancel,
}: SponsorshipFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      onClick={(e) => e.stopPropagation()}
      className="relative flex max-h-[85vh] w-[90%] flex-col overflow-hidden rounded-xl bg-white shadow-2xl md:min-h-150 md:min-w-150"
    >
      <div className="flex shrink-0 items-center justify-between border-b bg-gray-50 px-6 py-4">
        <h2 className="text-xl font-bold text-gray-800">
          {isNewMode ? "새 상품 추가" : "상품 상세 정보"}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-2xl font-bold text-gray-400 hover:text-gray-600"
        >
          &times;
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
        <div></div>
        <FormCheckbox label="공개 여부" value={formData.isPublic} onChange={onChange("isPublic")} />
        {/* 이미지 업로드 */}
        <FormImageUpload
          label="대표 이미지"
          previewUrl={previewUrl ? previewUrl : formData.imageUrl}
          fileSize={fileSize}
          onChange={onImageChange}
          onRemove={onImageRemove}
        />

        {/* 기본 정보 */}
        <div className="flex flex-col gap-4">
          <FormInput
            label="협찬 건 제목"
            required
            value={formData.title}
            onChange={onChange("title")}
            errorMessage={errors.title}
            placeholder="제목을 입력하세요"
          />
          <FormInput
            label="브랜드명"
            required
            value={formData.brandName}
            onChange={onChange("brandName")}
            errorMessage={errors.brandName}
            placeholder="브랜드명을 입력하세요"
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormSelect
            label="유형"
            required
            value={formData.contentType}
            onChange={onChange("contentType")}
            options={CONTENT_TYPE_OPTIONS}
            errorMessage={errors.contentType}
          />
          <FormSelect
            label="진행 상태"
            required
            value={formData.status}
            onChange={onChange("status")}
            options={STATUS_OPTIONS}
            errorMessage={errors.status}
          />
          <FormInput
            label="컨텐츠 유지 기간 (개월)"
            type="number"
            value={formData.retentionMonths}
            onChange={onChange("retentionMonths")}
            placeholder="예: 6"
          />
          <FormDatePicker
            label="제품 수령일"
            value={formData.receivedDate}
            onChange={onDateChange("receivedDate")}
            errorMessage={errors.receivedDate}
          />
          <FormInput
            label="업로드 기한 (일수)"
            type="number"
            value={formData.deadlineDays}
            onChange={onChange("deadlineDays")}
            placeholder="예: 7"
          />
          <FormDatePicker
            label="업로드 마감일"
            value={formData.uploadDeadline}
            onChange={onDateChange("uploadDeadline")}
          />
          <FormDatePicker
            label="컨텐츠 업로드 날짜"
            value={formData.uploadedDate}
            onChange={onDateChange("uploadedDate")}
          />
        </div>

        {/* 링크 및 상세 정보 */}
        <div className="flex flex-col gap-4">
          <FormInput
            label="가이드 링크"
            value={formData.guideUrl}
            onChange={onChange("guideUrl")}
          />
          <FormInput
            label="구매 링크"
            value={formData.purchaseUrl}
            onChange={onChange("purchaseUrl")}
          />
          <FormInput
            label="제품 설명"
            multiline
            rows={3}
            value={formData.description}
            onChange={onChange("description")}
            placeholder="기억해야 할 사항을 적어주세요."
          />
          <FormInput
            label="메모 / 코멘트"
            multiline
            rows={3}
            value={formData.memo}
            onChange={onChange("memo")}
            placeholder="기억해야 할 사항을 적어주세요."
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex shrink-0 justify-end gap-3 border-t bg-gray-50 p-4">
        <Button size="sm" colorTheme="outlined" onClick={onCancel} disabled={isPending}>
          취소
        </Button>
        <Button size="sm" colorTheme="accent" disabled={isPending} type="submit">
          {isPending ? "저장 중..." : "저장하기"}
        </Button>
      </div>
    </form>
  );
}
