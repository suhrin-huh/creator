"use client";

// components
import Image from "next/image";
import PixelWindow from "@/components/common/PixelWindow";

// assets
import ProfileImage from "@/assets/image/profile-image.png";
import InstagramPixelIcon from "@/assets/image/instgram-pixel-icon.png";
import NaverPixelIcon from "@/assets/image/naver-pixel-icon.png";
import MailPixelIcon from "@/assets/image/mail-pixel-icon.png";
import Link from "next/link";

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
        icon: InstagramPixelIcon,
        color: "#7638fa",
        borderColor: "#4a6c1c",
      },
      {
        id: "blog",
        label: "Blog",
        href: "https://blog.naver.com/suh_rin",
        icon: NaverPixelIcon,
        color: "#4cae4f",
        borderColor: "#2e7d32",
      },
    ],
  };

  return (
    <PixelWindow title="PROFILE_INFO.EXE" statusBar={<span>✦ P loaded</span>}>
      <div className="p-md flex flex-col items-center gap-3 text-center">
        {/* 아바타 */}
        <div className="border-pixel border-primary bg-primary-outlined flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full shadow-[3px_3px_0_rgba(90,110,180,0.2)]">
          <Image src={PROFILE_INFO.image.src} alt={PROFILE_INFO.image.alt} />
        </div>
        {/* 이름 및 이메일 */}
        <div className="text-foreground-muted flex items-center gap-1.5 text-xs">
          <h1 className="text-foreground-main text-[22px] font-bold">{PROFILE_INFO.name}</h1>
          <div className="relative h-6 w-6">
            <Image src={MailPixelIcon} alt="이메일 아이콘" fill />
          </div>
          <span>{PROFILE_INFO.email}</span>
        </div>
        {/* 소개 */}
        <p className="text-foreground-main max-w-[480px] text-[13px] leading-relaxed">
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
            <Link
              href={link.href}
              key={link.label}
              className="gap-sm flex items-center hover:scale-90"
            >
              <div className="relative h-5 w-5">
                <Image src={link.icon} alt={link.label} fill />
              </div>
              <p className="text-caption">{link.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </PixelWindow>
  );
}
