import React, { useState, useEffect } from 'react';
import { Gift } from '../types';
import { addToWishlist, removeFromWishlist, isInWishlist } from '../utils/storage';
import { track } from '../utils/analytics';

interface Props {
  gift: Gift;
  variant?: 'polaroid' | 'minimal';
  onToggleWishlist?: () => void;
  onClick?: (gift: Gift) => void;
}

export const GiftCard: React.FC<Props> = ({ gift, variant = 'polaroid', onToggleWishlist, onClick }) => {
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
      className="group relative cursor-pointer"
    >
      {/* POLAROID BODY */}
      <div className="bg-white p-3 pb-4 shadow-paper transition-shadow duration-300 group-hover:shadow-floating">
        
        {/* Tape at top (Visual anchor) */}
        <div className="tape-top"></div>

        {/* 1. Image Area */}
        <div className="relative aspect-square w-full bg-gray-100 mb-3 overflow-hidden filter sepia-[0.2]">
            <img 
              src={gift.image} 
              alt={gift.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            
            {/* Price Tag (Sticker on image) */}
            <div className="absolute bottom-2 right-2 bg-yellow-300 text-ink px-2 py-1 font-typewriter font-bold text-xs rotate-[-2deg] shadow-sm transform transition-transform group-hover:scale-110">
                {gift.price.toLocaleString()} ₽
            </div>
        </div>
        
        {/* 2. Handwriting Area */}
        <div className="px-1 min-h-[60px] flex flex-col justify-between">
           <h3 className="font-handwritten text-2xl leading-none text-ink mb-2 line-clamp-2">
              {gift.title}
           </h3>
           
           <div className="flex justify-between items-end border-t border-pencil/10 pt-2">
               <span className="font-typewriter text-[10px] text-pencil uppercase tracking-wider">
                   #{gift.category}
               </span>
               
               <button 
                onClick={handleWishlist}
                className="text-xl transition-transform hover:scale-125 active:scale-95"
                title="Сохранить"
               >
                   {saved ? '❤️' : '♡'}
               </button>
           </div>
        </div>
      </div>
    </div>
  );
};