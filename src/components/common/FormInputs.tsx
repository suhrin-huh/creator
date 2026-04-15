// components
import { TextField, Select, MenuItem, FormControl } from "@mui/material";
import Button from "./Button";

// library
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// types
import type { SelectChangeEvent, TextFieldProps } from "@mui/material";
import type { Dayjs } from "dayjs";

import "dayjs/locale/ko"; // 로케일 독립, 실행 환경에 언어셋을 세팅하는 부수 효과(Side effect) import
// types

// --- 스타일링용 내부 컴포넌트 (라벨, 에러메시지) ---
const Label = ({ required, children }: { required?: boolean; children: React.ReactNode }) => (
  <p className="mb-1 text-sm font-semibold text-gray-700">
    {children} {required && <span className="text-red-500">*</span>}
  </p>
);

const ErrorMessage = ({ children }: { children?: React.ReactNode }) => {
  if (!children) return null;
  return <p className="mt-1 text-xs font-semibold text-red-500">{children}</p>;
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
    <div className="flex w-full flex-col">
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
  onChange: (e: SelectChangeEvent<string | number>) => void;
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
    <div className="flex w-full min-w-[200px] flex-col">
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
      <div className="flex w-full min-w-[200px] flex-col">
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
  fileSize?: number | null; // 파일 용량
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void; // 초기화 핸들러
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
    <div className="flex w-full flex-col gap-2">
      <Label required={required}>{label}</Label>
      <div className="flex items-start gap-4">
        {/* 미리보기 영역 */}
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs text-gray-400">No Image</span>
          )}
        </div>

        {/* 2. 컨트롤 영역 (버튼 및 정보) */}
        <div className="flex h-24 flex-col justify-center gap-2">
          {previewUrl ? (
            // [상태 A] 이미지가 있을 때: 초기화 버튼 + 용량
            <div className="flex flex-col gap-1">
              <Button type="button" size="sm" colorTheme="danger" onClick={onRemove}>
                이미지 초기화
              </Button>

              {/* 용량 표시 (값이 있을 때만) */}
              {fileSize && (
                <span className="ml-1 text-xs font-medium text-gray-500">
                  용량: {formatFileSize(fileSize)}
                </span>
              )}
            </div>
          ) : (
            // [상태 B] 이미지가 없을 때: 업로드 버튼 + 안내 문구
            <div className="flex flex-col gap-1">
              <Button size="sm" colorTheme="outlined">
                <label className="">
                  이미지 선택
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={onChange}
                    // 중요: 같은 파일 다시 선택 시 onChange 발동되게 초기화
                    onClick={(e) => (e.currentTarget.value = "")}
                  />
                </label>
              </Button>
              <span className="ml-1 text-xs text-gray-500">jpg, png, webp (최대 5MB)</span>
            </div>
          )}
        </div>
      </div>
      <ErrorMessage>{errorMessage}</ErrorMessage>
    </div>
  );
};

// =========================================================
// 5. 체크 박스 (FormCheckbox)
// 토글 형식
// =========================================================

interface FormCheckboxProps {
  label: string;
  value: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
  required?: boolean;
}

export const FormCheckbox = ({
  label,
  value,
  onChange,
  errorMessage,
  required,
}: FormCheckboxProps) => {
  return (
    <div className="flex items-center justify-between">
      <Label required={required}>{label}</Label>
      <label className="inline-flex cursor-pointer items-center">
        {/* 실제 form값 */}
        <input
          type="checkbox"
          name={label}
          checked={value}
          onChange={onChange}
          className="hidden"
        />

        {/* 토글 트랙 */}
        <span
          className={`relative h-6 w-10 rounded-full transition ${value ? "bg-primary" : "bg-gray-200"} `}
        >
          {/* 토글 썸 */}
          <span
            className={`absolute top-1 left-1 h-4 w-4 rounded-full border border-black/10 bg-white transition-transform ${value ? "translate-x-4" : ""} `}
          />
        </span>
      </label>
    </div>
  );
};
