-- Seed: Sample Opportunities
-- Description: Inserts sample opportunity data for development/testing

-- Insert sample opportunities
INSERT INTO opportunities (title, description, created_by, organizers, zip_code, event_begin, event_end) VALUES
  ('Opportunity 1', 'Description 1', gen_random_uuid(), [], 12345, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Opportunity 2', 'Description 2', gen_random_uuid(), [], 12345, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Opportunity 3', 'Description 3', gen_random_uuid(), [], 23456, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Opportunity 4', 'Description 4', gen_random_uuid(), [], 23456, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('Opportunity 5', 'Description 5', gen_random_uuid(), [], 34567, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
