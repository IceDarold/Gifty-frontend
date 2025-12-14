import React from 'react';
import { NavLink } from 'react-router-dom';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
  showFooter?: boolean;
}

// Decorative HUD Corners
const HudCorners = () => (
  <div className="fixed inset-0 pointer-events-none z-[40] p-2 max-w-lg mx-auto">
    {/* Top Left */}
    <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-cyber-green/50"></div>
    {/* Top Right */}
    <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-cyber-green/50"></div>
    {/* Bottom Left */}
    <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-cyber-green/50"></div>
    {/* Bottom Right */}
    <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-cyber-green/50"></div>
  </div>
);

export const Layout: React.FC<LayoutProps> = ({ children, showNav = true, showFooter = true }) => {
  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto relative bg-cyber-black bg-[size:20px_20px] bg-grid-pattern border-x border-cyber-green/10 shadow-[0_0_50px_rgba(0,255,65,0.05)]">
      
      <HudCorners />

      {/* Top System Status Bar */}
      <div className="fixed top-0 left-0 right-0 max-w-lg mx-auto z-50 bg-cyber-black/90 backdrop-blur-sm border-b border-cyber-green/20 px-4 py-2 flex justify-between items-center text-[9px] font-mono tracking-widest text-cyber-green/70 uppercase select-none">
         <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-cyber-green rounded-full animate-pulse shadow-neon"></span>
            <span>NET: SECURE</span>
         </div>
         <span>MEM: 64TB</span>
      </div>

      <main className={`flex-grow flex flex-col pt-12 ${showNav ? 'pb-28' : 'pb-8'}`}>
        <div className="flex-grow">
          {children}
        </div>
        {showFooter && <Footer />}
      </main>

      {showNav && (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center max-w-lg mx-auto">
          {/* Main Control Deck */}
          <nav className="w-full bg-cyber-black/95 backdrop-blur-md border-t border-cyber-green/30 px-2 pb-6 pt-2 flex justify-between items-end relative">
             
             {/* Decorative Top Line on Nav */}
             <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyber-green to-transparent opacity-50"></div>

             <NavLink to="/" className={({ isActive }) => `flex-1 flex flex-col items-center gap-1 group p-2 transition-all ${isActive ? 'text-cyber-green opacity-100' : 'text-cyber-gray opacity-60 hover:text-cyber-green hover:opacity-80'}`}>
                {({ isActive }) => (
                    <>
                        <div className={`border border-current p-1 transition-all ${isActive ? 'shadow-neon bg-cyber-green/10' : ''}`}>
                            <span className="text-xl font-bold font-mono">I/O</span>
                        </div>
                        <span className="text-[8px] uppercase tracking-widest font-mono">[ROOT]</span>
                    </>
                )}
             </NavLink>
             
             {/* Center Action - Floating Hexagon/Button */}
             <NavLink to="/quiz" className="flex-1 flex flex-col items-center -mt-8 relative z-10 group">
                {({ isActive }) => (
                    <div className="flex flex-col items-center">
                        <div className={`w-16 h-14 clip-path-polygon bg-cyber-black border border-cyber-green flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-cyber-green text-black shadow-neon' : 'text-cyber-green hover:bg-cyber-green/20 group-hover:scale-110'}`}>
                            <span className="text-xs font-black font-mono animate-flicker">RUN</span>
                        </div>
                        <span className="text-[8px] uppercase tracking-widest text-cyber-green mt-1 bg-cyber-black px-2 border border-cyber-green/30">INIT</span>
                    </div>
                )}
             </NavLink>

             <NavLink to="/profile" className={({ isActive }) => `flex-1 flex flex-col items-center gap-1 group p-2 transition-all ${isActive ? 'text-cyber-green opacity-100' : 'text-cyber-gray opacity-60 hover:text-cyber-green hover:opacity-80'}`}>
                {({ isActive }) => (
                    <>
                        <div className={`border border-current p-1 transition-all ${isActive ? 'shadow-neon bg-cyber-green/10' : ''}`}>
                            <span className="text-xl font-bold font-mono">DB</span>
                        </div>
                        <span className="text-[8px] uppercase tracking-widest font-mono">[USER]</span>
                    </>
                )}
             </NavLink>

          </nav>
        </div>
      )}
      
      {/* CSS for clip-path polygon (Hexagon-ish) */}
      <style>{`
        .clip-path-polygon {
            clip-path: polygon(10% 0, 90% 0, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0 90%, 0 10%);
        }
      `}</style>
    </div>
  );
};