/**
 * 제품(product) 등록/수정을 위한 form UI
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
import type { ContentType, ProductFormData, SponsorshipDetailFormData } from "@/types";

// constants
import {
  PRODUCT_TYPE_OPTIONS,
  SPONSORSHIP_TYPE_OPTIONS,
  SPONSORSHIP_CONTENT_TYPE_OPTIONS,
  SPONSORSHIP_STATUS_OPTIONS,
} from "@/constants";

interface SponsorshipFormProps {
  productFormData: ProductFormData;
  detailFormData: SponsorshipDetailFormData;
  previewUrl: string | null;
  fileSize: number | null;
  errors: Partial<Record<keyof ProductFormData | keyof SponsorshipDetailFormData, string>>;
  isPending: boolean;
  isNewMode: boolean;
  // 핸들러들
  onProductChange: (
    field: keyof ProductFormData,
  ) => (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string | number>,
  ) => void;
  onDetailChange: (
    field: keyof SponsorshipDetailFormData,
  ) => (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string | number>,
  ) => void;
  onProductDateChange: (field: "uploadedDate") => (date: Dayjs | null) => void;
  onDetailDateChange: (field: "receivedDate" | "uploadDeadline") => (date: Dayjs | null) => void;
  onContentTypeToggle: (type: ContentType) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export default function SponsorshipForm({
  productFormData,
  detailFormData,
  previewUrl,
  fileSize,
  errors,
  isPending,
  isNewMode,
  onProductChange,
  onDetailChange,
  onProductDateChange,
  onDetailDateChange,
  onContentTypeToggle,
  onImageChange,
  onImageRemove,
  onSubmit,
  onCancel,
  onDelete,
}: SponsorshipFormProps) {
  const isSponsored = productFormData.productType === "SPONSORED";

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
        {/* 공개 여부 */}
        <FormCheckbox
          label="공개 여부"
          value={productFormData.isPublic}
          onChange={onProductChange("isPublic")}
        />

        {/* 이미지 업로드 */}
        <FormImageUpload
          label="대표 이미지"
          previewUrl={previewUrl ? previewUrl : productFormData.imageUrl}
          fileSize={fileSize}
          onChange={onImageChange}
          onRemove={onImageRemove}
        />

        {/* 기본 정보 */}
        <div className="flex flex-col gap-4">
          <FormInput
            label="제품 제목"
            required
            value={productFormData.title}
            onChange={onProductChange("title")}
            errorMessage={errors.title}
            placeholder="제목을 입력하세요"
          />
          <FormInput
            label="브랜드명"
            required
            value={productFormData.brandName}
            onChange={onProductChange("brandName")}
            errorMessage={errors.brandName}
            placeholder="브랜드명을 입력하세요"
          />
          <FormSelect
            label="구매 유형"
            required
            value={productFormData.productType}
            onChange={onProductChange("productType")}
            options={PRODUCT_TYPE_OPTIONS}
          />
        </div>

        {/* 협찬 상세 정보 (SPONSORED 타입일 때만 표시) */}
        {isSponsored && (
          <div className="border-primary-focus flex flex-col gap-4 rounded-lg border p-4">
            <p className="text-sm font-semibold text-gray-600">협찬 상세 정보</p>
            <FormSelect
              label="제공 유형"
              required
              value={detailFormData.sponsorshipType}
              onChange={onDetailChange("sponsorshipType")}
              options={SPONSORSHIP_TYPE_OPTIONS}
            />

            {/* 컨텐츠 유형 (다중 선택) */}
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-gray-700">
                컨텐츠 유형 <span className="text-red-500">*</span>
              </p>
              <div className="flex gap-2">
                {SPONSORSHIP_CONTENT_TYPE_OPTIONS.map(({ label, value }) => {
                  const isSelected = detailFormData.contentType.includes(value as ContentType);
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => onContentTypeToggle(value as ContentType)}
                      className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                        isSelected
                          ? "border-primary bg-primary text-white"
                          : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              {errors.contentType && <p className="text-xs text-red-500">{errors.contentType}</p>}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormSelect
                label="진행 상태"
                required
                value={detailFormData.status}
                onChange={onDetailChange("status")}
                options={SPONSORSHIP_STATUS_OPTIONS}
                errorMessage={errors.status}
              />
              <FormInput
                label="컨텐츠 유지 기간 (개월)"
                type="number"
                value={detailFormData.retentionMonths}
                onChange={onDetailChange("retentionMonths")}
                placeholder="예: 6"
              />
              <FormDatePicker
                label="제품 수령일"
                value={detailFormData.receivedDate}
                onChange={onDetailDateChange("receivedDate")}
                errorMessage={errors.receivedDate}
              />
              <FormInput
                label="업로드 기한 (일수)"
                type="number"
                value={detailFormData.deadlineDays}
                onChange={onDetailChange("deadlineDays")}
                placeholder="예: 7"
              />
              <FormDatePicker
                label="업로드 마감일"
                value={detailFormData.uploadDeadline}
                onChange={onDetailDateChange("uploadDeadline")}
              />
            </div>
            <FormInput
              label="가이드 링크"
              value={detailFormData.guideUrl ?? ""}
              onChange={onDetailChange("guideUrl")}
            />
          </div>
        )}
        <div className="flex flex-col gap-4">
          <FormInput
            label="구매 링크"
            value={productFormData.purchaseUrl ?? ""}
            onChange={onProductChange("purchaseUrl")}
          />
          <FormDatePicker
            label="컨텐츠 업로드 날짜"
            value={productFormData.uploadedDate}
            onChange={onProductDateChange("uploadedDate")}
          />
          <FormInput
            label="제품 설명"
            multiline
            rows={3}
            value={productFormData.description ?? ""}
            onChange={onProductChange("description")}
            placeholder="제품에 대한 설명을 적어주세요."
          />
          <FormInput
            label="메모 / 코멘트"
            multiline
            rows={3}
            value={productFormData.memo ?? ""}
            onChange={onProductChange("memo")}
            placeholder="기억해야 할 사항을 적어주세요."
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex shrink-0 justify-between border-t bg-gray-50 p-4">
        <div>
          {!isNewMode && onDelete && (
            <Button size="sm" colorTheme="danger" onClick={onDelete} disabled={isPending}>
              삭제
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          <Button size="sm" colorTheme="outlined" onClick={onCancel} disabled={isPending}>
            취소
          </Button>
          <Button size="sm" colorTheme="outlined" disabled={isPending} type="submit">
            {isPending ? "저장 중..." : "저장하기"}
          </Button>
        </div>
      </div>
    </form>
  );
}
