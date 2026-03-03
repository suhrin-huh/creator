import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminSponsorships, saveSponsorship } from "@/actions/sponsorship";
import type { ActionState } from "@/actions/sponsorship";

// Query Keys
export const sponsorshipKeys = {
  all: ["sponsorships"] as const,
  lists: () => [...sponsorshipKeys.all, "list"] as const,
  list: (filters?: string) => [...sponsorshipKeys.lists(), { filters }] as const,
  details: () => [...sponsorshipKeys.all, "detail"] as const,
  detail: (id: number) => [...sponsorshipKeys.details(), id] as const,
};

/**
 * Admin 협찬 목록 조회 hook
 * 협찬목록은 변동이 적으므로 긴 staleTime을 사용
 */
export function useAdminSponsorships() {
  return useQuery({
    queryKey: sponsorshipKeys.list(),
    queryFn: async () => {
      const data = await getAdminSponsorships();
      return data;
    },
    staleTime: 1000 * 60 * 30, // 30분 - 협찬목록은 변동이 적으므로 긴 캐시 시간
    gcTime: 1000 * 60 * 60, // 1시간 - 가비지 컬렉션 시간
  });
}

/**
 * 협찬 저장/수정 mutation hook
 */
export function useSaveSponsorshipMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData): Promise<ActionState> => {
      return await saveSponsorship(formData);
    },
    onSuccess: (data) => {
      if (data.success) {
        // 저장 성공 시 협찬 목록 쿼리 무효화하여 자동 갱신
        queryClient.invalidateQueries({ queryKey: sponsorshipKeys.lists() });
      }
    },
  });
}
