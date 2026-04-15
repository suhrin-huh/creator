"use client";

// library
import { useActionState } from "react"; // Next.js 14라면 'react-dom'의 useFormState 사용

// components
import { FormInput } from "@/components/common/FormInputs";
import Button from "@/components/common/Button";

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
      <Button type="submit" size="full" colorTheme="accent">
        {isPending ? "접속 중..." : "접속하기"}
      </Button>
    </form>
  );
}
