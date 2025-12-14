import React from 'react';
import { NavLink } from 'react-router-dom';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
  showFooter?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, showNav = true, showFooter = true }) => {
  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto relative overflow-hidden">
      
      <main className={`flex-grow flex flex-col ${showNav ? 'pb-32' : 'pb-8'}`}>
        <div className="flex-grow">
          {children}
        </div>
        {showFooter && <Footer />}
      </main>

      {showNav && (
        <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center pointer-events-none">
          <nav className="glass-panel pointer-events-auto rounded-full px-8 py-4 flex justify-between items-center w-[85%] max-w-[340px] shadow-2xl shadow-black/50">
             
             {/* Home */}
             <NavLink to="/" className={({ isActive }) => `flex flex-col items-center gap-1 transition-all duration-500 ${isActive ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'text-white/40 hover:text-white/80'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
             </NavLink>
             
             {/* Middle Action Button - QUIZ - Glowing Orb */}
             <NavLink to="/quiz" className={({ isActive }) => `flex items-center justify-center -mt-10 w-16 h-16 rounded-full transition-all duration-500 bg-gradient-to-tr from-indigo-500 to-fuchsia-500 shadow-[0_0_20px_rgba(167,139,250,0.5)] border border-white/20 ${isActive ? 'scale-110 shadow-[0_0_30px_rgba(167,139,250,0.8)]' : 'hover:scale-105'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
             </NavLink>

             {/* Profile */}
             <NavLink to="/profile" className={({ isActive }) => `flex flex-col items-center gap-1 transition-all duration-500 ${isActive ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'text-white/40 hover:text-white/80'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
             </NavLink>
          </nav>
        </div>
      )}
    </div>
  );
};