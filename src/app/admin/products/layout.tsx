// 모달 추가를 위한 layout

interface ProductsLayoutProps {
  children: React.ReactNode,
  modal: React.ReactNode
}

export default function ProductsLayout({
  children,
  modal, // @modal 슬롯
}:ProductsLayoutProps) {
  return (
    <>
      {children}
      {modal}
    </>
  )
}