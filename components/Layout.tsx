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
    <div className="min-h-screen w-full relative flex flex-col font-mono bg-void text-raw">
      
      {/* 1. CHAOTIC NAV: Elements not aligned */}
      <header className="fixed top-0 left-0 w-full z-50 pointer-events-none p-4 mix-blend-exclusion text-white">
          <div className="flex justify-between items-start">
             <NavLink to="/" className="pointer-events-auto font-display font-extrabold text-3xl tracking-tighter hover:italic transition-all">
                Gifty<span className="text-sm align-super">.ai?</span>
             </NavLink>

             {showNav && (
               <nav className="pointer-events-auto flex flex-col gap-2 items-end">
                  <NavLink to="/quiz" className={({isActive}) => `text-xs uppercase bg-white text-black px-1 ${isActive ? 'line-through' : 'hover:bg-acid-green'}`}>
                     [ Start_Engine ]
                  </NavLink>
                  <NavLink to="/wishlist" className={({isActive}) => `text-xs uppercase bg-white text-black px-1 ${isActive ? 'line-through' : 'hover:bg-acid-green'}`}>
                     [ Hoarding ]
                  </NavLink>
                  <NavLink to="/profile" className={({isActive}) => `text-xs uppercase bg-white text-black px-1 ${isActive ? 'line-through' : 'hover:bg-acid-green'}`}>
                     [ Subject_Data ]
                  </NavLink>
               </nav>
             )}
          </div>
      </header>

      {/* 2. DECORATIVE NOISE: Random fixed elements */}
      <div className="fixed top-1/2 left-0 -rotate-90 text-[10px] text-gray-400 origin-left pointer-events-none z-0">
          SYSTEM_STATUS: UNSTABLE // HAPPINESS NOT GUARANTEED
      </div>
      <div className="fixed bottom-4 right-4 w-12 h-12 border border-black rounded-full animate-spin-slow pointer-events-none z-0 flex items-center justify-center text-[8px]">
          WAIT
      </div>

      {/* 3. MAIN CONTENT */}
      <main className="w-full flex-grow z-10 pt-24 px-4 sm:px-8 pb-32 max-w-6xl mx-auto border-l-2 border-dashed border-black/10 min-h-screen">
        {children}
      </main>

      {/* 4. MARQUEE FOOTER */}
      {showFooter && (
          <div className="fixed bottom-0 left-0 w-full bg-acid-green border-t-2 border-black py-2 overflow-hidden z-50">
              <div className="whitespace-nowrap animate-marquee font-bold text-sm">
                  WE USE COOKIES. WE ALSO EAT COOKIES. THIS AI IS GUESSING. DO NOT TRUST THE ALGORITHM WITH YOUR LIFE, ONLY YOUR WALLET. A GIFT IS JUST A SOCIAL CONTRACT WRAPPED IN PAPER.
                  WE USE COOKIES. WE ALSO EAT COOKIES. THIS AI IS GUESSING. DO NOT TRUST THE ALGORITHM WITH YOUR LIFE, ONLY YOUR WALLET. A GIFT IS JUST A SOCIAL CONTRACT WRAPPED IN PAPER.
              </div>
          </div>
      )}
    </div>
  );
};