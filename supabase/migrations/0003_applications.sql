-- 0003_applications.sql
-- 무료 사전 체험 신청 테이블

create table if not exists public.applications (
  id                      uuid primary key default uuid_generate_v4(),
  name                    text not null,
  contact                 text not null,
  contact_type            text not null check (contact_type in ('email','phone','other')),
  purpose                 text not null check (purpose in ('send_photos','tv_easy','family_record','curious')),
  privacy_consent         boolean not null default false,
  privacy_consented_at    timestamptz,
  posthog_id              text,
  utm_source              text,
  utm_medium              text,
  utm_campaign            text,
  utm_content             text,
  utm_term                text,
  referrer                text,
  created_at              timestamptz not null default now()
);

create index if not exists applications_created_at_idx on public.applications (created_at desc);
create index if not exists applications_purpose_idx on public.applications (purpose);
create index if not exists applications_utm_source_idx on public.applications (utm_source);

-- 익명 접근 차단. 서버 API(서비스 롤 키)에서만 쓰기 가능.
alter table public.applications enable row level security;
