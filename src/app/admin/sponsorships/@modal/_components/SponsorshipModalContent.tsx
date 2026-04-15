"use client";

// library
import { useSearchParams, useRouter, usePathname } from "next/navigation";

// hook
import { useProductForm } from "@/hooks/useProductForm";

// component
import SponsorshipForm from "./SponsorshipForm";

/** 실제 로직을 처리하는 알맹이 컴포넌트 */
export default function SponsorshipModalContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // URL에서 파라미터 추출
  const action = searchParams.get("action");
  const productId = searchParams.get("productId");
  const isNewMode = action === "new";
  const isEditMode = action === "edit" && !!productId;

  // 모달 닫기 핸들러
  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("action");
    params.delete("productId");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const {
    productFormData,
    detailFormData,
    previewUrl,
    fileSize,
    errors,
    isPending,
    handleProductChange,
    handleDetailChange,
    handleProductDateChange,
    handleDetailDateChange,
    handleContentTypeToggle,
    handleImageChange,
    handleImageRemove,
    handleSubmit,
  } = useProductForm({
    isEditMode,
    productId,
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
        productFormData={productFormData}
        detailFormData={detailFormData}
        previewUrl={previewUrl}
        fileSize={fileSize}
        errors={errors}
        isPending={isPending}
        isNewMode={isNewMode}
        onProductChange={handleProductChange}
        onDetailChange={handleDetailChange}
        onProductDateChange={handleProductDateChange}
        onDetailDateChange={handleDetailDateChange}
        onContentTypeToggle={handleContentTypeToggle}
        onImageChange={handleImageChange}
        onImageRemove={handleImageRemove}
        onSubmit={handleSubmit}
        onCancel={handleClose}
      />
    </div>
  );
}
