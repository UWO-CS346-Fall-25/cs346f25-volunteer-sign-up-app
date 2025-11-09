-- Migration: Create Opportunities Table
-- Description: Creates the opportunities table with basic authentication fields
-- Created: 2025

-- Create opportunities table
CREATE TABLE IF NOT EXISTS opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(250) NOT NULL,
  description VARCHAR(1000) NOT NULL,
  created_by UUID NOT NULL,
  organizers UUID[] NOT NULL,
  zip_code INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  event_begin TIMESTAMPTZ NOT NULL,
  event_end TIMESTAMPTZ NOT NULL
);

-- Add a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON opportunities
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();