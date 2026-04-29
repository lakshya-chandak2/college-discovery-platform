'use client';
import { useEffect, useState } from 'react';
import { api, College } from '@/lib/api';
import CollegeCard from '@/components/CollegeCard';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface SavedItem {
  id: string;
  collegeId: string;
  college: College;
}

export default function SavedPage() {
  const router = useRouter();
  const { token, isLoading } = useAuth();
  const [saved, setSaved] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    if (!token) return;
    try {
      const res = await api.getSaved(token);
      setSaved(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && !token) {
      router.push('/login');
    } else if (token) {
      fetchSaved();
    }
  }, [token, isLoading]);

  const handleUnsave = async (collegeId: string) => {
    if (!token) return;
    try {
      await api.unsaveCollege(collegeId, token);
      setSaved(prev => prev.filter(item => item.collegeId !== collegeId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-32">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="skeleton h-80" />
        <div className="skeleton h-80" />
        <div className="skeleton h-80" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-end justify-between mb-10 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Saved Colleges</h1>
            <p className="text-gray-500 font-medium">You have bookmarked <span className="text-blue-600 font-bold">{saved.length}</span> institutions.</p>
          </div>
          <Link href="/" className="px-6 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
            Find More
          </Link>
        </div>

        {saved.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="text-6xl mb-6">🔖</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 max-w-md mx-auto">Start exploring and save your favorite colleges to keep track of them here.</p>
            <Link 
              href="/" 
              className="mt-8 inline-block px-8 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
            >
              Browse Colleges
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {saved.map((item, i) => (
              <div key={item.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                <CollegeCard 
                  college={item.college} 
                  action={
                    <button
                      onClick={() => handleUnsave(item.collegeId)}
                      className="p-2 rounded-lg bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-100 transition-all"
                      title="Remove from saved"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
