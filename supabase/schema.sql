-- =========================================================
-- STUDY MANAGER DATABASE
-- Supabase / PostgreSQL
-- =========================================================

create extension if not exists "uuid-ossp";

-- =========================================================
-- PROFILES
-- =========================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  timezone text default 'Asia/Tehran',
  calendar_type text default 'jalali',
  language text default 'fa',
  theme text default 'dark',
  daily_study_goal_minutes integer default 360,
  week_starts_on integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =========================================================
-- SUBJECTS
-- =========================================================

create table if not exists public.subjects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text,
  icon text,
  description text,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =========================================================
-- TOPICS
-- =========================================================

create table if not exists public.topics (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  parent_id uuid references public.topics(id) on delete cascade,
  name text not null,
  description text,
  mastery integer default 0
    check (mastery >= 0 and mastery <= 100),
  priority text default 'medium'
    check (priority in ('low', 'medium', 'high')),
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =========================================================
-- RESOURCES
-- =========================================================

create table if not exists public.resources (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete set null,
  topic_id uuid references public.topics(id) on delete set null,
  title text not null,
  type text default 'other'
    check (
      type in (
        'book',
        'video',
        'website',
        'pdf',
        'course',
        'notes',
        'other'
      )
    ),
  url text,
  description text,
  author text,
  is_favorite boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =========================================================
-- STUDY SESSIONS
-- =========================================================

create table if not exists public.study_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete set null,
  topic_id uuid references public.topics(id) on delete set null,
  resource_id uuid references public.resources(id) on delete set null,

  activity_type text default 'study'
    check (
      activity_type in (
        'study',
        'review',
        'test',
        'homework',
        'reading',
        'video',
        'other'
      )
    ),

  timer_mode text default 'stopwatch'
    check (
      timer_mode in (
        'stopwatch',
        'countdown',
        'pomodoro'
      )
    ),

  started_at timestamptz not null,
  ended_at timestamptz,

  duration_seconds integer default 0
    check (duration_seconds >= 0),

  break_seconds integer default 0
    check (break_seconds >= 0),

  net_duration_seconds integer default 0
    check (net_duration_seconds >= 0),

  target_seconds integer
    check (
      target_seconds is null
      or target_seconds >= 0
    ),

  quality integer
    check (
      quality is null
      or quality between 1 and 5
    ),

  notes text,

  completed boolean default false,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =========================================================
-- DAILY AVAILABILITY
-- =========================================================

create table if not exists public.daily_availability (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,

  date date not null,

  start_time time not null,
  end_time time not null,

  type text default 'available'
    check (
      type in (
        'available',
        'busy',
        'school',
        'gym',
        'sleep',
        'meal',
        'commute',
        'leisure',
        'other'
      )
    ),

  title text,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =========================================================
-- DAILY ACTIVITIES
-- =========================================================

create table if not exists public.daily_activities (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,

  date date not null,

  type text not null
    check (
      type in (
        'school',
        'gym',
        'sleep',
        'meal',
        'commute',
        'leisure',
        'other'
      )
    ),

  title text not null,

  start_time time,
  end_time time,

  duration_minutes integer
    check (
      duration_minutes is null
      or duration_minutes >= 0
    ),

  notes text,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =========================================================
-- EXAMS
-- =========================================================

create table if not exists public.exams (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,

  title text not null,

  subject_id uuid references public.subjects(id) on delete set null,
  topic_id uuid references public.topics(id) on delete set null,

  exam_date timestamptz not null,

  target_score numeric,
  max_score numeric,

  actual_score numeric,

  status text default 'upcoming'
    check (
      status in (
        'upcoming',
        'completed',
        'cancelled'
      )
    ),

  priority text default 'medium'
    check (
      priority in (
        'low',
        'medium',
        'high'
      )
    ),

  notes text,
  preparation_notes text,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =========================================================
-- TESTS
-- =========================================================

create table if not exists public.tests (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,

  title text not null,

  subject_id uuid references public.subjects(id) on delete set null,
  topic_id uuid references public.topics(id) on delete set null,

  test_date timestamptz not null,

  question_count integer default 0,
  correct_count integer default 0,
  wrong_count integer default 0,
  blank_count integer default 0,

  duration_minutes integer default 0,

  score numeric,
  max_score numeric,

  percentage numeric,

  notes text,
  self_analysis text,

  difficulty text default 'medium'
    check (
      difficulty in (
        'easy',
        'medium',
        'hard'
      )
    ),

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =========================================================
-- TEST QUESTIONS
-- =========================================================

create table if not exists public.test_questions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,

  test_id uuid not null references public.tests(id) on delete cascade,

  question_number integer not null,

  result text default 'blank'
    check (
      result in (
        'correct',
        'wrong',
        'blank'
      )
    ),

  time_seconds integer default 0,

  difficulty text,

  notes text,

  created_at timestamptz default now()
);

-- =========================================================
-- MISTAKE CATEGORIES
-- =========================================================

create table if not exists public.mistake_categories (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,

  name text not null,

  is_default boolean default false,

  created_at timestamptz default now()
);

-- =========================================================
-- MISTAKES
-- =========================================================

create table if not exists public.mistakes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,

  test_id uuid references public.tests(id) on delete cascade,
  question_id uuid references public.test_questions(id) on delete cascade,

  subject_id uuid references public.subjects(id) on delete set null,
  topic_id uuid references public.topics(id) on delete set null,

  category_id uuid references public.mistake_categories(id) on delete set null,

  description text,
  correction text,

  resolved boolean default false,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =========================================================
-- TASKS
-- =========================================================

create table if not exists public.tasks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,

  title text not null,
  description text,

  subject_id uuid references public.subjects(id) on delete set null,
  topic_id uuid references public.topics(id) on delete set null,

  due_date timestamptz,

  estimated_minutes integer
    check (
      estimated_minutes is null
      or estimated_minutes >= 0
    ),

  actual_minutes integer default 0
    check (actual_minutes >= 0),

  priority text default 'medium'
    check (
      priority in (
        'low',
        'medium',
        'high'
      )
    ),

  status text default 'todo'
    check (
      status in (
        'todo',
        'in_progress',
        'completed',
        'cancelled'
      )
    ),

  approved_reschedule boolean default false,

  notes text,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =========================================================
-- GOALS
-- =========================================================

create table if not exists public.goals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,

  title text not null,
  description text,

  type text not null
    check (
      type in (
        'daily_hours',
        'weekly_hours',
        'monthly_hours',
        'subject_hours',
        'topic',
        'book',
        'score',
        'percentage',
        'custom'
      )
    ),

  subject_id uuid references public.subjects(id) on delete set null,
  topic_id uuid references public.topics(id) on delete set null,

  start_date date,
  end_date date,

  target_value numeric not null default 0,
  current_value numeric not null default 0,

  unit text,

  status text default 'active'
    check (
      status in (
        'active',
        'completed',
        'paused',
        'cancelled'
      )
    ),

  notes text,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =========================================================
-- PLANNER ITEMS
-- =========================================================

create table if not exists public.planner_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,

  date date not null,

  title text not null,

  subject_id uuid references public.subjects(id) on delete set null,
  topic_id uuid references public.topics(id) on delete set null,

  start_time time,
  end_time time,

  duration_minutes integer default 0,

  priority text default 'medium'
    check (
      priority in (
        'low',
        'medium',
        'high'
      )
    ),

  status text default 'planned'
    check (
      status in (
        'planned',
        'in_progress',
        'completed',
        'skipped'
      )
    ),

  task_id uuid references public.tasks(id) on delete set null,

  notes text,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =========================================================
-- JOURNAL
-- =========================================================

create table if not exists public.journal_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,

  title text not null,
  content text not null,

  category text default 'general',

  entry_date date not null default current_date,

  mood integer
    check (
      mood is null
      or mood between 1 and 5
    ),

  tags text[] default '{}',

  ai_summary text,
  ai_insights jsonb,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =========================================================
-- SLEEP
-- =========================================================

create table if not exists public.sleep_records (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,

  date date not null,

  sleep_start timestamptz,
  sleep_end timestamptz,

  duration_minutes integer
    check (
      duration_minutes is null
      or duration_minutes >= 0
    ),

  rest_quality integer
    check (
      rest_quality is null
      or rest_quality between 1 and 5
    ),

  notes text,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =========================================================
-- NOTIFICATION SETTINGS
-- =========================================================

create table if not exists public.notification_settings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid unique not null references auth.users(id) on delete cascade,

  study_start boolean default true,
  study_end boolean default true,
  breaks boolean default true,
  exams boolean default true,
  overdue_tasks boolean default true,
  reports boolean default true,
  goals boolean default true,
  reviews boolean default true,
  falling_behind boolean default true,

  in_app boolean default true,
  browser boolean default true,

  quiet_hours_enabled boolean default false,
  quiet_start time,
  quiet_end time,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =========================================================
-- NOTIFICATIONS
-- =========================================================

create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,

  title text not null,
  message text not null,

  type text default 'general',

  read boolean default false,

  scheduled_at timestamptz,
  sent_at timestamptz,

  created_at timestamptz default now()
);

-- =========================================================
-- ACHIEVEMENTS
-- =========================================================

create table if not exists public.achievements (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,

  key text not null,
  title text not null,
  description text,

  progress integer default 0,
  target integer default 1,

  unlocked boolean default false,
  unlocked_at timestamptz,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =========================================================
-- STREAKS
-- =========================================================

create table if not exists public.study_streaks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid unique not null references auth.users(id) on delete cascade,

  current_streak integer default 0,
  longest_streak integer default 0,

  last_study_date date,

  updated_at timestamptz default now()
);

-- =========================================================
-- INDEXES
-- =========================================================

create index if not exists subjects_user_id_idx
on public.subjects(user_id);

create index if not exists topics_user_id_idx
on public.topics(user_id);

create index if not exists topics_subject_id_idx
on public.topics(subject_id);

create index if not exists resources_user_id_idx
on public.resources(user_id);

create index if not exists study_sessions_user_id_idx
on public.study_sessions(user_id);

create index if not exists study_sessions_started_at_idx
on public.study_sessions(started_at);

create index if not exists availability_user_date_idx
on public.daily_availability(user_id, date);

create index if not exists activities_user_date_idx
on public.daily_activities(user_id, date);

create index if not exists exams_user_date_idx
on public.exams(user_id, exam_date);

create index if not exists tests_user_date_idx
on public.tests(user_id, test_date);

create index if not exists tasks_user_due_date_idx
on public.tasks(user_id, due_date);

create index if not exists goals_user_id_idx
on public.goals(user_id);

create index if not exists planner_user_date_idx
on public.planner_items(user_id, date);

create index if not exists journal_user_date_idx
on public.journal_entries(user_id, entry_date);

create index if not exists sleep_user_date_idx
on public.sleep_records(user_id, date);

create index if not exists notifications_user_id_idx
on public.notifications(user_id);

-- =========================================================
-- UPDATED_AT FUNCTION
-- =========================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================================================
-- UPDATED_AT TRIGGERS
-- =========================================================

drop trigger if exists profiles_updated_at
on public.profiles;

create trigger profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists subjects_updated_at
on public.subjects;

create trigger subjects_updated_at
before update on public.subjects
for each row execute function public.set_updated_at();

drop trigger if exists topics_updated_at
on public.topics;

create trigger topics_updated_at
before update on public.topics
for each row execute function public.set_updated_at();

drop trigger if exists resources_updated_at
on public.resources;

create trigger resources_updated_at
before update on public.resources
for each row execute function public.set_updated_at();

drop trigger if exists study_sessions_updated_at
on public.study_sessions;

create trigger study_sessions_updated_at
before update on public.study_sessions
for each row execute function public.set_updated_at();

drop trigger if exists exams_updated_at
on public.exams;

create trigger exams_updated_at
before update on public.exams
for each row execute function public.set_updated_at();

drop trigger if exists tests_updated_at
on public.tests;

create trigger tests_updated_at
before update on public.tests
for each row execute function public.set_updated_at();

drop trigger if exists mistakes_updated_at
on public.mistakes;

create trigger mistakes_updated_at
before update on public.mistakes
for each row execute function public.set_updated_at();

drop trigger if exists tasks_updated_at
on public.tasks;

create trigger tasks_updated_at
before update on public.tasks
for each row execute function public.set_updated_at();

drop trigger if exists goals_updated_at
on public.goals;

create trigger goals_updated_at
before update on public.goals
for each row execute function public.set_updated_at();

drop trigger if exists planner_items_updated_at
on public.planner_items;

create trigger planner_items_updated_at
before update on public.planner_items
for each row execute function public.set_updated_at();

drop trigger if exists journal_entries_updated_at
on public.journal_entries;

create trigger journal_entries_updated_at
before update on public.journal_entries
for each row execute function public.set_updated_at();

drop trigger if exists sleep_records_updated_at
on public.sleep_records;

create trigger sleep_records_updated_at
before update on public.sleep_records
for each row execute function public.set_updated_at();

drop trigger if exists notification_settings_updated_at
on public.notification_settings;

create trigger notification_settings_updated_at
before update on public.notification_settings
for each row execute function public.set_updated_at();

drop trigger if exists achievements_updated_at
on public.achievements;

create trigger achievements_updated_at
before update on public.achievements
for each row execute function public.set_updated_at();

-- =========================================================
-- CREATE PROFILE AFTER SIGNUP
-- =========================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    full_name
  )
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      ''
    )
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created
on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- =========================================================
-- DEFAULT MISTAKE CATEGORIES
-- =========================================================

create or replace function public.create_default_mistake_categories()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.mistake_categories (
    user_id,
    name,
    is_default
  )
  values
    (new.id, 'بی‌دقتی', true),
    (new.id, 'ضعف مفهومی', true),
    (new.id, 'فراموشی', true),
    (new.id, 'کمبود زمان', true),
    (new.id, 'شک و تردید', true),
    (new.id, 'محاسباتی', true),
    (new.id, 'ناشناخته بودن مبحث', true),
    (new.id, 'سایر', true);

  return new;
end;
$$;

drop trigger if exists create_default_categories
on auth.users;

create trigger create_default_categories
after insert on auth.users
for each row
execute function public.create_default_mistake_categories();

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================

alter table public.profiles enable row level security;
alter table public.subjects enable row level security;
alter table public.topics enable row level security;
alter table public.resources enable row level security;
alter table public.study_sessions enable row level security;
alter table public.daily_availability enable row level security;
alter table public.daily_activities enable row level security;
alter table public.exams enable row level security;
alter table public.tests enable row level security;
alter table public.test_questions enable row level security;
alter table public.mistake_categories enable row level security;
alter table public.mistakes enable row level security;
alter table public.tasks enable row level security;
alter table public.goals enable row level security;
alter table public.planner_items enable row level security;
alter table public.journal_entries enable row level security;
alter table public.sleep_records enable row level security;
alter table public.notification_settings enable row level security;
alter table public.notifications enable row level security;
alter table public.achievements enable row level security;
alter table public.study_streaks enable row level security;

-- =========================================================
-- RLS POLICIES
-- =========================================================

create policy "profiles_select_own"
on public.profiles
for select
using (auth.uid() = id);

create policy "profiles_insert_own"
on public.profiles
for insert
with check (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "profiles_delete_own"
on public.profiles
for delete
using (auth.uid() = id);


create policy "subjects_all_own"
on public.subjects
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


create policy "topics_all_own"
on public.topics
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


create policy "resources_all_own"
on public.resources
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


create policy "study_sessions_all_own"
on public.study_sessions
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


create policy "daily_availability_all_own"
on public.daily_availability
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


create policy "daily_activities_all_own"
on public.daily_activities
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


create policy "exams_all_own"
on public.exams
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


create policy "tests_all_own"
on public.tests
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


create policy "test_questions_all_own"
on public.test_questions
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


create policy "mistake_categories_all_own"
on public.mistake_categories
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


create policy "mistakes_all_own"
on public.mistakes
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


create policy "tasks_all_own"
on public.tasks
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


create policy "goals_all_own"
on public.goals
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


create policy "planner_items_all_own"
on public.planner_items
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


create policy "journal_entries_all_own"
on public.journal_entries
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


create policy "sleep_records_all_own"
on public.sleep_records
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


create policy "notification_settings_all_own"
on public.notification_settings
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


create policy "notifications_all_own"
on public.notifications
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


create policy "achievements_all_own"
on public.achievements
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


create policy "study_streaks_all_own"
on public.study_streaks
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- =========================================================
-- DONE
-- =========================================================
