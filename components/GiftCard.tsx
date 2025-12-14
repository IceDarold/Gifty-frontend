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

  // Random rotation for "scattered on table" look
  const [rotation] = useState(() => Math.random() * 4 - 2); 

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
      className={`relative group cursor-pointer bg-white p-2 pb-8 shadow-paper hover:shadow-xl transition-all duration-300 hover:z-10 hover:scale-105`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* Tape at top */}
      <div className="tape"></div>

      {/* Image Area (Polaroid Window) */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100 border border-gray-100 mb-2">
        <img 
          src={gift.image} 
          alt={gift.title} 
          className="w-full h-full object-cover filter sepia-[0.1] contrast-[0.9]"
          loading="lazy"
        />
        
        {/* Marketplace Stamp */}
        <div className={`absolute bottom-2 left-2 px-2 py-1 rounded-sm border-2 border-paper-ink text-[10px] font-bold uppercase tracking-widest bg-white/90 transform -rotate-2 ${gift.marketplace === 'Ozon' ? 'text-blue-600' : 'text-purple-600'}`}>
          {gift.marketplace}
        </div>

        {/* Wishlist Heart - Hand drawn style */}
        <button 
          onClick={handleWishlist}
          className={`absolute top-2 right-2 w-8 h-8 flex items-center justify-center transition-transform active:scale-125`}
        >
           <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 drop-shadow-md ${saved ? 'fill-paper-red stroke-none' : 'fill-white/50 stroke-white stroke-2'}`} viewBox="0 0 24 24">
             <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
           </svg>
        </button>
      </div>
      
      {/* Handwritten Text Area */}
      <div className="px-2 text-center">
        <h3 className="font-sans text-lg font-bold text-paper-ink leading-tight line-clamp-2 mb-1">
            {gift.title}
        </h3>

        <div className="flex items-center justify-center gap-2">
            <span className="font-display font-bold text-xl text-paper-green bg-green-50 px-2 py-0.5 rounded-full transform -rotate-1">
               ~{gift.price}₽
            </span>
        </div>
      </div>
    </div>
  );
};