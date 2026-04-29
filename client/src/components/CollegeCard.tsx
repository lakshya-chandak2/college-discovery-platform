'use client';
import Link from 'next/link';
import { College } from '@/lib/api';
import { motion } from 'framer-motion';

interface Props {
  college: College;
  onCompareToggle?: (id: string) => void;
  isComparing?: boolean;
  onSaveToggle?: (id: string) => void;
  isSaved?: boolean;
  action?: React.ReactNode;
}

export default function CollegeCard({ college, onCompareToggle, isComparing, onSaveToggle, isSaved, action }: Props) {
  const courses = (() => {
    try { return JSON.parse(college.courses); } catch { return []; }
  })();

  const feeFormatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(college.fees);

  return (
    <motion.div 
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-white border-2 border-gray-100 hover:border-amber-200/60 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 h-full flex flex-col group relative overflow-hidden"
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-100 rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
      <div className="p-6 flex-1 relative z-10">
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex-1 min-w-0">
            <Link href={`/college/${college.id}`}>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors truncate font-serif">
                {college.name}
              </h3>
            </Link>
            <div className="flex items-center gap-1.5 mt-1">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm text-gray-500">{college.location}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {onSaveToggle && (
              <button
                onClick={(e) => { e.preventDefault(); onSaveToggle(college.id); }}
                className={`p-1.5 rounded-lg transition-all ${
                  isSaved 
                    ? 'bg-red-50 text-red-500 border border-red-100' 
                    : 'bg-gray-50 text-gray-400 hover:text-red-500 border border-transparent hover:border-red-100'
                }`}
                title={isSaved ? "Remove from saved" : "Save college"}
              >
                <svg className={`w-4 h-4 ${isSaved ? 'fill-current' : 'fill-none'}`} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            )}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200">
              <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs font-bold text-amber-700">{college.rating}</span>
            </div>
            {action}
          </div>
        </div>

        <div className="flex gap-2 mb-5">
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-slate-50 text-slate-700 border border-slate-200 uppercase tracking-wider">
            {college.type}
          </span>
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wider flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            Top Rated
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 py-5 border-t border-gray-100">
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1.5">Annual Fees</p>
            <p className="text-lg font-bold text-slate-900">{feeFormatted}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1.5">Placement</p>
            <p className="text-lg font-bold text-emerald-600">{college.placementPercentage}%</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {courses.slice(0, 3).map((c: string) => (
            <span key={c} className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
              {c}
            </span>
          ))}
          {courses.length > 3 && (
            <span className="text-xs text-gray-400 py-1">+{courses.length - 3} more</span>
          )}
        </div>
      </div>

      <div className="px-6 pb-6 pt-0 mt-auto flex items-center gap-3 relative z-10">
        <Link 
          href={`/college/${college.id}`} 
          className="flex-1 text-center py-3 text-sm font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
        >
          View Details
        </Link>
        {onCompareToggle && (
          <button
            onClick={() => onCompareToggle(college.id)}
            className={`px-4 py-3 text-sm font-bold rounded-xl border-2 transition-all ${
              isComparing
                ? 'bg-amber-50 border-amber-200 text-amber-700'
                : 'bg-white border-gray-100 text-gray-600 hover:border-amber-200 hover:text-amber-600 hover:bg-amber-50/30'
            }`}
            title="Add to compare"
          >
            {isComparing ? 'Added' : 'Compare'}
          </button>
        )}
      </div>
    </motion.div>
  );
}
