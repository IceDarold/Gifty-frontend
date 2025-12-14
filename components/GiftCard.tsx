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
      className={`relative group cursor-pointer bg-white border-2 border-pop-black rounded-2xl overflow-hidden transition-all duration-200 ${featured ? 'shadow-hard-lg' : 'shadow-hard hover:shadow-hard-lg hover:-translate-y-1'}`}
    >
      {/* Image Section */}
      <div className="relative aspect-[3/4] w-full overflow-hidden border-b-2 border-pop-black bg-gray-50">
        <img 
          src={gift.image} 
          alt={gift.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Marketplace Tag */}
        <div className={`absolute top-2 left-2 px-2 py-1 rounded-md border-2 border-pop-black text-[10px] font-bold shadow-hard-sm ${gift.marketplace === 'Ozon' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
          {gift.marketplace}
        </div>

        {/* Wishlist Button - Floating Bubble */}
        <button 
          onClick={handleWishlist}
          className={`absolute bottom-2 right-2 w-10 h-10 rounded-full flex items-center justify-center border-2 border-pop-black shadow-hard-sm transition-transform active:scale-90 ${saved ? 'bg-pop-pink text-white' : 'bg-white text-gray-400 hover:text-pop-pink'}`}
        >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
           </svg>
        </button>
      </div>
      
      {/* Content */}
      <div className="p-3">
        <h3 className="text-sm font-bold text-pop-black leading-tight line-clamp-2 mb-2 font-display">
            {gift.title}
        </h3>

        <div className="flex items-center justify-between mt-2">
           <span className="text-sm font-black bg-pop-yellow px-1.5 py-0.5 border-2 border-pop-black shadow-sm transform -rotate-2">
               {gift.price} ₽
           </span>
           
           {gift.reviews && (
                <div className="flex items-center gap-1 text-xs font-bold text-gray-600">
                    <svg className="w-4 h-4 text-pop-yellow fill-current stroke-pop-black stroke-1" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    {gift.reviews.rating}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};