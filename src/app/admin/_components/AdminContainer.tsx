"use client";

import { useRouter } from "next/navigation";

// components
import PixelButton from "@/components/common/PixelButton";
import PixelWindow from "@/components/common/PixelWindow";

export default function AdminContainer() {
  const router = useRouter();
  return (
    <main className="gap-sm flex flex-1 flex-col">
      <section className="gap-sm grid grid-cols-2 md:grid-cols-3">
        <PixelButton variant="ghost" onClick={() => router.push("/admin/sponsorships")}>
          <p className="font-pixel text-body-sm">PRODUCT</p>
        </PixelButton>
        <PixelButton variant="ghost" onClick={() => router.push("/admin/sponsorships")}>
          <p className="font-pixel text-body-sm">SANPLE</p>
        </PixelButton>
      </section>
      <PixelWindow title="WAITING LIST" statusBar={<p>SUHRINHUH</p>}>
        <div className="p-md gap-y-xs hide-scrollbar flex h-40 flex-col overflow-scroll">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border-outlined-light p-xs flex border-2">
              <p className="text-body-xs flex-1 truncate">Please insert a title of a product.</p>
              <PixelButton variant="muted" className="text-body-xs h-[20px]">
                Save
              </PixelButton>
            </div>
          ))}
        </div>
      </PixelWindow>
      <PixelWindow title="RECEIVED LIST" statusBar={<p>SUHRINHUH</p>}>
        <div className="p-md gap-y-xs flex flex-col">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border-outlined-light p-xs flex border-2">
              <p className="text-body-xs flex-1 truncate">Please insert a title of a product.</p>
              <PixelButton className="text-body-xs h-[20px]">Waiting</PixelButton>
            </div>
          ))}
        </div>
      </PixelWindow>
    </main>
  );
}
