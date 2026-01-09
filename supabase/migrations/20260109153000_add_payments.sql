create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  amount numeric(10, 2) not null,
  currency text not null default 'BDT',
  status text not null check (status in ('pending', 'paid', 'failed', 'cancelled')),
  ssl_session_id text,
  created_at timestamp with time zone default now()
);

create index if not exists orders_user_idx on public.orders (user_id);
create index if not exists orders_course_idx on public.orders (course_id);
create index if not exists orders_status_idx on public.orders (status);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  tran_id text not null,
  amount numeric(10, 2) not null,
  card_type text,
  validation_id text,
  status text,
  raw_response jsonb,
  created_at timestamp with time zone default now()
);

create unique index if not exists payments_tran_id_key on public.payments (tran_id);
create index if not exists payments_order_idx on public.payments (order_id);

create table if not exists public.purchased_courses (
  user_id uuid not null references auth.users (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  purchased_at timestamp with time zone default now(),
  primary key (user_id, course_id)
);

create index if not exists purchased_courses_course_idx on public.purchased_courses (course_id);

alter table public.orders enable row level security;
alter table public.payments enable row level security;
alter table public.purchased_courses enable row level security;

create policy "Orders are viewable by owner"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Orders are insertable by owner"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "Orders are updatable by owner"
  on public.orders for update
  using (auth.uid() = user_id);

create policy "Payments are viewable by order owner"
  on public.payments for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = payments.order_id
        and o.user_id = auth.uid()
    )
  );

create policy "Purchased courses are viewable by owner"
  on public.purchased_courses for select
  using (auth.uid() = user_id);

drop policy if exists "Lessons are readable by class" on public.lessons;

create policy "Lessons are readable for purchased courses"
  on public.lessons for select
  using (
    exists (
      select 1 from public.purchased_courses pc
      where pc.user_id = auth.uid()
        and pc.course_id = lessons.course_id
    )
  );
