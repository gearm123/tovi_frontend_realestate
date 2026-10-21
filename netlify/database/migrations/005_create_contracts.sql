CREATE TABLE IF NOT EXISTS contracts (
  id text PRIMARY KEY,
  token text NOT NULL UNIQUE,
  status text NOT NULL,
  data jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS contracts_status_created_idx
  ON contracts (status, created_at DESC);
