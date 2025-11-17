import { CheckCircle } from 'lucide-react';

export function Success() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600" size={56} />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Thank You!
          </h1>

          <p className="text-xl text-gray-700 mb-6">
            Your referral has been submitted successfully.
          </p>

          <div className="bg-green-50 rounded-lg p-6 mb-8">
            <p className="text-green-900">
              We'll review your referrals and process your rewards shortly.
              You'll receive an update via email once everything is confirmed.
            </p>
          </div>

          <div className="text-sm text-gray-500">Step 5 of 5 - Complete!</div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-gray-600">
              Thank you for being part of the Elevate Pay community and helping us grow!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
