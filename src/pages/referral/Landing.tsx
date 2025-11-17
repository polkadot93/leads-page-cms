import { useEffect, useState } from 'react';
import { referralApi } from '../../lib/api';
import type { Referrer } from '../../lib/supabase';
import { Gift } from 'lucide-react';

interface LandingProps {
  uuid: string;
}

export function Landing({ uuid }: LandingProps) {
  const [referrer, setReferrer] = useState<Referrer | null>(null);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReferrerData();
  }, [uuid]);

  async function loadReferrerData() {
    try {
      setLoading(true);
      const referrerData = await referralApi.getReferrerByUuid(uuid);

      if (!referrerData) {
        setError('Invalid referral link');
        return;
      }

      setReferrer(referrerData);
      const submitted = await referralApi.checkIfSubmitted(referrerData.id);
      setAlreadySubmitted(submitted);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error || !referrer) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="text-red-600 text-lg font-medium">{error || 'Referrer not found'}</div>
        </div>
      </div>
    );
  }

  if (alreadySubmitted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="text-green-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Already Completed</h1>
          <p className="text-gray-600">
            You have already submitted your referrals. Thank you for participating in our program!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Gift className="text-blue-600" size={40} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Hi <span className="text-blue-600">{referrer.name}</span>!
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              You've been a wonderful user at <span className="font-semibold">Elevate Pay</span>.
              Refer colleagues and earn cash rewards for each successful referral.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h2 className="font-semibold text-gray-900 mb-2">How it works:</h2>
            <ol className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="font-bold text-blue-600 mr-2">1.</span>
                <span>See how many colleagues from your company we found</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-blue-600 mr-2">2.</span>
                <span>Share your experience with Elevate Pay</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-blue-600 mr-2">3.</span>
                <span>Select colleagues to refer</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-blue-600 mr-2">4.</span>
                <span>Earn rewards for each referral</span>
              </li>
            </ol>
          </div>

          <div className="text-center">
            <div className="text-sm text-gray-500 mb-4">Step 1 of 5</div>
            <a
              href={`/ref/${uuid}/colleagues`}
              className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-lg shadow-md hover:shadow-lg"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
