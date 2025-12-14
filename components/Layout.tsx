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
    <div className="min-h-screen flex flex-col max-w-lg mx-auto relative shadow-2xl bg-paper-bg border-x border-gray-100">
      
      {/* Header - Hand-drawn Logo */}
      <header className="sticky top-0 z-40 bg-paper-bg/95 backdrop-blur-sm px-6 py-4 flex justify-between items-center border-b border-dashed border-gray-300">
         <div className="flex items-center gap-2 transform -rotate-1">
            <span className="font-display font-bold text-3xl text-paper-ink tracking-tight">
                Gifty<span className="text-paper-red">.ai</span>
            </span>
            <span className="text-2xl animate-swing">✏️</span>
         </div>
      </header>

      <main className={`flex-grow flex flex-col ${showNav ? 'pb-32' : 'pb-8'} bg-[linear-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:100%_2rem]`}>
        <div className="flex-grow pt-4">
          {children}
        </div>
        {showFooter && <Footer />}
      </main>

      {showNav && (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center max-w-lg mx-auto pointer-events-none">
          {/* Notebook Tabs Navigation */}
          <nav className="pointer-events-auto w-full px-2 flex items-end justify-center gap-2 pb-2">
             
             <NavLink to="/" className={({ isActive }) => `bg-white border-2 border-b-0 border-gray-200 rounded-t-xl p-4 w-20 h-20 flex flex-col items-center justify-start pt-3 transition-all transform origin-bottom hover:-translate-y-2 ${isActive ? 'h-24 -translate-y-2 z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]' : 'opacity-90 hover:opacity-100 translate-y-4'}`}>
                <span className="text-2xl mb-1">🏠</span>
                <span className="font-display text-lg leading-none">Дом</span>
             </NavLink>

             <NavLink to="/quiz" className={({ isActive }) => `bg-paper-yellow border-2 border-b-0 border-yellow-500/20 rounded-t-xl p-4 w-24 h-24 flex flex-col items-center justify-start pt-4 transition-all transform origin-bottom -mx-1 hover:-translate-y-4 ${isActive ? 'h-28 -translate-y-4 z-20 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]' : 'opacity-90 hover:opacity-100 translate-y-2'}`}>
                <span className="text-3xl mb-1 animate-bounce">🎁</span>
                <span className="font-display font-bold text-xl leading-none">Найти</span>
             </NavLink>

             <NavLink to="/profile" className={({ isActive }) => `bg-white border-2 border-b-0 border-gray-200 rounded-t-xl p-4 w-20 h-20 flex flex-col items-center justify-start pt-3 transition-all transform origin-bottom hover:-translate-y-2 ${isActive ? 'h-24 -translate-y-2 z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]' : 'opacity-90 hover:opacity-100 translate-y-4'}`}>
                <span className="text-2xl mb-1">👤</span>
                <span className="font-display text-lg leading-none">Я</span>
             </NavLink>

          </nav>
        </div>
      )}
    </div>
  );
};