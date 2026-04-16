"use client";

// components
import Image from "next/image";
import PixelWindow from "@/components/common/PixelWindow";
import PixelButton from "@/components/common/PixelButton";

// icon
import { PiInstagramLogoFill } from "react-icons/pi";
import { SiNaver } from "react-icons/si";

// assets
import ProfileImage from "@/assets/image/profile-image.png";

export default function ProfileSection() {
  /** 새롭게 정의한 프로필 정보 */
  const PROFILE_INFO = {
    name: "허서린",
    image: {
      src: ProfileImage,
      alt: "허서린 프로필 이미지",
    },
    email: "suhrinhuh77@gmail.com",
    bio: "안녕하세요! 다양한 스타일에 도전하고 싶은 허서린입니다.\n패션, 액세서리, 뷰티, 팝업스토어에 관심이 많아요 :D",
    links: [
      {
        id: "instagram",
        label: "Instagram",
        href: "https://www.instagram.com/suhrinhuh",
        icon: <PiInstagramLogoFill />,
        color: "#7638fa",
        borderColor: "#4a6c1c",
      },
      {
        id: "blog",
        label: "Blog",
        href: "https://blog.naver.com/suh_rin",
        icon: <SiNaver />,
        color: "#4cae4f",
        borderColor: "#2e7d32",
      },
    ],
  };

  if (true)
    return (
      <PixelWindow
        title="PROFILE_INFO.EXE"
        statusBar={
          <>
            <span>✦ P loaded</span>
          </>
        }
      >
        <div className="flex flex-col items-center gap-3 px-5 py-7 text-center">
          {/* 아바타 */}
          <div className="pixel-avatar">
            <Image src={PROFILE_INFO.image.src} alt={PROFILE_INFO.image.alt} />
            {/* <span className="text-4xl text-white/70">☺</span> */}
          </div>

          {/* 이름 */}
          <h1 className="text-text-main text-[22px] font-bold">{PROFILE_INFO.name}</h1>

          {/* 이메일 */}
          <div className="text-text-muted flex items-center gap-1.5 text-xs">
            <span className="pixel-email-dot" />
            {PROFILE_INFO.email}
          </div>

          {/* 소개 */}
          <p className="text-text-main max-w-[480px] text-[13px] leading-relaxed">
            {PROFILE_INFO.bio.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                {i < PROFILE_INFO.bio.split("\n").length - 1 && <br />}
              </span>
            ))}
          </p>
          {/* 링크 버튼들 */}
          <div className="flex flex-wrap justify-center gap-2.5">
            {PROFILE_INFO.links.map((link) => (
              <PixelButton
                key={link.id}
                as="a"
                // href={link.href}
                target="_blank"
                icon={link.icon}
                bgColor={link.color}
                borderColor={link.borderColor}
              >
                {link.label}
              </PixelButton>
            ))}
          </div>
        </div>
      </PixelWindow>
    );
}
