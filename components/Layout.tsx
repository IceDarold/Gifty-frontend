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
    <div className="min-h-screen w-full relative flex flex-col items-center bg-[#1a1a2e] font-console text-lg">
      
      {/* BACKGROUND GRID */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10" 
           style={{ 
             backgroundImage: 'linear-gradient(#4d6df3 1px, transparent 1px), linear-gradient(90deg, #4d6df3 1px, transparent 1px)', 
             backgroundSize: '40px 40px' 
           }}>
      </div>

      {/* TOP HUD */}
      <div className="w-full max-w-xl fixed top-0 z-40 bg-retro-black border-b-4 border-retro-white text-retro-white p-2 px-4 flex justify-between items-center shadow-pixel">
          <div className="flex items-center gap-2">
             <div className="w-3 h-3 bg-red-500 rounded-full animate-blink"></div>
             <span className="font-pixel text-xs text-yellow-400">P1: READY</span>
          </div>
          <div className="font-pixel text-xs">SCORE: <span className="text-green-400">9999</span></div>
      </div>

      {/* Main Content Area */}
      <main className="w-full max-w-xl flex-grow z-10 pb-32 px-4 pt-16">
        {children}
        {showFooter && <Footer />}
      </main>

      {/* INVENTORY NAVIGATION */}
      {showNav && (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none pb-4">
          <nav className="pointer-events-auto bg-retro-black border-4 border-retro-white p-2 shadow-pixel-lg flex gap-2 items-end max-w-md w-full mx-2">
             
             {/* HOME SLOT */}
             <NavLink to="/" className={({ isActive }) => `
                flex-1 h-16 border-4 flex flex-col items-center justify-center transition-all cursor-pointer relative
                ${isActive ? 'bg-retro-primary border-yellow-400 -translate-y-2 shadow-pixel' : 'bg-gray-800 border-gray-600 hover:bg-gray-700'}
             `}>
                {({ isActive }) => (
                  <>
                     <span className="text-2xl mb-1">🏠</span>
                     <span className="font-pixel text-[8px] uppercase tracking-widest text-white">HOME</span>
                     {isActive && <div className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 animate-blink"></div>}
                  </>
                )}
             </NavLink>

             {/* QUIZ SLOT (Larger) */}
             <NavLink to="/quiz" className={({ isActive }) => `
                flex-1 h-20 border-4 flex flex-col items-center justify-center transition-all cursor-pointer relative -mt-4
                ${isActive ? 'bg-retro-accent border-white -translate-y-2 shadow-pixel' : 'bg-gray-800 border-gray-600 hover:bg-gray-700'}
             `}>
                 <span className="text-3xl animate-float-pixel">🎁</span>
                 <span className="font-pixel text-[10px] uppercase text-white mt-1">START</span>
             </NavLink>

             {/* PROFILE SLOT */}
             <NavLink to="/profile" className={({ isActive }) => `
                flex-1 h-16 border-4 flex flex-col items-center justify-center transition-all cursor-pointer relative
                ${isActive ? 'bg-purple-600 border-yellow-400 -translate-y-2 shadow-pixel' : 'bg-gray-800 border-gray-600 hover:bg-gray-700'}
             `}>
                {({ isActive }) => (
                  <>
                    <span className="text-2xl mb-1">👤</span>
                    <span className="font-pixel text-[8px] uppercase tracking-widest text-white">CHAR</span>
                  </>
                )}
             </NavLink>

          </nav>
        </div>
      )}
    </div>
  );
};