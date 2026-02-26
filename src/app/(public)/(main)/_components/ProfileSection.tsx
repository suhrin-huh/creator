// components
import Image from "next/image";

// icon
import { PiInstagramLogoFill } from "react-icons/pi";
import { SiNaver } from "react-icons/si";

export default function ProfileSection() {
  const snsOptions = [
    {
      label: "Instagram",
      icon: <PiInstagramLogoFill size={15} />,
      href: "https://www.instagram.com/suhrinhuh",
    },
    { label: "Blog", icon: <SiNaver size={10} />, href: "https://blog.naver.com/suh_rin" },
    // { label: "Youtube", icon: <SiYoutube size={20} />, href: null },
  ];

  return (
    <section className="gap-lg p-xl md:p-2xl flex flex-col items-center rounded-xl bg-white shadow-md transition-shadow">
      <div className="relative flex h-30 w-30 items-center justify-center overflow-hidden rounded-full border-4 border-white shadow-sm md:h-36 md:w-36">
        <Image
          src="/profile-image.png"
          alt="허서린 프로필 이미지"
          fill
          className="rounded-full object-cover"
        />
      </div>
      {/* 프로필 텍스트 영역 */}
      <div className="gap-md flex w-full flex-col items-center">
        <div className="gap-xs flex flex-col items-center text-center">
          <h2 className="text-body-lg md:text-h3 text-primary-dark font-bold">허서린</h2>
          <p className="text-body-sm text-gray-500">📧 suhrinhuh77@gmail.com</p>
        </div>
        {/* 소개글 */}
        <p className="text-body-sm md:text-body-md text-gray-600">
          안녕하세요! 다양한 스타일에 도전하고 싶은 허서린입니다. 패션, 액세서리, 뷰티, 팝업스토어에
          관심이 많아요 :D
        </p>
        {/* 소셜 미디어 리스트 */}
        <div className="gap-md flex w-full flex-wrap justify-center">
          {snsOptions.map((option) => (
            <a
              key={`${option.label}-href`}
              href={option.href}
              className="px-sm py-xs md:px-md md:py-sm gap-sm bg-primary text-body-xs md:text-body-sm hover:bg-primary-hover active:bg-primary-active flex items-center justify-center rounded-full font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98]"
            >
              {option.icon}
              <span>{option.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
