"use client";

// ════════════════════════════════
//  검색 UI 컴포넌트
//  검색 로직은 없음, 이벤트만 위로 전달
// ════════════════════════════════

// 픽셀 돋보기 SVG
function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      shapeRendering="crispEdges"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="3" y="1" width="6" height="1" fill="#6677aa" />
      <rect x="2" y="2" width="1" height="1" fill="#6677aa" />
      <rect x="9" y="2" width="1" height="1" fill="#6677aa" />
      <rect x="1" y="3" width="1" height="5" fill="#6677aa" />
      <rect x="10" y="3" width="1" height="5" fill="#6677aa" />
      <rect x="2" y="8" width="1" height="1" fill="#6677aa" />
      <rect x="9" y="8" width="1" height="1" fill="#6677aa" />
      <rect x="3" y="9" width="6" height="1" fill="#6677aa" />
      <rect x="3" y="2" width="6" height="1" fill="#b0c0e8" />
      <rect x="2" y="3" width="8" height="5" fill="#b0c0e8" />
      <rect x="3" y="8" width="6" height="1" fill="#b0c0e8" />
      <rect x="3" y="3" width="2" height="1" fill="rgba(255,255,255,0.7)" />
      <rect x="3" y="4" width="1" height="1" fill="rgba(255,255,255,0.5)" />
      <rect x="9" y="9" width="2" height="2" fill="#6677aa" />
      <rect x="10" y="10" width="2" height="2" fill="#6677aa" />
      <rect x="11" y="11" width="2" height="2" fill="#6677aa" />
      <rect x="12" y="12" width="2" height="2" fill="#4a5588" />
    </svg>
  );
}

// 픽셀 X SVG
function ClearIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      shapeRendering="crispEdges"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="0" y="0" width="2" height="2" fill="#8899cc" />
      <rect x="8" y="0" width="2" height="2" fill="#8899cc" />
      <rect x="2" y="2" width="2" height="2" fill="#8899cc" />
      <rect x="6" y="2" width="2" height="2" fill="#8899cc" />
      <rect x="4" y="4" width="2" height="2" fill="#8899cc" />
      <rect x="2" y="6" width="2" height="2" fill="#8899cc" />
      <rect x="6" y="6" width="2" height="2" fill="#8899cc" />
      <rect x="0" y="8" width="2" height="2" fill="#8899cc" />
      <rect x="8" y="8" width="2" height="2" fill="#8899cc" />
    </svg>
  );
}

interface SearchWindowProps {
  query: string;
  onQueryChange: (e: ChangeEvent<HTMLInputElement>) => void; // string만 받도록 유지
  onClear: () => void;
  onClose?: () => void;
}

// icons
import { MdSearch, MdClear } from "react-icons/md";

// types
import { ChangeEvent } from "react";

interface SearchInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
}

export default function SearchInput({ value, onChange, onClick }: SearchInputProps) {
  return (
    <>
      <div className="w-full">
        <div className="p-md gap-x-sm flex w-full items-center justify-center rounded-full bg-white shadow-md">
          <MdSearch size={20} className="pointer-none text-gray-400" />
          <input
            type="text"
            className="text-body-sm flex-1 outline-0"
            placeholder="제품을 검색해보세요"
            id="searchInput"
            value={value}
            onChange={onChange}
          />
          <button
            className="rounded-full hover:bg-gray-300/30 active:scale-75"
            id="clear-button"
            onClick={onClick}
          >
            <MdClear size={20} className="pointer-none text-gray-400" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-1.5 p-2.5">
        {/* 돋보기 아이콘 */}
        <span className="flex h-5 w-5 shrink-0 items-center justify-center">
          <SearchIcon />
        </span>

        {/* 검색 입력 */}
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder="제품을 검색해보세요"
          className="pixel-search-input flex-1"
          aria-label="제품 검색"
        />

        {/* 클리어 버튼 */}
        <button
          onClick={onClick}
          className="pixel-clear-btn h-[26px] w-[26px]"
          aria-label="검색어 지우기"
        >
          <ClearIcon />
        </button>
      </div>
    </>
  );
}
