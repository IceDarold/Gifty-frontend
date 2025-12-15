import React, { useState, useEffect } from 'react';
import { Gift } from '../types';
import { addToWishlist, removeFromWishlist, isInWishlist } from '../utils/storage';
import { track } from '../utils/analytics';

interface Props {
  gift: Gift;
  variant?: 'brutal' | 'minimal';
  onToggleWishlist?: () => void;
  onClick?: (gift: Gift) => void;
}

export const GiftCard: React.FC<Props> = ({ gift, variant = 'brutal', onToggleWishlist, onClick }) => {
  const [saved, setSaved] = useState(isInWishlist(gift.id));

  useEffect(() => {
    setSaved(isInWishlist(gift.id));
  }, [gift.id, onToggleWishlist]);

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (saved) {
      removeFromWishlist(gift.id);
      track('remove_wishlist', { id: gift.id });
    } else {
      addToWishlist(gift.id);
      track('add_wishlist', { id: gift.id });
    }
    setSaved(!saved);
    if (onToggleWishlist) onToggleWishlist();
  };

  return (
    <div 
      onClick={() => onClick && onClick(gift)}
      className={`
        group relative cursor-pointer transition-transform hover:-translate-y-1
        ${variant === 'brutal' 
            ? 'bg-white border-2 border-black shadow-[4px_4px_0px_#000]' 
            : 'bg-transparent border-l-4 border-acid-green pl-4'}
      `}
    >
      {/* Glitch Overlay on Hover */}
      <div className="absolute inset-0 bg-acid-green opacity-0 group-hover:opacity-20 z-10 pointer-events-none mix-blend-multiply transition-opacity"></div>

      {/* 1. Image */}
      <div className="relative overflow-hidden border-b-2 border-black">
        <img 
          src={gift.image} 
          alt={gift.title} 
          className="w-full aspect-square object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500"
          loading="lazy"
        />
        {/* Anti-Badge */}
        {variant === 'brutal' && (
            <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 font-mono text-xs z-20">
                ITEM #{gift.id}
            </div>
        )}
         <button 
          onClick={handleWishlist}
          className="absolute top-2 right-2 z-30 bg-white border border-black p-1 hover:bg-error hover:text-white transition-colors"
        >
           {saved ? 'SAVED' : 'SAVE?'}
        </button>
      </div>
      
      {/* 2. Content */}
      <div className="p-4 flex flex-col gap-2">
        <div className="flex justify-between items-start">
             <h3 className="font-display font-bold text-xl leading-none uppercase pr-4 group-hover:underline decoration-wavy decoration-acid-green">
                {gift.title}
             </h3>
             <span className="font-mono text-sm bg-black text-white px-1">
                {gift.price.toLocaleString()}
             </span>
        </div>
        
        {variant === 'brutal' && (
            <p className="font-mono text-xs leading-tight text-gray-600 border-l-2 border-gray-300 pl-2 mt-2">
                Ai_Reasoning: "{gift.reason.toLowerCase()}"
            </p>
        )}

        <div className="mt-2 flex gap-1 flex-wrap">
             {gift.tags.slice(0, 3).map(tag => (
                 <span key={tag} className="text-[10px] font-mono border border-black px-1 rounded-full bg-white">
                     #{tag}
                 </span>
             ))}
        </div>
      </div>
    </div>
  );
};