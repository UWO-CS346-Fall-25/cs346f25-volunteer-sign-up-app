create table public.users (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  first_name text not null,
  last_name text not null,
  email text not null,
  password text not null,
  updated_at timestamp with time zone not null default now(),
  joined_events uuid[] not null,
  constraint users_pkey primary key (id),
  constraint users_email_key unique (email),
  constraint users_email_check check ((length(email) < 256)),
  constraint users_first_name_check check ((length(first_name) < 51)),
  constraint users_last_name_check check ((length(last_name) < 51))
) TABLESPACE pg_default;