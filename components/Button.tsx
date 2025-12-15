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
  
  const baseStyles = "relative font-typewriter font-bold text-sm uppercase transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    // Primary: A Red Ink Stamp or Tag
    primary: `
        bg-stamp-red text-white border-2 border-transparent
        shadow-md hover:shadow-lg
        px-6 py-3 rounded-sm rotate-[-1deg] hover:rotate-0
        tracking-widest
    `,
    // Secondary: A pencil sketch box
    secondary: `
        bg-white text-pencil border-2 border-pencil
        shadow-sm hover:shadow-md
        px-5 py-3 rounded-sm rotate-[1deg] hover:rotate-0
    `,
    // Ghost: Just text with underline
    ghost: `
        bg-transparent text-ink underline decoration-2 underline-offset-4 decoration-stamp-red
        hover:decoration-wavy px-2 font-handwritten text-lg
    `
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full block' : 'inline-block'} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};