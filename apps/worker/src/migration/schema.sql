-- Clear the table if it already exists (useful for local development resets)
DROP TABLE IF EXISTS secrets;

-- Create the core secrets table
CREATE TABLE secrets (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL, -- 'message' or 'file'
  cipher_text TEXT NOT NULL, -- The encrypted base64 payload OR the R2 object key
  iv TEXT NOT NULL, -- The Initialization Vector for AES-GCM
  is_burn_after_read INTEGER NOT NULL DEFAULT 1, -- SQLite uses 1 (true) and 0 (false)
  expires_at INTEGER NOT NULL, -- Unix timestamp for absolute expiration
  created_at INTEGER NOT NULL DEFAULT (unixepoch()) -- Automatically sets current Unix time
);

-- Create an index on expires_at. 
-- This ensures that when your Cron Job runs `SELECT ... WHERE expires_at < ?`, 
-- it scans instantly instead of checking every single row in the database.
CREATE INDEX idx_secrets_expires_at ON secrets(expires_at);