'use client';
import { useState, useEffect, useCallback } from 'react';
import { api, College, PaginatedResponse } from '@/lib/api';
import CollegeCard from '@/components/CollegeCard';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, GraduationCap, Users, Award, ShieldCheck, Banknote } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [locations, setLocations] = useState<string[]>([]);
  const [maxFees, setMaxFees] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [page, setPage] = useState(1);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const fetchColleges = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: '12', sortBy, order: 'desc' };
      if (search) params.search = search;
      if (location) params.location = location;
      if (maxFees) params.maxFees = maxFees;
      const res = await api.getColleges(params);
      setData(res);
      
      // Also fetch saved colleges to update UI state if user is logged in
      if (token) {
        const saved = await api.getSaved(token);
        setSavedIds(saved.map((s: any) => s.collegeId));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, location, maxFees, sortBy, token]);

  const handleSaveToggle = async (id: string) => {
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      if (savedIds.includes(id)) {
        await api.unsaveCollege(id, token);
        setSavedIds(prev => prev.filter(x => x !== id));
      } else {
        await api.saveCollege(id, token);
        setSavedIds(prev => [...prev, id]);
      }
    } catch (err) {
      console.error('Failed to toggle save', err);
    }
  };

  useEffect(() => {
    api.getLocations().then(setLocations).catch(console.error);
  }, []);

  useEffect(() => {
    const timer = setTimeout(fetchColleges, 300);
    return () => clearTimeout(timer);
  }, [fetchColleges]);

  const toggleCompare = (id: string) => {
    setCompareIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const goCompare = () => {
    if (compareIds.length >= 2) {
      router.push(`/compare?ids=${compareIds.join(',')}`);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-[#F8FAFC]">
      {/* Animated Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 py-24 px-4 text-white animate-gradient-xy">
        {/* Decorative Background Patterns */}
        <div className="absolute inset-0 opacity-10">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1], 
              opacity: [0.5, 1, 0.5],
              x: [0, 50, 0],
              y: [0, -30, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-96 h-96 bg-amber-500 rounded-full blur-[128px] mix-blend-screen"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1], 
              opacity: [0.5, 1, 0.5],
              x: [0, -40, 0],
              y: [0, 40, 0]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-[128px] mix-blend-screen"
          />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-slate-800/80 border border-slate-700/50 text-amber-400 text-sm font-bold tracking-wide uppercase mb-6 backdrop-blur-md">
              India's Premier College Network
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight font-serif leading-tight">
              Discover Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">Perfect College</span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl mb-12 max-w-3xl mx-auto font-light">
              Explore over 50 top-rated institutions with verified placement statistics, detailed fee structures, and comprehensive course offerings.
            </p>
          </motion.div>

          {/* Animated Search Bar */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="relative max-w-3xl mx-auto group"
          >
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search by institution name or city..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="block w-full pl-16 pr-6 py-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-400 focus-ring-gold text-xl shadow-2xl transition-all"
            />
          </motion.div>

          {/* Quick Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-8 md:gap-16 mt-16 pt-10 border-t border-slate-800/50"
          >
            {[
              { label: 'Top Colleges', value: '50+', icon: GraduationCap },
              { label: 'Active Students', value: '10k+', icon: Users },
              { label: 'Placement Rate', value: '95%', icon: Award }
            ].map((stat, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-amber-400">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-white py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Verified Data', desc: 'All placement and fee data is strictly verified.', icon: ShieldCheck },
              { title: 'Smart Comparison', desc: 'Compare colleges side-by-side easily.', icon: Banknote },
              { title: 'Expert Guidance', desc: 'Find the best fit for your academic goals.', icon: MapPin }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4"
              >
                <div className="w-12 h-12 shrink-0 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-500 text-sm">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-gray-100">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <select 
                value={location} 
                onChange={(e) => { setLocation(e.target.value); setPage(1); }}
                className="appearance-none pl-4 pr-10 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-900 cursor-pointer shadow-sm"
              >
                <option value="">All Locations</option>
                {locations.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            <div className="relative">
              <select 
                value={maxFees} 
                onChange={(e) => { setMaxFees(e.target.value); setPage(1); }}
                className="appearance-none pl-4 pr-10 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-900 cursor-pointer shadow-sm"
              >
                <option value="">Any Fees</option>
                <option value="50000">Under ₹50K</option>
                <option value="100000">Under ₹1L</option>
                <option value="200000">Under ₹2L</option>
                <option value="300000">Under ₹3L</option>
                <option value="500000">Under ₹5L</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            <div className="relative">
              <select 
                value={sortBy} 
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                className="appearance-none pl-4 pr-10 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-900 cursor-pointer shadow-sm"
              >
                <option value="rating">Sort by Rating</option>
                <option value="fees">Sort by Fees</option>
                <option value="placementPercentage">Sort by Placement</option>
                <option value="name">Sort by Name</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          <div className="text-sm font-medium text-gray-400">
            Showing <span className="text-gray-900">{data?.colleges.length || 0}</span> of <span className="text-gray-900">{data?.pagination.total || 0}</span> colleges
          </div>
        </div>

        {/* Compare Bar */}
        {compareIds.length > 0 && (
          <div className="mb-8 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between animate-fade-in-up">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold shadow-md shadow-slate-200">
                {compareIds.length}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Colleges selected for comparison</p>
                <p className="text-xs text-amber-600 font-medium">Select {Math.max(0, 2 - compareIds.length)} more to compare</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setCompareIds([])} className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors">
                Clear all
              </button>
              <button 
                onClick={goCompare} 
                disabled={compareIds.length < 2}
                className="px-6 py-2 text-sm font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-slate-200"
              >
                Compare Now
              </button>
            </div>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-[380px]" />
            ))}
          </div>
        ) : data?.colleges.length === 0 ? (
          <div className="text-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No colleges found</h3>
            <p className="text-gray-500">We couldn't find anything matching your search. Try adjusting the filters.</p>
            <button 
              onClick={() => { setSearch(''); setLocation(''); setMaxFees(''); }}
              className="mt-6 px-6 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-100 transition-all shadow-sm"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <motion.div 
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {data?.colleges.map((college) => (
                <motion.div 
                  key={college.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                >
                  <CollegeCard
                    college={college}
                    onCompareToggle={toggleCompare}
                    isComparing={compareIds.includes(college.id)}
                    onSaveToggle={handleSaveToggle}
                    isSaved={savedIds.includes(college.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Pagination */}
        {data && data.pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-16">
            <button 
              onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo(0, 0); }} 
              disabled={page === 1}
              className="px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, data.pagination.totalPages) }, (_, i) => {
              const start = Math.max(1, Math.min(page - 2, data.pagination.totalPages - 4));
              const pg = start + i;
              if (pg > data.pagination.totalPages) return null;
              return (
                <button 
                  key={pg} 
                  onClick={() => { setPage(pg); window.scrollTo(0, 0); }}
                  className={`w-11 h-11 rounded-xl text-sm font-bold transition-all shadow-sm ${
                    pg === page
                      ? 'bg-slate-900 text-white shadow-slate-200'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {pg}
                </button>
              );
            })}
            <button 
              onClick={() => { setPage(p => Math.min(data.pagination.totalPages, p + 1)); window.scrollTo(0, 0); }} 
              disabled={page === data.pagination.totalPages}
              className="px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
