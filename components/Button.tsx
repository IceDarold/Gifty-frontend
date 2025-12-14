import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  
  const baseStyles = "relative py-3 px-6 font-bold text-lg rounded-full transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden";
  
  const variants = {
    // Frutiger Aero "Gel" Button
    primary: `
        bg-gradient-to-b from-[#00bfff] to-[#0080ff] 
        text-white border border-[#0070e0]
        shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_4px_10px_rgba(0,128,255,0.3)]
        hover:brightness-110
    `,
    secondary: `
        bg-white/50 backdrop-blur-md 
        text-blue-700 border border-white 
        shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_2px_5px_rgba(0,0,0,0.05)]
        hover:bg-white/70
    `,
    ghost: "bg-transparent text-blue-700 hover:bg-white/20"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {/* Gloss Highlight (Top half) */}
      {variant !== 'ghost' && (
        <div className="absolute top-0 left-0 right-0 h-[45%] bg-gradient-to-b from-white/60 to-transparent opacity-80 pointer-events-none rounded-t-full mx-1 mt-0.5"></div>
      )}
      
      {/* Content */}
      <span className="relative z-10 drop-shadow-sm">{children}</span>
    </button>
  );
};