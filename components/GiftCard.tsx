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
      className={`relative group rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 ${featured ? 'bg-gradient-to-b from-white/10 to-white/5 border border-white/20 shadow-[0_0_30px_rgba(100,100,255,0.2)]' : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20'}`}
    >
      {/* Featured Badge - Soft Glass */}
      {featured && (
        <div className="absolute top-3 left-3 z-20 bg-indigo-500/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest py-1 px-3 rounded-full shadow-lg border border-white/20">
          AI Choice
        </div>
      )}

      {/* Image Container - Soft Gradient Overlay */}
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <img 
          src={gift.image} 
          alt={gift.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

        {/* Marketplace - Minimal Tag */}
        <div className="absolute top-3 right-3 text-[10px] font-medium text-white/80 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
          {gift.marketplace}
        </div>

        {/* Wishlist Button - Floating Orb */}
        <button 
          onClick={handleWishlist}
          className={`absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300 border border-white/10 ${saved ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.5)]' : 'bg-white/10 text-white hover:bg-white/20'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
             <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Content - Overlay style */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="mb-2">
            {gift.reviews && (
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    <span>★</span>
                    <span>{gift.reviews.rating.toFixed(1)}</span>
                </div>
            )}
        </div>
        
        <h3 className="font-serif text-lg text-white leading-tight mb-1 line-clamp-2 drop-shadow-md">
            {gift.title}
        </h3>

        <div className="flex items-center justify-between mt-2">
           <span className="text-sm font-sans font-medium text-white/90">{gift.price.toLocaleString('ru-RU')} ₽</span>
           
           {/* AI Reason - Subtle text */}
           <p className="text-[10px] text-indigo-300 font-medium line-clamp-1 max-w-[60%] text-right">
              {gift.reason}
           </p>
        </div>
      </div>
    </div>
  );
};