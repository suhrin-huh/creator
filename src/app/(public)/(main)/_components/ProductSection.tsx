// actions
import { getPublicProducts } from "@/actions/products";

// components
import ProductSearchArea from "./ProductSearchArea";

export default async function ProductSection() {
  // 서버에서 데이터를 즉시 Fetch
  const initialProducts = await getPublicProducts();

  return (
    <section className="gap-y-lg flex w-full flex-col items-center">
      {/* 하위 클라이언트 컴포넌트에 초기 데이터로 넘겨줌 */}
      <ProductSearchArea initialProducts={initialProducts} />
    </section>
  );
}
