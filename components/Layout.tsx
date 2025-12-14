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
    <div className="min-h-screen w-full relative flex flex-col items-center bg-[#f0f2f5]">
      
      {/* Decorative Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full bg-pink-100 blur-3xl opacity-60"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 rounded-full bg-blue-100 blur-3xl opacity-60"></div>
      </div>

      {/* Main Content Area */}
      <main className="w-full max-w-xl flex-grow z-10 pb-36 px-6 pt-8">
        {children}
        {showFooter && <Footer />}
      </main>

      {/* Clay Navigation Bar */}
      {showNav && (
        <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center pointer-events-none">
          <nav className="pointer-events-auto bg-[#f0f2f5] rounded-[3rem] p-3 shadow-clay flex gap-6 items-center">
             
             {/* Home */}
             <NavLink to="/" className={({ isActive }) => `
                w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 clay-transition
                ${isActive ? 'bg-[#6c5ce7] text-white shadow-clay-btn translate-y-[-4px]' : 'text-gray-400 hover:text-[#6c5ce7] hover:bg-gray-100'}
             `}>
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
             </NavLink>

             {/* Quiz (Center Floating) */}
             <NavLink to="/quiz" className={({ isActive }) => `
                w-16 h-16 rounded-[2rem] flex items-center justify-center transition-all duration-300 -mt-8 clay-transition
                ${isActive ? 'bg-[#fd79a8] shadow-float scale-110' : 'bg-[#6c5ce7] shadow-clay-btn hover:scale-105'}
             `}>
                 <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
             </NavLink>

             {/* Profile */}
             <NavLink to="/profile" className={({ isActive }) => `
                w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 clay-transition
                ${isActive ? 'bg-[#6c5ce7] text-white shadow-clay-btn translate-y-[-4px]' : 'text-gray-400 hover:text-[#6c5ce7] hover:bg-gray-100'}
             `}>
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
             </NavLink>

          </nav>
        </div>
      )}
    </div>
  );
};