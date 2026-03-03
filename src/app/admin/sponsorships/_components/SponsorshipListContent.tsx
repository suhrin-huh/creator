"use client";

import { DataGrid, GridRowParams, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Button, Chip } from "@mui/material";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useAdminSponsorships } from "@/hooks/useSponsorships";
import type { AdminSponsorship } from "@/types";

export default function SponsorshipListContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // React Query를 사용하여 데이터 조회
  const { data: sponsorships = [], isLoading } = useAdminSponsorships();

  // 컬럼 정의
  const columns: GridColDef<AdminSponsorship>[] = [
    {
      field: "title",
      headerName: "협찬건 제목",
      flex: 2,
      renderCell: (params) => (
        <div className="flex h-full flex-col justify-center py-1">
          <p className="leading-tight font-semibold text-gray-900">{params.value}</p>
        </div>
      ),
    },
    {
      field: "contentType",
      headerName: "컨텐츠 유형",
      flex: 0.9,
      renderCell: (params: GridRenderCellParams<AdminSponsorship>) => {
        const typeMap: Record<string, string> = {
          FEED: "피드",
          REEL: "릴스",
          STORY: "스토리",
        };
        return (
          <div className="flex h-full items-center gap-2 text-gray-700">
            <span className="text-sm">{typeMap[params.row.contentType]}</span>
          </div>
        );
      },
    },
    {
      field: "status",
      headerName: "진행 상태",
      flex: 0.9,
      renderCell: (params) => {
        let label = params.value;
        let bg = "transparent";
        let color = "inherit";

        switch (params.value) {
          case "WAITING":
            label = "대기중";
            bg = "var(--color-gray-100)";
            color = "var(--color-gray-600)";
            break;
          case "RECEIVED":
            label = "수령완료";
            bg = "var(--color-secondary-light)";
            color = "var(--color-gray-800)";
            break;
          case "COMPLETED":
            label = "완료";
            bg = "var(--color-success-light)";
            color = "var(--color-success-dark)";
            break;
        }

        return (
          <Chip
            label={label}
            size="small"
            sx={{
              backgroundColor: bg,
              color: color,
              fontWeight: 700,
              borderRadius: "var(--radius-sm)",
              height: "24px",
              fontSize: "12px",
            }}
          />
        );
      },
    },
    {
      field: "createdDate",
      headerName: "등록일",
      flex: 1,
      renderCell: (params) => <span className="text-sm text-gray-500">{params.value}</span>,
    },
  ];

  // 행 클릭 핸들러: Modal 컨트롤, URL 변경시 @modal/page.tsx가 이를 감지해 자동으로 뜬다
  const handleRowClick = (params: GridRowParams<AdminSponsorship>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("action", "edit");
    newParams.set("sponsorshipId", params.id.toString());
    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  // 상품 추가하기 버튼 클릭 핸들러
  const handleAddSponsorship = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("action", "new");
    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  return (
    <div className="hide-scrollbar relative flex h-dvh w-full flex-col overflow-hidden bg-gray-50 text-black">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm md:rounded-t-lg">
        <nav className="p-lg flex flex-col items-center justify-between md:flex-row">
          <div className="logo text-h3 text-primary font-bold">Admin</div>
        </nav>
      </header>
      {/* Main Content */}
      <main className="flex flex-1 flex-col gap-6 overflow-y-auto p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h3 mb-1 font-bold text-gray-600">협찬 리스트</h1>
            <p className="text-body-md">현재 진행 중인 협찬 및 광고 상품을 관리하세요.</p>
          </div>
          <Button
            variant="contained"
            disableElevation
            onClick={handleAddSponsorship}
            sx={{
              backgroundColor: "var(--color-primary)",
              "&:hover": { backgroundColor: "var(--color-primary-dark)" },
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.95rem",
              borderRadius: "var(--radius-md)",
              padding: "0.6rem 1.5rem",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            + 상품 추가하기
          </Button>
        </div>
        {/*DataGrid*/}
        <div className="flex w-full flex-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <DataGrid
            rows={sponsorships}
            columns={columns}
            showToolbar
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 15, 30, 50]}
            // disableRowSelectionOnClick
            onRowClick={handleRowClick} // 클릭 시 URL만 바꿔줌
            rowHeight={60}
            sx={{
              border: "none",
              color: "var(--color-gray-800)",
              fontFamily: "inherit",
              // 헤더 스타일링
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "var(--color-gray-50)",
                borderBottom: "1px solid var(--color-gray-200)",
                color: "var(--color-gray-800)",
                fontWeight: 700,
                fontSize: "0.9rem",
              },
              // 셀 스타일링
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid var(--color-gray-100)",
              },
              // 행 호버 효과
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "var(--color-gray-50)",
              },
              // 푸터 스타일링
              "& .MuiDataGrid-footerContainer": {
                borderTop: "1px solid var(--color-gray-200)",
                backgroundColor: "var(--color-white)",
              },
              // 체크박스 등 아이콘 컬러
              "& .MuiCheckbox-root": {
                color: "var(--color-gray-400)",
              },
              // 선택된 행
              "& .MuiDataGrid-row.Mui-selected": {
                backgroundColor: "var(--color-gray-200)",
                "&:hover": {
                  backgroundColor: "var(--color-gray-300)", // 호버 시 조금 더 진하게
                },
              },
            }}
          />
        </div>
      </main>
    </div>
  );
}
