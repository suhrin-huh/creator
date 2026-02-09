import React from "react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  SelectChangeEvent,
  TextFieldProps,
} from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/ko";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";

// --- 스타일링용 내부 컴포넌트 (라벨, 에러메시지) ---
const Label = ({ required, children }: { required?: boolean; children: React.ReactNode }) => (
  <p className="font-semibold text-sm text-gray-700 mb-1">
    {children} {required && <span className="text-red-500">*</span>}
  </p>
);

const ErrorMessage = ({ children }: { children?: React.ReactNode }) => {
  if (!children) return null;
  return <p className="text-xs font-semibold text-red-500 mt-1">{children}</p>;
};

// =========================================================
// 1. 기본 텍스트 인풋 (FormInput)
// =========================================================
type FormInputProps = TextFieldProps & {
  label: string;
  errorMessage?: string;
};

export const FormInput = ({ label, required, errorMessage, ...props }: FormInputProps) => {
  return (
    <div className="flex flex-col w-full">
      <Label required={required}>{label}</Label>
      <TextField
        fullWidth
        size="small"
        error={!!errorMessage}
        {...props} // value, onChange 등 나머지 props 전달
      />
      <ErrorMessage>{errorMessage}</ErrorMessage>
    </div>
  );
};

// =========================================================
// 2. 셀렉트 박스 (FormSelect)
// =========================================================
interface Option {
  label: string;
  value: string | number;
}

interface FormSelectProps {
  label: string;
  value: string | number;
  onChange: (e: SelectChangeEvent<unknown>) => void;
  options: Option[];
  errorMessage?: string;
  required?: boolean;
  placeholder?: string;
}

export const FormSelect = ({
  label,
  value,
  onChange,
  options,
  errorMessage,
  required,
  placeholder = "선택해주세요",
}: FormSelectProps) => {
  return (
    <div className="flex flex-col w-full min-w-[200px]">
      <Label required={required}>{label}</Label>
      <FormControl fullWidth size="small" error={!!errorMessage}>
        <Select value={value} onChange={onChange} displayEmpty>
          <MenuItem value="" disabled className="text-gray-400">
            {placeholder}
          </MenuItem>
          {options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <ErrorMessage>{errorMessage}</ErrorMessage>
    </div>
  );
};

// =========================================================
// 3. 날짜 선택기 (FormDatePicker)
// =========================================================
interface FormDatePickerProps {
  label: string;
  value: Dayjs | null;
  onChange: (date: Dayjs | null) => void;
  errorMessage?: string;
  required?: boolean;
}

export const FormDatePicker = ({
  label,
  value,
  onChange,
  errorMessage,
  required,
}: FormDatePickerProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
      <div className="flex flex-col w-full min-w-[200px]">
        <Label required={required}>{label}</Label>
        <DatePicker
          value={value}
          onChange={onChange}
          format="YYYY-MM-DD"
          slotProps={{
            textField: {
              fullWidth: true,
              size: "small",
              placeholder: "yyyy-mm-dd",
              error: !!errorMessage,
            },
          }}
          />
        <ErrorMessage>{errorMessage}</ErrorMessage>
      </div>
    </LocalizationProvider>
  );
};

// =========================================================
// 4. 이미지 업로드 (FormImageUpload)
// 파일 용량 포맷팅 추가
// =========================================================
interface FormImageUploadProps {
  label: string;
  previewUrl: string | null;
  fileSize?: number | null;     // 파일 용량
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;         // 초기화 핸들러
  errorMessage?: string;
  required?: boolean;
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const FormImageUpload = ({
  label,
  previewUrl,
  fileSize,
  onChange,
  onRemove,
  errorMessage,
  required,
}: FormImageUploadProps) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label required={required}>{label}</Label>
      <div className="flex items-start gap-4">
        {/* 미리보기 영역 */}
        <div className="w-24 h-24 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs text-gray-400">No Image</span>
          )}
        </div>

        {/* 2. 컨트롤 영역 (버튼 및 정보) */}
        <div className="flex flex-col gap-2 justify-center h-24">
          {previewUrl ? (
            // [상태 A] 이미지가 있을 때: 초기화 버튼 + 용량
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={onRemove}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-md hover:bg-red-50 transition-colors focus:outline-none"
              >
                이미지 초기화
              </button>
              
              {/* 용량 표시 (값이 있을 때만) */}
              {fileSize && (
                <span className="text-xs text-gray-500 font-medium ml-1">
                  용량: {formatFileSize(fileSize)}
                </span>
              )}
            </div>
          ) : (
            // [상태 B] 이미지가 없을 때: 업로드 버튼 + 안내 문구
            <div className="flex flex-col gap-1">
              <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                이미지 선택
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={onChange}
                  // 중요: 같은 파일 다시 선택 시 onChange 발동되게 초기화
                  onClick={(e) => (e.currentTarget.value = '')}
                />
              </label>
              <span className="text-xs text-gray-500 ml-1">
                jpg, png, webp (최대 5MB)
              </span>
            </div>
          )}
        </div>
      </div>
      <ErrorMessage>{errorMessage}</ErrorMessage>
    </div>
  );
};