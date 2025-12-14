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
  
  const baseStyles = "relative py-4 px-8 font-extrabold text-lg rounded-[2rem] transition-all duration-200 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:active:scale-100";
  
  const variants = {
    // Vibrant Clay
    primary: `
        bg-[#6c5ce7] text-white
        shadow-[8px_8px_16px_rgba(108,92,231,0.4),-4px_-4px_12px_rgba(255,255,255,0.2),inset_2px_2px_4px_rgba(255,255,255,0.2)]
        hover:bg-[#5f4dd0]
        active:shadow-inner
    `,
    // Soft Clay
    secondary: `
        bg-[#f0f2f5] text-[#2d3436]
        shadow-clay
        hover:translate-y-[-2px]
        active:shadow-clay-pressed
    `,
    ghost: "bg-transparent text-[#6c5ce7] hover:bg-white/50"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};