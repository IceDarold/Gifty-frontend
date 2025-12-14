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
    <div className="min-h-screen flex flex-col max-w-lg mx-auto relative bg-paper border-x-2 border-black shadow-2xl overflow-hidden">
      {/* Global Texture */}
      <div className="bg-noise"></div>

      <main className={`flex-grow relative z-10 flex flex-col ${showNav ? 'pb-28' : 'pb-8'}`}>
        <div className="flex-grow">
          {children}
        </div>
        {showFooter && <Footer />}
      </main>

      {showNav && (
        <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
          <nav className="bg-white/90 backdrop-blur-md pointer-events-auto rounded-2xl border-2 border-black shadow-hard px-8 py-4 flex justify-between items-center w-[85%] max-w-[340px] transition-all hover:scale-[1.02]">
             
             {/* Home */}
             <NavLink to="/" className={({ isActive }) => `flex flex-col items-center gap-1 transition-all group ${isActive ? 'text-black' : 'text-gray-400 hover:text-black'}`}>
                {({ isActive }) => (
                  <>
                    <div className={`p-1 rounded-lg transition-all ${isActive ? 'bg-pop-cyan border-2 border-black shadow-sm' : 'group-hover:-translate-y-1'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </div>
                  </>
                )}
             </NavLink>
             
             {/* Middle Action Button - QUIZ */}
             <NavLink to="/quiz" className={({ isActive }) => `flex flex-col items-center justify-center -mt-12 w-16 h-16 bg-pop-pink border-2 border-black rounded-full shadow-hard transition-all active:translate-y-1 active:shadow-none z-20 ${isActive ? 'scale-110 rotate-6 bg-pop-yellow' : 'hover:rotate-6 hover:scale-105'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
             </NavLink>

             {/* Profile */}
             <NavLink to="/profile" className={({ isActive }) => `flex flex-col items-center gap-1 transition-all group ${isActive ? 'text-black' : 'text-gray-400 hover:text-black'}`}>
                {({ isActive }) => (
                  <>
                    <div className={`p-1 rounded-lg transition-all ${isActive ? 'bg-pop-cyan border-2 border-black shadow-sm' : 'group-hover:-translate-y-1'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                  </>
                )}
             </NavLink>
          </nav>
        </div>
      )}
    </div>
  );
};