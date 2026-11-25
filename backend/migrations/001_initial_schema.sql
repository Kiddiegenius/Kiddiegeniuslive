CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS parents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  adult_confirmed_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
  nickname VARCHAR(24) NOT NULL,
  grade VARCHAR(1) NOT NULL CHECK (grade IN ('K','1','2','3','4','5')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  grade VARCHAR(1) NOT NULL CHECK (grade IN ('K','1','2','3','4','5')),
  subject TEXT NOT NULL CHECK (subject IN ('math','ela','science','social-studies','arts')),
  strand TEXT NOT NULL,
  benchmark_code TEXT,
  learning_objective TEXT NOT NULL,
  estimated_minutes SMALLINT NOT NULL DEFAULT 10 CHECK (estimated_minutes BETWEEN 1 AND 60),
  sort_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('started','completed')),
  score SMALLINT CHECK (score BETWEEN 0 AND 100),
  time_spent_seconds INTEGER NOT NULL DEFAULT 0 CHECK (time_spent_seconds BETWEEN 0 AND 7200),
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (child_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS children_parent_id_idx ON children(parent_id);
CREATE INDEX IF NOT EXISTS lesson_progress_child_id_idx ON lesson_progress(child_id);
CREATE INDEX IF NOT EXISTS lessons_grade_subject_idx ON lessons(grade, subject, published);
