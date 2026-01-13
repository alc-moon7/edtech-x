alter table public.orders
  add column if not exists chapter_id uuid references public.chapters (id) on delete set null;

create index if not exists orders_chapter_idx on public.orders (chapter_id);
