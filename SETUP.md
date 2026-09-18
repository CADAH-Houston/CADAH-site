# Setup Guide — Step 1 (Public Front End)

This covers what's needed to review what's built so far, get the code onto
a durable home (GitHub), and see it live (Vercel). Stripe and Gmail aren't
needed until later build steps.

The site runs in **demo mode** with clearly-labeled sample data until you
connect Supabase, so there's no rush — you can review the look and feel
first and wire up real data whenever you're ready.

## 1. Create a GitHub Organization and repo (this becomes the project's home)

Right now the code only exists as a zip file I've sent you. That's fine for
now, but it's a bad handoff story — if a future board member or developer
ever needs to pick this up, there should be one durable place with the code
and its history, not a zip buried in an old chat.

**Use a GitHub Organization, not your personal account.** A repo under your
personal GitHub belongs to you — if you're no longer on the board someday,
the association loses access unless you remember to transfer it. An
Organization is free, owned by CADAH rather than any one person, and lets
you add other board members as owners now so there's no single point of
failure.

1. Go to github.com — sign in with your personal account if you have one
   (or create one; it's just the login you'll use, not what owns anything),
   then go to **Settings > Organizations > New organization**. Choose the
   free plan. Something like `cadah-houston` works well as the org name.
2. Once created, go to that org's **People** tab and invite at least one
   other board member as an **Owner** — this is the step that actually
   solves the succession problem, so it's worth doing now rather than
   later.
3. Go to **Settings > Developer settings > Personal access tokens > Fine-
   grained tokens** (under your personal account, since org-owned tokens
   aren't a thing) and generate a new token:
   - Resource owner: select the **cadah-houston** organization (not
     yourself)
   - Repository access: "All repositories" in that org (or create an empty
     repo named `cadah-site` in the org first and scope the token to it)
   - Permissions: **Contents: Read and write** (that's the only permission
     needed)
   - Set an expiration — 7 days is plenty, since I only need it once to
     create the repo and push the code.
4. Send me the token. I'll create the repo under the organization and push
   everything, then let you know you can revoke the token afterward.

Once that's done, CADAH's codebase lives at a permanent, org-owned GitHub
URL, with full version history of every change going forward — not tied to
your personal account.

The same principle applies to Supabase and Vercel below: where you can,
add a second board member as a team member/owner rather than leaving the
project solely under one person's individual account.

## 2. Create a Supabase project (free tier)

Same personal-login-then-org pattern as GitHub, and it's free here too.

1. Go to supabase.com and sign up (GitHub or email both work) — this is
   your personal login. Supabase automatically creates an **Organization**
   for you at signup; rename it to something like `CADAH` instead of your
   name (Organization settings > General).
2. In that organization's **Team** settings, invite at least one other
   board member as an **Owner** — free on Supabase's base plan, so there's
   no reason not to.
3. Click "New project" inside the CADAH organization. Pick any name (e.g.
   `cadah-membership`), a strong database password (save it somewhere),
   and a region close to Houston (e.g. US East).
4. Once the project finishes provisioning, open the **SQL Editor** (left
   sidebar), click "New query," paste in the contents of
   `supabase/migrations/0001_init.sql` from this project, and run it. That
   creates all the tables, security rules, and the photo storage bucket in
   one go.
5. Go to **Project Settings > API**. You'll need three values from this
   page — send them to me (or set them yourself, see step 4 below):
   - **Project URL**
   - **anon / public key**
   - **service_role key** (click "reveal" — keep this one private, don't
     post it anywhere public)

## 3. Create a Vercel account and connect it to the GitHub repo

This is the standard way to run a Next.js site, and it means every future
update — from me or from whoever maintains this after you — goes live
automatically the moment it's pushed to GitHub. No manual deploy step, no
tokens to manage.

**One honest caveat, unlike GitHub and Supabase:** Vercel's free Hobby plan
doesn't support adding a second person with deploy access at all — that
needs the Pro plan, starting at $20/month. Given the whole point here is
avoiding recurring fees, my suggestion is to keep this on your personal
free Hobby account for now rather than pay for it. It's a low-risk single
point of failure, because the actual code (GitHub, org-owned) and the
actual data (Supabase, org-owned) are both already protected — if this
Vercel account were ever inaccessible, anyone with repo access could spin
up a brand-new free Vercel account, re-import the same GitHub repo, paste
in the env vars from step 4 below, and be back live in a few minutes.
Nothing would be lost. If CADAH would rather pay for built-in redundancy
here too, say the word and we can set up a Team instead.

**Sign up with a CADAH email address rather than your personal one** (e.g.
something like webmaster@ or board@ if you have it) — use email/password
signup rather than "Continue with GitHub" for this reason. Vercel's free
plan is still just one login either way, but if that login belongs to a
CADAH-owned inbox instead of your personal Gmail, then whoever has access
to that inbox later can do a password reset and get in — the same
succession logic as the GitHub/Supabase orgs, just achieved differently
since Vercel doesn't offer free multi-user accounts. Worth storing the
Vercel password itself somewhere the board can retrieve it (a shared
password manager, if CADAH has one), since email access alone won't help
without it.

1. Go to vercel.com and sign up with the CADAH email + a password (skip
   "Continue with GitHub" here, per the note above).
2. Click **"Add New... > Project"**, then **"Import"** next to the
   `cadah-site` repo — the first time, you'll be prompted to connect a
   GitHub account/install the Vercel GitHub App so it can see the repo;
   authorize it against the **cadah-houston** organization (sign in with
   your personal GitHub for this authorization step only — it's just
   granting Vercel permission to read the repo, not tying account
   ownership to you).
3. Leave the default settings (Vercel auto-detects Next.js) and click
   **Deploy**. You'll get a live `.vercel.app` URL within a minute or two —
   send it to me or just open it on your phone.

## 4. Add the environment variables

Once you have the Supabase values from step 2, either:

- **Send them to me** and I'll add them to the Vercel project and
  redeploy, or
- **Add them yourself** in Vercel: Project Settings > Environment
  Variables, using the names in `.env.local.example` in this project.

For the admin photo-upload page, also set `ADMIN_UPLOAD_PASSCODE` to any
long random string of your choosing (treat it like a password) — you'll use
it to upload event photos at `/admin/upload` until real admin login exists.

## Branding — send the logo whenever you have it, no need to wait

You mentioned CADAH has a logo — send it over whenever it's convenient
(SVG is ideal since it stays crisp at any size, but PNG or JPG both work
fine, transparent background preferred if you have one). Once I have it,
I'll pull the actual colors out of it and swap them in for the placeholder
red/neutral palette currently on the site (headings, buttons, links, the
site header), and place the logo itself in the header and as the favicon.

This is a config-file change like the name fix was, so it's quick to redo
if you want to try a couple of variations — no need to have it perfectly
decided before sending it over.

## What you don't need yet

- **Stripe** — not needed until build step 7 (card payments).
- **Gmail** — not needed until build step 6 (group email tool) and step 9
  (renewal reminders).

## Running it locally instead (optional)

If you'd rather run it on your own computer:

```bash
npm install
cp .env.local.example .env.local   # fill in the values from step 2
npm run dev
```

Then open http://localhost:3000.
