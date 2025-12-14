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
  const baseStyles = "py-3.5 px-6 rounded-xl font-display font-bold text-lg transition-all border-2 border-black active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    // Pop Yellow with Hard Shadow
    primary: "bg-pop-yellow text-black shadow-hard hover:bg-yellow-300",
    
    // White with Hard Shadow
    secondary: "bg-white text-black shadow-hard hover:bg-gray-50",
    
    // Transparent but with border (Outline)
    ghost: "bg-transparent border-dashed text-black hover:bg-black/5 shadow-none"
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