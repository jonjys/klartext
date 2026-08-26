create table if not exists orders (
  id serial primary key,
  product_slug text not null,
  amount_kr integer not null,
  status text not null default 'pending',
  access_token text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists orders_token_idx on orders (access_token);
create index if not exists orders_created_idx on orders (created_at desc);

create table if not exists funnel_events (
  id serial primary key,
  name text not null,
  product_slug text,
  created_at timestamptz not null default now()
);

create index if not exists funnel_events_name_idx on funnel_events (name, created_at desc);
