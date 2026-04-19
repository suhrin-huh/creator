"use client";

import { useState, useEffect } from "react"; // 추가
import { useMediaQuery, useTheme } from "@mui/material"; // 추가

import { DataGrid, GridRowParams, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Chip } from "@mui/material";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useAdminProducts } from "@/hooks/useProducts";
import type { AdminProduct } from "@/types";
import PixelButton from "@/components/common/PixelButton";

export default function SponsorshipListContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const theme = useTheme();
  // sm(600px) 이상일 때만 true
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});

  // 화면 크기가 변할 때마다 노출할 컬럼 제어
  useEffect(() => {
    setColumnVisibilityModel({
      createdAt: isMobile ? false : true, // 모바일에서는 등록일 숨기기
      // 더 숨기고 싶은 필드가 있다면 여기에 추가
    });

    setPaginationModel((prev) => ({
      ...prev,
      pageSize: isMobile ? 5 : 10, // 모바일은 5개, 데스크탑은 10개
    }));
  }, [isMobile]);

  // 1. paginationModel을 상태로 관리
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10, // 초기값
  });

  // React Query를 사용하여 데이터 조회
  const { data: products = [], isLoading } = useAdminProducts();

  // 컬럼 정의
  const columns: GridColDef<AdminProduct>[] = [
    {
      field: "title",
      headerName: "제품 제목",
      flex: 2,
      renderCell: (params) => (
        <div className="flex h-full flex-col justify-center py-1">
          <p className="leading-tight font-semibold text-gray-900">{params.value}</p>
        </div>
      ),
    },
    {
      field: "status",
      headerName: "진행 상태",
      flex: 0.9,
      renderCell: (params) => {
        let label = "-";
        let bg = "transparent";
        let color = "var(--color-gray-400)";

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
            label = "업로드완료";
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
      field: "createdAt",
      headerName: "등록일",
      flex: 1,
      renderCell: (params) => (
        <span className="text-sm text-gray-500">
          {params.value ? String(params.value).split("T")[0] : "-"}
        </span>
      ),
    },
  ];

  // 행 클릭 핸들러: Modal 컨트롤, URL 변경시 @modal/page.tsx가 이를 감지해 자동으로 뜬다
  const handleRowClick = (params: GridRowParams<AdminProduct>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("action", "edit");
    newParams.set("productId", params.id.toString());
    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  // 상품 추가하기 버튼 클릭 핸들러
  const handleAddSponsorship = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("action", "new");
    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  return (
    <main className="gap-md flex flex-1 flex-col">
      <div className="gap-sm flex items-center justify-between">
        <p className="text-body-xs font-pixel">Product List</p>
        <PixelButton variant="primary" onClick={handleAddSponsorship}>
          Add a product
        </PixelButton>
      </div>
      {/*DataGrid*/}
      <div className="flex w-full flex-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <DataGrid
          rows={products}
          columns={columns}
          loading={isLoading}
          // 가시성 모델 적용
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
          showToolbar
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 15, 30, 50]}
          // disableRowSelectionOnClick
          onRowClick={handleRowClick} // 클릭 시 URL만 바꿔줌
          rowHeight={50}
          sx={{
            // 헤더 스타일링
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: "1px solid var(--color-gray-200)",
              fontSize: "0.9rem",
            },
            // 행 호버 효과
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "var(--color-primary-light)",
            },
            // 선택된 행
            "& .MuiDataGrid-row.Mui-selected": {
              backgroundColor: "var(--color-primary-light)",
              "&:hover": {
                backgroundColor: "var(--color-outlined-light)", // 호버 시 조금 더 진하게
              },
            },
          }}
        />
      </div>
    </main>
  );
}
