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
    <div className="h-screen w-full relative overflow-hidden flex flex-col items-center">
      
      {/* --- DESK SURFACE DECORATIONS --- */}
      {/* Coffee Stain */}
      <div className="fixed top-[-40px] right-[-40px] w-64 h-64 rounded-full border-[12px] border-[#3e2723] opacity-20 blur-sm pointer-events-none z-0 mix-blend-multiply"></div>
      <div className="fixed top-[-40px] right-[-40px] w-60 h-60 rounded-full border-[2px] border-[#3e2723] opacity-30 pointer-events-none z-0 mix-blend-multiply"></div>
      
      {/* Random Papers in background */}
      <div className="fixed top-[20%] left-[-50px] w-40 h-60 bg-white texture-paper shadow-md rotate-12 z-0 opacity-80 pointer-events-none transform skew-y-6"></div>
      <div className="fixed bottom-[20%] right-[-60px] w-52 h-52 bg-marker-yellow texture-kraft shadow-md -rotate-12 z-0 opacity-80 pointer-events-none rounded-full"></div>

      {/* --- MAIN SCROLL AREA --- */}
      <main className="w-full max-w-xl h-full overflow-y-auto no-scrollbar relative z-10 pt-4 pb-40 px-2 perspective-1000">
        <div className="min-h-full">
            {children}
            {showFooter && <Footer />}
        </div>
      </main>

      {/* --- PHYSICAL NAVIGATION BAR --- */}
      {showNav && (
        <div className="fixed bottom-0 left-0 right-0 z-50 h-28 pointer-events-none flex justify-center items-end max-w-xl mx-auto">
          <nav className="pointer-events-auto flex items-end gap-6 pb-2 px-4 w-full justify-around">
             
             {/* HOME: A Yellow Sticky Note */}
             <NavLink to="/" className={({ isActive }) => `
                relative group transition-transform duration-300 ease-out origin-bottom
                ${isActive ? 'z-20 scale-110 -translate-y-4 rotate-2' : 'hover:-translate-y-2 opacity-90 rotate-[-2deg]'}
             `}>
                <div className="w-24 h-24 bg-marker-yellow texture-paper shadow-lifted flex flex-col items-center justify-center p-2 relative" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 95% 90%, 0% 100%)' }}>
                    <div className="tape" style={{ top: '-10px', left: '30%', width: '40px', height: '20px', '--tape-rot': '2deg' } as any}></div>
                    <span className="text-3xl filter drop-shadow-sm">🏠</span>
                    <span className="font-marker text-sm mt-1">Дом</span>
                </div>
             </NavLink>

             {/* QUIZ: A Red Tag / Ticket */}
             <NavLink to="/quiz" className={({ isActive }) => `
                relative group transition-transform duration-300 ease-out origin-bottom
                ${isActive ? 'z-30 scale-125 -translate-y-8 rotate-0' : 'hover:-translate-y-4 rotate-3'}
             `}>
                 <div className="w-28 h-28 bg-marker-red texture-kraft shadow-lifted rounded-full flex flex-col items-center justify-center border-4 border-dashed border-white/30 relative">
                     {/* String holding the tag */}
                     <div className="absolute -top-20 left-1/2 w-0.5 h-20 bg-white/50 -z-10"></div>
                     
                     <span className="text-4xl animate-bounce">🎁</span>
                     <span className="font-marker text-white text-xl uppercase -mt-1 transform -rotate-6">СТАРТ</span>
                 </div>
             </NavLink>

             {/* PROFILE: A Polaroid Photo */}
             <NavLink to="/profile" className={({ isActive }) => `
                relative group transition-transform duration-300 ease-out origin-bottom
                ${isActive ? 'z-20 scale-110 -translate-y-4 rotate-[-3deg]' : 'hover:-translate-y-2 opacity-90 rotate-6'}
             `}>
                <div className="w-24 h-28 bg-white p-2 pb-8 shadow-lifted flex flex-col items-center">
                    <div className="w-full h-16 bg-gray-200 overflow-hidden relative">
                         <div className="absolute inset-0 bg-gray-800 flex items-center justify-center text-2xl">👤</div>
                         <div className="absolute inset-0 polaroid-shine"></div>
                    </div>
                    <span className="font-hand text-xl mt-2 text-gray-800 leading-none">Я</span>
                    <div className="tape" style={{ top: '-12px', right: '20%', width: '30px', height: '20px', '--tape-rot': '-10deg' } as any}></div>
                </div>
             </NavLink>

          </nav>
        </div>
      )}
    </div>
  );
};