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
  const baseStyles = "py-4 px-8 rounded-full font-sans font-semibold text-base transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";
  
  const variants = {
    // Gradient Glow
    primary: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] border border-white/20",
    
    // Glassy
    secondary: "bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10",
    
    // Minimal
    ghost: "bg-transparent text-white/70 hover:text-white hover:bg-white/5"
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