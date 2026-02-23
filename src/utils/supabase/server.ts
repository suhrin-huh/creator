// 서버 컴포넌트&액션용
// react 패키지의 cache 함수를 사용하면, 한 번의 요청 내에서 이 함수가 여러 번 호출되더라도 최초 한 번만 실행되고 나머지는 캐시된 인스턴스를 반환합니다. (사실상의 싱글톤 효과)
// => 이제 이를 컨트롤러에서 호출하여 사용하면 된다.

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { cache } from "react";

// cache로 감싸서 "Request-Scoped Singleton" 구현
export const createClient = cache(async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, // TODO: 이 부분이 왜 안전할까?
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Action이나 Route Handler에서는 무시될 수 있음
          }
        },
      },
    },
  );
});
