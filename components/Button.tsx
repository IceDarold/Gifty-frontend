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
  
  const baseStyles = "relative py-4 px-8 font-black text-lg rounded-[2rem] transition-all duration-200 flex items-center justify-center gap-3 active:scale-[0.96] disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none";
  
  const variants = {
    // Vibrant Clay - Shiny plastic look
    primary: `
        bg-[#6c5ce7] text-white
        shadow-[8px_8px_16px_rgba(108,92,231,0.4),-4px_-4px_12px_rgba(255,255,255,0.3),inset_2px_2px_4px_rgba(255,255,255,0.4)]
        hover:shadow-[10px_10px_20px_rgba(108,92,231,0.5),-4px_-4px_12px_rgba(255,255,255,0.3),inset_2px_2px_4px_rgba(255,255,255,0.4)]
        hover:translate-y-[-2px]
        active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.2)]
        bg-gradient-to-br from-[#6c5ce7] to-[#5f4dd0]
    `,
    // Soft Clay - Matte look
    secondary: `
        bg-[#eef2f6] text-[#2d3436]
        shadow-clay-sm
        hover:shadow-clay
        hover:translate-y-[-2px]
        active:shadow-clay-pressed
    `,
    ghost: "bg-transparent text-[#6c5ce7] hover:bg-white/50 border-2 border-transparent hover:border-[#6c5ce7]/20"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {/* Gloss reflection for primary buttons */}
      {variant === 'primary' && (
          <div className="absolute top-2 left-4 right-4 h-[2px] bg-white/30 rounded-full blur-[1px]"></div>
      )}
      {children}
    </button>
  );
};