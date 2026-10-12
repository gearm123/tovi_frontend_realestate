CREATE TABLE IF NOT EXISTS articles (
  id text PRIMARY KEY,
  data jsonb NOT NULL,
  sort_index bigint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS articles_sort_index_idx ON articles (sort_index, id);
