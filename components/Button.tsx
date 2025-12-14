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
  
  // The "messy" border radius + sketch shadow creates the hand-drawn feel
  const baseStyles = "relative py-3 px-6 font-display font-bold text-xl tracking-wide transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border-2";
  
  const variants = {
    primary: "bg-paper-yellow text-paper-ink border-paper-ink rounded-messy shadow-sketch hover:shadow-sketch-lg hover:-rotate-1",
    secondary: "bg-white text-paper-ink border-paper-ink rounded-messy-sm shadow-sketch hover:shadow-sketch-lg hover:rotate-1",
    ghost: "bg-transparent border-transparent shadow-none hover:bg-gray-100/50 rounded-xl"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {/* Scribble effect on hover for primary */}
      {variant === 'primary' && (
         <span className="absolute inset-0 border-2 border-paper-ink rounded-messy opacity-0 group-hover:opacity-100 animate-scribble pointer-events-none"></span>
      )}
      {children}
    </button>
  );
};