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
  
  const baseStyles = "relative py-3 px-6 font-marker tracking-widest text-lg transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group";
  
  const variants = {
    primary: "bg-black text-white shadow-lifted hover:-rotate-1",
    secondary: "bg-white text-black border-2 border-black shadow-close hover:rotate-1",
    ghost: "bg-transparent text-black hover:bg-black/5 hover:rotate-1 decoration-wavy underline underline-offset-4"
  };

  // Rough jagged edges using clip-path to look like torn cardboard
  const clipStyle = variant !== 'ghost' ? {
    clipPath: 'polygon(2% 5%, 98% 2%, 100% 95%, 95% 100%, 5% 98%, 0% 100%)'
  } : {};

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      style={clipStyle}
      {...props}
    >
      {variant === 'primary' && (
         <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
      )}
      {children}
    </button>
  );
};