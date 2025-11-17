import { useEffect, useState } from 'react';
import { referralApi } from '../../lib/api';
import type { Referrer, Referee } from '../../lib/supabase';
import { FileText, Upload } from 'lucide-react';

interface ReferralFormProps {
  uuid: string;
}

export function ReferralForm({ uuid }: ReferralFormProps) {
  const [referrer, setReferrer] = useState<Referrer | null>(null);
  const [colleagues, setColleagues] = useState<Referee[]>([]);
  const [testimonial, setTestimonial] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [selectedReferees, setSelectedReferees] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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

      const colleaguesData = await referralApi.getColleagues(referrerData.company_name);
      setColleagues(colleaguesData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function toggleReferee(id: number) {
    setSelectedReferees(prev =>
      prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!testimonial.trim()) {
      setError('Please provide a testimonial');
      return;
    }

    if (selectedReferees.length === 0) {
      setError('Please select at least one colleague to refer');
      return;
    }

    try {
      setSubmitting(true);
      await referralApi.submitReferral(uuid, {
        testimonial,
        image_url: imagePreview || undefined,
        selected_referees: selectedReferees
      });

      window.location.href = `/ref/${uuid}/verify`;
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error && !referrer) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="text-red-600 text-lg font-medium">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="text-blue-600" size={40} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Share Your Experience
            </h1>
            <p className="text-gray-600">
              Tell us about your experience and select colleagues to refer
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={referrer?.name || ''}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  value={referrer?.email || ''}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded" />
                  ) : (
                    <div>
                      <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                      <p className="text-gray-600">Click to upload an image</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Testimonial <span className="text-red-500">*</span>
              </label>
              <textarea
                value={testimonial}
                onChange={(e) => setTestimonial(e.target.value.slice(0, 300))}
                maxLength={300}
                rows={4}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Share your experience with Elevate Pay..."
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {testimonial.length}/300 characters
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Colleagues to Refer <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
                {colleagues.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No colleagues found</p>
                ) : (
                  colleagues.map((colleague) => (
                    <label
                      key={colleague.id}
                      className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition"
                    >
                      <input
                        type="checkbox"
                        checked={selectedReferees.includes(colleague.id)}
                        onChange={() => toggleReferee(colleague.id)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <div className="ml-3">
                        <div className="font-medium text-gray-900">{colleague.name}</div>
                        <div className="text-sm text-gray-600">{colleague.email}</div>
                      </div>
                    </label>
                  ))
                )}
              </div>
              {selectedReferees.length > 0 && (
                <div className="text-sm text-blue-600 mt-2">
                  {selectedReferees.length} colleague(s) selected
                </div>
              )}
            </div>

            <div className="text-center pt-4">
              <div className="text-sm text-gray-500 mb-4">Step 3 of 5</div>
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Referral'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
