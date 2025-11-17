import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Referrer {
  id: number;
  uuid: string;
  name: string;
  company_name: string;
  email: string;
  created_at: string;
}

export interface Referee {
  id: number;
  name: string;
  email: string;
  company_name: string;
}

export interface ReferralSubmission {
  id: number;
  referrer_id: number;
  testimonial: string;
  image_url: string | null;
  selected_referees: number[];
  submitted_at: string;
}

export interface AppSetting {
  key: string;
  value: string;
}
