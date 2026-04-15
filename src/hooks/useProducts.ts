import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminProducts, getProductById, saveProduct } from "@/actions/products";
import type { ActionState } from "@/types";

// Query Keys
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters?: string) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
};

/**
 * Admin 제품 목록 조회 hook
 */
export function useAdminProducts() {
  return useQuery({
    queryKey: productKeys.list(),
    queryFn: async () => {
      const data = await getAdminProducts();
      return data;
    },
    staleTime: 1000 * 60 * 30, // 30분
    gcTime: 1000 * 60 * 60, // 1시간
  });
}

/**
 * 제품 개별 데이터 조회 hook
 */
export function useProductDetail(productId: number) {
  return useQuery({
    queryKey: productKeys.detail(productId),
    queryFn: async () => {
      const data = await getProductById(productId);
      return data;
    },
    enabled: !!productId,
    staleTime: 1000 * 60 * 10, // 10분
    gcTime: 1000 * 60 * 30, // 30분
  });
}

/**
 * 제품 저장/수정 mutation hook
 */
export function useSaveProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData): Promise<ActionState> => {
      return await saveProduct(formData);
    },
    onSuccess: (data) => {
      if (data.success) {
        // 저장 성공 시 제품 목록 쿼리 무효화하여 자동 갱신
        queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      }
    },
  });
}
