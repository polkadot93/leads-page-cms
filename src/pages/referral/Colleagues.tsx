import { useEffect, useState } from 'react';
import { referralApi } from '../../lib/api';
import type { Referrer, Referee } from '../../lib/supabase';
import { Users, DollarSign } from 'lucide-react';

interface ColleaguesProps {
  uuid: string;
}

export function Colleagues({ uuid }: ColleaguesProps) {
  const [referrer, setReferrer] = useState<Referrer | null>(null);
  const [colleagues, setColleagues] = useState<Referee[]>([]);
  const [bonusAmount, setBonusAmount] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [uuid]);

  async function loadData() {
    try {
      setLoading(true);
      const referrerData = await referralApi.getReferrerByUuid(uuid);

      if (!referrerData) {
        setError('Invalid referral link');
        return;
      }

      const submitted = await referralApi.checkIfSubmitted(referrerData.id);
      if (submitted) {
        window.location.href = `/ref/${uuid}`;
        return;
      }

      setReferrer(referrerData);

      const [colleaguesData, bonus] = await Promise.all([
        referralApi.getColleagues(referrerData.company_name),
        referralApi.getBonusAmount()
      ]);

      setColleagues(colleaguesData);
      setBonusAmount(bonus);
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

  const totalReward = colleagues.length * bonusAmount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="text-green-600" size={40} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Great News!
            </h1>
            <p className="text-xl text-gray-700 mb-6">
              We found <span className="font-bold text-blue-600">{colleagues.length} colleagues</span> at{' '}
              <span className="font-semibold">{referrer.company_name}</span>
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl p-8 mb-8 text-white text-center">
            <div className="flex items-center justify-center mb-3">
              <DollarSign size={32} className="mr-2" />
              <span className="text-5xl font-bold">${totalReward}</span>
            </div>
            <p className="text-blue-100 text-lg">
              Potential reward for referring all colleagues
            </p>
            <p className="text-blue-200 text-sm mt-2">
              ${bonusAmount} per successful referral
            </p>
          </div>



          <div className="text-center">
            <div className="text-sm text-gray-500 mb-4">Step 2 of 5</div>
            <a
              href={`/ref/${uuid}/form`}
              className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-lg shadow-md hover:shadow-lg"
            >
              Continue
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
