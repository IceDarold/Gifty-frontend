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
    <div className="min-h-screen w-full relative flex flex-col font-mono bg-white text-black bg-grid-pattern bg-[length:40px_40px]">
      
      {/* 1. RAW NAV */}
      <header className="fixed top-0 left-0 w-full z-50 pointer-events-none mix-blend-difference text-white">
          <div className="flex justify-between items-start p-4">
             <NavLink to="/" className="pointer-events-auto font-display font-black text-4xl tracking-tighter hover:text-acid-green transition-colors uppercase leading-[0.8]">
                Gifty<br/>
                <span className="text-sm font-mono tracking-widest opacity-50">v.6.6.6</span>
             </NavLink>

             {showNav && (
               <nav className="pointer-events-auto flex flex-col gap-1 items-end">
                  {['/quiz', '/wishlist', '/profile'].map((path) => (
                      <NavLink 
                        key={path}
                        to={path} 
                        className={({isActive}) => `
                            text-sm font-bold uppercase bg-white text-black px-2 py-1 border-2 border-black
                            transition-all hover:bg-acid-green hover:translate-x-1 hover:translate-y-1 hover:shadow-none
                            ${isActive ? 'bg-black text-acid-green border-white translate-x-1 translate-y-1' : 'shadow-[4px_4px_0px_#000]'}
                        `}
                      >
                         [{path.replace('/', '')}]
                      </NavLink>
                  ))}
               </nav>
             )}
          </div>
      </header>

      {/* 2. CHAOS ELEMENTS */}
      <div className="fixed top-1/2 -left-12 -rotate-90 font-mono text-xs text-black/20 origin-center pointer-events-none z-0 whitespace-nowrap">
          /// SYSTEM_OVERRIDE_INITIATED /// DO_NOT_RESIST ///
      </div>
      
      {/* 3. MAIN CONTAINER */}
      <main className="w-full flex-grow z-10 pt-32 px-4 sm:px-8 pb-32 max-w-7xl mx-auto border-x-2 border-black bg-white/80 backdrop-blur-sm min-h-screen relative">
        {/* Top decorative line */}
        <div className="absolute top-0 left-0 w-full h-2 bg-black pattern-diagonal-lines"></div>
        {children}
      </main>

      {/* 4. MARQUEE FOOTER */}
      {showFooter && (
          <>
            <Footer />
            <div className="fixed bottom-0 left-0 w-full bg-acid-green border-t-4 border-black py-3 overflow-hidden z-50">
                <div className="whitespace-nowrap animate-marquee font-display font-black text-lg uppercase tracking-widest text-black">
                    WARNING: THIS SITE CONTAINS HIGH LEVELS OF IRONY. CONSUME RESPONSIBLY. // WE ARE WATCHING YOU SHOP. // YOUR TASTE IS BEING JUDGED. // 
                    WARNING: THIS SITE CONTAINS HIGH LEVELS OF IRONY. CONSUME RESPONSIBLY. // WE ARE WATCHING YOU SHOP. // YOUR TASTE IS BEING JUDGED. // 
                </div>
            </div>
          </>
      )}
    </div>
  );
};