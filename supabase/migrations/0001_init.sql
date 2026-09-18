-- CADAH Membership Site — initial schema
-- Run this once in the Supabase SQL editor (Dashboard > SQL Editor > New query)
-- right after creating the project. Safe to re-run only if you drop the
-- tables first — it does not use "create if not exists" everywhere on
-- purpose, so you notice if something already exists.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- members  (used starting in build step 2 — admin CRUD)
-- ---------------------------------------------------------------------------
create table public.members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  specialty text,
  practice_location text,

  phone text,
  phone_visible boolean not null default false,
  email text,
  email_visible boolean not null default false,
  home_address text,
  home_address_visible boolean not null default false,
  practice_address text,
  practice_address_visible boolean not null default false,

  membership_type text not null default 'annual' check (membership_type in ('annual', 'lifetime')),
  status text not null default 'active' check (status in ('active', 'retired', 'moved', 'inactive')),

  -- Flexible field for anything not yet modeled (languages spoken, hospital
  -- affiliation, etc.) without a schema change, e.g. {"languages": ["Mandarin","English"]}
  extra_info jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

alter table public.members enable row level security;
-- No public policies yet on purpose: only the service role (admin actions)
-- can read/write members until member login ships in build step 4.

-- ---------------------------------------------------------------------------
-- payments  (build step 8)
-- ---------------------------------------------------------------------------
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members (id) on delete cascade,
  amount numeric(10, 2) not null,
  paid_on date not null default current_date,
  method text not null check (method in ('stripe', 'zelle', 'cash', 'check')),
  covers_year int,
  is_lifetime boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.payments enable row level security;
-- Locked down to the service role, same as members.

-- ---------------------------------------------------------------------------
-- users  (build step 4 — member login). One row per Supabase Auth user.
-- ---------------------------------------------------------------------------
create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'member' check (role in ('admin', 'member')),
  member_id uuid references public.members (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;

-- ---------------------------------------------------------------------------
-- events  (build step 1 — public calendar)
-- ---------------------------------------------------------------------------
create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  location text,
  start_at timestamptz not null,
  end_at timestamptz,
  visibility text not null default 'public' check (visibility in ('public', 'members_only')),
  created_at timestamptz not null default now()
);

alter table public.events enable row level security;

create policy "Public events are readable by anyone"
  on public.events for select
  to anon, authenticated
  using (visibility = 'public');

-- Members-only events become readable to logged-in members once build step 4
-- adds a policy checking public.users. Writes stay service-role-only for now.

-- ---------------------------------------------------------------------------
-- event_photos  (build step 1 — public gallery)
-- ---------------------------------------------------------------------------
create table public.event_photos (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.events (id) on delete set null,
  storage_path text not null,
  caption text,
  uploaded_at timestamptz not null default now()
);

alter table public.event_photos enable row level security;

create policy "Event photos are readable by anyone"
  on public.event_photos for select
  to anon, authenticated
  using (true);

-- Writes go through the admin-passcode-gated upload page for now (uses the
-- service role key server-side), so no insert/update/delete policy here yet.

-- ---------------------------------------------------------------------------
-- membership_applications  (build step 1 — public "Apply to Join" form)
-- ---------------------------------------------------------------------------
create table public.membership_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  specialty text,
  practice_location text,
  membership_type_interest text check (membership_type_interest in ('annual', 'lifetime')),
  message text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

alter table public.membership_applications enable row level security;

create policy "Anyone can submit an application"
  on public.membership_applications for insert
  to anon, authenticated
  with check (true);

-- Deliberately no select/update/delete policy for anon/authenticated:
-- applicants can submit but not read back the list. Only the board (service
-- role, via a future admin screen) can review applications.

-- ---------------------------------------------------------------------------
-- Storage: public bucket for event photos
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('event-photos', 'event-photos', true)
on conflict (id) do nothing;

create policy "Event photo files are publicly readable"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'event-photos');

-- Uploads to this bucket go through the admin-passcode-gated server action,
-- which uses the service role key and therefore bypasses these policies —
-- no insert policy needed here yet.
