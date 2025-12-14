import React from 'react';
import { NavLink } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, showNav = true }) => {
  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto bg-gradient-to-b from-indigo-500/10 to-transparent relative shadow-2xl overflow-hidden">
      {/* Decorative background blurs */}
      <div className="fixed top-20 left-10 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="fixed top-40 right-10 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <main className="flex-grow relative z-10 pb-24">
        {children}
      </main>

      {showNav && (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
          <nav className="bg-white/90 backdrop-blur-md rounded-full shadow-2xl border border-white/20 px-6 py-3 mb-6 mx-4 w-full max-w-[300px] flex justify-between items-center pointer-events-auto">
             <NavLink to="/" className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-indigo-600' : 'text-gray-400'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
             </NavLink>
             
             <NavLink to="/quiz" className={({ isActive }) => `flex flex-col items-center gap-1 -mt-8 bg-yellow-400 p-4 rounded-full shadow-lg border-4 border-white/50 text-indigo-900 transition-transform ${isActive ? 'scale-110' : 'scale-100'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
             </NavLink>

             <NavLink to="/wishlist" className={({ isActive }) => `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-indigo-600' : 'text-gray-400'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
             </NavLink>
          </nav>
        </div>
      )}
    </div>
  );
};