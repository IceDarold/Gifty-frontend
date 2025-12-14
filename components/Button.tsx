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
  
  const baseStyles = "group relative inline-flex items-center justify-center font-mono text-sm uppercase tracking-wider transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed";
  
  const variants = {
    // Primary: Brackets that close in on hover
    primary: `
        text-ink py-4 px-8
        before:content-['['] before:mr-2 before:transition-all before:duration-300 before:text-accent
        after:content-[']'] after:ml-2 after:transition-all after:duration-300 after:text-accent
        hover:before:mr-1 hover:after:ml-1 hover:text-accent
    `,
    // Secondary: Solid black block, brutalist
    secondary: `
        bg-ink text-paper py-3 px-6
        hover:bg-accent hover:text-white
    `,
    // Ghost: Simple underline
    ghost: "text-graphite hover:text-ink underline decoration-1 underline-offset-4 decoration-gray-300 hover:decoration-accent"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full flex' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};