"use client";

// library
import { useSearchParams, useRouter, usePathname } from "next/navigation";

// hook
import { useSponsorshipForm } from "@/hooks/useSponsorshipForm";

// component
import SponsorshipForm from "./_components/SponsorshipForm";

export default function SponsorshipDetailModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // URL에서 파라미터 추출
  const action = searchParams.get("action");
  const sponsorshipId = searchParams.get("sponsorshipId");
  const isNewMode = action === "new";
  const isEditMode = action === "edit" && !!sponsorshipId;

  // 모달 닫기 핸들러
  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("action");
    params.delete("sponsorshipId");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const {
    formData,
    previewUrl,
    fileSize,
    errors,
    isPending,
    handleChange,
    handleDateChange,
    handleImageChange,
    handleImageRemove,
    handleSubmit,
  } = useSponsorshipForm({
    isEditMode,
    sponsorshipId,
    onSuccess: handleClose,
  });

  // action이 있을 때에만 모달 표시
  if (!action) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleClose}
    >
      <SponsorshipForm
        formData={formData}
        previewUrl={previewUrl}
        fileSize={fileSize}
        errors={errors}
        isPending={isPending}
        isNewMode={isNewMode}
        onChange={handleChange}
        onDateChange={handleDateChange}
        onImageChange={handleImageChange}
        onImageRemove={handleImageRemove}
        onSubmit={handleSubmit}
        onCancel={handleClose}
      />
    </div>
  );
}
