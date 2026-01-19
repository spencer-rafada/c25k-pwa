-- Create workout_completions table
create table workout_completions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  workout_id text not null,
  completed_at timestamptz not null,
  duration_seconds int,
  created_at timestamptz default now(),

  unique(user_id, workout_id)
);

-- Create index for querying user's completions
create index idx_workout_completions_user_id on workout_completions(user_id);

-- Enable Row-Level Security
alter table workout_completions enable row level security;

-- RLS Policies

-- Users can read their own completions
create policy "Users can read own completions"
  on workout_completions for select
  using (auth.uid() = user_id);

-- Users can insert their own completions
create policy "Users can insert own completions"
  on workout_completions for insert
  with check (auth.uid() = user_id);

-- Users can update their own completions
create policy "Users can update own completions"
  on workout_completions for update
  using (auth.uid() = user_id);

-- Users can delete their own completions
create policy "Users can delete own completions"
  on workout_completions for delete
  using (auth.uid() = user_id);
