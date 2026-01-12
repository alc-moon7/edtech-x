create or replace function public.get_leaderboard(limit_count integer default 5)
returns table (
  user_id uuid,
  full_name text,
  total_points integer,
  rank integer
)
language sql
security definer
set search_path = public
as $$
  select
    attempts.user_id,
    coalesce(up.full_name, split_part(users.email, '@', 1)) as full_name,
    sum(attempts.score)::int as total_points,
    rank() over (order by sum(attempts.score) desc) as rank
  from public.student_quiz_attempts attempts
  join auth.users users on users.id = attempts.user_id
  left join public.user_profiles up on up.user_id = attempts.user_id
  group by attempts.user_id, up.full_name, users.email
  order by total_points desc
  limit limit_count;
$$;

grant execute on function public.get_leaderboard(integer) to authenticated;
