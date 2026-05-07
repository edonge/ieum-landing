-- 0004_contacts.sql
-- 문의하기 폼 데이터 저장 테이블

create table if not exists public.contacts (
  id                      uuid primary key default uuid_generate_v4(),
  email                   text not null,
  message                 text not null,
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

create index if not exists contacts_created_at_idx on public.contacts (created_at desc);

-- 익명 접근 차단. 서버 API(서비스 롤 키)에서만 쓰기 가능.
alter table public.contacts enable row level security;
