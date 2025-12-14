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
      className={`relative group cursor-pointer border ${featured ? 'border-cyber-green bg-cyber-green/5' : 'border-cyber-gray/40 bg-cyber-dark'} hover:border-cyber-green transition-colors duration-200`}
    >
      {/* Decorative Corners */}
      <div className="absolute top-0 right-0 p-1">
         <div className="w-2 h-2 bg-cyber-green/50"></div>
      </div>

      {featured && (
        <div className="absolute top-0 left-0 z-20 bg-cyber-green text-black text-[9px] font-bold font-mono px-2 py-1">
          [REC_001]
        </div>
      )}

      {/* Image Container - Grayscale to Color on Hover */}
      <div className="relative aspect-[3/4] w-full overflow-hidden border-b border-cyber-gray/40">
        <img 
          src={gift.image} 
          alt={gift.title} 
          className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 contrast-125"
          loading="lazy"
        />
        {/* Scanline overlay on image */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,6px_100%] pointer-events-none opacity-50"></div>

        {/* Marketplace Tag */}
        <div className="absolute top-2 right-2 text-[8px] font-mono text-cyber-green bg-black/80 px-1 border border-cyber-green/30">
          SRC::{gift.marketplace.toUpperCase()}
        </div>

        {/* Wishlist Button - Square */}
        <button 
          onClick={handleWishlist}
          className={`absolute bottom-0 right-0 w-10 h-10 flex items-center justify-center border-l border-t border-cyber-gray/40 transition-colors ${saved ? 'bg-cyber-alert text-black border-cyber-alert' : 'bg-black/80 text-cyber-green hover:bg-cyber-green hover:text-black'}`}
        >
           {saved ? '★' : '+'}
        </button>
      </div>
      
      {/* Content */}
      <div className="p-3 font-mono">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-xs text-cyber-green leading-tight line-clamp-2 uppercase font-bold group-hover:underline">
                {gift.title}
            </h3>
        </div>

        <div className="flex items-end justify-between border-t border-cyber-gray/30 pt-2 mt-2">
           <div>
               <div className="text-[8px] text-cyber-gray uppercase">Cost_Val</div>
               <span className="text-sm font-bold text-white">{gift.price} ₽</span>
           </div>
           
           {gift.reviews && (
                <div className="text-right">
                    <div className="text-[8px] text-cyber-gray uppercase">Rating</div>
                    <span className="text-xs text-cyber-green">
                        {'★'.repeat(Math.round(gift.reviews.rating))}
                    </span>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};