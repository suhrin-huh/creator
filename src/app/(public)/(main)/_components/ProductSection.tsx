// actions
import { getPublicProducts } from "@/actions/products";

import PixelWindow from "@/components/common/PixelWindow";

// components
import ProductSearchArea from "./ProductSearchArea";

export default async function ProductSection() {
  // 서버에서 데이터를 즉시 Fetch
  const initialProducts = await getPublicProducts();
  return (
    <section className="w-full">
      {/* 하위 클라이언트 컴포넌트에 초기 데이터로 넘겨줌 */}
      <PixelWindow
        title="PRODUCT_LIST.EXE"
        statusBar={
          <>
            <span>✦ P loaded</span>
          </>
        }
      >
        <ProductSearchArea initialProducts={initialProducts} />
      </PixelWindow>
    </section>
  );
}
