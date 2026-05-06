"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const menu = [
  { label: "서비스 소개", href: "/#hero", id: "hero" },
  { label: "어떻게 쓰나요?", href: "/#intro-mobile", id: "intro-mobile" },
];

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    elements.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [ids.join(",")]);
  return active;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const sectionIds = menu.map((m) => m.id).filter((x): x is string => x !== null);
  const activeSection = useActiveSection(sectionIds);
  const [clickedId, setClickedId] = useState<string | null>(null);

  // 클릭 직후 IntersectionObserver가 따라잡기 전까지 즉시 active 색상 적용
  useEffect(() => {
    if (!clickedId) return;
    const t = setTimeout(() => setClickedId(null), 800);
    return () => clearTimeout(t);
  }, [clickedId]);

  const isActive = (item: (typeof menu)[number]) => {
    if (clickedId === item.id) return true;
    return pathname === "/" && activeSection === item.id;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[#717171]/30">
      <div className="mx-auto flex h-[68px] w-full max-w-[1120px] items-center px-8 lg:px-12">
        {/* 왼쪽: 로고 */}
        <Link href="/" className="flex items-center gap-[10px]" aria-label="이음 홈">
          <img src="/LOGO.png" alt="" aria-hidden className="block h-8 w-auto" />
          <span className="text-[18px] font-bold leading-none text-black">이음</span>
        </Link>

        {/* 오른쪽 영역: 메뉴 + CTA */}
        <div className="ml-auto flex items-center gap-10 lg:gap-20">
          {/* 메뉴 (≥768) */}
          <nav className="hidden md:flex items-center gap-[48px] lg:gap-[52px]">
            {menu.map((item) => {
              const active = isActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => item.id && setClickedId(item.id)}
                  className={`text-[14px] font-semibold no-underline transition-colors duration-300 ease-out hover:text-[#111111] ${
                    active ? "text-[#000000]" : "text-[#9F9F9F]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA (≥768) */}
          <Link
            href="/apply"
            className="hidden md:inline-flex h-[38px] items-center rounded-lg bg-[#00006A] px-[22px] text-[14px] font-bold text-white transition-opacity hover:opacity-90"
          >
            무료로 신청하기
          </Link>

          {/* 모바일 햄버거 (<768) */}
          <button
            type="button"
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex h-10 w-10 items-center justify-center"
          >
            <span className="sr-only">메뉴 토글</span>
            <span aria-hidden className="relative block h-0.5 w-6 bg-black before:absolute before:-top-2 before:left-0 before:h-0.5 before:w-6 before:bg-black before:content-[''] after:absolute after:top-2 after:left-0 after:h-0.5 after:w-6 after:bg-black after:content-['']" />
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 패널 — 구조만, 디자이너 시안 받으면 디테일 적용 */}
      {open && (
        <nav className="md:hidden border-t border-[#717171]/30 bg-white">
          <ul className="flex flex-col px-6 py-4">
            {menu.map((item) => {
              const active = isActive(item);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => {
                      if (item.id) setClickedId(item.id);
                      setOpen(false);
                    }}
                    className={`block py-3 text-[14px] font-semibold transition-colors duration-300 ease-out hover:text-[#111111] ${
                      active ? "text-[#000000]" : "text-[#9F9F9F]"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li className="pt-2">
              <Link
                href="/apply"
                onClick={() => setOpen(false)}
                className="inline-flex h-[38px] items-center rounded-lg bg-[#00006A] px-[22px] text-[14px] font-bold text-white"
              >
                무료로 신청하기
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
