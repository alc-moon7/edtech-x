do $$
declare
  dim int;
begin
  select atttypmod - 4
    into dim
  from pg_attribute
  where attrelid = 'public.nctb_chunks'::regclass
    and attname = 'embedding';

  if dim is null or dim <> 1536 then
    alter table public.nctb_chunks
      alter column embedding type vector(1536)
      using embedding::vector(1536);
  end if;
end $$;
