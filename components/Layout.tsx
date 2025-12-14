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
    <div className="min-h-screen flex flex-col max-w-xl mx-auto relative overflow-hidden">
      
      {/* Background Decor: Coffee Stain */}
      <div className="fixed top-[-50px] right-[-50px] w-64 h-64 rounded-full border-[15px] border-[#6f4e37] opacity-10 blur-sm pointer-events-none z-0" style={{ transform: 'scale(1.2) rotate(25deg)' }}></div>
      <div className="fixed top-[-50px] right-[-50px] w-64 h-64 rounded-full border-[2px] border-[#6f4e37] opacity-20 pointer-events-none z-0"></div>

      {/* Main Content Area - A sheet of paper on the desk */}
      <main className={`flex-grow relative z-10 ${showNav ? 'pb-36' : 'pb-8'} px-2`}>
        {children}
        {showFooter && <Footer />}
      </main>

      {showNav && (
        <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center pointer-events-none">
          {/* Navigation: Sticky Notes stuck to the bottom of the screen */}
          <nav className="pointer-events-auto flex gap-4 items-end">
             
             {/* Home Note */}
             <NavLink to="/" className={({ isActive }) => `
                w-20 h-20 bg-[#ffeb3b] shadow-float transform transition-transform duration-300 flex flex-col items-center justify-center
                ${isActive ? 'rotate-[-3deg] -translate-y-4 scale-110 z-20' : 'rotate-2 hover:-translate-y-2 opacity-90'}
             `} style={{ clipPath: 'polygon(0% 0%, 100% 0%, 95% 100%, 0% 95%)' }}>
                <div className="tape-strip" style={{ top: '-10px', left: '20%', width: '40px', height: '20px' }}></div>
                <span className="text-2xl">🏠</span>
                <span className="font-marker text-xs">Дом</span>
             </NavLink>

             {/* Quiz Note - Main Action */}
             <NavLink to="/quiz" className={({ isActive }) => `
                w-24 h-24 bg-[#ff6b6b] shadow-deep transform transition-transform duration-300 flex flex-col items-center justify-center
                ${isActive ? 'rotate-3 -translate-y-6 scale-110 z-30' : 'rotate-[-2deg] hover:-translate-y-4'}
             `} style={{ clipPath: 'polygon(2% 2%, 98% 0%, 100% 98%, 0% 100%)' }}>
                <div className="tape-strip" style={{ top: '-12px', left: '30%', width: '50px', height: '25px', transform: 'rotate(2deg)' }}></div>
                <span className="text-4xl animate-bounce">🎁</span>
                <span className="font-marker text-white text-lg mt-1">НАЙТИ!</span>
             </NavLink>

             {/* Profile Note */}
             <NavLink to="/profile" className={({ isActive }) => `
                w-20 h-20 bg-[#4d96ff] shadow-float transform transition-transform duration-300 flex flex-col items-center justify-center
                ${isActive ? 'rotate-2 -translate-y-4 scale-110 z-20' : 'rotate-[-3deg] hover:-translate-y-2 opacity-90'}
             `} style={{ clipPath: 'polygon(5% 0%, 100% 5%, 95% 95%, 0% 100%)' }}>
                <div className="tape-strip" style={{ top: '-10px', right: '20%', width: '40px', height: '20px', transform: 'rotate(-5deg)' }}></div>
                <span className="text-2xl">👤</span>
                <span className="font-marker text-white text-xs">Я</span>
             </NavLink>

          </nav>
        </div>
      )}
    </div>
  );
};