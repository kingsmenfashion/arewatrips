create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  auth_provider text not null default 'google',
  created_at timestamptz not null default now(),
  last_login timestamptz not null default now()
);

create unique index if not exists profiles_email_unique
  on public.profiles (lower(email))
  where email is not null;

create table if not exists public.ride_bookings (
  id uuid primary key default gen_random_uuid(),
  pickup text not null,
  dropoff text not null,
  booking_date date not null,
  booking_time text not null,
  ride_type text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public.hotel_bookings (
  id uuid primary key default gen_random_uuid(),
  hotel_name text not null,
  room_type text not null,
  price_per_night integer not null,
  check_in_date date not null,
  check_out_date date not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public.travel_groups (
  id uuid primary key default gen_random_uuid(),
  origin text not null,
  destination text not null,
  current_members integer not null default 1,
  max_members integer not null default 4 check (max_members > 0),
  status text not null default 'open' check (status in ('open', 'closed', 'expired')),
  created_by uuid not null references public.profiles(id) on delete cascade,
  expiry_date timestamptz not null,
  created_at timestamptz not null default now(),
  check (current_members between 1 and max_members)
);

create table if not exists public.group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.travel_groups(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  seats_reserved integer not null default 1 check (seats_reserved between 1 and 4),
  status text not null default 'active' check (status in ('active', 'cancelled')),
  created_at timestamptz not null default now(),
  unique (group_id, user_id)
);

alter table public.profiles enable row level security;
alter table public.ride_bookings enable row level security;
alter table public.hotel_bookings enable row level security;
alter table public.travel_groups enable row level security;
alter table public.group_members enable row level security;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "Users can create their own profile" on public.profiles;
create policy "Users can create their own profile"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Allow anonymous ride booking inserts" on public.ride_bookings;
create policy "Allow anonymous ride booking inserts"
  on public.ride_bookings
  for insert
  to anon
  with check (true);

drop policy if exists "Allow anonymous hotel booking inserts" on public.hotel_bookings;
create policy "Allow anonymous hotel booking inserts"
  on public.hotel_bookings
  for insert
  to anon
  with check (true);

drop policy if exists "Anyone can read open travel groups" on public.travel_groups;
create policy "Anyone can read open travel groups"
  on public.travel_groups
  for select
  to anon, authenticated
  using (status = 'open');

drop policy if exists "Authenticated users can create travel groups" on public.travel_groups;
create policy "Authenticated users can create travel groups"
  on public.travel_groups
  for insert
  to authenticated
  with check (auth.uid() = created_by);

drop policy if exists "Users can read their own group memberships" on public.group_members;
create policy "Users can read their own group memberships"
  on public.group_members
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can create their own group memberships" on public.group_members;
create policy "Users can create their own group memberships"
  on public.group_members
  for insert
  to authenticated
  with check (auth.uid() = user_id);
