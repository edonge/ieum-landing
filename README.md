# 이음 (i_eum) — 페이크도어 랜딩

베타 출시 전 실수요 검증을 위한 페이크도어 테스트 사이트.

## 스택

- **프레임워크**: Next.js 14 (App Router) + TypeScript
- **스타일**: Tailwind CSS + Pretendard
- **분석**: PostHog
- **DB**: Supabase (Postgres)
- **호스팅**: Vercel
- **이메일 알림**: Resend (선택)

## 첫 실행

```bash
npm install
cp .env.example .env.local   # 값 채우기
npm run dev
```

`http://localhost:3000` 접속.

## 환경 변수 (.env.local)

| 키 | 설명 |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (프론트 노출) |
| `SUPABASE_SERVICE_ROLE_KEY` | API 라우트 전용, 절대 클라이언트 노출 금지 |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog 프로젝트 API 키 |
| `NEXT_PUBLIC_POSTHOG_HOST` | 기본값 `https://us.i.posthog.com` |
| `NOTIFY_EMAIL_TO` | waitlist 가입 알림 받을 이메일 |
| `RESEND_API_KEY` | Resend API 키 (없으면 알림 비활성) |

## Supabase 세팅

1. Supabase 프로젝트 생성
2. SQL Editor에서 `supabase/migrations/0001_init.sql` 실행
3. Project Settings → API → 키 복사 → `.env.local`

## PostHog 세팅

1. PostHog Cloud (US) 가입
2. 새 Project 생성 → API Key 복사
3. **Funnel** 만들기:
   - `landing_viewed` → `cta_clicked` → `pricing_viewed` → `plan_selected` → `checkout_viewed` → `checkout_submitted` → `waitlist_submitted` → `interview_completed`
4. **Insight**: `checkout_submitted` 이벤트 → utm_source 기준 분리

## 페이지 구조

```
/                       랜딩
/pricing                요금제 (Free / Pro 5,900원)
/checkout               결제 (페이크도어 — 카드 입력란 없음)
/checkout/success       베타 안내 + 인터뷰 폼
/legal/privacy          개인정보처리방침
/legal/terms            이용약관
/api/waitlist           POST: 이메일 저장
/api/interview          POST: 인터뷰 응답 저장
```

## 핵심 측정 KPI

- **진짜 수요 지표**: `landing_viewed → checkout_submitted` 전환율
- **거품 포함 지표**: `landing_viewed → waitlist_submitted` 전환율
- **가격 검증**: `interview_completed`의 `willingness_to_pay` 분포

## 무료 한도 모니터링

| 서비스 | 한도 | 확인 방법 |
|---|---|---|
| Vercel Hobby | 100GB 대역폭/월 | Vercel Dashboard → Usage |
| PostHog Free | 1M events/월, 5k 세션 리플레이 | PostHog → Billing |
| Supabase Free | 50k MAU, 500MB DB, 5GB 대역폭 | Supabase → Project Settings → Usage |

각 서비스에서 80% 도달 시 알림을 켜둘 것.

## 홍보 시점 체크리스트

본 프로젝트는 **무료 홍보 채널만 사용** (유튜브/인스타 오가닉). Vercel Hobby 한도(100GB/월)면 충분. 유료 광고 집행 시에만 Vercel Pro 검토.

- [ ] UTM 규약 확정 (`utm_source=youtube|instagram`, `utm_medium=video|reels|bio`, `utm_campaign=...`, `utm_content=...`)
- [ ] PostHog Insight를 utm_source 기준으로 분리
- [ ] 일일 알림 dashboard 셋업 (waitlist 가입 수)
- [ ] 무료 한도 80% 도달 알림 (Vercel/PostHog/Supabase)

## 배포 (Vercel)

```bash
# Vercel CLI
npx vercel link
npx vercel env add  # .env.local 키들 등록
npx vercel --prod
```

도메인 연결: Vercel Dashboard → Project → Domains → `이음닷컴` 추가 → 가비아 DNS에 CNAME 등록.
