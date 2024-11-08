create table public.translations (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references public.users(id) not null,
  input_text text not null,
  translated_text text not null,
  pinyin text not null,
  word_breakdown jsonb not null
);

-- Add RLS policies
alter table public.translations enable row level security;

create policy "Users can insert their own translations"
  on public.translations for insert
  with check (user_id = auth.uid());

create policy "Users can view their own translations"
  on public.translations for select
  using (user_id = auth.uid());
