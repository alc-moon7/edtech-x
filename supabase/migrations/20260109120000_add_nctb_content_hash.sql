create extension if not exists pgcrypto with schema extensions;

alter table public.nctb_chunks
  add column if not exists content_hash text;

update public.nctb_chunks
  set content_hash = encode(extensions.digest(convert_to(content, 'UTF8'), 'sha256'), 'hex')
  where content_hash is null
    and content is not null;

delete from public.nctb_chunks a
using public.nctb_chunks b
where a.content_hash = b.content_hash
  and a.id <> b.id
  and a.created_at > b.created_at;

create unique index if not exists nctb_chunks_content_hash_key
  on public.nctb_chunks (content_hash);

alter table public.nctb_chunks
  alter column content_hash set not null;
