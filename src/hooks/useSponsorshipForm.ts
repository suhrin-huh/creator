// actions
import { saveSponsorship } from "@/actions/sponsorship";

// library
import { useState, useEffect, useTransition } from "react";

// types
import type { Dayjs } from "dayjs";
import type { SelectChangeEvent } from "@mui/material";
import type { SponsorshipFormData } from "@/types"; // 경로 맞춰주세요

import { INITIAL_FORM_DATA } from "@/constants";

interface UseSponsorshipFormProps {
  isEditMode: boolean;
  sponsorshipId: string | null;
  onSuccess: () => void; // 저장이 성공했을 때 실행할 콜백
}

// TODO: 현재에는 초기 데이터가 생성의 경우만 고려되어 있음! (INITIAL_FORM_DATA)
export function useSponsorshipForm({
  isEditMode,
  sponsorshipId,
  onSuccess,
}: UseSponsorshipFormProps) {
  const [formData, setFormData] = useState<SponsorshipFormData>(INITIAL_FORM_DATA);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof SponsorshipFormData, string>>>({});
  const [isPending, startTransition] = useTransition();

  // 초기 데이터 로드 및 리셋
  useEffect(() => {
    if (isEditMode && sponsorshipId) {
      console.log(`Fetch data for ID: ${sponsorshipId}`);
      // TODO: Fetch logic here
    } else {
      // 새 글 모드거나 모달이 닫혔다가 다시 열릴 때 초기화
      resetForm();
    }
  }, [isEditMode, sponsorshipId]);

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setImageFile(null);
    setPreviewUrl(null);
    setFileSize(null);
    setErrors({});
  };

  // 텍스트/Select 변경 핸들러
  const handleChange =
    (field: keyof SponsorshipFormData) =>
    (
      e:
        | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | SelectChangeEvent<string | number>,
    ) => {
      const target = e.target;

      // 체크박스인지 확인
      const isCheckbox = "type" in target && target.type === "checkbox";

      const value = isCheckbox ? (target as HTMLInputElement).checked : target.value;

      setFormData((prev) => {
        const nextState = { ...prev, [field]: value };

        // 날짜 자동 계산 로직
        if (field === "deadlineDays") {
          const { receivedDate, deadlineDays } = nextState;
          if (receivedDate && deadlineDays !== "") {
            nextState.uploadDeadline = receivedDate.add(Number(deadlineDays), "day");
          }
        }
        return nextState;
      });
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  // 날짜 변경 핸들러
  const handleDateChange =
    (field: "receivedDate" | "uploadDeadline" | "uploadedDate") => (date: Dayjs | null) => {
      setFormData((prev) => {
        const nextState = { ...prev, [field]: date };

        // 날짜 자동 계산 로직
        if (field === "receivedDate") {
          const { receivedDate, deadlineDays } = nextState;
          if (receivedDate && deadlineDays !== "") {
            nextState.uploadDeadline = receivedDate.add(Number(deadlineDays), "day");
          }
        }
        // 컨텐츠 업로드 날짜 입력시 완료 상태로 변경
        if (field === "uploadedDate") {
          if (date) {
            nextState.status = "COMPLETED";
          }
        }
        return nextState;
      });
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
    setFormData((prev) => ({ ...prev, imageUrl: null }));
  };

  // 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    const newErrors: Partial<Record<keyof SponsorshipFormData, string>> = {};
    if (!formData.title.trim()) newErrors.title = "제목을 입력해주세요.";
    if (!formData.brandName.trim()) newErrors.brandName = "브랜드명을 입력해주세요.";
    if (!formData.contentType) newErrors.contentType = "유형을 선택해주세요.";
    if (!formData.status) newErrors.status = "진행상태를 선택해주세요.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const submitFormData = new FormData();
    submitFormData.append("actionType", isEditMode ? "edit" : "new");
    if (sponsorshipId) submitFormData.append("id", sponsorshipId);

    // 데이터 Append (반복문으로 처리 가능하지만 명시적으로 작성)
    Object.entries(formData).forEach(([key, value]) => {
      if (value === null) return;
      if (key === "receivedDate" || key === "uploadDeadline") {
        if (value) submitFormData.append(key, value.format("YYYY-MM-DD"));
      } else {
        submitFormData.append(key, value);
      }
    });

    if (imageFile) submitFormData.append("image", imageFile);

    startTransition(async () => {
      try {
        const result = await saveSponsorship(submitFormData);
        if (result.success) {
          alert(result.message);
          setFormData(INITIAL_FORM_DATA);
          onSuccess(); // 성공 시 모달 닫기 등의 동작 수행
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error(error);
        alert("저장 중 오류가 발생했습니다.");
      }
    });
  };

  return {
    formData,
    imageFile,
    previewUrl,
    fileSize,
    errors,
    isPending,
    handleChange,
    handleDateChange,
    handleImageChange,
    handleImageRemove,
    handleSubmit,
  };
}
