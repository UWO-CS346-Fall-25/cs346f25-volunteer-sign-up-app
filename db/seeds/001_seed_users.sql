-- Seed: Sample Users
-- Description: Inserts sample user data for development/testing
-- Note: In production, use proper password hashing (bcrypt)

-- Insert sample users
-- Password: 'password123' (In production, this should be hashed with bcrypt)
INSERT INTO users (first_name, last_name, email, password, joined_events) VALUES
  ('John', 'Doe', 'john@example.com', 'password', ARRAY[]::UUID[]),
  ('Jane', 'Smith', 'jane@example.com', 'password', ARRAY[]::UUID[]),
  ('Admin', 'User', 'admin@example.com', 'password', ARRAY[]::UUID[]);

-- Note: The passwords above are placeholders.
-- You should:
-- 1. Install bcrypt: npm install bcrypt
-- 2. Hash passwords properly before storing
-- 3. Never commit real passwords to version control
