import React, { useState, useEffect } from 'react';

interface MascotProps {
  className?: string;
  emotion?: 'happy' | 'thinking' | 'surprised' | 'excited' | 'cool';
  eyesX?: number; // -1 to 1
  eyesY?: number; // -1 to 1
  accessory?: 'none' | 'glasses' | 'scarf' | 'santa-hat';
  floating?: boolean;
}

export const Mascot: React.FC<MascotProps> = ({ 
  className = "w-32 h-32", 
  emotion = 'happy',
  eyesX = 0,
  eyesY = 0,
  accessory = 'santa-hat',
  floating = true
}) => {
  // Eye tracking movement calculation (clamped for the SVG coordinate system)
  // Eye center is approx at x=0, y=0 relative to their group
  const pupilX = Math.max(-1, Math.min(1, eyesX)) * 5;
  const pupilY = Math.max(-1, Math.min(1, eyesY)) * 5;

  // Blinking Logic
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const blinkLoop = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150); // Close eyes duration
      
      // Random interval between blinks (2s to 6s)
      const nextBlink = Math.random() * 4000 + 2000; 
      setTimeout(blinkLoop, nextBlink);
    };
    
    const timer = setTimeout(blinkLoop, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`${className} relative select-none pointer-events-none`}>
      <div className={`w-full h-full ${floating ? 'animate-[float_6s_ease-in-out_infinite]' : ''}`}>
        
        <svg viewBox="0 0 200 220" className="w-full h-full drop-shadow-2xl overflow-visible">
            <defs>
                {/* Soft Blue Gradient for Head */}
                <linearGradient id="headGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60A5FA" /> 
                    <stop offset="100%" stopColor="#2563EB" />
                </linearGradient>
                
                {/* Inner Glow for Depth */}
                <filter id="softGlow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>

            {/* --- EARS (Behind Head) --- */}
            <g transform="translate(0, 10)">
                {/* Left Ear */}
                <path d="M40 70 Q 20 40 30 20 Q 50 10 70 50" fill="url(#headGradient)" stroke="#1D4ED8" strokeWidth="2" />
                {/* Right Ear */}
                <path d="M160 70 Q 180 40 170 20 Q 150 10 130 50" fill="url(#headGradient)" stroke="#1D4ED8" strokeWidth="2" />
            </g>

            {/* --- HEAD --- */}
            {/* Squircle Shape */}
            <rect x="30" y="50" width="140" height="130" rx="60" fill="url(#headGradient)" />
            
            {/* Snout Area (Lighter Blue) */}
            <ellipse cx="100" cy="145" rx="45" ry="35" fill="#BFDBFE" opacity="0.4" />

            {/* --- FACE DETAILS --- */}
            
            {/* Cheeks */}
            <ellipse cx="55" cy="135" rx="12" ry="8" fill="#F472B6" opacity="0.6" />
            <ellipse cx="145" cy="135" rx="12" ry="8" fill="#F472B6" opacity="0.6" />

            {/* Nose */}
            <ellipse cx="100" cy="135" rx="10" ry="7" fill="#1E3A8A" />
            <ellipse cx="103" cy="133" rx="3" ry="2" fill="white" opacity="0.5" />

            {/* Mouth */}
            <path 
                d={emotion === 'surprised' ? "M90 155 Q100 165 110 155" : "M85 152 Q100 165 115 152"} 
                fill="none" 
                stroke="#1E3A8A" 
                strokeWidth="4" 
                strokeLinecap="round" 
            />

            {/* --- EYES --- */}
            <g transform="translate(0, 10)">
                 {/* Left Eye Container */}
                 <g transform="translate(70, 95)">
                    <circle cx="0" cy="0" r="22" fill="white" stroke="#DBEAFE" strokeWidth="2"/>
                    {isBlinking ? (
                        <line x1="-18" y1="0" x2="18" y2="0" stroke="#1E3A8A" strokeWidth="4" strokeLinecap="round" />
                    ) : (
                        <g transform={`translate(${pupilX}, ${pupilY})`}>
                            <circle cx="0" cy="0" r="10" fill="#1E3A8A" />
                            <circle cx="3" cy="-3" r="3" fill="white" />
                        </g>
                    )}
                 </g>

                 {/* Right Eye Container */}
                 <g transform="translate(130, 95)">
                    <circle cx="0" cy="0" r="22" fill="white" stroke="#DBEAFE" strokeWidth="2"/>
                    {isBlinking ? (
                        <line x1="-18" y1="0" x2="18" y2="0" stroke="#1E3A8A" strokeWidth="4" strokeLinecap="round" />
                    ) : (
                        <g transform={`translate(${pupilX}, ${pupilY})`}>
                            <circle cx="0" cy="0" r="10" fill="#1E3A8A" />
                            <circle cx="3" cy="-3" r="3" fill="white" />
                        </g>
                    )}
                 </g>
            </g>

            {/* --- ACCESSORIES --- */}

            {accessory === 'santa-hat' && (
                <g transform="translate(10, -15) rotate(-5, 100, 100)">
                    {/* Hat Body */}
                    <path 
                        d="M40 65 Q 100 -20 180 65" 
                        fill="#EF4444" 
                        stroke="#B91C1C" 
                        strokeWidth="2"
                    />
                     {/* Hat Fold */}
                     <path 
                        d="M130 25 Q 160 30 180 65" 
                        fill="#EF4444" 
                    />

                    {/* White Brim */}
                    <path 
                        d="M35 60 Q 100 50 165 60 L 165 80 Q 100 70 35 80 Z" 
                        fill="white" 
                        stroke="#E5E7EB"
                        strokeWidth="1"
                        filter="url(#softGlow)"
                    />
                    
                    {/* Pom Pom */}
                    <circle cx="175" cy="80" r="15" fill="white" stroke="#E5E7EB" strokeWidth="1" />
                </g>
            )}

            {accessory === 'glasses' && (
                 <g transform="translate(0, 10)">
                    <circle cx="70" cy="95" r="26" fill="none" stroke="#1F2937" strokeWidth="3" />
                    <circle cx="130" cy="95" r="26" fill="none" stroke="#1F2937" strokeWidth="3" />
                    <line x1="96" y1="95" x2="104" y2="95" stroke="#1F2937" strokeWidth="3" />
                 </g>
            )}
        </svg>
      </div>
    </div>
  );
};