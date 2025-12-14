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
  
  const baseStyles = "relative py-3 px-6 font-display font-bold text-sm tracking-wide transition-all duration-100 rounded-xl border-2 border-pop-black flex items-center justify-center gap-2 active:shadow-none active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-pop-yellow text-pop-black shadow-hard hover:-translate-y-0.5 hover:shadow-hard-lg",
    secondary: "bg-white text-pop-black shadow-hard hover:-translate-y-0.5 hover:shadow-hard-lg",
    ghost: "bg-transparent border-transparent shadow-none hover:bg-gray-100 !border-0"
  };

  // Override ghost border
  const finalClass = variant === 'ghost' 
    ? `${baseStyles.replace('border-2 border-pop-black', '')} ${variants.ghost}`
    : `${baseStyles} ${variants[variant]}`;

  return (
    <button 
      className={`${finalClass} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};