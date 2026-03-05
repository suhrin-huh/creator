"use client";

// library
import { useActionState } from "react"; // Next.js 14라면 'react-dom'의 useFormState 사용

// components
import { FormInput } from "@/components/common/FormInputs";

// action
import { login } from "@/actions/auth";

const initialState = {
  success: false,
  message: "",
};

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="gap-sm flex w-full flex-col">
      <div className="flex flex-col gap-1">
        <FormInput
          label={"비밀번호"}
          type="password"
          id="password"
          name="password"
          required
          placeholder="비밀번호를 입력하세요"
          errorMessage={state?.message}
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="p-sm rounded-lg bg-gray-500 font-bold text-white transition-all hover:bg-gray-700 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {isPending ? "접속 중..." : "접속하기"}
      </button>
    </form>
  );
}
