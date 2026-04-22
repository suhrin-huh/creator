export default function SponsorshipFormSkeleton() {
  return (
    <div
      className="relative flex max-h-[85vh] w-[90%] flex-col overflow-hidden rounded-xl bg-white shadow-2xl md:min-h-150 md:min-w-150"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b px-6 py-4">
        <div className="bg-primary/50 h-7 w-32 animate-pulse rounded-md" />
        <div className="bg-primary/50 h-7 w-7 animate-pulse rounded-md" />
      </div>

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
        {/* 공개 여부 체크박스 */}
        <div className="flex justify-between gap-2">
          <div className="bg-primary/50 h-4 w-16 animate-pulse rounded" />
          <div className="bg-primary/50 h-5 w-15 animate-pulse rounded-full" />
        </div>

        {/* 이미지 업로드 영역 */}
        <div className="flex flex-col gap-1.5">
          <div className="bg-primary/50 h-4 w-20 animate-pulse rounded" />
          <div className="bg-primary/50 h-40 w-full animate-pulse rounded-lg" />
        </div>

        {/* 기본 정보 */}
        <div className="flex flex-col gap-4">
          <SkeletonField labelWidth="w-16" />
          <SkeletonField labelWidth="w-16" />
          <SkeletonField labelWidth="w-20" />
        </div>

        {/* 하단 필드들 */}
        <div className="flex flex-col gap-4">
          <SkeletonField labelWidth="w-20" />
          <SkeletonField labelWidth="w-32" />
          <SkeletonTextarea labelWidth="w-16" />
          <SkeletonTextarea labelWidth="w-28" />
        </div>
      </div>

      {/* Footer */}
      <div className="flex shrink-0 justify-between border-t bg-gray-50 p-4">
        <div className="bg-primary/50 h-8 w-14 animate-pulse rounded-md" />
        <div className="flex gap-3">
          <div className="bg-primary/50 h-8 w-14 animate-pulse rounded-md" />
          <div className="bg-primary/50 h-8 w-20 animate-pulse rounded-md" />
        </div>
      </div>
    </div>
  );
}

function SkeletonField({ labelWidth }: { labelWidth: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className={`h-4 ${labelWidth} bg-primary/50 animate-pulse rounded`} />
      <div className="bg-primary/50 h-10 w-full animate-pulse rounded-md" />
    </div>
  );
}

function SkeletonTextarea({ labelWidth }: { labelWidth: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className={`h-4 ${labelWidth} bg-primary/50 animate-pulse rounded`} />
      <div className="bg-primary/50 h-20 w-full animate-pulse rounded-md" />
    </div>
  );
}
