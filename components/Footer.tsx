import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 text-center relative z-0 mt-auto">
       <div className="w-full h-px bg-gradient-to-r from-transparent via-indigo-200/20 to-transparent mb-6"></div>
       
       <div className="flex items-center justify-center gap-6 mb-4">
          <a href="#" className="text-indigo-200/60 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors">О сервисе</a>
          <a href="#" className="text-indigo-200/60 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors">Блог</a>
          <a href="#" className="text-indigo-200/60 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors">Политика</a>
       </div>
       
       <div className="text-indigo-200/40 text-[10px] px-8 leading-relaxed font-medium">
          <p className="mb-2">© 2024 Gifty AI</p>
          <p>Мы используем магию и алгоритмы,<br/>чтобы вы дарили лучшие подарки.</p>
       </div>
    </footer>
  );
};