// 모달 추가를 위한 layout

interface SponsorshipsLayoutProps {
  children: React.ReactNode,
  modal: React.ReactNode
}

export default function SponsorshipsLayout({
  children,
  modal, // @modal 슬롯
}:SponsorshipsLayoutProps) {
  return (
    <>
      {children}
      {modal}
    </>
  )
}