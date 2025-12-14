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
    <div className="min-h-screen w-full relative flex flex-col font-serif bg-paper text-ink selection:bg-accent selection:text-white">
      
      {/* HEADER / NAV - Minimalist Text */}
      <header className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-start pointer-events-none mix-blend-multiply">
          <div className="pointer-events-auto">
             <NavLink to="/" className="font-mono text-xs uppercase tracking-widest hover:text-accent transition-colors">
                Gifty.ai <span className="text-gray-400">v2.0</span>
             </NavLink>
          </div>

          {showNav && (
            <nav className="pointer-events-auto flex flex-col items-end gap-1 font-mono text-xs tracking-wide">
                <NavLink to="/" className={({isActive}) => `hover:text-accent transition-colors ${isActive ? 'line-through decoration-accent' : ''}`}>
                    [ Index ]
                </NavLink>
                <NavLink to="/quiz" className={({isActive}) => `hover:text-accent transition-colors ${isActive ? 'line-through decoration-accent' : ''}`}>
                    [ Search ]
                </NavLink>
                <NavLink to="/profile" className={({isActive}) => `hover:text-accent transition-colors ${isActive ? 'line-through decoration-accent' : ''}`}>
                    [ User ]
                </NavLink>
            </nav>
          )}
      </header>

      {/* Grid Lines (Subtle) */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]" 
           style={{ backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px)', backgroundSize: '25% 100%' }}>
      </div>

      {/* Main Content Area */}
      <main className="w-full max-w-2xl mx-auto flex-grow z-10 pt-24 px-6 pb-24">
        {children}
      </main>

      {showFooter && (
          <div className="w-full max-w-2xl mx-auto px-6 mb-8">
              <Footer />
          </div>
      )}
    </div>
  );
};