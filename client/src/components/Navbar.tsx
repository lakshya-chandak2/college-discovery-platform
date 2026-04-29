'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.nav 
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" }
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-200/50 h-20 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative overflow-hidden rounded-lg shadow-md border border-gray-100 group-hover:shadow-lg transition-all">
            <Image src="/logo.png" alt="Logo" width={42} height={42} className="transition-transform duration-300 group-hover:scale-110" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900 font-serif group-hover:text-amber-600 transition-colors">
            College Discovery
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          <Link href="/" className="text-sm font-semibold text-slate-700 hover:text-amber-600 transition-colors relative group">
            Explore
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/compare" className="text-sm font-semibold text-slate-700 hover:text-amber-600 transition-colors relative group">
            Compare
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-300 group-hover:w-full"></span>
          </Link>
          {user && (
            <Link href="/saved" className="text-sm font-semibold text-slate-700 hover:text-amber-600 transition-colors relative group">
              Saved
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-gray-50 border border-gray-200">
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-900">
                  {user.email[0].toUpperCase()}
                </div>
                <span className="text-xs font-semibold text-gray-700 hidden sm:inline">{user.email.split('@')[0]}</span>
              </div>
              <button
                onClick={logout}
                className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-5 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-all shadow-md shadow-slate-200 active:scale-95"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
