-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- 1. Partners Table (Updated with custom commissions)
create table if not exists public.partners (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null unique,
  referral_key text not null unique,
  status text not null default 'active' check (status in ('active', 'paused')),
  -- Custom Commission Overrides (NULL means use global default)
  commission_dfy_percent numeric(5, 2), -- e.g. 10.00 for 10%
  commission_saas_percent numeric(5, 2), -- e.g. 20.00 for 20%
  created_at timestamp with time zone default now()
);

-- 2. Visitors Table
create table if not exists public.visitors (
  id uuid primary key default uuid_generate_v4(),
  referral_key text not null references public.partners(referral_key),
  first_seen timestamp with time zone default now(),
  last_seen timestamp with time zone default now()
);

-- 3. Events Table
create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(),
  visitor_id uuid references public.visitors(id),
  partner_id uuid references public.partners(id),
  event_type text not null, 
  asset text, 
  created_at timestamp with time zone default now()
);

-- 4. Conversions Table
create table if not exists public.conversions (
  id uuid primary key default uuid_generate_v4(),
  visitor_id uuid references public.visitors(id),
  partner_id uuid references public.partners(id),
  offer_type text not null check (offer_type in ('dfy', 'saas')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'paid')),
  commission_amount numeric(10, 2) default 0.00,
  created_at timestamp with time zone default now()
);

-- 5. Payouts Table
create table if not exists public.payouts (
  id uuid primary key default uuid_generate_v4(),
  partner_id uuid references public.partners(id),
  amount numeric(10, 2) not null,
  status text not null default 'pending' check (status in ('pending', 'sent')),
  sent_at timestamp with time zone
);

-- 6. App Config Table (CMS Lite)
create table if not exists public.app_config (
  key text primary key,
  value text not null,
  description text
);

-- Seed Default Config Content
INSERT INTO public.app_config (key, value, description)
VALUES 
  ('dashboard_title', 'UAI Partner Dashboard', 'Main title on the dashboard'),
  ('dashboard_subtitle', 'Unengaged Audience Intelligence', 'Subtitle under the main title'),
  ('attribution_rules', 'First-touch attribution. 365-day window.', 'Text explaining attribution rules')
ON CONFLICT (key) DO NOTHING;


-- RLS Policies Update
-- We need to ensure Admin (you) can read/write everything.
-- For simplicity in this SQL editor context, we'll Create policies that allow specific emails to do everything.

-- Allow Admin full access (Replace with your specific email check)
CREATE POLICY "Admin Full Access" ON public.partners FOR ALL TO authenticated 
USING (auth.jwt() ->> 'email' = 'chuck.mullaney@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'chuck.mullaney@gmail.com');

CREATE POLICY "Admin Full Access Config" ON public.app_config FOR ALL TO authenticated 
USING (auth.jwt() ->> 'email' = 'chuck.mullaney@gmail.com')
WITH CHECK (auth.jwt() ->> 'email' = 'chuck.mullaney@gmail.com');

-- Allow Public Read for Config (so partners see the text)
CREATE POLICY "Public Read Config" ON public.app_config FOR SELECT TO authenticated USING (true);
