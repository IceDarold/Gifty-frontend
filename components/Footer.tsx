import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 text-center relative z-0 mt-auto opacity-60">
       <div className="flex items-center justify-center gap-6 mb-4">
          <a href="#" className="text-white text-xs hover:text-indigo-300 transition-colors">About</a>
          <a href="#" className="text-white text-xs hover:text-indigo-300 transition-colors">Blog</a>
          <a href="#" className="text-white text-xs hover:text-indigo-300 transition-colors">Privacy</a>
       </div>
       
       <div className="text-white/40 text-[10px] px-8 font-light">
          <p>© 2024 GIFTY AURA</p>
       </div>
    </footer>
  );
};