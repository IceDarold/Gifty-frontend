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
        relative cursor-pointer group bg-[#f0f2f5] rounded-[2.5rem] p-4 transition-all duration-300
        ${featured ? 'shadow-clay scale-[1.02]' : 'shadow-clay-sm hover:shadow-clay hover:-translate-y-1'}
      `}
    >
      {/* Image Container - Inset Look */}
      <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] p-2 bg-[#f0f2f5]">
        <img 
          src={gift.image} 
          alt={gift.title} 
          className="w-full h-full object-cover rounded-[1.5rem] transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Floating Badge */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-[#6c5ce7] px-3 py-1 text-xs font-extrabold rounded-full shadow-sm">
          {gift.marketplace}
        </div>

        {/* Heart Button */}
        <button 
          onClick={handleWishlist}
          className={`absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md active:scale-90 ${saved ? 'bg-[#ff7675] text-white' : 'bg-white text-gray-400 hover:text-[#ff7675]'}`}
        >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
           </svg>
        </button>
      </div>
      
      <div className="pt-4 px-2">
        <h3 className="font-extrabold text-gray-700 leading-tight mb-2 line-clamp-2 text-lg">
            {gift.title}
        </h3>
        
        <div className="flex items-center justify-between">
             <span className="text-[#6c5ce7] font-black text-xl">
                {gift.price} ₽
             </span>
             {featured && (
                 <span className="text-[10px] font-bold text-[#00b894] bg-[#55efc4]/20 px-2 py-1 rounded-lg">
                     TOP
                 </span>
             )}
        </div>
      </div>
    </div>
  );
};