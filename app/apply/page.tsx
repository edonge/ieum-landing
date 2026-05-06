"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { track, getDistinctId } from "@/lib/analytics";
import { getStoredUtm } from "@/lib/utm";

const purposes = [
  { id: "send_photos", label: "부모님께 사진을 자주 보내고 싶어요" },
  { id: "tv_easy", label: "부모님이 TV로 쉽게 보셨으면 해요" },
  { id: "family_record", label: "가족 기록을 함께 남기고 싶어요" },
  { id: "curious", label: "이음 사전 체험이 궁금해요" },
];

function looksLikeContact(value: string) {
  if (!value) return false;
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const digitCount = value.replace(/\D/g, "").length;
  const isPhone = digitCount >= 9 && digitCount <= 15;
  return isEmail || isPhone;
}

type FormErrors = {
  name?: string;
  contact?: string;
  purpose?: string;
  consent?: string;
  submit?: string;
};

export default function PreRegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [purpose, setPurpose] = useState<string>("");
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    track("apply_viewed");
  }, []);

  // ESC로 모달 닫기
  useEffect(() => {
    if (!privacyModalOpen) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPrivacyModalOpen(false);
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [privacyModalOpen]);

  const reset = () => {
    setName("");
    setContact("");
    setPurpose("");
    setPrivacyConsent(false);
    setErrors({});
    setSubmitted(false);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: FormErrors = {};
    if (!name.trim()) next.name = "성함 또는 닉네임을 입력해주세요.";
    if (!contact.trim()) {
      next.contact = "연락처를 입력해주세요.";
    } else if (!looksLikeContact(contact.trim())) {
      next.contact = "휴대폰 번호 또는 이메일 형식으로 입력해주세요.";
    }
    if (!purpose) next.purpose = "이용 목적을 선택해주세요.";
    if (!privacyConsent) next.consent = "개인정보 수집·이용 동의가 필요합니다.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    const now = new Date().toISOString();
    const utm = getStoredUtm();
    const referrer =
      typeof document !== "undefined" ? document.referrer || undefined : undefined;
    const posthog_id = getDistinctId();

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          contact: contact.trim(),
          purpose,
          privacy_consent: true,
          privacy_consented_at: now,
          posthog_id,
          ...utm,
          referrer,
        }),
      });
      if (!res.ok) {
        throw new Error("submit_failed");
      }
      track("waitlist_submitted", { purpose });
      setSubmitted(true);
    } catch {
      setErrors({
        submit: "신청 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="apply-page">
      <div className="apply-bg" aria-hidden>
        <span className="apply-bg-circle apply-bg-circle-1" />
        <span className="apply-bg-circle apply-bg-circle-2" />
      </div>

      <div className="apply-inner">
        {/* 좌측 안내 */}
        <motion.div
          className="apply-intro"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <p className="apply-eyebrow">무료 사전 체험</p>
          <h1 className="apply-title">{"이음을 먼저\n경험해보세요"}</h1>
          <p className="apply-subtitle">
            출시 전, 일부 가족을 대상으로
            <br />
            무료 사전 체험을 준비하고 있어요.
            <br />
            신청해주시면 체험 가능 일정과 안내를
            <br />
            가장 먼저 보내드릴게요.
          </p>
          <div className="apply-notice">
            사전 체험 기간에는 무료로 이용할 수 있어요.
            <br />
            정식 출시 후에는 월 구독형으로 제공될 수 있습니다.
          </div>
        </motion.div>

        {/* 우측 신청 폼 카드 */}
        <motion.div
          className="apply-card"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.12 }}
        >
          {!submitted ? (
            <>
              <h2 className="apply-card-title">무료 사전 체험 신청</h2>
              <p className="apply-card-desc">
                간단한 정보만 남겨주시면
                <br />
                이음이 준비되는 대로 안내드릴게요.
              </p>

              <form onSubmit={onSubmit} className="apply-form" noValidate>
                <div className="apply-field">
                  <label htmlFor="apply-name">성함 또는 닉네임</label>
                  <input
                    id="apply-name"
                    type="text"
                    placeholder="예: 김이음"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                  />
                  {errors.name && <p className="apply-error">{errors.name}</p>}
                </div>

                <div className="apply-field">
                  <label htmlFor="apply-contact">연락처</label>
                  <p className="apply-helper">
                    휴대폰 번호 또는 이메일을 입력해주세요.
                  </p>
                  <input
                    id="apply-contact"
                    type="text"
                    placeholder="예: 010-1234-5678 또는 ieum@example.com"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                  />
                  {errors.contact && (
                    <p className="apply-error">{errors.contact}</p>
                  )}
                </div>

                <div className="apply-field">
                  <label>어떤 상황에 가장 가까우신가요?</label>
                  <div className="apply-purpose-grid">
                    {purposes.map((p) => {
                      const active = purpose === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          className={`apply-purpose-card${active ? " active" : ""}`}
                          onClick={() => {
                            setPurpose(p.id);
                            setErrors((prev) => ({ ...prev, purpose: undefined }));
                          }}
                          aria-pressed={active}
                        >
                          {p.label}
                        </button>
                      );
                    })}
                  </div>
                  {errors.purpose && (
                    <p className="apply-error">{errors.purpose}</p>
                  )}
                </div>

                {/* 개인정보 수집·이용 동의 */}
                <div className="apply-consent">
                  <label className="apply-consent-row">
                    <input
                      type="checkbox"
                      checked={privacyConsent}
                      onChange={(e) => {
                        setPrivacyConsent(e.target.checked);
                        if (e.target.checked) {
                          setErrors((prev) => ({ ...prev, consent: undefined }));
                        }
                      }}
                    />
                    <span>
                      개인정보 수집·이용에 동의합니다.{" "}
                      <span className="apply-required">(필수)</span>{" "}
                      <button
                        type="button"
                        className="apply-consent-detail"
                        onClick={() => setPrivacyModalOpen(true)}
                      >
                        자세히 보기
                      </button>
                    </span>
                  </label>
                  {errors.consent && (
                    <p className="apply-error apply-consent-error">{errors.consent}</p>
                  )}
                  <p className="apply-consent-helper">
                    입력하신 정보는 이음 사전 체험 및 출시 안내 목적으로만
                    사용됩니다.
                  </p>
                </div>

                <button type="submit" className="apply-submit" disabled={submitting}>
                  {submitting ? "신청 중..." : "무료 사전 체험 신청하기"}
                </button>
                {errors.submit && (
                  <p className="apply-error apply-submit-error">{errors.submit}</p>
                )}
              </form>
            </>
          ) : (
            <div className="apply-success">
              <div className="apply-success-icon" aria-hidden>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#00006A"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="4 12 10 18 20 6" />
                </svg>
              </div>
              <h2 className="apply-success-title">사전 신청이 완료되었어요</h2>
              <p className="apply-success-desc">
                이음이 준비되는 대로
                <br />
                남겨주신 연락처로 가장 먼저 안내드릴게요.
              </p>
              <button
                type="button"
                className="apply-submit"
                onClick={() => router.push("/")}
              >
                홈으로 돌아가기
              </button>
              <button
                type="button"
                className="apply-success-link"
                onClick={reset}
              >
                다시 신청하기
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* 개인정보 동의 상세 모달 */}
      {privacyModalOpen && (
        <div
          className="apply-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="apply-modal-title"
          onClick={() => setPrivacyModalOpen(false)}
        >
          <div className="apply-modal" onClick={(e) => e.stopPropagation()}>
            <h3 id="apply-modal-title" className="apply-modal-title">
              개인정보 수집·이용 동의
            </h3>
            <div className="apply-modal-body">
              <p>
                이음은 무료 사전 체험 신청 및 출시 안내를 위해 아래와 같이
                개인정보를 수집·이용합니다.
              </p>

              <h4>1. 수집·이용 목적</h4>
              <ul>
                <li>이음 무료 사전 체험 신청 접수</li>
                <li>서비스 출시 및 사전 체험 일정 안내</li>
                <li>신청자 확인 및 문의 응대</li>
              </ul>

              <h4>2. 수집 항목</h4>
              <ul>
                <li>성함 또는 닉네임</li>
                <li>연락처(휴대폰 번호 또는 이메일)</li>
                <li>이용 목적 선택 항목</li>
                <li>남기고 싶은 말(선택 입력 시)</li>
              </ul>

              <h4>3. 보유 및 이용 기간</h4>
              <ul>
                <li>사전 체험 및 출시 안내 목적 달성 시까지</li>
                <li>
                  단, 신청자가 삭제 또는 동의 철회를 요청하는 경우 지체 없이
                  파기합니다.
                </li>
              </ul>

              <h4>4. 동의 거부 권리 및 불이익</h4>
              <ul>
                <li>개인정보 수집·이용 동의를 거부할 권리가 있습니다.</li>
                <li>
                  다만 동의하지 않을 경우 무료 사전 체험 신청 및 출시 안내를
                  받을 수 없습니다.
                </li>
              </ul>
            </div>
            <button
              type="button"
              className="apply-modal-close"
              onClick={() => setPrivacyModalOpen(false)}
            >
              확인
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        .apply-page {
          position: relative;
          width: 100%;
          min-height: calc(100svh - 68px);
          background: #ffffff;
          overflow: hidden;
        }

        .apply-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        .apply-bg-circle {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          background: rgba(191, 222, 255, 0.42);
        }

        .apply-bg-circle-1 {
          top: -10%;
          left: -8%;
          width: 520px;
          height: 520px;
          opacity: 0.55;
          animation: applyBgFloat 14s ease-in-out infinite;
        }

        .apply-bg-circle-2 {
          right: -10%;
          bottom: -16%;
          width: 460px;
          height: 460px;
          opacity: 0.45;
          animation: applyBgFloat 16s ease-in-out infinite reverse;
        }

        @keyframes applyBgFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-10px); }
        }

        .apply-inner {
          position: relative;
          z-index: 1;
          width: min(1120px, calc(100% - 64px));
          margin: 0 auto;
          padding: clamp(80px, 10vh, 120px) 0 clamp(100px, 12vh, 140px);
          display: grid;
          grid-template-columns: 1fr 460px;
          align-items: center;
          column-gap: clamp(72px, 8vw, 120px);
        }

        /* ---------- 좌측 안내 ---------- */
        .apply-eyebrow {
          margin: 0 0 28px;
          color: #00006a;
          font-size: 22px;
          font-weight: 800;
        }

        .apply-title {
          margin: 0;
          color: #050505;
          font-size: clamp(52px, 4.8vw, 72px);
          font-weight: 800;
          line-height: 1.12;
          letter-spacing: -0.045em;
          white-space: pre-line;
          word-break: keep-all;
        }

        .apply-subtitle {
          margin: 32px 0 0;
          color: #526692;
          font-size: clamp(20px, 1.55vw, 25px);
          font-weight: 700;
          line-height: 1.45;
          letter-spacing: -0.03em;
          word-break: keep-all;
        }

        .apply-notice {
          margin-top: 40px;
          padding: 20px 22px;
          border: 1px solid rgba(0, 0, 106, 0.08);
          border-radius: 18px;
          background: #f5f8ff;
          color: #526692;
          font-size: 16px;
          font-weight: 700;
          line-height: 1.45;
          word-break: keep-all;
        }

        /* ---------- 폼 카드 ---------- */
        .apply-card {
          padding: 42px;
          border: 1px solid rgba(230, 235, 245, 0.95);
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.96);
          box-shadow: 0 20px 56px rgba(15, 23, 42, 0.1);
        }

        .apply-card-title {
          margin: 0;
          color: #111111;
          font-size: 30px;
          font-weight: 800;
          line-height: 1.25;
          letter-spacing: -0.03em;
        }

        .apply-card-desc {
          margin: 12px 0 0;
          color: #8a8a8a;
          font-size: 16px;
          font-weight: 700;
          line-height: 1.5;
          word-break: keep-all;
        }

        .apply-form {
          margin-top: 32px;
        }

        .apply-field {
          margin-bottom: 24px;
        }

        .apply-field > label {
          display: block;
          margin-bottom: 10px;
          color: #111111;
          font-size: 15px;
          font-weight: 800;
        }

        .apply-helper {
          margin: -4px 0 10px;
          color: #8a8a8a;
          font-size: 13px;
          font-weight: 700;
        }

        .apply-field input,
        .apply-field textarea {
          width: 100%;
          height: 54px;
          padding: 0 16px;
          border: 1px solid #e5eaf0;
          border-radius: 14px;
          background: #ffffff;
          color: #111111;
          font-size: 16px;
          font-weight: 600;
          font-family: inherit;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .apply-field input::placeholder,
        .apply-field textarea::placeholder {
          color: #b0b8c1;
        }

        .apply-field input:focus,
        .apply-field textarea:focus {
          border-color: #00006a;
          box-shadow: 0 0 0 3px rgba(0, 0, 106, 0.08);
        }

        .apply-error {
          margin: 8px 0 0;
          color: #e5484d;
          font-size: 13px;
          font-weight: 700;
        }

        /* 이용 목적 카드 */
        .apply-purpose-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .apply-purpose-card {
          padding: 16px;
          border: 1px solid #e5eaf0;
          border-radius: 14px;
          background: #ffffff;
          color: #111111;
          font-size: 15px;
          font-weight: 700;
          line-height: 1.4;
          letter-spacing: -0.02em;
          font-family: inherit;
          text-align: left;
          cursor: pointer;
          word-break: keep-all;
          transition: all 0.18s ease;
        }

        .apply-purpose-card:hover {
          border-color: rgba(0, 0, 106, 0.4);
        }

        .apply-purpose-card.active {
          border-color: #00006a;
          background: #f5f8ff;
          box-shadow: 0 0 0 3px rgba(0, 0, 106, 0.06);
        }

        /* 동의 체크박스 */
        .apply-consent {
          margin-top: 24px;
          margin-bottom: 24px;
        }

        .apply-consent-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          cursor: pointer;
        }

        .apply-consent-row input[type="checkbox"] {
          flex-shrink: 0;
          width: 18px;
          height: 18px;
          margin: 1px 0 0;
          accent-color: #00006a;
          cursor: pointer;
        }

        .apply-consent-row > span {
          color: #111111;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.45;
        }

        .apply-required {
          color: #00006a;
          font-weight: 800;
        }

        .apply-consent-detail {
          margin-left: 4px;
          padding: 0;
          border: none;
          background: transparent;
          color: #00006a;
          font-size: 14px;
          font-weight: 800;
          font-family: inherit;
          text-decoration: underline;
          cursor: pointer;
        }

        .apply-consent-detail:hover {
          opacity: 0.85;
        }

        .apply-consent-error {
          margin: 10px 0 0;
        }

        .apply-submit-error {
          margin-top: 12px;
          text-align: center;
        }

        .apply-consent-helper {
          margin: 8px 0 0;
          color: #9a9a9a;
          font-size: 13px;
          font-weight: 600;
          line-height: 1.45;
        }

        /* 제출 버튼 */
        .apply-submit {
          width: 100%;
          height: 58px;
          margin-top: 8px;
          border: none;
          border-radius: 14px;
          background: #00006a;
          color: #ffffff;
          font-size: 18px;
          font-weight: 800;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .apply-submit:hover {
          opacity: 0.94;
          transform: translateY(-1px);
        }

        .apply-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
        }

        /* ---------- 신청 완료 ---------- */
        .apply-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8px 0 4px;
          text-align: center;
        }

        .apply-success-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          margin-bottom: 24px;
          border-radius: 9999px;
          background: #f5f8ff;
        }

        .apply-success-title {
          margin: 0;
          color: #111111;
          font-size: 30px;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .apply-success-desc {
          margin: 14px 0 32px;
          color: #526692;
          font-size: 18px;
          font-weight: 700;
          line-height: 1.5;
          word-break: keep-all;
        }

        .apply-success-link {
          margin-top: 14px;
          padding: 0;
          border: none;
          background: transparent;
          color: #526692;
          font-size: 14px;
          font-weight: 700;
          font-family: inherit;
          text-decoration: underline;
          cursor: pointer;
        }

        /* ---------- 개인정보 동의 모달 ---------- */
        .apply-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          background: rgba(15, 23, 42, 0.45);
          animation: applyModalFade 0.2s ease-out;
        }

        @keyframes applyModalFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .apply-modal {
          width: 100%;
          max-width: 520px;
          max-height: 85vh;
          overflow-y: auto;
          padding: 32px;
          border-radius: 24px;
          background: #ffffff;
          box-shadow: 0 20px 56px rgba(15, 23, 42, 0.16);
        }

        .apply-modal-title {
          margin: 0 0 16px;
          color: #111111;
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .apply-modal-body {
          color: #526692;
          font-size: 15px;
          font-weight: 600;
          line-height: 1.6;
        }

        .apply-modal-body p {
          margin: 0 0 14px;
        }

        .apply-modal-body h4 {
          margin: 18px 0 8px;
          color: #111111;
          font-size: 15px;
          font-weight: 800;
        }

        .apply-modal-body ul {
          margin: 0;
          padding-left: 18px;
        }

        .apply-modal-body li {
          margin: 4px 0;
        }

        .apply-modal-close {
          width: 100%;
          height: 50px;
          margin-top: 24px;
          border: none;
          border-radius: 12px;
          background: #00006a;
          color: #ffffff;
          font-size: 16px;
          font-weight: 800;
          font-family: inherit;
          cursor: pointer;
        }

        .apply-modal-close:hover {
          opacity: 0.94;
        }

        /* ---------- 반응형 ---------- */
        @media (max-width: 1024px) {
          .apply-inner {
            grid-template-columns: 1fr;
            row-gap: 56px;
            text-align: center;
          }

          .apply-intro {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .apply-notice {
            max-width: 460px;
            text-align: left;
          }

          .apply-card {
            max-width: 520px;
            margin: 0 auto;
            text-align: left;
          }

          .apply-card-desc,
          .apply-form,
          .apply-field > label {
            text-align: left;
          }
        }

        @media (max-width: 768px) {
          .apply-inner {
            width: min(calc(100% - 32px), 420px);
            padding: 72px 0 90px;
          }

          .apply-title {
            font-size: 42px;
          }

          .apply-subtitle {
            font-size: 18px;
          }

          .apply-card {
            padding: 30px 24px;
          }

          .apply-card-title {
            font-size: 26px;
          }

          .apply-purpose-grid {
            grid-template-columns: 1fr;
          }

          .apply-field input {
            height: 52px;
          }

          .apply-submit {
            height: 54px;
            font-size: 17px;
          }

          .apply-modal {
            width: calc(100% - 32px);
            padding: 24px;
          }

          .apply-modal-body {
            font-size: 14px;
          }
        }
      `}</style>
    </main>
  );
}
