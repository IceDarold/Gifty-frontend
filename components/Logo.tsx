import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'color' | 'white';
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({ className = '', variant = 'color', onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`flex items-baseline leading-none select-none cursor-pointer group hover:scale-105 transition-transform duration-300 ${className}`}
    >
      {variant === 'color' ? (
        <>
            <span className="font-sans font-[900] text-[1.8rem] tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#3B82F6] drop-shadow-sm">
                Gifty
            </span>
            <span className="font-sans font-[900] text-[1.8rem] tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] ml-[2px]">
                AI
            </span>
        </>
      ) : (
        <>
            <span className="font-sans font-[900] text-[1.8rem] tracking-tighter text-white drop-shadow-md">
                Gifty
            </span>
            <span className="font-sans font-[900] text-[1.8rem] tracking-tighter text-white/90 ml-[2px] drop-shadow-md">
                AI
            </span>
        </>
      )}
    </div>
  );
};