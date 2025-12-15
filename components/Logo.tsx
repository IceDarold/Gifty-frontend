import React from 'react';
import { Mascot } from './Mascot';

interface LogoProps {
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({ className = '', onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-2 select-none cursor-pointer group ${className}`}
    >
      {/* Icon Wrapper */}
      <div className="w-11 h-11 relative flex-shrink-0 transition-transform duration-500 ease-out group-hover:rotate-[15deg] group-hover:scale-110">
         <Mascot 
            className="w-full h-full drop-shadow-md filter saturate-110" 
            emotion="happy" 
            accessory="none"
         />
      </div>
      
      {/* Typography */}
      <div className="flex items-baseline leading-none pt-1">
        <span className="font-sans font-[900] text-[1.75rem] tracking-tighter text-[#2563EB] drop-shadow-sm group-hover:text-[#3B82F6] transition-colors">
            Gifty
        </span>
        <span className="font-sans font-[900] text-[1.75rem] tracking-tighter text-[#8B5CF6] ml-[2px] group-hover:text-[#A78BFA] transition-colors">
            AI
        </span>
      </div>
    </div>
  );
};