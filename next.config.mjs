/** @type {import('next').NextConfig} */
const securityHeaders = [
  // 클릭재킹 방어
  { key: "X-Frame-Options", value: "DENY" },
  // MIME sniffing 차단
  { key: "X-Content-Type-Options", value: "nosniff" },
  // 외부 사이트로 이동 시 path/query 노출 최소화
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // 사용 안 하는 민감 권한 명시 차단
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=()",
  },
  // HTTPS 강제 (도메인 연결 + Vercel SSL 활성화 후 효과)
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // 컨텐츠 출처 화이트리스트 (PostHog/Supabase/Pretendard 허용)
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://us-assets.i.posthog.com",
      "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https://cdn.jsdelivr.net",
      "connect-src 'self' https://*.supabase.co https://us.i.posthog.com https://us-assets.i.posthog.com https://*.i.posthog.com https://api.resend.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // X-Powered-By 헤더 제거 (스택 노출 차단)
  compress: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
