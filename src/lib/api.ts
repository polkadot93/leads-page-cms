import { supabase } from './supabase';
import type { Referrer, Referee, ReferralSubmission } from './supabase';

const TEST_OTP = '123456'; // Hardcoded OTP for testing

// Store submission data in sessionStorage so it persists across page navigations
function getSubmissionData(uuid: string) {
  const data = sessionStorage.getItem(`submission_${uuid}`);
  return data ? JSON.parse(data) : null;
}

function setSubmissionData(uuid: string, formData: any) {
  sessionStorage.setItem(`submission_${uuid}`, JSON.stringify(formData));
}

function clearSubmissionData(uuid: string) {
  sessionStorage.removeItem(`submission_${uuid}`);
}

export const adminApi = {
  async createReferrer(data: { name: string; email: string; company_name: string }) {
    const { data: referrer, error } = await supabase
      .from('referrers')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return referrer;
  },

  async getReferrers() {
    const { data, error } = await supabase
      .from('referrers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createReferee(data: { name: string; email: string; company_name: string }) {
    const { data: referee, error } = await supabase
      .from('referees')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return referee;
  },

  async getReferees() {
    const { data, error } = await supabase
      .from('referees')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    return data;
  },

  async getSubmissions() {
    const { data, error } = await supabase
      .from('referral_submissions')
      .select(`
        *,
        referrers (
          name,
          email,
          company_name
        )
      `)
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};

export const referralApi = {
  async getReferrerByUuid(uuid: string): Promise<Referrer | null> {
    const { data, error } = await supabase
      .from('referrers')
      .select('*')
      .eq('uuid', uuid)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async checkIfSubmitted(referrerId: number): Promise<boolean> {
    const { data, error } = await supabase
      .from('referral_submissions')
      .select('id')
      .eq('referrer_id', referrerId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  },

  async getColleagues(companyName: string): Promise<Referee[]> {
    const { data, error } = await supabase
      .from('referees')
      .select('*')
      .ilike('company_name', companyName);

    if (error) throw error;
    return data || [];
  },

  async getBonusAmount(): Promise<number> {
    const { data, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'referral_bonus_amount')
      .maybeSingle();

    if (error) throw error;
    return data ? parseInt(data.value) : 10;
  },

  async submitReferral(uuid: string, formData: {
    testimonial: string;
    image_url?: string;
    selected_referees: number[];
  }) {
    setSubmissionData(uuid, formData);
    console.log(`OTP for ${uuid}: ${TEST_OTP}`);
    return { success: true, message: 'OTP sent to your email', otp: TEST_OTP };
  },

  async verifyOTP(uuid: string, otp: string) {
    const stored = getSubmissionData(uuid);

    if (!stored) {
      throw new Error('No submission found. Please submit the form again.');
    }

    if (otp !== TEST_OTP) {
      throw new Error('Invalid OTP. Please try again.');
    }

    const referrer = await this.getReferrerByUuid(uuid);
    if (!referrer) {
      throw new Error('Referrer not found');
    }

    const { data, error } = await supabase
      .from('referral_submissions')
      .insert([{
        referrer_id: referrer.id,
        testimonial: stored.testimonial,
        image_url: stored.image_url || null,
        selected_referees: stored.selected_referees
      }])
      .select()
      .single();

    if (error) throw error;

    clearSubmissionData(uuid);

    return data;
  },

  async resendOTP(uuid: string) {
    const stored = getSubmissionData(uuid);

    if (!stored) {
      throw new Error('No pending submission. Please submit the form first.');
    }

    console.log(`OTP for ${uuid}: ${TEST_OTP}`);

    return { success: true, message: 'New OTP sent to your email', otp: TEST_OTP };
  }
};
