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
    <div className="min-h-screen w-full relative flex flex-col font-serif bg-paper text-ink selection:bg-accent selection:text-white overflow-x-hidden">
      
      {/* 1. TOP BAR: Technical Specs */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-start mix-blend-multiply bg-paper/90 backdrop-blur-sm border-b border-ink/5">
          <div className="flex flex-col">
             <NavLink to="/" className="font-mono text-sm font-medium tracking-tight hover:text-accent transition-colors">
                Gifty.ai <span className="text-xs text-graphite align-top">©Sys_2.0</span>
             </NavLink>
             <span className="font-mono text-[10px] text-graphite uppercase tracking-widest mt-1">
                Data-Poetry Engine
             </span>
          </div>

          {showNav && (
            <nav className="flex gap-6 font-mono text-xs uppercase tracking-widest">
                <NavLink to="/quiz" className={({isActive}) => `hover:text-accent transition-colors ${isActive ? 'text-accent border-b border-accent' : 'text-graphite'}`}>
                    Search_Protocol
                </NavLink>
                <NavLink to="/wishlist" className={({isActive}) => `hover:text-accent transition-colors ${isActive ? 'text-accent border-b border-accent' : 'text-graphite'}`}>
                    Archives
                </NavLink>
                <NavLink to="/profile" className={({isActive}) => `hover:text-accent transition-colors ${isActive ? 'text-accent border-b border-accent' : 'text-graphite'}`}>
                    Dossier
                </NavLink>
            </nav>
          )}
      </header>

      {/* Grid Lines (Vertical only for 'document' feel) */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.04] flex justify-between px-6 max-w-4xl mx-auto w-full">
          <div className="w-px h-full bg-ink"></div>
          <div className="w-px h-full bg-ink"></div>
          <div className="w-px h-full bg-ink"></div>
      </div>

      {/* Main Content Area */}
      <main className="w-full max-w-4xl mx-auto flex-grow z-10 pt-32 px-6 pb-32">
        {children}
      </main>

      {/* BOTTOM TICKER: System Status */}
      <div className="fixed bottom-0 left-0 w-full bg-ink text-paper font-mono text-xs py-1 overflow-hidden z-40 pointer-events-none">
          <div className="whitespace-nowrap animate-ticker inline-block">
              SYSTEM STATUS: ONLINE ● ANALYZING EMOTIONAL PATTERNS ● INDEXING OBJECTS ● CALCULATING AFFECTION COEFFICIENTS ● WAITING FOR INPUT ● 
              SYSTEM STATUS: ONLINE ● ANALYZING EMOTIONAL PATTERNS ● INDEXING OBJECTS ● CALCULATING AFFECTION COEFFICIENTS ● WAITING FOR INPUT ●
          </div>
      </div>
    </div>
  );
};