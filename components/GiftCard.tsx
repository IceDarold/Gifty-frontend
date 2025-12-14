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

  const getMarketplaceStyle = (mp: string) => {
    switch (mp) {
        case 'Ozon': return 'bg-blue-100 text-blue-800 border-blue-800';
        case 'WB': return 'bg-purple-100 text-purple-800 border-purple-800';
        case 'Amazon': return 'bg-orange-100 text-orange-800 border-orange-800';
        default: return 'bg-gray-100 text-gray-800 border-gray-800';
    }
  };

  return (
    <div 
      onClick={() => onClick && onClick(gift)}
      className={`relative bg-white border-2 border-black rounded-xl cursor-pointer group flex flex-col h-full overflow-hidden transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none ${featured ? 'shadow-hard-lg ring-4 ring-pop-yellow' : 'shadow-hard hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000]'}`}
    >
      {/* Featured Badge as a Sticker */}
      {featured && (
        <div className="absolute top-2 left-2 z-20 bg-pop-pink text-black border-2 border-black text-[10px] font-black uppercase tracking-widest py-1 px-3 transform -rotate-6 shadow-hard-sm">
          Best Match!
        </div>
      )}

      {/* Image Container with bold divider */}
      <div className="relative aspect-[3/4] w-full overflow-hidden border-b-2 border-black bg-gray-50">
        <img 
          src={gift.image} 
          alt={gift.title} 
          className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
          loading="lazy"
        />
        
        {/* Marketplace Chip */}
        <div className={`absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 border-2 ${getMarketplaceStyle(gift.marketplace)} bg-opacity-100`}>
          {gift.marketplace}
        </div>

        {/* Heart Button */}
        <button 
          onClick={handleWishlist}
          className={`absolute top-2 right-2 p-2 rounded-full border-2 border-black transition-all z-10 ${saved ? 'bg-red-500 text-white shadow-none' : 'bg-white hover:bg-red-100 text-black shadow-hard-sm'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
             <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Content */}
      <div className="p-3 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
            {gift.reviews && (
                <div className="flex items-center gap-1 bg-yellow-100 px-1.5 rounded border border-black text-[10px] font-bold">
                    <span>★</span>
                    <span>{gift.reviews.rating.toFixed(1)}</span>
                </div>
            )}
        </div>
        
        <h3 className="font-display font-bold text-black text-sm leading-tight mb-2 line-clamp-2 min-h-[2.5rem]">
            {gift.title}
        </h3>

        {/* AI Insight - Comic Bubble style */}
        <div className="relative mb-3 mt-1 bg-pop-cyan/20 p-2 rounded-lg border-2 border-black border-dashed">
            <p className="text-[10px] text-black font-semibold leading-snug">
                "{gift.reason}"
            </p>
        </div>

        {/* Price & Action */}
        <div className="mt-auto flex items-center justify-between pt-2 border-t-2 border-black border-dotted">
           <span className="text-lg font-black text-black">{gift.price.toLocaleString('ru-RU')} ₽</span>
           
           <button className="bg-black text-white p-1.5 rounded-lg hover:bg-gray-800 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
           </button>
        </div>
      </div>
    </div>
  );
};