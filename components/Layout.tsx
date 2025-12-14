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
    <div className="min-h-screen w-full relative flex flex-col items-center overflow-hidden bg-[#eef2f6]">
      
      {/* Living Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content Area */}
      <main className="w-full max-w-xl flex-grow z-10 pb-36 px-6 pt-8">
        {children}
        {showFooter && <Footer />}
      </main>

      {/* Clay Navigation Bar - Floating Island */}
      {showNav && (
        <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
          <nav className="pointer-events-auto bg-[#eef2f6]/90 backdrop-blur-sm rounded-[3rem] px-6 py-3 shadow-clay flex gap-8 items-center border border-white/40">
             
             {/* Home */}
             <NavLink to="/" className={({ isActive }) => `
                relative group flex flex-col items-center justify-center transition-all duration-300
             `}>
                {({ isActive }) => (
                  <>
                    <div className={`w-12 h-12 rounded-[1.5rem] flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-[#6c5ce7] text-white shadow-clay-btn translate-y-[-4px]' : 'text-gray-400 hover:bg-white hover:text-[#6c5ce7]'}`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    </div>
                    {isActive && <div className="absolute -bottom-2 w-1 h-1 bg-[#6c5ce7] rounded-full"></div>}
                  </>
                )}
             </NavLink>

             {/* Quiz (Center Floating with Ripple) */}
             <NavLink to="/quiz" className={({ isActive }) => `
                w-16 h-16 rounded-[2rem] flex items-center justify-center transition-all duration-300 -mt-10
                ${isActive ? 'bg-[#fd79a8] shadow-float scale-110' : 'bg-[#6c5ce7] shadow-clay-btn hover:scale-105'}
             `}>
                 <div className="absolute inset-0 bg-white opacity-20 rounded-[2rem] animate-pulse"></div>
                 <svg className="w-8 h-8 text-white relative z-10" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
             </NavLink>

             {/* Profile */}
             <NavLink to="/profile" className={({ isActive }) => `
                relative group flex flex-col items-center justify-center transition-all duration-300
             `}>
                 {({ isActive }) => (
                  <>
                    <div className={`w-12 h-12 rounded-[1.5rem] flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-[#6c5ce7] text-white shadow-clay-btn translate-y-[-4px]' : 'text-gray-400 hover:bg-white hover:text-[#6c5ce7]'}`}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    {isActive && <div className="absolute -bottom-2 w-1 h-1 bg-[#6c5ce7] rounded-full"></div>}
                  </>
                )}
             </NavLink>

          </nav>
        </div>
      )}
    </div>
  );
};