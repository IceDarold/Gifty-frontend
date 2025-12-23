import React from 'react';
import { Link } from 'react-router-dom';
import { useDevMode } from './DevModeContext';

export const Footer: React.FC = () => {
  const { isDevMode, enableDevMode, disableDevMode } = useDevMode();

  const handleDevTrigger = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isDevMode) {
        // eslint-disable-next-line no-restricted-globals
        if(confirm('Disable Dev Mode?')) {
            disableDevMode();
        }
    } else {
        // eslint-disable-next-line no-restricted-globals
        const pwd = prompt('Enter Dev Password:');
        if (pwd) {
            if (enableDevMode(pwd)) {
                // eslint-disable-next-line no-restricted-globals
                alert('🚀 Dev Mode Enabled');
            } else {
                // eslint-disable-next-line no-restricted-globals
                alert('❌ Access Denied');
            }
        }
    }
  };

  return (
    <footer className="w-full py-8 text-center relative z-10 mt-auto">
       <div className="w-full h-px bg-gradient-to-r from-transparent via-indigo-200/20 to-transparent mb-6"></div>
       
       <div className="flex items-center justify-center gap-6 mb-4">
          <a href="#" className="text-indigo-200/60 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors">О сервисе</a>
          <Link to="/blog" className="text-indigo-200/60 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors">Блог</Link>
          <a href="#" className="text-indigo-200/60 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors">Политика</a>
       </div>
       
       <div className="text-indigo-200/40 text-[10px] px-8 leading-relaxed font-medium flex flex-col items-center">
          <p className="mb-2">© 2025 Gifty AI</p>
          <p>Мы используем магию и алгоритмы,<br/>чтобы вы дарили лучшие подарки.</p>
          
          <div className="mt-4 min-h-[20px] flex items-center justify-center">
            <button 
                onClick={handleDevTrigger}
                className={`font-mono text-[10px] transition-all duration-300 cursor-pointer select-none px-2 py-1 rounded ${
                    isDevMode 
                    ? 'text-green-500 opacity-100 font-bold bg-green-500/10' 
                    : 'text-brand-purple opacity-0 hover:opacity-100 hover:bg-white/5' 
                }`}
                title="Dev Mode"
            >
                {isDevMode ? '[DEV MODE ACTIVE]' : 'π'}
            </button>
          </div>
       </div>
    </footer>
  );
};