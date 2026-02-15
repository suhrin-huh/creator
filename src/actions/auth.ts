'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function login(prevState: any, formData: FormData) {
  const supabase = await createClient();
  
  // 폼에서 비밀번호 가져오기
  const password = formData.get('password') as string;
  
  // 이메일은 DB에 넣은 값으로 고정 (현재는 비밀번호만 입력받음)
  const email = process.env.ADMIN_EMAIL;

  // 환경 변수 설정 체크
  if (!email) {
    console.error("ADMIN_EMAIL 환경 변수가 설정되지 않았습니다.");
    return { success: false, message: '서버 설정 오류: 관리자에게 문의하세요.' };
  }

  // Supabase Auth 로그인 시도
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  }); // 해당 함수 실행 시 Supabase가 자동으로 Set-Cookie 헤더를 생성

  if (error) {
    console.error('Login failed:', error.message);
    return { success: false, message: '비밀번호가 올바르지 않습니다.' };
  }

  // 로그인 성공 시 어드민 페이지로 이동
  redirect('/admin');
}