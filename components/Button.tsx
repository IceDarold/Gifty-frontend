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
  
  const baseStyles = "relative py-4 px-6 font-pixel text-xs uppercase tracking-widest transition-transform active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 group";
  
  const variants = {
    primary: `
        bg-retro-primary text-white border-4 border-black
        shadow-pixel hover:bg-blue-600
    `,
    secondary: `
        bg-white text-black border-4 border-black
        shadow-pixel hover:bg-gray-100
    `,
    ghost: "bg-transparent text-white border-2 border-dashed border-white/50 hover:bg-white/10 hover:border-white"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {/* Selection Arrow on Hover */}
      {variant !== 'ghost' && (
         <span className="absolute left-2 opacity-0 group-hover:opacity-100 transition-opacity">►</span>
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
};