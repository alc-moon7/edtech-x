create extension if not exists pgcrypto;

alter table public.nctb_chunks
  add column if not exists content_hash text;

update public.nctb_chunks
  set content_hash = encode(digest(content, 'sha256'), 'hex')
  where content_hash is null;

delete from public.nctb_chunks a
using public.nctb_chunks b
where a.content_hash = b.content_hash
  and a.id <> b.id
  and a.created_at > b.created_at;

create unique index if not exists nctb_chunks_content_hash_key
  on public.nctb_chunks (content_hash);

alter table public.nctb_chunks
  alter column content_hash set not null;
