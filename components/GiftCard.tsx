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
        relative cursor-pointer group rounded-3xl overflow-hidden transition-all duration-300
        ${featured ? 'bg-white/60' : 'bg-white/40'}
        backdrop-filter backdrop-blur-xl border border-white/60 shadow-glass
        hover:shadow-glow hover:-translate-y-1 hover:bg-white/60
      `}
    >
      {/* Image Container with Water Gloss */}
      <div className="relative aspect-square m-2 rounded-2xl overflow-hidden shadow-inner">
        <img 
          src={gift.image} 
          alt={gift.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Gloss Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 left-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none"></div>

        {/* Marketplace Pill */}
        <div className={`absolute top-2 left-2 px-2 py-1 text-[10px] font-bold uppercase rounded-full backdrop-blur-md shadow-sm text-white ${gift.marketplace === 'Ozon' ? 'bg-blue-500/80' : 'bg-purple-500/80'}`}>
          {gift.marketplace}
        </div>

        {/* Wishlist Bubble */}
        <button 
          onClick={handleWishlist}
          className={`absolute bottom-2 right-2 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md shadow-sm transition-all active:scale-90 ${saved ? 'bg-red-500/90 text-white' : 'bg-white/70 text-gray-500 hover:bg-white'}`}
        >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
           </svg>
        </button>
      </div>
      
      <div className={`px-4 pb-4 ${featured ? 'pt-2' : 'pt-0'}`}>
        <h3 className="font-bold text-gray-800 leading-tight mb-1 line-clamp-2 drop-shadow-sm">
            {gift.title}
        </h3>
        
        <div className="flex items-center justify-between mt-2">
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 font-black text-lg">
                {gift.price} ₽
             </span>
             {featured && (
                 <span className="text-xs text-green-600 bg-green-100/50 px-2 py-0.5 rounded-full border border-green-200">
                     Рекомендуем
                 </span>
             )}
        </div>
      </div>
    </div>
  );
};