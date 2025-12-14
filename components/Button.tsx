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
  const baseStyles = "relative py-4 px-6 font-mono font-bold text-xs uppercase tracking-widest transition-all duration-100 active:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden border";
  
  const variants = {
    // Solid filled block
    primary: "bg-cyber-green text-black border-cyber-green shadow-neon hover:bg-white hover:text-black",
    
    // Wireframe
    secondary: "bg-transparent text-cyber-green border-cyber-green hover:bg-cyber-green/10 hover:shadow-[0_0_15px_rgba(0,255,65,0.2)]",
    
    // Minimal Text
    ghost: "bg-transparent text-cyber-gray border-transparent hover:text-cyber-green hover:bg-cyber-green/5"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {/* Tech Corners for primary/secondary */}
      {variant !== 'ghost' && (
        <>
            <span className="absolute top-0 left-0 w-1 h-1 bg-current"></span>
            <span className="absolute bottom-0 right-0 w-1 h-1 bg-current"></span>
        </>
      )}
      
      {/* Scan overlay on hover */}
      <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-300 pointer-events-none"></span>

      <span className="relative z-10 flex items-center justify-center gap-3">
        {variant === 'primary' && <span className="animate-blink font-black">{'>_'}</span>}
        {children}
      </span>
    </button>
  );
};