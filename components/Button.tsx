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
  
  const baseStyles = "relative py-3 px-6 font-marker tracking-wider text-xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group";
  
  // Styles mimicking torn cardboard or paper scraps
  const variants = {
    primary: "bg-[#2b2b2b] text-white shadow-deep rotate-[-1deg] hover:rotate-0 hover:scale-[1.02]",
    secondary: "bg-white text-[#2b2b2b] border-2 border-[#2b2b2b] shadow-float rotate-[1deg] hover:rotate-0",
    ghost: "bg-transparent text-[#2b2b2b] hover:bg-black/5 hover:rotate-1 decoration-wavy underline underline-offset-4"
  };

  // Random rough clip-path for primary/secondary to look cut out
  const clipStyle = variant !== 'ghost' ? {
    clipPath: 'polygon(2% 5%, 98% 0%, 100% 95%, 95% 100%, 5% 98%, 0% 100%)'
  } : {};

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      style={clipStyle}
      {...props}
    >
      {/* Tape Decoration for Primary buttons */}
      {variant === 'primary' && (
         <div className="tape-strip" style={{ top: '-10px', left: '10px', width: '30px', height: '15px', transform: 'rotate(45deg)', opacity: 0.3 }}></div>
      )}
      {children}
    </button>
  );
};