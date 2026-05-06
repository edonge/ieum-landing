-- 0002_utm.sql
-- waitlist에 UTM/referrer 추적 컬럼 추가 (광고 채널/콘텐츠별 전환 분석)

alter table public.waitlist
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text,
  add column if not exists utm_content text,
  add column if not exists utm_term text,
  add column if not exists referrer text;

create index if not exists waitlist_utm_source_idx on public.waitlist (utm_source);
