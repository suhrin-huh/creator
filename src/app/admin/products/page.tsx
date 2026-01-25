"use client";

import { useState } from "react";
import { DataGrid, GridRowParams, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Button, Chip } from "@mui/material";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

// 상품 타입 정의
interface Product {
  id: number;
  title: string;
  productName: string;
  contentType: "FEED" | "REEL" | "STORY";
  status: "WAITING" | "RECEIVED" | "COMPLETED";
  date: string;
}

// 목 데이터 생성 (기존 유지)
const generateMockData = (): Product[] => {
  const contentTypes: Product["contentType"][] = ["FEED", "REEL", "STORY"];
  const statuses: Product["status"][] = ["WAITING", "RECEIVED", "COMPLETED"];
  const productNames = [
    "스킨케어 세트", "에센스", "립스틱", "마스크팩", "선크림",
    "토너", "클렌징폼", "아이크림", "세럼", "로션",
    "미스트", "팩", "오일", "스크럽", "마스크",
  ];

  const titles = [
    "봄 시즌 스킨케어 협찬", "신제품 런칭 이벤트", "여름 선크림 캠페인",
    "에센스 리뷰 협찬", "립스틱 신상품 홍보", "마스크팩 체험단 모집",
    "토너 사용 후기", "클렌징 제품 리뷰", "아이크림 효과 검증",
    "세럼 추천 콘텐츠", "로션 사용법 공유", "미스트 활용 팁",
    "팩 사용 후기", "오일 마사지 방법", "스크럽 사용 가이드",
  ];

  const mockData: Product[] = [];
  const today = new Date();

  for (let i = 1; i <= 25; i++) {
    const daysAgo = Math.floor(Math.random() * 90);
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    mockData.push({
      id: i,
      title: titles[Math.floor(Math.random() * titles.length)],
      productName: productNames[Math.floor(Math.random() * productNames.length)],
      contentType: contentTypes[Math.floor(Math.random() * contentTypes.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      date: formattedDate,
    });
  }
  return mockData;
};

export default function ProductsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [products] = useState<Product[]>(generateMockData());

  // 컬럼 정의
  const columns: GridColDef<Product>[] = [
    {
      field: "title",
      headerName: "협찬 건 제목",
      flex: 2,
      renderCell: (params) => (
        <div className="flex flex-col justify-center h-full py-1">
          <p className="font-semibold text-gray-900 leading-tight">
            {params.value}
          </p>
        </div>
      ),
    },
    {
      field: "contentType",
      headerName: "컨텐츠 유형",
      flex: 0.9,
      renderCell: (params: GridRenderCellParams<Product>) => {
        const typeMap: Record<string, string> = {
          FEED: "피드", REEL: "릴스", STORY: "스토리",
        };
        console.log(params.row.contentType)
        return (
          <div className="flex items-center gap-2 h-full text-gray-700">
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
        let border = "none";

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
              border: border,
              height: "24px",
              fontSize: "12px"
            }}
          />
        );
      },
    },
    {
      field: "date",
      headerName: "등록일",
      flex:1,
      renderCell: (params) => (
         <span className="text-gray-500 text-sm">{params.value}</span>
      )
    },
  ];

  // 
  // 행 클릭 핸들러: Modal 컨트롤, URL 변경시 @modal/page.tsx가 이를 감지해 자동으로 뜬다
  const handleRowClick = (params: GridRowParams<Product>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("productId", params.id.toString());
    router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  return (
    <div className="hide-scrollbar text-black bg-gray-50 relative flex h-dvh w-full flex-col overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm md:rounded-t-lg">
      <nav className="p-lg flex flex-col items-center justify-between md:flex-row">
        <div className="logo text-h3 text-primary font-bold">Admin</div>
        {/* <ul className="nav-links gap-x-md flex">
            {navOptions.map((option) => (
              <li className="hover:text-primary-hover" key={`li-${option.label}`}>
                <a href="#test">{option.label}</a>
              </li>
            ))}
          </ul> */}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col gap-6 p-8 overflow-y-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-h3 font-bold text-gray-600 mb-1">
              상품 리스트
            </h1>
            <p className="text-body-md">
              현재 진행 중인 협찬 및 광고 상품을 관리하세요.
            </p>
          </div>
          <Button
            variant="contained"
            disableElevation
            sx={{
              backgroundColor: "var(--color-primary)",
              "&:hover": { backgroundColor: "var(--color-primary-dark)" },
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.95rem",
              borderRadius: "var(--radius-md)",
              padding: "0.6rem 1.5rem",
              boxShadow: "var(--shadow-sm)"
            }}
          >
            + 상품 추가하기
          </Button>
        </div>
        {/*DataGrid*/}
        <div className="flex flex-1 w-full bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
          <DataGrid
            rows={products}
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
                  color: "var(--color-gray-400)"
              },
              // 선택된 행
              "& .MuiDataGrid-row.Mui-selected": {
                backgroundColor: "var(--color-gray-200)",
                "&:hover": {
                  backgroundColor: "var(--color-gray-300)", // 호버 시 조금 더 진하게
                }
              }
            }}
          />
        </div>
      </main>
    </div>
  );
}