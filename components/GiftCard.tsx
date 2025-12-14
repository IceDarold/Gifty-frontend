import React, { useState, useEffect } from 'react';
import { Gift } from '../types';
import { addToWishlist, removeFromWishlist, isInWishlist } from '../utils/storage';
import { track } from '../utils/analytics';

interface Props {
  gift: Gift;
  featured?: boolean;
  onToggleWishlist?: () => void;
  onClick?: (gift: Gift) => void;
}

export const GiftCard: React.FC<Props> = ({ gift, featured = false, onToggleWishlist, onClick }) => {
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
        group relative cursor-pointer flex flex-col gap-3 mb-12 sm:mb-0
        ${featured ? 'col-span-2' : ''}
      `}
    >
      {/* 1. Meta Data (Top Line) */}
      <div className="flex justify-between items-center border-t border-ink/10 pt-2 font-mono text-xxs uppercase tracking-wider text-gray-400 group-hover:text-ink transition-colors">
          <span>#{gift.id.padStart(3, '0')}</span>
          <span>{gift.category}</span>
      </div>

      {/* 2. Image Area (Sharp, Grayscale to Color) */}
      <div className="relative aspect-[3/4] w-full bg-gray-100 overflow-hidden">
        <img 
          src={gift.image} 
          alt={gift.title} 
          className="w-full h-full object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Wishlist Indicator (Minimal) */}
        <button 
          onClick={handleWishlist}
          className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity"
        >
           <span className={`text-xl ${saved ? 'text-error' : 'text-white mix-blend-difference'}`}>
               {saved ? '●' : '○'}
           </span>
        </button>
      </div>
      
      {/* 3. Typography Content */}
      <div className="flex flex-col gap-1 mt-1">
        <div className="flex justify-between items-baseline gap-4">
             <h3 className="font-serif text-lg leading-tight font-light text-ink group-hover:text-accent transition-colors">
                {gift.title}
             </h3>
             <span className="font-mono text-sm shrink-0">
                {gift.price.toLocaleString()}
             </span>
        </div>
        
        {featured && (
            <p className="font-serif text-sm text-graphite italic mt-2 border-l border-accent pl-3">
                "{gift.reason}"
            </p>
        )}
      </div>
    </div>
  );
};