-- CADAH Membership Site — membership tiers
-- Run once in the Supabase SQL editor (Dashboard > SQL Editor > New query).
-- Adds the specific membership tier (Lifetime / Regular / Resident / Student /
-- Associate) alongside the existing annual-vs-lifetime column, so the board
-- can filter and export by tier.

alter table public.members
  add column membership_tier text not null default 'regular'
  check (membership_tier in ('lifetime', 'regular', 'resident', 'student', 'associate'));

-- Existing lifetime members become tier "lifetime"; everyone else starts as
-- "regular" and can be adjusted from the member edit screen.
update public.members
  set membership_tier = 'lifetime'
  where membership_type = 'lifetime';
