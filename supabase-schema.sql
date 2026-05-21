-- Run this in Supabase SQL editor: https://app.supabase.com > SQL Editor

-- ─────────────────────────────────────
-- TABLES
-- ─────────────────────────────────────

create table products (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  slug              text unique not null,
  description       text,
  price             numeric(10,2) not null,
  type              text not null check (type in ('physical', 'digital')),
  images            text[] default '{}',
  digital_file_path text,
  stock             integer,
  is_active         boolean default true,
  created_at        timestamptz default now()
);

create table promos (
  id          uuid primary key default gen_random_uuid(),
  code        text unique not null,
  type        text not null check (type in ('percentage', 'fixed')),
  value       numeric(10,2) not null,
  min_order   numeric(10,2) default 0,
  max_uses    integer,
  used_count  integer default 0,
  expires_at  timestamptz,
  is_active   boolean default true,
  created_at  timestamptz default now()
);

create table orders (
  id               uuid primary key default gen_random_uuid(),
  order_number     text unique not null,
  customer_name    text not null,
  customer_email   text not null,
  customer_phone   text not null,
  shipping_address jsonb,
  subtotal         numeric(10,2) not null,
  discount         numeric(10,2) default 0,
  total            numeric(10,2) not null,
  promo_code       text,
  status           text default 'pending' check (status in ('pending','paid','processing','shipped','completed','cancelled')),
  payment_status   text default 'pending' check (payment_status in ('pending','paid','failed')),
  bill_code        text,
  ref_no           text,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

create table order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid references orders(id) on delete cascade,
  product_id   uuid references products(id),
  product_name text not null,
  product_type text not null,
  quantity     integer not null,
  unit_price   numeric(10,2) not null,
  total_price  numeric(10,2) not null
);

create table profiles (
  id   uuid primary key references auth.users on delete cascade,
  name text,
  role text default 'admin'
);

-- ─────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────

create index on products (is_active);
create index on orders (payment_status);
create index on orders (status);
create index on orders (created_at desc);
create index on order_items (order_id);

-- ─────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────

alter table products enable row level security;
alter table promos enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table profiles enable row level security;

-- Products: public can read active ones; service role handles writes
create policy "Public read active products"
  on products for select
  using (is_active = true);

-- Promos: no public access (validated server-side via service role)

-- Orders: no public access (all via service role on server)

-- Profiles: users can read their own profile
create policy "Users can read own profile"
  on profiles for select
  using (auth.uid() = id);

-- ─────────────────────────────────────
-- HELPER FUNCTION: increment promo usage
-- ─────────────────────────────────────

create or replace function increment_promo_usage(promo_code_arg text)
returns void
language sql
security definer
as $$
  update promos
  set used_count = used_count + 1
  where code = promo_code_arg;
$$;

-- ─────────────────────────────────────
-- STORAGE BUCKETS (run in dashboard or via JS)
-- ─────────────────────────────────────
-- Create two buckets in Supabase Storage:
--   1. "product-images" — public bucket (for product photos)
--   2. "digital-files"  — private bucket (for digital product files, accessed via signed URLs)
--
-- In the Supabase dashboard: Storage > New bucket
--   product-images: Public = ON
--   digital-files:  Public = OFF
