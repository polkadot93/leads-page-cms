/*
  # Create Referral Campaign System

  1. New Tables
    - `referrers`
      - `id` (int, primary key, auto-increment)
      - `uuid` (uuid, unique, default gen_random_uuid())
      - `name` (text)
      - `company_name` (text)
      - `email` (text, unique)
      - `created_at` (timestamptz, default now())
    
    - `referees`
      - `id` (int, primary key, auto-increment)
      - `name` (text)
      - `email` (text, unique)
      - `company_name` (text)
    
    - `referral_submissions`
      - `id` (int, primary key, auto-increment)
      - `referrer_id` (int, unique, foreign key to referrers)
      - `testimonial` (text)
      - `image_url` (text, nullable)
      - `selected_referees` (jsonb)
      - `submitted_at` (timestamptz, default now())
    
    - `app_settings`
      - `key` (text, primary key)
      - `value` (text)

  2. Security
    - Enable RLS on all tables
    - Public read access for referrers and referees (needed for public referral flow)
    - Public insert access for referral_submissions (needed for public submissions)
    - Admin operations will use service role key

  3. Indexes
    - Index on company_name for referrers and referees (for fast company matching)

  4. Important Notes
    - Using serial (auto-increment integers) for IDs as specified
    - UUID field for referrers is separate from the primary key
    - One-to-one relationship between referrers and submissions enforced by unique constraint
    - Case-insensitive company matching will be handled in application logic
*/

CREATE TABLE IF NOT EXISTS referrers (
  id serial PRIMARY KEY,
  uuid uuid UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company_name text NOT NULL,
  email text UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_referrers_company_name ON referrers(company_name);

CREATE TABLE IF NOT EXISTS referees (
  id serial PRIMARY KEY,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  company_name text NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_referees_company_name ON referees(company_name);

CREATE TABLE IF NOT EXISTS referral_submissions (
  id serial PRIMARY KEY,
  referrer_id int UNIQUE NOT NULL REFERENCES referrers(id) ON DELETE CASCADE,
  testimonial text NOT NULL,
  image_url text,
  selected_referees jsonb NOT NULL,
  submitted_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS app_settings (
  key text PRIMARY KEY,
  value text NOT NULL
);

INSERT INTO app_settings (key, value) 
VALUES ('referral_bonus_amount', '10')
ON CONFLICT (key) DO NOTHING;

ALTER TABLE referrers ENABLE ROW LEVEL SECURITY;
ALTER TABLE referees ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to referrers"
  ON referrers FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated read access to referrers"
  ON referrers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow public read access to referees"
  ON referees FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated read access to referees"
  ON referees FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow public insert to referral_submissions"
  ON referral_submissions FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public read access to referral_submissions"
  ON referral_submissions FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated read access to referral_submissions"
  ON referral_submissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow public read access to app_settings"
  ON app_settings FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow authenticated read access to app_settings"
  ON app_settings FOR SELECT
  TO authenticated
  USING (true);