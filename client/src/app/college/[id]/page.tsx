'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api, College } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function CollegeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (id) {
      api.getCollege(id as string)
        .then(setCollege)
        .catch(console.error)
        .finally(() => setLoading(false));

      if (token) {
        api.getSaved(token)
          .then(saved => {
            setIsSaved(saved.some((s: any) => s.collegeId === id));
          })
          .catch(console.error);
      }
    }
  }, [id, token]);

  const toggleSave = async () => {
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      if (isSaved) {
        await api.unsaveCollege(id as string, token);
        setIsSaved(false);
      } else {
        await api.saveCollege(id as string, token);
        setIsSaved(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <div className="skeleton h-64 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 skeleton h-96" />
        <div className="skeleton h-96" />
      </div>
    </div>
  );

  if (!college) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">College not found</h2>
        <p className="text-gray-500">The college you are looking for does not exist.</p>
      </div>
    </div>
  );

  const courses = JSON.parse(college.courses);
  const feeFormatted = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(college.fees);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header Banner */}
      <div className="bg-white border-b border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-100">
                  {college.type}
                </span>
                <div className="flex items-center gap-1 text-amber-500">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  <span className="text-sm font-bold text-gray-900">{college.rating} Rating</span>
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">{college.name}</h1>
              <p className="flex items-center gap-2 text-gray-500 font-medium">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {college.location}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleSave}
                className={`p-3.5 rounded-xl border transition-all ${
                  isSaved 
                    ? 'bg-red-50 text-red-500 border-red-100 shadow-sm' 
                    : 'bg-white text-gray-400 border-gray-200 hover:text-red-500 hover:border-red-100'
                }`}
                title={isSaved ? "Remove from saved" : "Save to wishlist"}
              >
                <svg className={`w-6 h-6 ${isSaved ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button className="flex-1 md:flex-none px-8 py-3.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                Apply Now
              </button>
              <button className="flex-1 md:flex-none px-8 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all shadow-sm">
                Download Brochure
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
                Overview
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {college.name}, located in {college.location}, is one of India's premier {college.type} institutions. 
                With a consistently high rating of {college.rating}/5, the college is renowned for its academic excellence 
                and industry-aligned curriculum. The campus provides state-of-the-art facilities and a vibrant 
                environment for student growth and development.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-10">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Established</p>
                  <p className="text-lg font-bold text-gray-900">1995</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Campus Size</p>
                  <p className="text-lg font-bold text-gray-900">45 Acres</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Total Students</p>
                  <p className="text-lg font-bold text-gray-900">5,000+</p>
                </div>
              </div>
            </section>

            {/* Courses */}
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
                Available Courses
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.map((course: string) => (
                  <div key={course} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 transition-all group">
                    <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    </div>
                    <span className="font-bold text-gray-700 group-hover:text-blue-700">{course}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Admission Info</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">Annual Fees</p>
                  <p className="text-2xl font-black text-blue-600">{feeFormatted}</p>
                </div>
                <div className="pt-6 border-t border-gray-100">
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">Placement Percentage</p>
                  <div className="flex items-end gap-2">
                    <p className="text-3xl font-black text-emerald-600">{college.placementPercentage}%</p>
                    <p className="text-xs text-gray-500 pb-1 font-bold">Successful</p>
                  </div>
                </div>
                <div className="pt-6 border-t border-gray-100 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">Entrance Exam</span>
                    <span className="text-gray-900 font-bold">JEE Mains</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">Application Deadline</span>
                    <span className="text-gray-900 font-bold">May 15, 2024</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white">
              <h3 className="text-lg font-bold mb-3">Want more details?</h3>
              <p className="text-blue-100 text-sm mb-6">Chat with our counselors to get personalized guidance for your admission.</p>
              <button className="w-full py-3.5 rounded-xl bg-white text-blue-600 font-bold hover:bg-blue-50 transition-all shadow-md">
                Talk to Expert
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
