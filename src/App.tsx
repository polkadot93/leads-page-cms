import { Router, useRouter } from './Router';
import { ReferrersList } from './pages/admin/ReferrersList';
import { NewReferrer } from './pages/admin/NewReferrer';
import { RefereesList } from './pages/admin/RefereesList';
import { NewReferee } from './pages/admin/NewReferee';
import { SubmissionsList } from './pages/admin/SubmissionsList';
import { Landing } from './pages/referral/Landing';
import { Colleagues } from './pages/referral/Colleagues';
import { ReferralForm } from './pages/referral/ReferralForm';
import { VerifyOTP } from './pages/referral/VerifyOTP';
import { Success } from './pages/referral/Success';
import { Home } from 'lucide-react';

function AppContent() {
  const { path } = useRouter();

  if (path === '/admin/referrers') {
    return <ReferrersList />;
  }

  if (path === '/admin/referrers/new') {
    return <NewReferrer />;
  }

  if (path === '/admin/referees') {
    return <RefereesList />;
  }

  if (path === '/admin/referees/new') {
    return <NewReferee />;
  }

  if (path === '/admin/submissions') {
    return <SubmissionsList />;
  }

  const refMatch = path.match(/^\/ref\/([a-f0-9-]+)$/);
  if (refMatch) {
    return <Landing uuid={refMatch[1]} />;
  }

  const colleaguesMatch = path.match(/^\/ref\/([a-f0-9-]+)\/colleagues$/);
  if (colleaguesMatch) {
    return <Colleagues uuid={colleaguesMatch[1]} />;
  }

  const formMatch = path.match(/^\/ref\/([a-f0-9-]+)\/form$/);
  if (formMatch) {
    return <ReferralForm uuid={formMatch[1]} />;
  }

  const verifyMatch = path.match(/^\/ref\/([a-f0-9-]+)\/verify$/);
  if (verifyMatch) {
    return <VerifyOTP uuid={verifyMatch[1]} />;
  }

  const successMatch = path.match(/^\/ref\/([a-f0-9-]+)\/success$/);
  if (successMatch) {
    return <Success />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Home className="text-blue-600" size={40} />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Elevate Pay Referral System
            </h1>
            <p className="text-xl text-gray-600">
              Manage your referral program and track submissions
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 hover:shadow-md transition">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">Admin Portal</h2>
              <p className="text-blue-700 mb-6">
                Manage referrers, referees, and view submissions
              </p>
              <div className="space-y-3">
                <a
                  href="/admin/referrers"
                  className="block px-4 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium text-center"
                >
                  Manage Referrers
                </a>
                <a
                  href="/admin/referees"
                  className="block px-4 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium text-center"
                >
                  Manage Referees
                </a>
                <a
                  href="/admin/submissions"
                  className="block px-4 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium text-center"
                >
                  View Submissions
                </a>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 hover:shadow-md transition">
              <h2 className="text-2xl font-bold text-green-900 mb-4">Test Referral</h2>
              <p className="text-green-700 mb-6">
                Try out the referral flow with sample data
              </p>
              <div className="bg-white rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 mb-2">Sample referrer UUID:</p>
                <code className="text-xs font-mono text-gray-900 break-all">
                  Check /admin/referrers for UUIDs
                </code>
              </div>
              <p className="text-sm text-green-700">
                Navigate to <code className="bg-white px-2 py-1 rounded">/ref/[uuid]</code> to start
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
