import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 text-center border-t border-cyber-gray/20 bg-cyber-black mt-auto">
       <div className="flex items-center justify-center gap-6 mb-2 font-mono text-[10px] uppercase">
          <a href="#" className="text-cyber-gray hover:text-cyber-green">[ABOUT]</a>
          <a href="#" className="text-cyber-gray hover:text-cyber-green">[LOGS]</a>
          <a href="#" className="text-cyber-gray hover:text-cyber-green">[PRIVACY]</a>
       </div>
       
       <div className="text-cyber-dim text-[9px] font-mono">
          <p>SYSTEM_STATUS: STABLE | GIFTY_PROTOCOL_2077</p>
       </div>
    </footer>
  );
};