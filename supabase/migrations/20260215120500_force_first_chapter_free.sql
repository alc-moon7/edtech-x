update public.subjects
set free_first_chapter = true,
    first_chapter_free = true;

update public.chapters
set is_free = true,
    price = 0
where order_no = 1;
