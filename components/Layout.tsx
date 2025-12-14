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
    <div className="min-h-screen w-full relative flex flex-col items-center">
      
      {/* Floating Bubbles Background Animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[10%] left-[10%] w-32 h-32 rounded-full bg-white/10 blur-xl animate-float"></div>
          <div className="absolute bottom-[20%] right-[5%] w-48 h-48 rounded-full bg-green-300/20 blur-2xl animate-float-delayed"></div>
          <div className="absolute top-[40%] right-[30%] w-16 h-16 rounded-full bg-blue-300/20 blur-md animate-float"></div>
      </div>

      {/* Main Content Area */}
      <main className="w-full max-w-xl flex-grow z-10 pb-32 px-4 pt-6">
        {children}
        {showFooter && <Footer />}
      </main>

      {/* Dock Navigation */}
      {showNav && (
        <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
          <nav className="pointer-events-auto bg-white/40 backdrop-blur-xl border border-white/50 rounded-2xl p-2 shadow-glass flex gap-4 items-center transform transition-all hover:scale-105 hover:bg-white/50">
             
             {/* Home */}
             <NavLink to="/" className={({ isActive }) => `
                w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 relative group
                ${isActive ? 'bg-gradient-to-b from-blue-400 to-blue-600 shadow-glow scale-110 -translate-y-2' : 'hover:bg-white/30'}
             `}>
                {({ isActive }) => (
                  <>
                    <span className={`text-2xl drop-shadow-md ${isActive ? 'text-white' : 'grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100'}`}>🏠</span>
                    {/* Reflection */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/40 to-transparent opacity-50 pointer-events-none"></div>
                  </>
                )}
             </NavLink>

             {/* Quiz (Center Orb) */}
             <NavLink to="/quiz" className={({ isActive }) => `
                w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 relative mx-2
                ${isActive ? 'scale-110 -translate-y-2' : 'hover:scale-105'}
             `}>
                 <div className="absolute inset-0 rounded-full bg-gradient-to-b from-green-400 to-green-600 shadow-lg border-2 border-white/50"></div>
                 {/* Gloss shine */}
                 <div className="absolute top-1 left-2 right-2 h-6 rounded-full bg-gradient-to-b from-white/80 to-transparent"></div>
                 
                 <span className="relative z-10 text-3xl drop-shadow-sm">🎁</span>
             </NavLink>

             {/* Profile */}
             <NavLink to="/profile" className={({ isActive }) => `
                w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 relative group
                ${isActive ? 'bg-gradient-to-b from-blue-400 to-blue-600 shadow-glow scale-110 -translate-y-2' : 'hover:bg-white/30'}
             `}>
                {({ isActive }) => (
                  <>
                    <span className={`text-2xl drop-shadow-md ${isActive ? 'text-white' : 'grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100'}`}>👤</span>
                    {/* Reflection */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/40 to-transparent opacity-50 pointer-events-none"></div>
                  </>
                )}
             </NavLink>

          </nav>
        </div>
      )}
    </div>
  );
};