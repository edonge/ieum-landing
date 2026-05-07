"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { track, getDistinctId } from "@/lib/analytics";
import { getStoredUtm } from "@/lib/utm";

type FormErrors = {
  email?: string;
  message?: string;
  consent?: string;
  submit?: string;
};

export default function ContactPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [loadedAt] = useState<number>(() => Date.now());

  useEffect(() => {
    track("section_viewed", { section_name: "contact" });
  }, []);

  const reset = () => {
    setEmail("");
    setMessage("");
    setPrivacyConsent(false);
    setErrors({});
    setSubmitted(false);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: FormErrors = {};
    if (!email.trim()) {
      next.email = "이메일을 입력해주세요.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "올바른 이메일 주소를 입력해주세요.";
    }
    if (!message.trim()) {
      next.message = "문의 내용을 입력해주세요.";
    } else if (message.trim().length > 2000) {
      next.message = "2000자 이내로 작성해주세요.";
    }
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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          message: message.trim(),
          privacy_consent: true,
          privacy_consented_at: now,
          hp_company: honeypot,
          loaded_at: loadedAt,
          posthog_id,
          ...utm,
          referrer,
        }),
      });
      if (!res.ok) {
        throw new Error("submit_failed");
      }
      track("interview_requested", { source: "contact" });
      setSubmitted(true);
    } catch {
      setErrors({
        submit: "전송 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="contact-page">
      <div className="contact-bg" aria-hidden>
        <span className="contact-bg-circle contact-bg-circle-1" />
        <span className="contact-bg-circle contact-bg-circle-2" />
      </div>

      <div className="contact-inner">
        <motion.div
          className="contact-card"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {!submitted ? (
            <>
              <p className="contact-eyebrow">문의하기</p>
              <h1 className="contact-title">무엇을 도와드릴까요?</h1>
              <p className="contact-subtitle">
                남겨주시면 입력하신 이메일로 직접 회신드릴게요.
              </p>

              <form onSubmit={onSubmit} className="contact-form" noValidate>
                {/* honeypot */}
                <div aria-hidden className="contact-hp" tabIndex={-1}>
                  <label htmlFor="contact-company">회사 (입력하지 마세요)</label>
                  <input
                    id="contact-company"
                    type="text"
                    name="company"
                    autoComplete="off"
                    tabIndex={-1}
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="contact-email">이메일</label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="회신 받을 이메일을 입력해주세요"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                  {errors.email && (
                    <p className="contact-error">{errors.email}</p>
                  )}
                </div>

                <div className="contact-field">
                  <label htmlFor="contact-message">문의 내용</label>
                  <textarea
                    id="contact-message"
                    rows={6}
                    placeholder="궁금한 점이나 제안하고 싶은 내용을 자유롭게 적어주세요."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={2000}
                  />
                  <p className="contact-counter">{message.length} / 2000</p>
                  {errors.message && (
                    <p className="contact-error">{errors.message}</p>
                  )}
                </div>

                <div className="contact-consent">
                  <label className="contact-consent-row">
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
                      회신을 위해 이메일 주소 수집·이용에 동의합니다. 보관 기간은 회신 완료 또는 6개월입니다.
                    </span>
                  </label>
                  {errors.consent && (
                    <p className="contact-error contact-consent-error">
                      {errors.consent}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="contact-submit"
                  disabled={submitting}
                >
                  {submitting ? "전송 중..." : "문의 보내기"}
                </button>
                {errors.submit && (
                  <p className="contact-error contact-submit-error">
                    {errors.submit}
                  </p>
                )}
              </form>
            </>
          ) : (
            <div className="contact-success">
              <div className="contact-success-icon" aria-hidden>
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
              <h2 className="contact-success-title">문의가 전송되었어요</h2>
              <p className="contact-success-desc">
                남겨주신 이메일로 빠른 시일 내에 회신드릴게요.
              </p>
              <button
                type="button"
                className="contact-submit"
                onClick={() => router.push("/")}
              >
                홈으로 돌아가기
              </button>
              <button
                type="button"
                className="contact-success-link"
                onClick={reset}
              >
                다른 문의 보내기
              </button>
            </div>
          )}
        </motion.div>
      </div>

      <style jsx global>{`
        .contact-page {
          position: relative;
          width: 100%;
          min-height: calc(100svh - 68px);
          background: #ffffff;
          overflow: hidden;
        }

        .contact-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        .contact-bg-circle {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          background: rgba(191, 222, 255, 0.42);
        }

        .contact-bg-circle-1 {
          top: -10%;
          left: -8%;
          width: 480px;
          height: 480px;
          opacity: 0.5;
        }

        .contact-bg-circle-2 {
          right: -10%;
          bottom: -16%;
          width: 440px;
          height: 440px;
          opacity: 0.4;
        }

        .contact-inner {
          position: relative;
          z-index: 1;
          width: min(640px, calc(100% - 64px));
          margin: 0 auto;
          padding: clamp(72px, 9vh, 110px) 0 clamp(96px, 12vh, 140px);
        }

        .contact-card {
          padding: 42px;
          border: 1px solid rgba(230, 235, 245, 0.95);
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.96);
          box-shadow: 0 20px 56px rgba(15, 23, 42, 0.1);
        }

        .contact-eyebrow {
          margin: 0 0 12px;
          color: #00006a;
          font-size: 16px;
          font-weight: 800;
        }

        .contact-title {
          margin: 0;
          color: #050505;
          font-size: clamp(34px, 3.4vw, 44px);
          font-weight: 800;
          line-height: 1.2;
          letter-spacing: -0.04em;
          word-break: keep-all;
        }

        .contact-subtitle {
          margin: 14px 0 0;
          color: #526692;
          font-size: 17px;
          font-weight: 700;
          line-height: 1.45;
          letter-spacing: -0.02em;
          word-break: keep-all;
        }

        .contact-form {
          margin-top: 32px;
        }

        .contact-hp {
          position: absolute;
          left: -10000px;
          width: 1px;
          height: 1px;
          overflow: hidden;
        }

        .contact-field {
          margin-bottom: 22px;
        }

        .contact-field > label {
          display: block;
          margin-bottom: 10px;
          color: #111111;
          font-size: 15px;
          font-weight: 800;
        }

        .contact-field input,
        .contact-field textarea {
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

        .contact-field textarea {
          height: auto;
          min-height: 140px;
          padding: 16px;
          line-height: 1.5;
          resize: vertical;
        }

        .contact-field input::placeholder,
        .contact-field textarea::placeholder {
          color: #b0b8c1;
        }

        .contact-field input:focus,
        .contact-field textarea:focus {
          border-color: #00006a;
          box-shadow: 0 0 0 3px rgba(0, 0, 106, 0.08);
        }

        .contact-counter {
          margin: 6px 0 0;
          color: #b0b8c1;
          font-size: 12px;
          font-weight: 700;
          text-align: right;
        }

        .contact-error {
          margin: 8px 0 0;
          color: #e5484d;
          font-size: 13px;
          font-weight: 700;
        }

        .contact-consent {
          margin: 8px 0 24px;
        }

        .contact-consent-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          cursor: pointer;
        }

        .contact-consent-row input[type="checkbox"] {
          flex-shrink: 0;
          width: 18px;
          height: 18px;
          margin: 1px 0 0;
          accent-color: #00006a;
          cursor: pointer;
        }

        .contact-consent-row > span {
          color: #111111;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.45;
          word-break: keep-all;
        }

        .contact-consent-error {
          margin-top: 10px;
        }

        .contact-submit {
          width: 100%;
          height: 56px;
          margin-top: 8px;
          border: none;
          border-radius: 14px;
          background: #00006a;
          color: #ffffff;
          font-size: 17px;
          font-weight: 800;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .contact-submit:hover {
          opacity: 0.94;
          transform: translateY(-1px);
        }

        .contact-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
        }

        .contact-submit-error {
          margin-top: 12px;
          text-align: center;
        }

        /* 완료 */
        .contact-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 12px 0;
          text-align: center;
        }

        .contact-success-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          margin-bottom: 24px;
          border-radius: 9999px;
          background: #f5f8ff;
        }

        .contact-success-title {
          margin: 0;
          color: #111111;
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .contact-success-desc {
          margin: 14px 0 32px;
          color: #526692;
          font-size: 17px;
          font-weight: 700;
          line-height: 1.5;
        }

        .contact-success-link {
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

        @media (max-width: 768px) {
          .contact-inner {
            width: min(calc(100% - 32px), 480px);
            padding: 64px 0 80px;
          }
          .contact-card {
            padding: 30px 24px;
          }
          .contact-title {
            font-size: 28px;
          }
          .contact-subtitle {
            font-size: 16px;
          }
        }
      `}</style>
    </main>
  );
}
