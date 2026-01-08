// components
import Image from "next/image";

// icon
import { PiInstagramLogoFill } from "react-icons/pi";
import { SiNaver } from "react-icons/si";

export default function ProfileSection() {
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
  );
}
