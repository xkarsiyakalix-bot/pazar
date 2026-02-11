-- Create a table to store category settings (active/passive status)
create table if not exists public.category_settings (
    category_name text primary key,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.category_settings enable row level security;

-- Create policies
create policy "Allow public read access" on public.category_settings for select using (true);
create policy "Allow admin full access" on public.category_settings for all using (
    exists (
        select 1 from profiles
        where profiles.id = auth.uid() and profiles.is_admin = true
    )
);

-- Insert initial categories from the static list (optional, but good for initialization)
-- This part is tricky because we can't easily iterate the JS array in SQL.
-- Instead, the frontend admin panel will handle the "init" if a record is missing (treat missing as active).
