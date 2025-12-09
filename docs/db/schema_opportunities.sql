create table public.opportunities (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  event_begin timestamp with time zone not null,
  event_end timestamp with time zone not null,
  zip_code integer not null,
  title text not null,
  description text not null,
  image text,
  created_by uuid,
  organizers uuid[] not null,
  constraint opportunities_pkey primary key (id),
  constraint opportunities_description_check check ((length(description) < 1001)),
  constraint opportunities_title_check check ((length(title) < 251))
) TABLESPACE pg_default;