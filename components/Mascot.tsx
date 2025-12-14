import React from 'react';

interface MascotProps {
  className?: string;
  emotion?: 'happy' | 'thinking' | 'surprised' | 'excited' | 'cool';
}

export const Mascot: React.FC<MascotProps> = ({ 
  className = "", 
  emotion = 'happy',
}) => {
  
  // Typographic expressions
  const faces = {
    happy: "( ^ _ ^ )",
    thinking: "( ? _ ? )",
    surprised: "( o _ o )",
    excited: "\\( ^ o ^ )/",
    cool: "[ - _ - ]"
  };

  return (
    <div className={`font-mono text-ink tracking-widest select-none ${className}`}>
        <div className="animate-drift flex flex-col items-center gap-2">
            <span className="text-xs text-gray-400 uppercase tracking-[0.3em]">System.AI</span>
            <div className="text-3xl sm:text-4xl whitespace-nowrap">
                {faces[emotion]}
            </div>
            {emotion === 'thinking' && (
                <div className="flex gap-1 mt-1">
                    <span className="w-1 h-1 bg-accent rounded-full animate-bounce"></span>
                    <span className="w-1 h-1 bg-accent rounded-full animate-bounce delay-100"></span>
                    <span className="w-1 h-1 bg-accent rounded-full animate-bounce delay-200"></span>
                </div>
            )}
        </div>
    </div>
  );
};