"use client";

import Link from "next/link";
import { type ReactNode, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { track } from "@/lib/analytics";

const calendarDates = Array.from({ length: 31 }, (_, i) => {
  const day = i + 1;
  return {
    day,
    marked: [1, 2, 4, 5, 7, 8].includes(day),
    selected: day === 8,
  };
});

const giftCategories = [
  { label: "건강식품", image: "/category_health.png" },
  { label: "생활용품", image: "/category_things.png" },
  { label: "식품", image: "/category_food.png" },
  { label: "취미용품", image: "/category_hobby.png" },
];

function PhoneMockup({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`record-phone ${className}`}>
      <div className="phone-device">
        <img className="phone-frame" src="/phone.png" alt="" aria-hidden />
        <div className="phone-screen">{children}</div>
      </div>
    </div>
  );
}

function RecordPhoneHeader({
  activePoint = false,
  showCart = false,
}: {
  activePoint?: boolean;
  showCart?: boolean;
}) {
  return (
    <>
      <img
        className="record-statusbar"
        src="/Status%20bar%20-%20iPhone.svg"
        alt=""
        aria-hidden
      />
      <div className="record-app-header">
        <img className="record-logo" src="/LOGO.png" alt="" aria-hidden />
        <div className="record-header-actions">
          {showCart && (
            <img
              className="record-cart-icon"
              src="/Shopping%20cart.svg"
              alt=""
              aria-hidden
            />
          )}
          <div className={`record-point-icon${activePoint ? " active" : ""}`}>
            <img src="/icon_point.svg" alt="" aria-hidden />
          </div>
        </div>
      </div>
    </>
  );
}

function RecordBottomNav({ active }: { active: "home" | "calendar" | "gift" }) {
  const items = [
    { id: "home", label: "홈", src: "/Home.svg" },
    { id: "calendar", label: "캘린더", src: "/Calendar.svg" },
    { id: "gift", label: "선물", src: "/Gift.svg" },
  ] as const;

  return (
    <nav className="record-bottom-nav" aria-label="앱 탭바">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`record-nav-item${active === item.id ? " active" : ""}`}
          aria-label={item.label}
        >
          <img src={item.src} alt="" aria-hidden />
        </button>
      ))}
    </nav>
  );
}

function CalendarPhoneScreen() {
  return (
    <div className="record-app record-calendar-app">
      <RecordPhoneHeader activePoint />

      <div className="record-calendar-content">
        <div className="record-month-row">
          <strong>5월 2026</strong>
          <div className="record-month-controls" aria-hidden>
            <span>&lt;</span>
            <span>&gt;</span>
          </div>
        </div>

        <div className="record-calendar-grid" aria-hidden>
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
            <span key={day} className="record-weekday">
              {day}
            </span>
          ))}
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={`blank-${i}`} className="record-day blank" />
          ))}
          {calendarDates.map((date) => (
            <span
              key={date.day}
              className={`record-day${date.selected ? " selected" : ""}${
                date.marked ? " marked" : ""
              }`}
            >
              {date.marked && <img src="/LOGO.svg" alt="" aria-hidden />}
              <span>{date.day}</span>
            </span>
          ))}
        </div>

        <div className="record-temperature-card">
          <div className="record-temperature-label">
            <span>이음 온도</span>
            <strong>75%</strong>
          </div>
          <div className="record-progress-track">
            <span />
          </div>
        </div>
      </div>

      <RecordBottomNav active="calendar" />
    </div>
  );
}

function GiftPhoneScreen() {
  return (
    <div className="record-app record-gift-app">
      <RecordPhoneHeader showCart />

      <div className="record-gift-content">
        <h3>선물하기</h3>
        <div className="record-gift-tabs" aria-label="선물 보기 방식">
          <span className="active">카테고리</span>
          <span>전체 선물</span>
        </div>

        <div className="record-gift-grid">
          {giftCategories.map((item) => (
            <article key={item.label} className="record-gift-card">
              <img src={item.image} alt="" aria-hidden />
              <strong>{item.label}</strong>
            </article>
          ))}
        </div>
      </div>

      <RecordBottomNav active="gift" />
    </div>
  );
}

function RecordPointSection() {
  return (
    <section id="intro-reward" className="intro-reward-section">
      <div className="intro-reward-inner">
        <motion.div
          className="intro-reward-title"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.35, once: false }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <p className="intro-reward-eyebrow">기록 · 포인트</p>
          <h2 className="intro-reward-heading">
            보낸 기록은 남고,
            <br />
            포인트는 선물로 이어져요
          </h2>
          <p className="intro-reward-subtitle">
            이번 달에 얼마나 자주 전했는지 확인하고,
            <br />
            쌓인 포인트로 부모님께 필요한 선물을 준비할 수 있어요
          </p>
        </motion.div>

        <div className="record-phone-row">
          <motion.div
            className="record-phone-stack record-phone-stack-left"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.15, once: false }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
          >
            <p className="record-phone-copy">
              이번 달에 남긴 기록을 한눈에 보고,
              <br />
              이음 온도로 꾸준함을 확인해요
            </p>
            <PhoneMockup className="record-phone-calendar">
              <CalendarPhoneScreen />
            </PhoneMockup>
          </motion.div>

          <motion.div
            className="record-phone-stack record-phone-stack-right"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.15, once: false }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.16 }}
          >
            <PhoneMockup className="record-phone-gift">
              <GiftPhoneScreen />
            </PhoneMockup>
            <p className="record-phone-copy">
              건강식품부터 생활용품까지,
              <br />
              부모님께 필요한 선물을 준비할 수{" "}있어요
            </p>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        .intro-reward-section {
          position: relative;
          box-sizing: border-box;
          width: 100%;
          min-height: max(calc(100svh - 68px + 360px), 1040px);
          overflow: hidden;
          background: #ffffff;
        }

        .intro-reward-inner {
          width: min(1120px, calc(100% - 64px));
          margin: 0 auto;
          padding: clamp(76px, 9vh, 108px) 0 110px;
        }

        .intro-reward-title {
          width: min(760px, 100%);
        }

        .intro-reward-eyebrow {
          margin: 0 0 38px;
          color: #00006a;
          font-size: 24px;
          font-weight: 800;
          line-height: 1.3;
        }

        .intro-reward-heading {
          margin: 0;
          color: #111111;
          font-size: clamp(48px, 4.5vw, 64px);
          font-weight: 700;
          line-height: 1.12;
          letter-spacing: -0.04em;
          word-break: keep-all;
        }

        .intro-reward-subtitle {
          margin: 26px 0 0;
          color: #2b3340;
          font-size: clamp(19px, 1.55vw, 24px);
          font-weight: 700;
          line-height: 1.45;
          letter-spacing: -0.03em;
          word-break: keep-all;
        }

        .record-phone-row {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          align-items: start;
          gap: clamp(54px, 7vw, 96px);
          width: min(820px, 100%);
          margin: 68px auto 0;
        }

        .record-phone-stack {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 0;
        }

        .record-phone-stack-left {
          margin-top: 170px;
        }

        .record-phone-stack-right {
          margin-top: 0;
        }

        .record-phone {
          width: clamp(285px, 27vw, 350px);
        }

        .record-phone .phone-device {
          isolation: isolate;
          filter: none;
        }

        .record-phone .phone-device::before {
          position: absolute;
          inset: 5% 6% 4%;
          z-index: 0;
          border-radius: 34px;
          box-shadow:
            -10px 14px 22px rgba(0, 0, 0, 0.09),
            -24px 38px 34px rgba(0, 0, 0, 0.14);
          content: "";
          pointer-events: none;
        }

        .record-phone .phone-frame {
          position: relative;
          z-index: 2;
        }

        .record-phone .phone-screen {
          position: absolute;
          z-index: 3;
        }

        .record-phone-gift {
          margin-top: 0;
        }

        .record-phone-copy {
          width: min(420px, 100%);
          margin: 0;
          color: #2b3340;
          text-align: center;
          font-size: clamp(20px, 1.6vw, 26px);
          font-weight: 700;
          line-height: 1.35;
          letter-spacing: -0.03em;
          word-break: keep-all;
        }

        .record-phone-stack-left .record-phone-copy {
          margin-bottom: 54px;
        }

        .record-phone-stack-right .record-phone-copy {
          margin-top: 80px;
        }

        .record-app {
          position: relative;
          height: 100%;
          overflow: hidden;
          border-radius: inherit;
          background: #fbfdff;
          color: #111111;
          font-family: inherit;
        }

        .record-statusbar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 4;
          display: block;
          width: 100%;
          height: auto;
          pointer-events: none;
          user-select: none;
        }

        .record-app-header {
          position: absolute;
          top: 9%;
          left: 8%;
          right: 8%;
          z-index: 3;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .record-logo {
          display: block;
          width: 22%;
          min-width: 36px;
          max-width: 56px;
          height: auto;
          flex-shrink: 0;
        }

        .record-header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .record-cart-icon {
          display: block;
          width: 26px;
          height: 26px;
          object-fit: contain;
        }

        .record-point-icon {
          display: flex;
          width: 28px;
          height: 28px;
          align-items: center;
          justify-content: center;
        }

        .record-point-icon.active {
          background: transparent;
        }

        .record-point-icon img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .record-calendar-content,
        .record-gift-content {
          position: absolute;
          top: 18%;
          left: 8%;
          right: 8%;
          bottom: 17%;
        }

        .record-month-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .record-month-row strong {
          color: #111111;
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .record-month-controls {
          display: flex;
          gap: 8px;
        }

        .record-month-controls span {
          display: flex;
          width: 25px;
          height: 25px;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background: #f1f4f8;
          color: #2b3340;
          font-size: 14px;
          font-weight: 800;
        }

        .record-calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 6px 4px;
          margin-top: 20px;
        }

        .record-weekday {
          color: #9f9f9f;
          text-align: center;
          font-size: 9px;
          font-weight: 800;
        }

        .record-day {
          position: relative;
          display: flex;
          aspect-ratio: 1;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          color: #2b3340;
          font-size: 12px;
          font-weight: 800;
        }

        .record-day.blank {
          visibility: hidden;
        }

        .record-day.selected {
          background: #cfeaff;
          color: #00006a;
        }

        .record-day img {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 2;
          width: 24px;
          height: 24px;
          opacity: 0.4;
          transform: translate(-50%, -50%);
          object-fit: contain;
        }

        .record-day img + span {
          position: relative;
          z-index: 1;
        }

        .record-temperature-card {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          border: 1px solid #eef0f4;
          border-radius: 18px;
          background: #ffffff;
          padding: 15px 16px;
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.05);
        }

        .record-temperature-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #111111;
          font-size: 13px;
          font-weight: 800;
        }

        .record-temperature-label strong {
          color: #00006a;
          font-size: 13px;
          font-weight: 900;
        }

        .record-progress-track {
          height: 9px;
          margin-top: 11px;
          overflow: hidden;
          border-radius: 999px;
          background: #eceef3;
        }

        .record-progress-track span {
          display: block;
          width: 75%;
          height: 100%;
          border-radius: inherit;
          background: #00006a;
        }

        .record-gift-content h3 {
          margin: 0;
          color: #111111;
          text-align: center;
          font-size: 23px;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .record-gift-tabs {
          display: flex;
          gap: 8px;
          margin-top: 18px;
          border-radius: 999px;
          background: #f1f3f6;
          padding: 5px;
        }

        .record-gift-tabs span {
          flex: 1;
          border-radius: 999px;
          padding: 9px 0;
          color: #717171;
          text-align: center;
          font-size: 12px;
          font-weight: 800;
        }

        .record-gift-tabs span.active {
          background: #ffffff;
          color: #00006a;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
        }

        .record-gift-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-top: 20px;
        }

        .record-gift-card {
          display: flex;
          min-width: 0;
          flex-direction: column;
          gap: 6px;
          overflow: hidden;
          border: 1px solid #eef0f4;
          border-radius: 14px;
          background: #ffffff;
          padding: 9px;
          box-shadow: 0 7px 18px rgba(15, 23, 42, 0.04);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .record-gift-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
        }

        .record-gift-card img {
          display: block;
          width: 100%;
          aspect-ratio: 1.18;
          border-radius: 10px;
          object-fit: cover;
          background: #f5f6fa;
        }

        .record-gift-card strong {
          color: #111111;
          font-size: 12px;
          font-weight: 800;
        }

        .record-bottom-nav {
          position: absolute;
          left: 6%;
          right: 6%;
          bottom: 4%;
          z-index: 3;
          display: grid;
          height: 11%;
          min-height: 48px;
          max-height: 68px;
          grid-template-columns: repeat(3, 1fr);
          align-items: center;
          border: 1px solid #eef0f4;
          border-radius: 20px;
          background: #ffffff;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);
        }

        .record-nav-item {
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: transparent;
          padding: 0;
          cursor: default;
        }

        .record-nav-item img {
          width: 50%;
          min-width: 18px;
          max-width: 26px;
          height: auto;
          object-fit: contain;
          opacity: 0.58;
          filter: grayscale(1) brightness(0.35);
        }

        .record-nav-item.active img {
          opacity: 1;
          filter: invert(9%) sepia(75%) saturate(4011%) hue-rotate(239deg)
            brightness(77%) contrast(131%);
        }

        @media (max-width: 1024px) and (min-width: 769px) {
          .intro-reward-inner {
            width: min(100% - 48px, 980px);
          }

          .record-phone-row {
            gap: 42px;
            width: min(680px, 100%);
            margin-top: 62px;
          }

          .record-phone {
            width: clamp(260px, 30vw, 305px);
          }

          .record-phone-stack-left {
            margin-top: 134px;
          }

          .record-phone-copy {
            font-size: clamp(18px, 1.8vw, 22px);
          }

          .record-phone-stack-left .record-phone-copy {
            margin-bottom: 44px;
          }

          .record-phone-stack-right .record-phone-copy {
            margin-top: 64px;
          }
        }

        @media (max-width: 768px) {
          .intro-reward-section {
            min-height: auto;
            overflow: visible;
          }

          .intro-reward-inner {
            width: min(calc(100% - 32px), 420px);
            padding: 80px 0;
          }

          .intro-reward-title {
            width: 100%;
          }

          .intro-reward-eyebrow {
            margin-bottom: 24px;
          }

          .intro-reward-heading {
            font-size: clamp(40px, 11vw, 52px);
          }

          .intro-reward-subtitle {
            font-size: 20px;
          }

          .intro-reward-subtitle br {
            display: none;
          }

          .record-phone-row {
            display: flex;
            width: 100%;
            flex-direction: column;
            align-items: center;
            gap: 44px;
            margin-top: 56px;
          }

          .record-phone-stack,
          .record-phone-stack-left,
          .record-phone-stack-right {
            width: 100%;
            margin-top: 0;
          }

          .record-phone,
          .record-phone-gift {
            width: min(300px, 80vw);
            margin-top: 0;
          }

          .record-phone-copy {
            width: 100%;
            font-size: 20px;
          }

          .record-phone-stack-left .record-phone-copy,
          .record-phone-stack-right .record-phone-copy {
            margin: 0 0 32px;
          }

          .record-phone-stack-right .record-phone-copy {
            order: -1;
          }
        }
      `}</style>
    </section>
  );
}

export default function LandingPage() {
  const [tvCycleKey, setTvCycleKey] = useState(0);

  useEffect(() => {
    track("landing_viewed");
  }, []);

  const scrollToNextSection = () => {
    const hero = document.getElementById("hero");
    const nextSection = hero?.nextElementSibling;
    if (nextSection instanceof HTMLElement) {
      nextSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section id="hero" className="hero-section">
        {/* 하단 아이콘 레이어 (5 + 4 줄) */}
        <div className="hero-icons" aria-hidden>
          <img className="hero-icon hero-icon-camera" src="/Icon_camera.png" alt="" />
          <img className="hero-icon hero-icon-heart" src="/Icon_heart.png" alt="" />
          <img className="hero-icon hero-icon-mobile" src="/Icon_mobile.png" alt="" />
          <img className="hero-icon hero-icon-clock" src="/Icon_clock.png" alt="" />
          <img className="hero-icon hero-icon-alert" src="/Icon_alert.png" alt="" />
          <img className="hero-icon hero-icon-people" src="/Icon_people.png" alt="" />
          <img className="hero-icon hero-icon-home" src="/Icon_home.png" alt="" />
          <img className="hero-icon hero-icon-message" src="/Icon_message.png" alt="" />
          <img className="hero-icon hero-icon-tv" src="/Icon_TV.png" alt="" />
        </div>

        {/* 텍스트 + CTA */}
        <div className="hero-content">
          <h1 className="hero-title">
            올리고, 확인하고.
            <br />
            그게 전부예요
          </h1>

          <Link
            href="/apply"
            onClick={() => track("cta_clicked", { cta_location: "hero" })}
            className="hero-cta"
          >
            무료로 신청하기
          </Link>
        </div>

        {/* Chevron Down — Hero section 하단 중앙, 위아래 부유 애니메이션 */}
        <button
          type="button"
          className="hero-chevron"
          aria-label="다음 섹션으로 이동"
          onClick={scrollToNextSection}
        >
          <img src="/Chevron_down.png" alt="" aria-hidden />
        </button>

        <style jsx global>{`
          .hero-section {
            position: relative;
            box-sizing: border-box;
            width: 100%;
            height: calc(100svh - 68px);
            min-height: 640px;
            overflow: hidden;
            background: linear-gradient(
              180deg,
              #eaf6ff 0%,
              #f3f8ff 58%,
              #eef4ff 100%
            );
          }

          .hero-content {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 320px;
            left: 0;
            z-index: 2;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 0 16px;
            text-align: center;
            transform: translateY(-40px);
          }

          .hero-title {
            margin: 0;
            color: #111111;
            font-size: 64px;
            font-weight: 700;
            line-height: 1.2;
            letter-spacing: -0.04em;
            word-break: keep-all;
          }

          .hero-cta {
            margin-top: 32px;
            display: inline-flex;
            height: 52px;
            padding: 0 28px;
            border-radius: 10px;
            background: #05006b;
            color: #ffffff;
            font-size: 17px;
            font-weight: 700;
            white-space: nowrap;
            align-items: center;
            justify-content: center;
            transition: opacity 0.2s;
          }

          .hero-cta:hover {
            opacity: 0.9;
          }

          .hero-icons {
            position: absolute;
            left: 50%;
            bottom: 150px;
            width: 810px;
            height: 300px;
            transform: translateX(-50%);
            z-index: 1;
            pointer-events: none;
          }

          .hero-icon {
            position: absolute;
            display: block;
            opacity: 0.85;
            object-fit: contain;
          }

          .hero-icon-camera  { left: 4%;  top: 0%;  width: 136px; height: 113px; }
          .hero-icon-heart   { left: 24%; top: 0%;  width: 127px; height: 117px; }
          .hero-icon-mobile  { left: 46%; top: -1%; width: 79px;  height: 130px; }
          .hero-icon-clock   { left: 65%; top: 2%;  width: 116px; height: 116px; }
          .hero-icon-alert   { left: 84%; top: 0%;  width: 114px; height: 127px; }
          .hero-icon-people  { left: 11%; top: 52%; width: 170px; height: 142px; }
          .hero-icon-home    { left: 36%; top: 53%; width: 142px; height: 140px; }
          .hero-icon-message { left: 57%; top: 58%; width: 147px; height: 95px; }
          .hero-icon-tv      { left: 78%; top: 54%; width: 134px; height: 123px; }

          .hero-chevron {
            position: absolute;
            left: 50%;
            bottom: 28px;
            width: 104.5px;
            height: 45.5px;
            border: 0;
            padding: 0;
            background: transparent;
            cursor: pointer;
            z-index: 3;
            animation: heroChevronFloat 1.8s ease-in-out infinite;
          }

          .hero-chevron img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: contain;
          }

          @keyframes heroChevronFloat {
            0%, 100% { transform: translateX(-50%) translateY(0); }
            50%      { transform: translateX(-50%) translateY(8px); }
          }

          @media (prefers-reduced-motion: reduce) {
            .hero-chevron {
              animation: none;
            }
          }

          @media (max-width: 1024px) {
            .hero-cta {
              font-size: 18px;
            }
            .hero-icons {
              bottom: 128px;
              width: 810px;
              height: 300px;
            }
            .hero-icon {
              transform-origin: center;
            }
          }

          @media (max-width: 768px) {
            .hero-section {
              min-height: 620px;
            }
            .hero-content {
              bottom: 292px;
            }
            .hero-title {
              font-size: 52px;
              line-height: 1.2;
            }
            .hero-cta {
              height: 48px;
              padding: 0 24px;
              font-size: 16px;
            }
            .hero-icons {
              width: 810px;
              height: 300px;
              bottom: 104px;
            }
          }

          @media (max-width: 480px) {
            .hero-title {
              font-size: 38px;
            }
            .hero-cta {
              font-size: 15px;
            }
            .hero-chevron {
              bottom: 20px;
            }
          }
        `}</style>
      </section>

      {/* Persona — 누구의 어떤 문제를 푸는지 공감 섹션 */}
      <section id="persona" className="persona-section">
        <div className="persona-inner">
          <motion.div
            className="persona-header"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.35, once: false }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <h2 className="persona-title">이런 하루, 익숙하시지 않으신가요?</h2>
            <motion.p
              className="persona-subtitle"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.35, once: false }}
              transition={{ duration: 0.65, ease: "easeOut", delay: 0.08 }}
            >
              보내고 싶고, 보고 싶었던 순간들
              <br />
              <span className="accent">이음이 대신</span>{" "}
              <span className="strong">이어드립니다</span>
            </motion.p>
          </motion.div>

          <div className="persona-cards">
            <motion.div
              className="persona-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.35, once: false }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.18 }}
            >
              <h3 className="persona-card-title">자녀</h3>

              {[
                { situation: "멀리 떨어져 살지만,", quote: "“자주 닿고 싶을 때”" },
                { situation: "매일 통화는 어려워도,", quote: "“얼굴은 비추고 싶을 때”" },
                { situation: "사진은 쌓이는데,", quote: "“보내는 건 자꾸 미루게 될 때”" },
              ].map((item, i) => (
                <motion.div
                  key={item.situation}
                  className="persona-item"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ amount: 0.35, once: false }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.42 + i * 0.08 }}
                >
                  <p className="persona-situation">{item.situation}</p>
                  <p className="persona-quote">{item.quote}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="persona-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.35, once: false }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.34 }}
            >
              <h3 className="persona-card-title">부모님</h3>

              {[
                { situation: "복잡한 조작 없이,", quote: "“가족의 얼굴을 보고 싶을 때”" },
                { situation: "기다리지 않아도,", quote: "“아이의 오늘이 닿길 바랄 때”" },
                { situation: "말 한마디보다,", quote: "“얼굴 한 번이 더 반가운 날”" },
              ].map((item, i) => (
                <motion.div
                  key={item.situation}
                  className="persona-item"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ amount: 0.35, once: false }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.58 + i * 0.08 }}
                >
                  <p className="persona-situation">{item.situation}</p>
                  <p className="persona-quote">{item.quote}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        <style jsx global>{`
          .persona-section {
            position: relative;
            box-sizing: border-box;
            width: 100%;
            min-height: max(calc(100svh - 68px + 200px), 980px);
            overflow: hidden;
            background: #ffffff;
            padding: clamp(188px, 21vh, 260px) 0 clamp(112px, 13vh, 152px);
          }

          .persona-inner {
            position: relative;
            z-index: 2;
            width: min(1120px, calc(100% - 64px));
            margin: 0 auto;
          }

          .persona-header {
            text-align: center;
          }

          .persona-title {
            margin: 0;
            color: #050505;
            font-size: clamp(42px, 4vw, 56px);
            font-weight: 800;
            line-height: 1.2;
            letter-spacing: -0.04em;
            word-break: keep-all;
          }

          .persona-subtitle {
            margin: 24px 0 0;
            color: #9a9a9a;
            font-size: clamp(20px, 1.7vw, 26px);
            font-weight: 700;
            line-height: 1.35;
            letter-spacing: -0.03em;
            word-break: keep-all;
          }

          .persona-subtitle .accent {
            color: #111111;
            font-weight: 800;
          }

          .persona-subtitle .strong {
            color: #00006a;
            font-weight: 800;
          }

          .persona-cards {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: clamp(40px, 4.5vw, 64px);
            max-width: 832px;
            margin: clamp(56px, 7vh, 76px) auto 0;
            align-items: stretch;
          }

          .persona-card {
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            min-height: 420px;
            padding: 44px 52px;
            border: 1px solid rgba(230, 235, 245, 0.9);
            border-radius: 28px;
            background: rgba(255, 255, 255, 0.94);
            backdrop-filter: blur(25px);
            box-shadow:
              inset 2px 2px 6px rgba(0, 0, 0, 0.25),
              7px 6px 14px rgba(0, 0, 0, 0.25);
          }

          .persona-card-title {
            display: flex;
            align-items: center;
            gap: 12px;
            margin: 0 0 40px;
            color: #111111;
            font-size: 28px;
            font-weight: 800;
            line-height: 1.2;
            letter-spacing: -0.03em;
          }

          .persona-item {
            margin-bottom: 30px;
          }

          .persona-item:last-child {
            margin-bottom: 0;
          }

          .persona-situation {
            margin: 0 0 6px;
            color: #526692;
            font-size: 20px;
            font-weight: 700;
            line-height: 1.45;
            letter-spacing: -0.03em;
            text-align: left;
            word-break: keep-all;
          }

          .persona-quote {
            margin: 0;
            color: #111111;
            font-size: 20px;
            font-weight: 800;
            line-height: 1.42;
            letter-spacing: -0.035em;
            text-align: center;
            word-break: keep-all;
          }

          @media (max-width: 1024px) {
            .persona-cards {
              gap: 40px;
            }

            .persona-card {
              padding: 38px 34px;
            }

            .persona-card-title {
              font-size: 26px;
              margin-bottom: 32px;
            }
          }

          @media (max-width: 768px) {
            .persona-section {
              min-height: auto;
              padding: 148px 0 88px;
            }

            .persona-inner {
              width: min(calc(100% - 32px), 420px);
            }

            .persona-cards {
              grid-template-columns: 1fr;
              gap: 28px;
              max-width: 420px;
              margin-top: 56px;
            }

            .persona-card {
              padding: 36px 30px;
              min-height: auto;
            }
          }

          @media (max-width: 480px) {
            .persona-section {
              padding: 136px 0 80px;
            }

            .persona-title {
              font-size: 38px;
            }

            .persona-subtitle {
              font-size: 18px;
            }

            .persona-card-title {
              font-size: 24px;
              margin-bottom: 28px;
            }

            .persona-situation {
              font-size: 20px;
            }

            .persona-quote {
              font-size: 20px;
            }
          }
        `}</style>
      </section>

      {/* Service — 서비스 소개 */}
      <section id="service" className="service-section">
        <div className="service-inner">
          <motion.div
            className="service-header"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.35, once: false }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <h2 className="service-title">
              <span>이음</span>을 소개합니다
            </h2>
            <motion.p
              className="service-subtitle"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.35, once: false }}
              transition={{ duration: 0.65, ease: "easeOut", delay: 0.08 }}
            >
              사진과 영상, 그리고 작은 안부
              <br />
              그 모든 순간을 가족에게 자연스럽게 이어드려요
            </motion.p>
          </motion.div>

          <motion.div
            className="service-logo-wrap"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.35, once: false }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          >
            <img className="service-logo" src="/LOGO_BIG.png" alt="이음" />
          </motion.div>
        </div>

        <style jsx global>{`
          .service-section {
            position: relative;
            box-sizing: border-box;
            width: 100%;
            min-height: calc(100svh - 68px);
            overflow: hidden;
            background: #ffffff;
            padding: clamp(88px, 10vh, 120px) 0;
          }

          .service-inner {
            position: relative;
            z-index: 2;
            width: min(1120px, calc(100% - 64px));
            margin: 0 auto;
            transform: translateY(40px);
          }

          .service-header {
            text-align: center;
          }

          /* persona-title과 동일 스펙 */
          .service-title {
            margin: 0;
            color: #050505;
            font-size: clamp(42px, 4vw, 56px);
            font-weight: 800;
            line-height: 1.2;
            letter-spacing: -0.04em;
            word-break: keep-all;
          }

          .service-title span {
            color: #00006a;
          }

          /* persona-subtitle과 동일 스펙 */
          .service-subtitle {
            margin: 24px 0 0;
            color: #9a9a9a;
            font-size: clamp(20px, 1.7vw, 26px);
            font-weight: 700;
            line-height: 1.35;
            letter-spacing: -0.03em;
            word-break: keep-all;
          }

          .service-logo-wrap {
            margin: clamp(64px, 8vh, 96px) auto 0;
            text-align: center;
          }

          .service-logo {
            display: block;
            width: 400px;
            max-width: 100%;
            height: auto;
            margin: 0 auto;
          }

          @media (max-width: 768px) {
            .service-section {
              min-height: auto;
              padding: 80px 0;
            }

            .service-inner {
              width: min(calc(100% - 32px), 420px);
            }

            .service-logo-wrap {
              margin-top: 56px;
            }

            .service-logo {
              width: min(360px, 84vw);
            }
          }

          @media (max-width: 480px) {
            .service-section {
              padding: 72px 0;
            }

            .service-title {
              font-size: 38px;
            }

            .service-subtitle {
              font-size: 18px;
            }
          }
        `}</style>
      </section>

      {/* Intro 1 — 모바일 · 보내기 */}
      <section
        id="intro-mobile"
        className="intro-mobile-section"
      >
        <div className="intro-mobile-inner">
          <motion.div
            className="intro-mobile-title"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.45, once: false }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <p className="intro-mobile-eyebrow">모바일 · 보내기</p>
            <h2 className="intro-mobile-heading">고르고, 보내고</h2>
          </motion.div>

          <motion.p
            className="intro-mobile-copy intro-mobile-copy-left"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.45, once: false }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
          >
            사진과 영상을 고르고{"\n"}짧은 한 마디를 더해{"\n"}한 번에 보낼 수 있어요
          </motion.p>

          <div className="phone-showcase">
            <motion.div
              className="phone-showcase-motion"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.01, once: false }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            >
              <div className="phone-device">
                <img className="phone-frame" src="/phone.png" alt="" aria-hidden />
                <div className="phone-screen">
                  <div className="mobile-send-ui">
                    {/* iOS 상태바 (PNG로 자연 비율 유지) */}
                    <img
                      className="send-statusbar"
                      src="/Status%20bar%20-%20iPhone.svg"
                      alt=""
                      aria-hidden
                    />

                    {/* 앱 헤더: 좌측 로고 + 우측 아이콘 3개 */}
                    <div className="send-app-header">
                      <img
                        className="send-logo-mark"
                        src="/LOGO.png"
                        alt=""
                        aria-hidden
                      />
                      <div className="send-header-actions">
                        <img
                          className="send-header-icon"
                          src="/User%20plus.svg"
                          alt=""
                          aria-hidden
                        />
                        <span className="send-header-icon-wrap">
                          <img
                            className="send-header-icon"
                            src="/Bell.svg"
                            alt=""
                            aria-hidden
                          />
                          <span className="send-header-dot" aria-hidden />
                        </span>
                        <img
                          className="send-header-icon"
                          src="/Settings.svg"
                          alt=""
                          aria-hidden
                        />
                      </div>
                    </div>

                    {/* 중앙 메인 액션: 카메라 + 폴더 */}
                    <div className="send-main-actions">
                      <button
                        type="button"
                        className="send-action-button send-action-camera"
                        aria-label="카메라로 촬영"
                      >
                        <span className="send-action-badge">1</span>
                        <img src="/Camera_button.svg" alt="" aria-hidden />
                      </button>
                      <button
                        type="button"
                        className="send-action-button send-action-folder"
                        aria-label="앨범에서 선택"
                      >
                        <span className="send-action-badge">3</span>
                        <img src="/Folder_button.svg" alt="" aria-hidden />
                      </button>
                    </div>

                    <div className="send-flow-panel" aria-hidden>
                      <div className="send-photo-picker">
                        <div className="send-photo-card send-photo-card-1">
                          <img src="/send-photo-1.png" alt="" aria-hidden />
                          <span className="send-photo-check">1</span>
                        </div>
                        <div className="send-photo-card send-photo-card-2">
                          <img src="/send-photo-2.png" alt="" aria-hidden />
                          <span className="send-photo-check">2</span>
                        </div>
                        <div className="send-photo-card send-photo-card-3">
                          <img src="/send-photo-3.png" alt="" aria-hidden />
                          <span className="send-photo-check">3</span>
                        </div>
                      </div>
                      <div className="send-message-preview">
                        엄마, 오늘 산책 다녀왔어요
                      </div>
                      <button type="button" className="send-flow-button">
                        보내기
                      </button>
                      <div className="send-complete-toast">전송완료!</div>
                    </div>

                    {/* 하단 탭바 */}
                    <nav className="send-bottom-nav" aria-label="앱 탭바">
                      <button
                        type="button"
                        className="send-nav-item active"
                        aria-label="홈"
                      >
                        <img src="/Home.svg" alt="" aria-hidden />
                      </button>
                      <button
                        type="button"
                        className="send-nav-item"
                        aria-label="캘린더"
                      >
                        <img src="/Calendar.svg" alt="" aria-hidden />
                      </button>
                      <button
                        type="button"
                        className="send-nav-item"
                        aria-label="선물"
                      >
                        <img src="/Gift.svg" alt="" aria-hidden />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
              <p className="phone-showcase-caption">
                생각날 때 한번,
                <br />
                이음이 도와드릴게요.
              </p>
            </motion.div>
          </div>

          <motion.p
            className="intro-mobile-copy intro-mobile-copy-right"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.45, once: false }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.16 }}
          >
            복잡한 과정 없이{"\n"}모바일에서 바로{"\n"}가족에게 전송돼요
          </motion.p>
        </div>

        <style jsx global>{`
          .intro-mobile-section {
            position: relative;
            box-sizing: border-box;
            width: 100%;
            min-height: max(calc(100svh - 68px + 620px), 1280px);
            overflow: hidden;
            background: #ffffff;
          }

          .intro-mobile-inner {
            position: relative;
            --phone-width: clamp(255px, 21.25vw, 332px);
            --phone-half-width: clamp(127.5px, 10.625vw, 166px);
            --phone-copy-gap: clamp(44px, 5vw, 72px);
            width: min(1120px, calc(100% - 64px));
            height: 100%;
            min-height: max(calc(100svh - 68px + 620px), 1280px);
            margin: 0 auto;
          }

          .intro-mobile-title {
            position: absolute;
            top: clamp(48px, 8vh, 88px);
            left: 0;
          }

          .intro-mobile-eyebrow {
            margin: 0 0 48px;
            color: #00006a;
            font-size: 24px;
            font-weight: 800;
          }

          .intro-mobile-heading {
            margin: 0;
            color: #111111;
            font-size: 64px;
            font-weight: 700;
            line-height: 1.15;
            letter-spacing: -0.04em;
          }

          .intro-mobile-copy {
            position: absolute;
            margin: 0;
            color: #2b3340;
            font-size: clamp(20px, 1.6vw, 26px);
            font-weight: 700;
            line-height: 1.35;
            letter-spacing: -0.03em;
            white-space: pre-line;
          }

          .intro-mobile-copy-left {
            top: calc(clamp(48px, 8vh, 88px) + 440px);
            right: calc(50% + var(--phone-half-width) + var(--phone-copy-gap));
            text-align: right;
          }

          .intro-mobile-copy-right {
            top: calc(clamp(48px, 8vh, 88px) + 360px);
            left: calc(50% + var(--phone-half-width) + var(--phone-copy-gap));
            text-align: left;
          }

          .phone-showcase {
            position: absolute;
            left: 50%;
            top: calc(clamp(48px, 8vh, 88px) + 286px);
            width: var(--phone-width);
            transform: translateX(-50%);
          }

          .phone-showcase-motion {
            position: relative;
            width: 100%;
          }

          .phone-device {
            position: relative;
            width: 100%;
            filter:
              drop-shadow(-10px 12px 12px rgba(0, 0, 0, 0.1))
              drop-shadow(-26px 42px 34px rgba(0, 0, 0, 0.22));
          }

          .phone-frame {
            position: relative;
            z-index: 2;
            display: block;
            width: 100%;
            height: auto;
            pointer-events: none;
          }

          .phone-screen {
            position: absolute;
            top: 4.5%;
            right: 7%;
            bottom: 4.5%;
            left: 7%;
            z-index: 3;
            overflow: hidden;
            border-radius: 28px;
            background: #ffffff;
          }

          /* ---------- 모바일 보내기 가짜 앱 UI ---------- */
          .mobile-send-ui {
            position: relative;
            --send-loop-duration: 14s;
            width: 100%;
            height: 100%;
            background: #fbfdff;
            overflow: hidden;
            border-radius: inherit;
            color: #111111;
            font-family: inherit;
          }

          .send-statusbar {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            width: 100%;
            height: auto;
            display: block;
            z-index: 3;
            pointer-events: none;
            user-select: none;
          }

          /* 앱 헤더 */
          .send-app-header {
            position: absolute;
            top: 9%;
            left: 8%;
            right: 8%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            z-index: 2;
          }

          .send-logo-mark {
            width: 22%;
            min-width: 36px;
            max-width: 56px;
            height: auto;
            display: block;
            flex-shrink: 0;
          }

          .send-header-actions {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .send-header-icon-wrap {
            position: relative;
            display: inline-flex;
          }

          .send-header-icon {
            width: 22px;
            height: 22px;
            display: block;
            object-fit: contain;
          }

          .send-header-dot {
            position: absolute;
            top: 0;
            right: 0;
            width: 5px;
            height: 5px;
            border-radius: 999px;
            background: #ff3b30;
          }

          /* 중앙 메인 액션 */
          .send-main-actions {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: clamp(20px, 8%, 44px);
            width: 100%;
            z-index: 1;
          }

          .send-action-button {
            position: relative;
            width: clamp(80px, 33%, 128px);
            aspect-ratio: 1;
            border: none;
            background: transparent;
            padding: 0;
            cursor: default;
            animation: sendActionHide var(--send-loop-duration) ease-in-out infinite;
          }

          .send-action-folder {
            animation: sendFolderSelect var(--send-loop-duration) ease-in-out infinite;
          }

          .send-action-button > img {
            width: 100%;
            height: 100%;
            display: block;
            object-fit: contain;
            user-select: none;
          }

          .send-action-badge {
            position: absolute;
            top: -10%;
            right: -8%;
            width: 36%;
            aspect-ratio: 1;
            border-radius: 9999px;
            background: #cfeaff;
            color: #000000;
            font-size: clamp(13px, 14px, 22px);
            font-weight: 900;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
            z-index: 2;
            pointer-events: none;
          }

          @keyframes sendSoftPulse {
            0%, 100% { transform: scale(1); }
            50%      { transform: scale(1.025); }
          }

          @keyframes sendActionHide {
            0%, 28% {
              opacity: 1;
              transform: scale(1);
            }
            36%, 94% {
              opacity: 0;
              transform: scale(0.94);
            }
            98%, 100% {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes sendFolderSelect {
            0%, 16% {
              opacity: 1;
              transform: scale(1);
            }
            22% {
              opacity: 1;
              transform: scale(1.1);
            }
            28% {
              opacity: 1;
              transform: scale(1);
            }
            36%, 94% {
              opacity: 0;
              transform: scale(0.94);
            }
            98%, 100% {
              opacity: 1;
              transform: scale(1);
            }
          }

          .send-flow-panel {
            position: absolute;
            top: 29%;
            left: 8%;
            right: 8%;
            z-index: 2;
            pointer-events: none;
          }

          .send-photo-picker {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            opacity: 0;
            transform: translateY(12px) scale(0.98);
            animation: sendPhotoPickerIn var(--send-loop-duration) ease-in-out infinite;
          }

          .send-photo-card {
            position: relative;
            aspect-ratio: 0.78;
            overflow: hidden;
            border-radius: 14px;
            background:
              linear-gradient(145deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0)),
              linear-gradient(135deg, #dff2ff 0%, #b6d9ff 48%, #f6d6de 100%);
            box-shadow: inset 0 0 0 2px #ffffff, 0 8px 18px rgba(15, 23, 42, 0.1);
          }

          .send-photo-card > img {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }

          .send-photo-card::after {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, rgba(0, 0, 0, 0.04), rgba(0, 0, 0, 0.14));
            pointer-events: none;
          }

          .send-photo-card-2 {
            background:
              linear-gradient(145deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0)),
              linear-gradient(135deg, #fff1c7 0%, #f7c7a7 48%, #b9d7ff 100%);
          }

          .send-photo-card-3 {
            background:
              linear-gradient(145deg, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0)),
              linear-gradient(135deg, #d9f8df 0%, #bdebd8 48%, #bed6ff 100%);
          }

          .send-photo-check {
            position: absolute;
            top: 7px;
            right: 7px;
            display: flex;
            width: 22px;
            height: 22px;
            align-items: center;
            justify-content: center;
            border-radius: 999px;
            background: #00006a;
            color: #ffffff;
            font-size: 12px;
            font-weight: 900;
            line-height: 1;
            opacity: 0;
            transform: scale(0.7);
            animation: sendPhotoCheckIn var(--send-loop-duration) ease-in-out infinite;
          }

          .send-message-preview {
            margin-top: 12px;
            padding: 12px 14px;
            border-radius: 16px;
            background: #ffffff;
            border: 1px solid #eef0f4;
            box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
            color: #2b3340;
            font-size: clamp(12px, 4vw, 15px);
            font-weight: 700;
            line-height: 1.2;
            opacity: 0;
            transform: translateY(10px);
            animation: sendMessageIn var(--send-loop-duration) ease-in-out infinite;
            white-space: nowrap;
            overflow: hidden;
          }

          .send-flow-button {
            display: flex;
            width: 100%;
            height: 44px;
            margin-top: 12px;
            align-items: center;
            justify-content: center;
            border: none;
            border-radius: 14px;
            background: #00006a;
            color: #ffffff;
            font-size: 15px;
            font-weight: 900;
            line-height: 1;
            opacity: 0;
            transform: translateY(10px);
            animation: sendButtonIn var(--send-loop-duration) ease-in-out infinite;
          }

          .send-complete-toast {
            position: absolute;
            top: 56%;
            left: 50%;
            display: flex;
            min-width: 132px;
            height: 44px;
            align-items: center;
            justify-content: center;
            border-radius: 999px;
            background: #111111;
            color: #ffffff;
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.16);
            font-size: 15px;
            font-weight: 900;
            opacity: 0;
            transform: translate(-50%, 12px) scale(0.96);
            animation: sendCompleteIn var(--send-loop-duration) ease-in-out infinite;
          }

          @keyframes sendPhotoPickerIn {
            0%, 34% {
              opacity: 0;
              transform: translateY(12px) scale(0.98);
            }
            40%, 72% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
            80%, 100% {
              opacity: 0;
              transform: translateY(-8px) scale(0.98);
            }
          }

          @keyframes sendPhotoCheckIn {
            0%, 42% {
              opacity: 0;
              transform: scale(0.7);
            }
            48%, 72% {
              opacity: 1;
              transform: scale(1);
            }
            80%, 100% {
              opacity: 0;
              transform: scale(0.8);
            }
          }

          @keyframes sendMessageIn {
            0%, 44% {
              opacity: 0;
              transform: translateY(10px);
            }
            50%, 72% {
              opacity: 1;
              transform: translateY(0);
            }
            80%, 100% {
              opacity: 0;
              transform: translateY(-8px);
            }
          }

          @keyframes sendButtonIn {
            0%, 56% {
              opacity: 0;
              transform: translateY(10px);
            }
            62%, 72% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
            75% {
              opacity: 1;
              transform: translateY(0) scale(0.97);
            }
            80%, 100% {
              opacity: 0;
              transform: translateY(-8px) scale(1);
            }
          }

          @keyframes sendCompleteIn {
            0%, 84% {
              opacity: 0;
              transform: translate(-50%, 12px) scale(0.96);
            }
            89%, 94% {
              opacity: 1;
              transform: translate(-50%, 0) scale(1);
            }
            98%, 100% {
              opacity: 0;
              transform: translate(-50%, -10px) scale(0.98);
            }
          }

          /* 하단 탭바 */
          .send-bottom-nav {
            position: absolute;
            left: 6%;
            right: 6%;
            bottom: 4%;
            height: 11%;
            min-height: 48px;
            max-height: 68px;
            border-radius: 20px;
            background: #ffffff;
            border: 1px solid #eef0f4;
            box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            align-items: center;
            z-index: 2;
          }

          .send-nav-item {
            display: flex;
            align-items: center;
            justify-content: center;
            border: none;
            background: transparent;
            padding: 0;
            cursor: default;
          }

          .send-nav-item img {
            width: 50%;
            max-width: 26px;
            min-width: 18px;
            height: auto;
            object-fit: contain;
            opacity: 0.65;
          }

          .send-nav-item.active img {
            opacity: 1;
          }

          /* ---------- (deprecated — 이전 phone-app 시안. 현재 미사용) ---------- */
          .phone-app {
            display: flex;
            height: 100%;
            flex-direction: column;
            gap: 14px;
            padding: 24px 18px;
            background: linear-gradient(180deg, #f7f8fb 0%, #ffffff 62%);
          }

          .phone-app-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: #111111;
            font-size: 13px;
            font-weight: 700;
          }

          .phone-app-bar span:last-child {
            color: #9f9f9f;
            font-size: 11px;
            font-weight: 600;
          }

          .phone-card-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            margin-top: 4px;
          }

          .phone-photo-card {
            position: relative;
            aspect-ratio: 1;
            overflow: hidden;
            border-radius: 14px;
            background: linear-gradient(135deg, #d9e8ff, #f4e3d7);
          }

          .phone-photo-card:nth-child(2) {
            background: linear-gradient(135deg, #dff2e7, #d9e8ff);
          }

          .phone-photo-card:nth-child(3) {
            background: linear-gradient(135deg, #f4e3d7, #ece8ff);
          }

          .phone-check {
            position: absolute;
            top: 7px;
            right: 7px;
            width: 18px;
            height: 18px;
            border-radius: 999px;
            background: #05006b;
          }

          .phone-check::after {
            position: absolute;
            top: 4px;
            left: 6px;
            width: 5px;
            height: 9px;
            border: solid #ffffff;
            border-width: 0 2px 2px 0;
            content: "";
            transform: rotate(45deg);
          }

          .phone-message {
            margin-top: 8px;
            border: 1px solid #eceef3;
            border-radius: 16px;
            background: #ffffff;
            padding: 14px;
            color: #2b3340;
            font-size: 13px;
            font-weight: 600;
          }

          .phone-send-button {
            height: 40px;
            border-radius: 14px;
            background: #05006b;
            color: #ffffff;
            font-size: 13px;
            font-weight: 700;
          }

          .phone-complete {
            margin-top: auto;
            border-radius: 16px;
            background: #f0f5ff;
            padding: 13px;
            color: #05006b;
            text-align: center;
            font-size: 13px;
            font-weight: 800;
          }

          .phone-showcase-caption {
            margin: 80px auto 0;
            color: #2b3340;
            text-align: center;
            font-size: clamp(20px, 1.6vw, 26px);
            font-weight: 700;
            line-height: 1.35;
            letter-spacing: -0.03em;
          }

          @media (max-width: 1024px) and (min-width: 769px) {
            .intro-mobile-inner {
              --phone-width: clamp(238px, 25.5vw, 289px);
              --phone-half-width: clamp(119px, 12.75vw, 144.5px);
              --phone-copy-gap: clamp(28px, 3.5vw, 48px);
            }

            .phone-showcase {
              top: calc(clamp(48px, 8vh, 88px) + 286px);
              width: var(--phone-width);
            }

            .intro-mobile-copy {
              font-size: clamp(18px, 1.8vw, 22px);
            }

            .intro-mobile-copy-left {
              top: calc(clamp(48px, 8vh, 88px) + 420px);
              right: calc(50% + var(--phone-half-width) + var(--phone-copy-gap));
            }

            .intro-mobile-copy-right {
              top: calc(clamp(48px, 8vh, 88px) + 350px);
              left: calc(50% + var(--phone-half-width) + var(--phone-copy-gap));
            }
          }

          @media (max-width: 768px) {
            .intro-mobile-section {
              min-height: auto;
              overflow: visible;
            }

            .intro-mobile-inner {
              display: flex;
              width: min(calc(100% - 32px), 420px);
              min-height: auto;
              flex-direction: column;
              align-items: center;
              padding: 80px 0;
              text-align: center;
            }

            .intro-mobile-title,
            .intro-mobile-copy,
            .phone-showcase {
              position: static;
              transform: none;
            }

            .intro-mobile-eyebrow {
              margin-bottom: 32px;
            }

            .intro-mobile-heading {
              font-size: clamp(40px, 11vw, 52px);
            }

            .intro-mobile-copy {
              margin-top: 32px;
              font-size: 20px;
              text-align: center;
            }

            .phone-showcase {
              width: min(300px, 80vw);
              margin-top: 48px;
            }

            .phone-showcase-caption {
              margin-top: 48px;
              font-size: 20px;
            }

            .intro-mobile-copy-right {
              margin-top: 40px;
            }
          }
        `}</style>
      </section>

      {/* Intro 2 — TV · 받아보기 */}
      <section id="intro-tv" className="intro-tv-section">
        <div className="intro-tv-inner">
          <motion.div
            className="intro-tv-title"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.45, once: false }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <p className="intro-tv-eyebrow">TV · 받아보기</p>
            <h2 className="intro-tv-heading">누르고, 확인하기</h2>
          </motion.div>

          <div className="tv-showcase">
            <motion.div
              className="tv-showcase-motion"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.01, once: false }}
              onViewportEnter={() => setTvCycleKey((key) => key + 1)}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            >
              <div className="tv-device">
                <img className="tv-frame" src="/TV.png" alt="" aria-hidden />
                <div className="tv-screen">
                  <div key={tvCycleKey} className="tv-app">
                    <video
                      className="tv-news-bg"
                      autoPlay
                      muted
                      loop
                      playsInline
                      poster="/TV_news.png"
                      aria-hidden
                    >
                      <source src="/TV_news.mp4" type="video/mp4" />
                    </video>

                    <div className="tv-channel-label">
                      <span>LIVE</span>
                      <strong>뉴스</strong>
                    </div>

                    <div className="tv-notification">
                      <span className="tv-notification-dot" />
                      <div>
                        <strong>새 알림</strong>
                        <span>가족이 사진을 보냈어요</span>
                      </div>
                      <button type="button" className="tv-confirm-button">
                        확인
                      </button>
                    </div>

                    <div className="tv-received-panel">
                      <div className="tv-panel-copy">
                        <strong>가족이 보낸 사진</strong>
                        <span>엄마, 오늘 산책 다녀왔어요</span>
                      </div>
                      <div className="tv-photo-grid">
                        <div className="tv-photo-card">
                          <img src="/send-photo-1.png" alt="" aria-hidden />
                        </div>
                        <div className="tv-photo-card">
                          <img src="/send-photo-2.png" alt="" aria-hidden />
                        </div>
                        <div className="tv-photo-card">
                          <img src="/send-photo-3.png" alt="" aria-hidden />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="intro-tv-caption">
                보던 채널 그대로
                <br />
                이제 보고 싶을 때 버튼 하나만 누르세요
              </p>
            </motion.div>
          </div>
        </div>

        <style jsx global>{`
          .intro-tv-section {
            position: relative;
            box-sizing: border-box;
            width: 100%;
            min-height: max(calc(100svh - 68px + 620px), 1280px);
            overflow: hidden;
            background: #ffffff;
          }

          .intro-tv-inner {
            position: relative;
            --tv-width: clamp(520px, 49vw, 650px);
            --tv-half-width: clamp(260px, 24.5vw, 325px);
            --tv-copy-gap: clamp(44px, 5vw, 72px);
            width: min(1120px, calc(100% - 64px));
            min-height: max(calc(100svh - 68px + 620px), 1280px);
            margin: 0 auto;
            padding: 0 48px;
          }

          .intro-tv-title {
            position: absolute;
            top: clamp(48px, 8vh, 88px);
            right: 48px;
            text-align: right;
          }

          .intro-tv-eyebrow {
            margin: 0 0 48px;
            color: #00006a;
            font-size: 24px;
            font-weight: 800;
          }

          .intro-tv-heading {
            margin: 0;
            color: #111111;
            font-size: 64px;
            font-weight: 700;
            line-height: 1.15;
            letter-spacing: -0.04em;
          }

          .tv-showcase {
            position: absolute;
            left: 50%;
            top: calc(clamp(48px, 8vh, 88px) + 286px);
            width: var(--tv-width);
            transform: translateX(-50%);
          }

          .tv-showcase-motion {
            position: relative;
            width: 100%;
          }

          .tv-device {
            position: relative;
            width: 100%;
          }

          .tv-frame {
            position: relative;
            z-index: 2;
            display: block;
            width: 100%;
            height: auto;
            pointer-events: none;
          }

          .tv-screen {
            position: absolute;
            top: 5.4%;
            right: 3.8%;
            bottom: 15.5%;
            left: 3.8%;
            z-index: 3;
            overflow: hidden;
            border-radius: 10px;
            background: #ffffff;
          }

          .tv-app {
            position: relative;
            height: 100%;
            overflow: hidden;
            background: #dff2ff;
            --tv-loop-duration: 12s;
          }

          .tv-news-bg {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            animation: tvNewsDim var(--tv-loop-duration) ease-in-out infinite;
          }

          .tv-channel-label {
            position: absolute;
            top: 16px;
            left: 18px;
            display: flex;
            align-items: center;
            gap: 9px;
            color: #ffffff;
            font-size: 13px;
            text-shadow: 0 1px 10px rgba(0, 0, 0, 0.28);
          }

          .tv-channel-label span {
            border-radius: 999px;
            background: #ef4444;
            padding: 4px 8px;
            font-size: 10px;
            font-weight: 800;
            line-height: 1;
          }

          .tv-channel-label strong {
            font-weight: 800;
          }

          .tv-notification {
            position: absolute;
            top: 16px;
            right: 18px;
            display: flex;
            align-items: center;
            gap: 10px;
            min-width: 232px;
            border: 1px solid rgba(255, 255, 255, 0.44);
            border-radius: 16px;
            background: rgba(255, 255, 255, 0.9);
            padding: 11px 13px;
            color: #111111;
            backdrop-filter: blur(10px);
            opacity: 0;
            transform: translateX(18px) scale(0.96);
            animation: tvNotificationFlow var(--tv-loop-duration) ease-in-out infinite;
          }

          .tv-notification-dot {
            width: 10px;
            height: 10px;
            border-radius: 999px;
            background: #05006b;
          }

          .tv-notification strong,
          .tv-notification span {
            display: block;
          }

          .tv-notification strong {
            font-size: 12px;
            font-weight: 800;
          }

          .tv-notification span {
            margin-top: 2px;
            color: #717171;
            font-size: 11px;
            font-weight: 700;
          }

          .tv-received-panel {
            position: absolute;
            inset: 0;
            display: grid;
            grid-template-rows: auto 1fr;
            gap: 16px;
            background:
              radial-gradient(circle at 18% 18%, rgba(255, 255, 255, 0.9) 0 18%, rgba(255, 255, 255, 0) 38%),
              radial-gradient(circle at 82% 12%, rgba(255, 255, 255, 0.7) 0 15%, rgba(255, 255, 255, 0) 34%),
              linear-gradient(180deg, #eaf7ff 0%, #cfeaff 100%);
            padding: 32px 36px 28px;
            opacity: 0;
            transform: translateY(18px) scale(0.98);
            animation: tvReceivedFlow var(--tv-loop-duration) ease-in-out infinite;
          }

          .tv-panel-copy strong,
          .tv-panel-copy span {
            display: block;
          }

          .tv-panel-copy strong {
            color: #111111;
            font-size: 20px;
            font-weight: 800;
          }

          .tv-panel-copy span {
            margin-top: 7px;
            color: #2b3340;
            font-size: 13px;
            font-weight: 700;
          }

          .tv-photo-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 14px;
            align-items: center;
          }

          .tv-photo-card {
            aspect-ratio: 4 / 3;
            overflow: hidden;
            border: 4px solid #ffffff;
            border-radius: 14px;
            background: #ffffff;
            box-shadow: 0 18px 32px rgba(5, 0, 107, 0.16);
            opacity: 0;
            transform: translateY(24px) scale(0.94);
            animation: tvPhotoIn var(--tv-loop-duration) ease-in-out infinite;
          }

          .tv-photo-card:nth-child(2) {
            animation-delay: 0.12s;
          }

          .tv-photo-card:nth-child(3) {
            animation-delay: 0.24s;
          }

          .tv-photo-card img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }

          .tv-confirm-button {
            margin-left: auto;
            height: 32px;
            padding: 0 18px;
            border: none;
            border-radius: 10px;
            background: #05006b;
            color: #ffffff;
            font-size: 12px;
            font-weight: 700;
            animation: tvConfirmPress var(--tv-loop-duration) ease-in-out infinite;
          }

          @keyframes tvNewsDim {
            0%, 54%, 96%, 100% {
              filter: brightness(1);
              transform: scale(1);
            }
            61%, 90% {
              filter: brightness(0.82) saturate(0.92);
              transform: scale(1.01);
            }
          }

          @keyframes tvNotificationFlow {
            0%, 18% {
              opacity: 0;
              transform: translateX(18px) scale(0.96);
            }
            25%, 48% {
              opacity: 1;
              transform: translateX(0) scale(1);
            }
            56%, 100% {
              opacity: 0;
              transform: translateX(0) scale(0.96);
            }
          }

          @keyframes tvConfirmPress {
            0%, 40% {
              transform: scale(1);
            }
            47% {
              transform: scale(0.94);
            }
            52%, 100% {
              transform: scale(1);
            }
          }

          @keyframes tvReceivedFlow {
            0%, 56% {
              opacity: 0;
              transform: translateY(18px) scale(0.98);
            }
            64%, 88% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
            96%, 100% {
              opacity: 0;
              transform: translateY(-12px) scale(0.98);
            }
          }

          @keyframes tvPhotoIn {
            0%, 62% {
              opacity: 0;
              transform: translateY(24px) scale(0.94);
            }
            70%, 88% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
            96%, 100% {
              opacity: 0;
              transform: translateY(-8px) scale(0.98);
            }
          }

          .intro-tv-caption {
            margin: 80px auto 0;
            color: #2b3340;
            text-align: center;
            font-size: clamp(22px, 1.8vw, 30px);
            font-weight: 700;
            line-height: 1.35;
            letter-spacing: -0.03em;
          }

          @media (max-width: 1024px) and (min-width: 769px) {
            .intro-tv-inner {
              --tv-width: clamp(460px, 58vw, 560px);
              --tv-half-width: clamp(230px, 29vw, 280px);
              --tv-copy-gap: clamp(28px, 3.5vw, 48px);
            }

            .tv-showcase {
              width: var(--tv-width);
            }

            .intro-tv-heading {
              font-size: 56px;
            }

            .intro-tv-caption {
              font-size: clamp(18px, 1.8vw, 22px);
            }
          }

          @media (max-width: 768px) {
            .intro-tv-section {
              min-height: auto;
              overflow: visible;
            }

            .intro-tv-inner {
              display: flex;
              width: min(calc(100% - 32px), 420px);
              min-height: auto;
              flex-direction: column;
              align-items: center;
              padding: 80px 0;
              text-align: center;
            }

            .intro-tv-title,
            .tv-showcase {
              position: static;
              transform: none;
            }

            .intro-tv-eyebrow {
              margin-bottom: 24px;
            }

            .intro-tv-heading {
              font-size: clamp(40px, 11vw, 52px);
            }

            .tv-showcase {
              margin-top: 48px;
              width: min(92vw, 560px);
            }

            .intro-tv-caption {
              margin-top: 40px;
              font-size: 20px;
            }
          }
        `}</style>
      </section>

      <RecordPointSection />

      {/* Final CTA */}
      <section className="footer-cta">
        <div className="footer-cta-inner">
          <h2 className="footer-cta-title">무료로 신청하기</h2>
          <p className="footer-cta-subtitle">
            부모님께 일상을 전하는 가장 쉬운 방법
          </p>

          <div className="footer-cta-buttons">
            <Link
              href="/apply"
              className="footer-cta-primary"
              onClick={() => track("cta_clicked", { cta_location: "footer_cta" })}
            >
              무료로 신청하기
            </Link>
            <a className="footer-cta-secondary" href="#contact">
              문의하기
            </a>
          </div>

          <img className="footer-cta-logo" src="/LOGO_BIG.png" alt="이음" />
        </div>
      </section>

      {/* Black Footer */}
      <footer className="footer-main">
        <div className="footer-main-inner">
          <div className="footer-info">
            <img className="footer-logo" src="/LOGO_footer.png" alt="" aria-hidden />
            <p className="footer-brand-name">이음</p>
            <p className="footer-description">
              가족의 순간을 부모님께 더 쉽게 전하는 서비스
            </p>
            <a className="footer-contact" href="#contact">
              문의하기
            </a>
            <p className="footer-policy">
              <Link href="/legal/privacy">개인정보처리방침</Link>
              <span aria-hidden>|</span>
              <Link href="/legal/terms">이용약관</Link>
            </p>
            <p className="footer-copyright">© 2026 ieum. All rights reserved.</p>
          </div>

          <div className="footer-socials">
            <a className="footer-social" href="#" aria-label="Instagram">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a className="footer-social" href="#" aria-label="YouTube">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.582 6.186a2.506 2.506 0 0 0-1.768-1.768C18.254 4 12 4 12 4s-6.254 0-7.814.418A2.506 2.506 0 0 0 2.418 6.186C2 7.746 2 12 2 12s0 4.254.418 5.814a2.506 2.506 0 0 0 1.768 1.768C5.746 20 12 20 12 20s6.254 0 7.814-.418a2.506 2.506 0 0 0 1.768-1.768C22 16.254 22 12 22 12s0-4.254-.418-5.814zM10 15.464V8.536L16 12 10 15.464z" />
              </svg>
            </a>
            <a className="footer-social" href="#" aria-label="Blog">
              <span className="footer-social-letter">B</span>
            </a>
          </div>
        </div>

        <style jsx global>{`
        /* ---------- Final CTA ---------- */
        .footer-cta {
          position: relative;
          overflow: hidden;
          width: 100%;
          padding: clamp(96px, 13vh, 150px) 0 clamp(80px, 10vh, 120px);
          background: #ffffff;
          text-align: center;
        }

        .footer-cta-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: min(1120px, calc(100% - 64px));
          margin: 0 auto;
        }

        .footer-cta-title {
          margin: 0;
          color: #050505;
          font-size: clamp(48px, 4.6vw, 72px);
          font-weight: 800;
          line-height: 1.2;
          letter-spacing: -0.045em;
          word-break: keep-all;
        }

        .footer-cta-subtitle {
          margin: 20px 0 0;
          color: #a0a0a0;
          font-size: clamp(20px, 1.6vw, 26px);
          font-weight: 700;
          line-height: 1.4;
          letter-spacing: -0.03em;
          word-break: keep-all;
        }

        .footer-cta-buttons {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin-top: clamp(72px, 9vh, 96px);
        }

        .footer-cta-primary,
        .footer-cta-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 56px;
          padding: 0 32px;
          border: none;
          border-radius: 10px;
          font-size: 20px;
          font-weight: 800;
          white-space: nowrap;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .footer-cta-primary {
          background: #00006a;
          color: #ffffff;
        }

        .footer-cta-primary:hover {
          opacity: 0.92;
          transform: translateY(-1px);
        }

        .footer-cta-secondary {
          background: #dadada;
          color: #111111;
        }

        .footer-cta-secondary:hover {
          background: #cccccc;
          transform: translateY(-1px);
        }

        .footer-cta-logo {
          display: block;
          margin: clamp(72px, 9vh, 96px) auto 0;
          width: clamp(140px, 13vw, 220px);
          height: auto;
        }

        /* ---------- Black Footer ---------- */
        .footer-main {
          width: 100%;
          padding: 52px 0 44px;
          background: #000000;
          color: #ffffff;
        }

        .footer-main-inner {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 40px;
          width: min(1120px, calc(100% - 64px));
          margin: 0 auto;
        }

        .footer-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .footer-logo {
          display: block;
          width: 100px;
          height: auto;
          margin: 0 0 32px;
        }

        .footer-brand-name {
          margin: 0 0 10px;
          font-size: 16px;
          font-weight: 800;
        }

        .footer-description {
          margin: 0 0 10px;
          font-size: 15px;
          font-weight: 700;
          line-height: 1.6;
        }

        .footer-contact {
          margin: 0 0 10px;
          color: #ffffff;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          transition: opacity 0.2s ease;
        }

        .footer-contact:hover {
          opacity: 0.75;
        }

        .footer-policy {
          display: flex;
          align-items: center;
          gap: 6px;
          margin: 0 0 16px;
          font-size: 15px;
          font-weight: 800;
        }

        .footer-policy a {
          color: #ffffff;
          text-decoration: none;
          transition: opacity 0.2s ease;
        }

        .footer-policy a:hover {
          opacity: 0.75;
        }

        .footer-copyright {
          margin: 0;
          font-size: 15px;
          font-weight: 800;
          opacity: 0.85;
        }

        /* ---------- SNS ---------- */
        .footer-socials {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .footer-social {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 9999px;
          background: #00006a;
          color: #ffffff;
          font-size: 22px;
          font-weight: 900;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .footer-social:hover {
          opacity: 0.9;
          transform: translateY(-2px);
        }

        .footer-social-letter {
          line-height: 1;
        }

        /* ---------- Responsive ---------- */
        @media (max-width: 768px) {
          .footer-cta {
            padding: 80px 0 72px;
          }

          .footer-cta-inner {
            width: min(calc(100% - 32px), 420px);
          }

          .footer-cta-title {
            font-size: 40px;
          }

          .footer-cta-subtitle {
            font-size: 18px;
          }

          .footer-cta-buttons {
            flex-direction: column;
            gap: 12px;
            width: 100%;
            margin-top: 56px;
          }

          .footer-cta-primary,
          .footer-cta-secondary {
            width: 100%;
            max-width: 280px;
            height: 50px;
            font-size: 17px;
          }

          .footer-cta-logo {
            margin-top: 56px;
          }

          .footer-main {
            padding: 44px 0 36px;
          }

          .footer-main-inner {
            flex-direction: column;
            align-items: flex-start;
            gap: 36px;
            width: min(calc(100% - 32px), 420px);
          }

          .footer-socials {
            align-self: flex-start;
          }
        }
      `}</style>
      </footer>
    </main>
  );
}
