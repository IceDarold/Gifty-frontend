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
  // Sharp edges, borders, mono font
  const baseStyles = "relative py-4 px-6 font-mono font-bold text-sm uppercase tracking-widest transition-all duration-100 active:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden";
  
  const variants = {
    // Green solid
    primary: "bg-cyber-green text-black border border-cyber-green hover:bg-white hover:text-black hover:shadow-[0_0_10px_#fff]",
    
    // Outlined
    secondary: "bg-transparent text-cyber-green border border-cyber-green hover:bg-cyber-green/10",
    
    // Minimal with bracket style
    ghost: "bg-transparent text-cyber-gray hover:text-cyber-green border border-transparent hover:border-cyber-gray/50"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {/* Corner decorations */}
      <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-current opacity-50"></span>
      <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-current opacity-50"></span>
      
      <span className="relative z-10 flex items-center justify-center gap-2">
        {variant === 'primary' && <span className="animate-blink mr-1">{'>'}</span>}
        {children}
      </span>
    </button>
  );
};