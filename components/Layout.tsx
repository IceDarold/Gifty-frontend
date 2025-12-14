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
    <div className="min-h-screen flex flex-col max-w-lg mx-auto relative border-x-2 border-pop-black bg-pop-bg shadow-2xl">
      
      {/* Fun Header */}
      <header className="sticky top-0 z-40 bg-pop-bg/90 backdrop-blur-md border-b-2 border-pop-black px-4 py-3 flex justify-between items-center">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-pop-yellow border-2 border-pop-black rounded-full flex items-center justify-center font-black text-sm shadow-hard-sm transform -rotate-6">
                G
            </div>
            <span className="font-display font-bold text-xl tracking-tight">Gifty<span className="text-pop-purple">.ai</span></span>
         </div>
         <div className="text-xs font-bold bg-pop-black text-white px-2 py-1 rounded-md">BETA</div>
      </header>

      <main className={`flex-grow flex flex-col ${showNav ? 'pb-28' : 'pb-8'}`}>
        <div className="flex-grow">
          {children}
        </div>
        {showFooter && <Footer />}
      </main>

      {showNav && (
        <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
          <nav className="pointer-events-auto bg-white border-2 border-pop-black rounded-full shadow-hard px-6 py-3 flex gap-8 items-center justify-between max-w-sm w-full">
             
             <NavLink to="/" className={({ isActive }) => `flex flex-col items-center gap-1 transition-all hover:scale-110 active:scale-95 ${isActive ? 'text-pop-black' : 'text-gray-400'}`}>
                {({ isActive }) => (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isActive ? 'fill-pop-yellow stroke-pop-black stroke-2' : 'stroke-current'}`} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    </>
                )}
             </NavLink>
             
             {/* Center Action - Pop Button */}
             <NavLink to="/quiz" className="flex flex-col items-center -mt-10 group">
                <div className="w-14 h-14 bg-pop-purple border-2 border-pop-black rounded-full flex items-center justify-center shadow-hard group-hover:shadow-none group-hover:translate-x-[4px] group-hover:translate-y-[4px] transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
             </NavLink>

             <NavLink to="/profile" className={({ isActive }) => `flex flex-col items-center gap-1 transition-all hover:scale-110 active:scale-95 ${isActive ? 'text-pop-black' : 'text-gray-400'}`}>
                 {({ isActive }) => (
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isActive ? 'fill-pop-blue stroke-pop-black stroke-2' : 'stroke-current'}`} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                 )}
             </NavLink>

          </nav>
        </div>
      )}
    </div>
  );
};