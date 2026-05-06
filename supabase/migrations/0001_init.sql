-- 0001_init.sql
-- 이음 페이크도어 랜딩 초기 스키마

create extension if not exists "uuid-ossp";

-- waitlist
create table if not exists public.waitlist (
  id              uuid primary key default uuid_generate_v4(),
  email           text not null unique,
  plan_selected   text not null check (plan_selected in ('free','pro')),
  posthog_id      text,
  created_at      timestamptz not null default now()
);

create index if not exists waitlist_created_at_idx on public.waitlist (created_at desc);

-- interview_responses
create table if not exists public.interview_responses (
  id                  uuid primary key default uuid_generate_v4(),
  waitlist_id         uuid references public.waitlist(id) on delete set null,
  problem             text not null,
  current_solution    text not null,
  willingness_to_pay  text not null check (
    willingness_to_pay in ('free_only','lt_3000','lt_6000','lt_10000','gte_10000')
  ),
  wants_interview     boolean not null default false,
  created_at          timestamptz not null default now()
);

create index if not exists interview_waitlist_idx on public.interview_responses (waitlist_id);

-- RLS: anon은 읽기 불가, 쓰기는 service_role 라우트로만 처리 (RLS 켜두면 anon은 모두 차단)
alter table public.waitlist enable row level security;
alter table public.interview_responses enable row level security;

-- 명시적 정책 없음 = service_role만 접근 가능 (서버 API에서만 사용)
