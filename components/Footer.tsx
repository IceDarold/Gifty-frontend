import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-12 border-t border-ink/10 flex flex-col sm:flex-row justify-between items-start gap-4 text-xs font-mono text-graphite uppercase tracking-widest">
       <div>
           Gifty.ai © 2025
       </div>
       <div className="flex gap-4">
           <a href="#" className="hover:text-ink">Manifesto</a>
           <a href="#" className="hover:text-ink">Privacy_Protocol</a>
       </div>
    </footer>
  );
};