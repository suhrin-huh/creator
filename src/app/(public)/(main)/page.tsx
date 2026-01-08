import Image from "next/image";
import { MdSearch, MdClear } from "react-icons/md";
import { PiInstagramLogoFill } from "react-icons/pi";
import { SiNaver, SiYoutube } from "react-icons/si";

export default function MainPage() {
  // const navOptions = [
  //   { label: "가", href: null },
  //   { label: "나", href: null },
  //   { label: "다", href: null },
  //   { label: "라", href: null },
  // ];

  const snsOptions = [
    {
      label: "Instagram",
      icon: <PiInstagramLogoFill size={20} />,
      href: "https://www.instagram.com/suhrinhuh",
    },
    { label: "Blog", icon: <SiNaver size={15} />, href: "https://blog.naver.com/suh_rin" },
    // { label: "Youtube", icon: <SiYoutube size={20} />, href: null },
  ];

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <nav className="p-lg flex flex-col items-center justify-between md:flex-row">
          <div className="logo text-h3 text-primary font-bold">Creator</div>
          {/* <ul className="nav-links gap-x-md flex">
            {navOptions.map((option) => (
              <li className="hover:text-primary-hover" key={`li-${option.label}`}>
                <a href="#test">{option.label}</a>
              </li>
            ))}
          </ul> */}
        </nav>
      </header>

      {/* Main */}
      <main className="gap-y-xl p-xl bg-primary flex flex-col">
        <section className="gap-lg p-2xl flex flex-col items-center rounded-2xl bg-white shadow-md md:flex-row">
          <div className="flex items-center justify-center rounded-full border-4 border-white shadow-lg">
            <Image
              src="/profile-image.png"
              alt="프로필 이미지"
              width={150}
              height={150}
              className="rounded-full"
            />
          </div>
          <div className="gap-y-md flex flex-col items-center text-center md:items-stretch md:text-start">
            <p className="text-primary-dark text-h3 font-bold">허서린</p>
            <p className="text-body-sm md:text-body-md text-gray-600">📧 suhrinhuh77@gmail.com</p>
            <p className="text-body-md md:text-body-md text-gray-600">
              안녕하세요! 다양한 스타일에 도전하고 싶은 허서린입니다.
              <br />
              패션, 액세서리, 뷰티, 팝업스토어에 관심이 많아요 :D
              <br />
            </p>
            {/* 소셜 미디어 리스트 */}
            <div className="gap-md flex flex-wrap justify-center md:justify-stretch">
              {snsOptions.map((option, idx) => (
                <a
                  key={`${option.label}-href`}
                  href={option.href}
                  className="gap-x-sm px-lg py-md bg-primary text-caption hover:bg-primary-hover md:text-body-md flex items-center rounded-full font-semibold text-white shadow-md transition duration-100 active:scale-105"
                >
                  {option.icon}
                  <span>{option.label}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* PPL List */}
        <section className="gap-y-lg flex flex-col items-center">
          <div className="w-full">
            <div className="px-lg py-md gap-x-sm flex w-full items-center justify-center rounded-full bg-white shadow-md">
              <MdSearch size={25} className="pointer-none text-gray-400" />
              <input
                type="text"
                className="flex-1 outline-0"
                placeholder="제품을 검색해보세요"
                id="searchInput"
              />
              <button
                className="p-sm rounded-full hover:bg-gray-300/30 active:scale-75"
                id="clearButton"
              >
                <MdClear size={20} className="pointer-none text-gray-400" />
              </button>
            </div>
          </div>
          {/* 여기부터는 제품리스트 */}
          <div className="gap-md grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" id="productsGrid">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={`product-card-${idx}`}
                className="px-lg flex w-full flex-row items-center overflow-hidden rounded-xl bg-white transition duration-100 hover:shadow-lg active:scale-105 md:flex-col md:items-stretch md:px-0"
                // data-name="뷰티 제품 A"
              >
                {/* 이미지 컨테이너 */}
                <div className="relative h-20 w-20 min-w-20 shrink-0 md:h-62 md:w-full">
                  <Image
                    src="/profile-image.png"
                    alt="제품 소개 이미지"
                    fill
                    className="rounded-md object-cover md:rounded-t-xl md:rounded-b-none"
                    sizes="(max-width: 768px) 80px, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* 이미지가 없을 경우 대체 UI */}
                  {/* <div className="absolute inset-0 flex items-center justify-center text-5xl text-white md:text-6xl">
                    🎨
                  </div> */}
                </div>

                {/* 제품 정보 */}
                <div className="flex-1 p-4">
                  <h3 className="mb-2 text-lg font-bold text-gray-800 md:text-xl">뷰티 제품 A</h3>
                  <p className="line-clamp-2 text-sm leading-relaxed text-gray-600 md:line-clamp-none md:text-base">
                    피부에 활력을 주는 프리미엄 스킨케어 제품으로, 자연 유래 성분이 풍부합니다.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="p-md h-16 bg-white text-center">
        <p className="text-caption text-gray-600">© 2026 Creator. All rights reserved.</p>
      </footer>
    </>
  );
}
