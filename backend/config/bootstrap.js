import pool from './db.js';

export async function ensureWorkflowSchema() {
  const statements = [
    "ALTER TYPE case_status ADD VALUE IF NOT EXISTS 'pending_chief'",
    "ALTER TYPE case_status ADD VALUE IF NOT EXISTS 'pending_dsw'",
    "ALTER TYPE case_status ADD VALUE IF NOT EXISTS 'pending_admin'",
    "ALTER TYPE case_status ADD VALUE IF NOT EXISTS 'resolved'",
    'ALTER TABLE cases ADD COLUMN IF NOT EXISTS created_by INT REFERENCES users(id)',
    'ALTER TABLE cases ADD COLUMN IF NOT EXISTS assigned_to_role user_role',
    'ALTER TABLE notifications ADD COLUMN IF NOT EXISTS case_id INT REFERENCES cases(id)',
    'ALTER TABLE notifications ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE',
    `
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'notifications' AND column_name = 'read'
      ) THEN
        EXECUTE 'UPDATE notifications SET is_read = COALESCE(is_read, read)';
        EXECUTE 'ALTER TABLE notifications DROP COLUMN read';
      END IF;
    END
    $$
    `,
    `
    UPDATE cases
    SET created_by = COALESCE(created_by, reported_by)
    WHERE created_by IS NULL
    `,
    `
    UPDATE cases
    SET
      status = CASE
        WHEN status::text IN ('resolved') THEN 'resolved'::case_status
        WHEN status::text IN ('dac_review', 'pending_admin') THEN 'pending_admin'::case_status
        WHEN status::text IN ('investigation', 'pending_dsw') THEN 'pending_dsw'::case_status
        ELSE 'pending_chief'::case_status
      END,
      assigned_to_role = CASE
        WHEN status::text = 'resolved' THEN NULL
        WHEN status::text IN ('pending_admin', 'dac_review') THEN 'admin'::user_role
        WHEN status::text IN ('pending_dsw', 'investigation') THEN 'dsw'::user_role
        ELSE 'chief_warden'::user_role
      END
    `,
  ];

  for (const statement of statements) {
    await pool.query(statement);
  }
}
