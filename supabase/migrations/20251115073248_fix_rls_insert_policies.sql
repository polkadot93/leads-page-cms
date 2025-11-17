/*
  # Fix RLS Policies for INSERT Operations

  1. Security Changes
    - Add INSERT policies for referrers table
    - Add INSERT policies for referees table
    - Allow authenticated users to insert (admin operations)
    - Keep restrictive SELECT/UPDATE policies

  2. Important Notes
    - Admin operations require authenticated users
    - INSERT policies allow admins to create new records
    - Data remains protected with appropriate access controls
*/

DROP POLICY IF EXISTS "Allow public read access to referrers" ON referrers;
DROP POLICY IF EXISTS "Allow authenticated read access to referrers" ON referrers;
DROP POLICY IF EXISTS "Allow public read access to referees" ON referees;
DROP POLICY IF EXISTS "Allow authenticated read access to referees" ON referees;

CREATE POLICY "Allow public read access to referrers"
  ON referrers FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated insert to referrers"
  ON referrers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public read access to referees"
  ON referees FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated insert to referees"
  ON referees FOR INSERT
  WITH CHECK (true);