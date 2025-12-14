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
    <div className="min-h-screen flex flex-col max-w-lg mx-auto relative bg-cyber-black bg-[size:40px_40px] bg-grid-pattern border-x border-cyber-gray/30">
      
      {/* Top System Status */}
      <div className="fixed top-0 left-0 right-0 max-w-lg mx-auto z-50 bg-cyber-black/90 border-b border-cyber-green/30 px-4 py-2 flex justify-between items-center text-[10px] font-mono tracking-widest text-cyber-dim uppercase">
         <span>SYS: ONLINE</span>
         <span>SECURE_CONN</span>
         <span>V.3.0.1</span>
      </div>

      <main className={`flex-grow flex flex-col pt-10 ${showNav ? 'pb-24' : 'pb-8'}`}>
        <div className="flex-grow">
          {children}
        </div>
        {showFooter && <Footer />}
      </main>

      {showNav && (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center max-w-lg mx-auto">
          <nav className="w-full bg-cyber-black border-t-2 border-cyber-green px-4 py-3 flex justify-between items-end">
             
             <NavLink to="/" className={({ isActive }) => `flex-1 flex flex-col items-center gap-1 group py-1 border border-transparent hover:border-cyber-green/30 transition-all ${isActive ? 'text-cyber-green bg-cyber-green/10' : 'text-cyber-gray hover:text-cyber-green'}`}>
                <span className="text-xl font-bold">I/O</span>
                <span className="text-[9px] uppercase tracking-widest">[HOME]</span>
             </NavLink>
             
             {/* Center Action */}
             <NavLink to="/quiz" className="flex-1 flex flex-col items-center -mt-8">
                {({ isActive }) => (
                    <>
                        <div className={`w-16 h-12 bg-cyber-black border-2 border-cyber-green flex items-center justify-center transition-all ${isActive ? 'bg-cyber-green text-black shadow-[0_0_15px_#00ff41]' : 'text-cyber-green hover:bg-cyber-green/20'}`}>
                            <span className="text-xs font-black font-mono">EXEC</span>
                        </div>
                        <div className="h-4 w-[2px] bg-cyber-green"></div>
                        <span className="text-[9px] uppercase tracking-widest text-cyber-green mt-1">START_SEQ</span>
                    </>
                )}
             </NavLink>

             <NavLink to="/profile" className={({ isActive }) => `flex-1 flex flex-col items-center gap-1 group py-1 border border-transparent hover:border-cyber-green/30 transition-all ${isActive ? 'text-cyber-green bg-cyber-green/10' : 'text-cyber-gray hover:text-cyber-green'}`}>
                <span className="text-xl font-bold">USR</span>
                <span className="text-[9px] uppercase tracking-widest">[DATA]</span>
             </NavLink>

          </nav>
        </div>
      )}
    </div>
  );
};