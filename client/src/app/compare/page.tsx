'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api, College } from '@/lib/api';

function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<College[]>([]);

  useEffect(() => {
    const ids = searchParams.get('ids')?.split(',') || [];
    if (ids.length > 0) {
      Promise.all(ids.map(id => api.getCollege(id)))
        .then(res => {
          setColleges(res);
          // Save to history in localStorage
          const savedHistory = JSON.parse(localStorage.getItem('compareHistory') || '[]');
          const updatedHistory = [...new Set([...ids, ...savedHistory])].slice(0, 10);
          localStorage.setItem('compareHistory', JSON.stringify(updatedHistory));
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    // Load full objects for history
    const historyIds = JSON.parse(localStorage.getItem('compareHistory') || '[]');
    if (historyIds.length > 0) {
      Promise.all(historyIds.slice(0, 6).map((id: string) => api.getCollege(id)))
        .then(res => setHistory(res.filter(Boolean)))
        .catch(console.error);
    }
  }, [searchParams]);

  const removeCollege = (id: string) => {
    const newColleges = colleges.filter(c => c.id !== id);
    if (newColleges.length === 0) {
      router.push('/');
    } else {
      setColleges(newColleges);
      router.replace(`/compare?ids=${newColleges.map(c => c.id).join(',')}`);
    }
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-32"><div className="skeleton h-96" /></div>;

  const formatFees = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Comparison Hub</h1>
          <p className="text-gray-500">Analyze and find the best fit among your selected institutions.</p>
        </div>

        {colleges.length > 0 ? (
          <>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="p-8 text-left text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 w-1/4">Features</th>
                      {colleges.map(c => (
                        <th key={c.id} className="p-8 border-b border-gray-100 min-w-[280px]">
                          <div className="flex flex-col items-center text-center">
                            <button 
                              onClick={() => removeCollege(c.id)}
                              className="mb-4 text-xs font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest"
                            >
                              Remove
                            </button>
                            <h3 className="text-lg font-extrabold text-gray-900 mb-1">{c.name}</h3>
                            <p className="text-sm text-gray-500 font-medium">{c.location}</p>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    <tr>
                      <td className="p-8 text-sm font-bold text-gray-500 bg-gray-50/30">Annual Fees</td>
                      {colleges.map(c => {
                        const isBest = c.fees === Math.min(...colleges.map(x => x.fees));
                        return (
                          <td key={c.id} className="p-8 text-center">
                            <span className={`text-lg font-black ${isBest ? 'text-emerald-600' : 'text-gray-900'}`}>
                              {formatFees(c.fees)}
                            </span>
                            {isBest && <p className="text-[10px] text-emerald-500 font-bold uppercase mt-1">Lowest Fee</p>}
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      <td className="p-8 text-sm font-bold text-gray-500 bg-gray-50/30">Placement Rate</td>
                      {colleges.map(c => {
                        const isBest = c.placementPercentage === Math.max(...colleges.map(x => x.placementPercentage));
                        return (
                          <td key={c.id} className="p-8 text-center">
                            <span className={`text-lg font-black ${isBest ? 'text-emerald-600' : 'text-gray-900'}`}>
                              {c.placementPercentage}%
                            </span>
                            {isBest && <p className="text-[10px] text-emerald-500 font-bold uppercase mt-1">Best Placement</p>}
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      <td className="p-8 text-sm font-bold text-gray-500 bg-gray-50/30">User Rating</td>
                      {colleges.map(c => {
                        const isBest = c.rating === Math.max(...colleges.map(x => x.rating));
                        return (
                          <td key={c.id} className="p-8 text-center">
                            <div className={`flex items-center justify-center gap-1.5 text-lg font-black ${isBest ? 'text-amber-500' : 'text-gray-900'}`}>
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                              {c.rating}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      <td className="p-8 text-sm font-bold text-gray-500 bg-gray-50/30">College Type</td>
                      {colleges.map(c => (
                        <td key={c.id} className="p-8 text-center">
                          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider">
                            {c.type}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-8 text-sm font-bold text-gray-500 bg-gray-50/30">Key Courses</td>
                      {colleges.map(c => {
                        const courses = JSON.parse(c.courses);
                        return (
                          <td key={c.id} className="p-8">
                            <div className="flex flex-wrap justify-center gap-2">
                              {courses.slice(0, 4).map((crs: string) => (
                                <span key={crs} className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-lg border border-blue-100">
                                  {crs}
                                </span>
                              ))}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-12 text-center">
              <button onClick={() => router.push('/')} className="px-8 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all shadow-sm">
                Add more colleges to compare
              </button>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
            <div className="text-6xl mb-6 text-gray-200">⚖️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No colleges selected</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Select colleges from the home page to compare them here, or pick from your recent history below.</p>
            <button onClick={() => router.push('/')} className="px-8 py-3.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
              Browse Colleges
            </button>
          </div>
        )}

        {history.length > 0 && (
          <div className="mt-20">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
              Recently Compared
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {history.filter(h => !colleges.some(c => c.id === h.id)).map(h => (
                <div key={h.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => {
                    const currentIds = colleges.map(c => c.id);
                    if (!currentIds.includes(h.id)) {
                      router.push(`/compare?ids=${[...currentIds, h.id].join(',')}`);
                    }
                  }}
                >
                  <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">{h.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">{h.location}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-32"><div className="skeleton h-96" /></div>}>
      <CompareContent />
    </Suspense>
  );
}
