import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 text-center relative z-0 mt-auto border-t-2 border-black bg-white">
       <div className="flex items-center justify-center gap-6 mb-4">
          <a href="#" className="text-black hover:bg-pop-yellow hover:border-black border border-transparent px-1 text-[12px] font-black uppercase tracking-widest transition-all">О сервисе</a>
          <a href="#" className="text-black hover:bg-pop-pink hover:border-black border border-transparent px-1 text-[12px] font-black uppercase tracking-widest transition-all">Блог</a>
          <a href="#" className="text-black hover:bg-pop-cyan hover:border-black border border-transparent px-1 text-[12px] font-black uppercase tracking-widest transition-all">Политика</a>
       </div>
       
       <div className="text-gray-500 text-[10px] px-8 leading-relaxed font-bold font-mono">
          <p className="mb-2">© 2024 GIFTY POP!</p>
          <p>MADE WITH 🖤 AND CODE.</p>
       </div>
    </footer>
  );
};