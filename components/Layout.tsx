import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
  showFooter?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, showNav = true }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col">
      {/* 1. DESK SURFACE */}
      <div className="flex-grow w-full max-w-6xl mx-auto p-4 sm:p-8 relative z-10 pb-32">
        {/* Subtle Lighting Gradient */}
        <div className="fixed inset-0 bg-gradient-to-br from-white/20 to-black/10 pointer-events-none z-0"></div>
        
        {children}
      </div>

      {/* 2. PHYSICAL NAVIGATION (Dock of items) */}
      {showNav && (
          <nav className="fixed bottom-0 left-0 w-full z-50 pointer-events-none flex justify-center items-end pb-4 gap-6 sm:gap-12">
             
             {/* Item 1: Home (Notepad) */}
             <NavLink to="/" className={({isActive}) => 
                `pointer-events-auto transition-transform duration-300 hover:-translate-y-4 ${isActive ? '-translate-y-2' : 'translate-y-4 opacity-90'}`
             }>
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-md shadow-deep flex items-center justify-center rotate-[-3deg] texture-paper border-t-8 border-red-900">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-4 h-16 bg-gray-400/20 rounded-full blur-sm"></div> {/* Shadow for depth */}
                    <div className="text-center">
                        <span className="block font-handwritten text-3xl font-bold text-ink">Главная</span>
                        <span className="block font-typewriter text-[10px] text-pencil">Стол</span>
                    </div>
                </div>
             </NavLink>

             {/* Item 2: Quiz (The Box) */}
             <NavLink to="/quiz" className={({isActive}) => 
                `pointer-events-auto transition-transform duration-300 hover:-translate-y-4 ${isActive ? '-translate-y-2 scale-105' : 'translate-y-4 opacity-90'}`
             }>
                <div className="relative w-28 h-28 sm:w-36 sm:h-36 bg-cardboard shadow-floating flex items-center justify-center rotate-[2deg] rounded-sm border-t border-white/20">
                     {/* Box Lid Effect */}
                     <div className="absolute inset-x-0 top-0 h-1/2 bg-black/5"></div>
                     <div className="z-10 bg-white/90 px-3 py-1 rotate-[-1deg] shadow-sm transform skew-x-2">
                         <span className="font-typewriter font-bold tracking-widest text-sm">ПОДБОР</span>
                     </div>
                </div>
             </NavLink>

             {/* Item 3: Wishlist (Corkboard Note) */}
             <NavLink to="/wishlist" className={({isActive}) => 
                `pointer-events-auto transition-transform duration-300 hover:-translate-y-4 ${isActive ? '-translate-y-2' : 'translate-y-4 opacity-90'}`
             }>
                 <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-yellow-100 shadow-deep flex items-center justify-center rotate-[4deg]">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-red-600 shadow-sm z-20"></div> {/* Pin */}
                    <div className="text-center rotate-[-4deg]">
                        <span className="block font-handwritten text-3xl font-bold text-ink">Идеи</span>
                        <span className="block font-typewriter text-[10px] text-pencil">Сохранено</span>
                    </div>
                </div>
             </NavLink>

             {/* Item 4: Profile (ID Card) */}
             <NavLink to="/profile" className={({isActive}) => 
                `pointer-events-auto transition-transform duration-300 hover:-translate-y-4 ${isActive ? '-translate-y-2' : 'translate-y-4 opacity-90'}`
             }>
                 <div className="relative w-20 h-28 sm:w-24 sm:h-36 bg-white rounded-lg shadow-deep flex flex-col items-center p-2 rotate-[-1deg] border border-gray-200">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mb-2 grayscale opacity-50"></div>
                    <div className="w-full h-1 bg-black/10 mb-1"></div>
                    <div className="w-2/3 h-1 bg-black/10 mb-2"></div>
                    <span className="font-typewriter text-[10px] text-center mt-auto">ID CARD</span>
                    <div className="absolute -top-2 w-full flex justify-center"><div className="w-2 h-8 bg-transparent border-2 border-gray-300 rounded-full"></div></div>
                </div>
             </NavLink>
          </nav>
      )}
    </div>
  );
};