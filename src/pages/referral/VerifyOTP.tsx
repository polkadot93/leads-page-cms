import { useState } from 'react';
import { referralApi } from '../../lib/api';
import { Shield } from 'lucide-react';

const TEST_OTP = '123456'; // Hardcoded OTP for testing

interface VerifyOTPProps {
  uuid: string;
}

export function VerifyOTP({ uuid }: VerifyOTPProps) {
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');

    if (otp.length !== 6) {
      setError('Please enter a 6-digit OTP');
      return;
    }

    try {
      setVerifying(true);
      await referralApi.verifyOTP(uuid, otp);
      window.location.href = `/ref/${uuid}/success`;
    } catch (err: any) {
      setError(err.message);
      setVerifying(false);
    }
  }

  async function handleResend() {
    setError('');
    setMessage('');

    try {
      setResending(true);
      await referralApi.resendOTP(uuid);
      setMessage('New OTP sent! Check your console.');
      setOtp('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="text-blue-600" size={40} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Verify Your Submission
            </h1>
            <p className="text-gray-600">
              We've sent a 6-digit OTP to your email. Check the console for the OTP.
            </p>
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-700 font-semibold">
                🔧 Testing Mode: Your OTP is <span className="text-2xl font-bold text-yellow-900">{TEST_OTP}</span>
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
              {message}
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="000000"
              />
            </div>

            <div className="text-center">
              <div className="text-sm text-gray-500 mb-4">Step 4 of 5</div>
              <button
                type="submit"
                disabled={verifying || otp.length !== 6}
                className="w-full px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {verifying ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
            >
              {resending ? 'Resending...' : 'Resend OTP'}
            </button>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> For demo purposes, the OTP is logged to the browser console.
              In production, this would be sent via email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
