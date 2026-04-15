// actions
import { getProductById } from "@/actions/products";

// library
import { useState, useEffect } from "react";
import dayjs from "dayjs";

// types
import type { Dayjs } from "dayjs";
import type { SelectChangeEvent } from "@mui/material";
import type { ContentType, ProductFormData, SponsorshipDetailFormData } from "@/types";

// constants
import { INITIAL_PRODUCT_FORM_DATA, INITIAL_SPONSORSHIP_DETAIL_FORM_DATA } from "@/constants";

// hooks
import { useSaveProductMutation } from "./useProducts";

interface UseProductFormProps {
  isEditMode: boolean;
  productId: string | null;
  onSuccess: () => void;
}

type FormErrors = Partial<Record<keyof ProductFormData | keyof SponsorshipDetailFormData, string>>;

export function useProductForm({ isEditMode, productId, onSuccess }: UseProductFormProps) {
  const [productFormData, setProductFormData] =
    useState<ProductFormData>(INITIAL_PRODUCT_FORM_DATA);
  const [detailFormData, setDetailFormData] = useState<SponsorshipDetailFormData>(
    INITIAL_SPONSORSHIP_DETAIL_FORM_DATA,
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const mutation = useSaveProductMutation();

  // 초기 데이터 로드 및 리셋
  useEffect(() => {
    const fetchDetail = async () => {
      if (isEditMode && productId) {
        const data = await getProductById(Number(productId));

        if (data) {
          setProductFormData({
            productType: data.productType,
            title: data.title,
            brandName: data.brandName,
            description: data.description || "",
            imageUrl: data.imageUrl,
            purchaseUrl: data.purchaseUrl,
            uploadedDate: data.uploadedDate ? dayjs(data.uploadedDate) : null,
            memo: data.memo || "",
            isPublic: data.isPublic,
          });

          if (data.sponsorshipDetail) {
            const d = data.sponsorshipDetail;
            setDetailFormData({
              sponsorshipType: d.sponsorshipType,
              guideUrl: d.guideUrl,
              contentType: d.contentType,
              receivedDate: d.receivedDate ? dayjs(d.receivedDate) : null,
              deadlineDays: d.deadlineDays ?? "",
              uploadDeadline: d.uploadDeadline ? dayjs(d.uploadDeadline) : null,
              retentionMonths: d.retentionMonths ?? "",
              status: d.status,
            });
          } else {
            setDetailFormData(INITIAL_SPONSORSHIP_DETAIL_FORM_DATA);
          }
        }
      } else {
        resetForm();
      }
    };

    fetchDetail();
  }, [isEditMode, productId]);

  const resetForm = () => {
    setProductFormData(INITIAL_PRODUCT_FORM_DATA);
    setDetailFormData(INITIAL_SPONSORSHIP_DETAIL_FORM_DATA);
    setImageFile(null);
    setPreviewUrl(null);
    setFileSize(null);
    setErrors({});
  };

  // products 테이블 필드 변경 핸들러
  const handleProductChange =
    (field: keyof ProductFormData) =>
    (
      e:
        | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | SelectChangeEvent<string | number>,
    ) => {
      const target = e.target;
      const isCheckbox = "type" in target && target.type === "checkbox";
      const value = isCheckbox ? (target as HTMLInputElement).checked : target.value;
      setProductFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field as keyof FormErrors]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  // sponsorship_details 테이블 필드 변경 핸들러
  const handleDetailChange =
    (field: keyof SponsorshipDetailFormData) =>
    (
      e:
        | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | SelectChangeEvent<string | number>,
    ) => {
      const target = e.target;
      const value = target.value;
      setDetailFormData((prev) => {
        const nextState = { ...prev, [field]: value };
        // 업로드 기한 자동 계산
        if (field === "deadlineDays") {
          const { receivedDate, deadlineDays } = nextState;
          if (receivedDate && deadlineDays !== "") {
            nextState.uploadDeadline = receivedDate.add(Number(deadlineDays), "day");
          }
        }
        return nextState;
      });
      if (errors[field as keyof FormErrors]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  // products 날짜 필드 (uploadedDate)
  const handleProductDateChange = (field: "uploadedDate") => (date: Dayjs | null) => {
    setProductFormData((prev) => ({ ...prev, [field]: date }));
  };

  // sponsorship_details 날짜 필드 (receivedDate, uploadDeadline)
  const handleDetailDateChange =
    (field: "receivedDate" | "uploadDeadline") => (date: Dayjs | null) => {
      setDetailFormData((prev) => {
        const nextState = { ...prev, [field]: date };
        // 수령일 변경 시 업로드 기한 자동 계산
        if (field === "receivedDate") {
          const { receivedDate, deadlineDays } = nextState;
          if (receivedDate && deadlineDays !== "") {
            nextState.uploadDeadline = receivedDate.add(Number(deadlineDays), "day");
          }
        }
        return nextState;
      });
    };

  // contentType 배열 토글
  const handleContentTypeToggle = (type: ContentType) => {
    setDetailFormData((prev) => {
      const next = prev.contentType.includes(type)
        ? prev.contentType.filter((t) => t !== type)
        : [...prev.contentType, type];
      return { ...prev, contentType: next };
    });
    if (errors.contentType) setErrors((prev) => ({ ...prev, contentType: undefined }));
  };

  // 이미지 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setFileSize(file.size);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setFileSize(null);
    setProductFormData((prev) => ({ ...prev, imageUrl: null }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    const newErrors: FormErrors = {};
    if (!productFormData.title.trim()) newErrors.title = "제목을 입력해주세요.";
    if (!productFormData.brandName.trim()) newErrors.brandName = "브랜드명을 입력해주세요.";
    if (productFormData.productType === "SPONSORED") {
      if (!detailFormData.contentType.length) newErrors.contentType = "유형을 선택해주세요.";
      if (!detailFormData.status) newErrors.status = "진행상태를 선택해주세요.";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const submitFormData = new FormData();
    submitFormData.append("actionType", isEditMode ? "edit" : "new");
    if (productId) submitFormData.append("id", productId);

    // products 필드
    Object.entries(productFormData).forEach(([key, value]) => {
      if (value === null) return;
      if (key === "uploadedDate") {
        submitFormData.append(key, (value as Dayjs).format("YYYY-MM-DD"));
      } else {
        submitFormData.append(key, String(value));
      }
    });

    // sponsorship_details 필드 (SPONSORED 타입일 때만)
    if (productFormData.productType === "SPONSORED") {
      Object.entries(detailFormData).forEach(([key, value]) => {
        if (value === null) return;
        if (key === "receivedDate" || key === "uploadDeadline") {
          submitFormData.append(key, (value as Dayjs).format("YYYY-MM-DD"));
        } else if (key === "contentType") {
          (value as ContentType[]).forEach((t) => submitFormData.append("contentType", t));
        } else {
          submitFormData.append(key, String(value));
        }
      });
    }

    if (imageFile) submitFormData.append("image", imageFile);

    mutation.mutate(submitFormData, {
      onSuccess: (result) => {
        if (result.success) {
          alert(result.message);
          resetForm();
          onSuccess();
        } else {
          alert(result.message);
        }
      },
      onError: (error) => {
        console.error(error);
        alert("저장 중 오류가 발생했습니다.");
      },
    });
  };

  return {
    productFormData,
    detailFormData,
    imageFile,
    previewUrl,
    fileSize,
    errors,
    isPending: mutation.isPending,
    handleProductChange,
    handleDetailChange,
    handleProductDateChange,
    handleDetailDateChange,
    handleContentTypeToggle,
    handleImageChange,
    handleImageRemove,
    handleSubmit,
  };
}
