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
  
  const baseStyles = "relative font-mono font-bold text-sm uppercase transition-all duration-75 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    // Primary: Acid Green, Black Border, Hard Shadow
    primary: `
        bg-acid-green text-black border-2 border-black
        shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
        hover:bg-white hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1
        px-8 py-4
    `,
    // Secondary: Black block, White text, Brutalist
    secondary: `
        bg-black text-white border-2 border-black
        hover:bg-error hover:border-error
        px-6 py-3
    `,
    // Ghost: Looks like raw text link
    ghost: `
        bg-transparent text-black underline decoration-2 underline-offset-4 decoration-black
        hover:decoration-acid-green hover:bg-black hover:text-white px-2
    `
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full block' : 'inline-block'} ${className}`}
      {...props}
    >
        {/* Random glitch element on primary buttons */}
        {variant === 'primary' && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-error pointer-events-none"></span>
        )}
      {children}
    </button>
  );
};