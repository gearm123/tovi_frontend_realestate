CREATE TABLE IF NOT EXISTS failed_leads (
  id text PRIMARY KEY,
  data jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS failed_leads_created_at_idx ON failed_leads (created_at DESC);
