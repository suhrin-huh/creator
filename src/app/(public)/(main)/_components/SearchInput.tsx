"use client";

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
  );
}
