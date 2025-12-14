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

  // Sync state if localStorage changes externally (e.g. from Modal)
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

  const handleCardClick = () => {
    if (onClick) {
      onClick(gift);
    }
  };

  const formatReviewCount = (count: number) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1).replace('.', ',') + 'к';
    }
    return count.toString();
  };

  const getMarketplaceColor = (mp: string) => {
    switch (mp) {
        case 'Ozon': return 'bg-blue-500 text-white';
        case 'WB': return 'bg-purple-600 text-white';
        case 'Amazon': return 'bg-orange-400 text-white';
        default: return 'bg-gray-800 text-white';
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`relative bg-white rounded-[1.5rem] shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group flex flex-col h-full overflow-hidden ${featured ? 'ring-2 ring-yellow-400 ring-offset-2' : ''}`}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-[10px] font-black uppercase tracking-widest py-1 px-3 rounded-b-lg shadow-md">
          Top Match
        </div>
      )}

      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <img 
          src={gift.image} 
          alt={gift.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Overlay Gradient (Subtle) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Marketplace Badge (Floating on image) */}
        <div className={`absolute bottom-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg backdrop-blur-sm ${getMarketplaceColor(gift.marketplace)} bg-opacity-90`}>
          {gift.marketplace}
        </div>

        {/* Wishlist Button (Glassmorphism) */}
        <button 
          onClick={handleWishlist}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md shadow-sm transition-all duration-300 active:scale-90 group-active:scale-95 z-10 ${saved ? 'bg-white text-red-500' : 'bg-white/60 hover:bg-white text-gray-600 hover:text-red-400'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${saved ? 'scale-110 fill-current' : ''}`} viewBox="0 0 20 20" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth={saved ? 0 : 2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
          </svg>
        </button>
      </div>
      
      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
           {/* Reviews (Compact) */}
            {gift.reviews ? (
            <div className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs font-bold text-gray-700">{gift.reviews.rating.toFixed(1)}</span>
                <span className="text-[10px] text-gray-400">({formatReviewCount(gift.reviews.count)})</span>
            </div>
            ) : <div className="h-4"></div>}
        </div>
        
        <h3 className="font-bold text-gray-800 text-sm leading-snug mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-indigo-600 transition-colors">
            {gift.title}
        </h3>

        {/* AI Insight Bubble */}
        <div className="relative mb-3 mt-1">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-2.5 border border-indigo-100/50">
                <div className="flex gap-2 items-start">
                    <span className="text-sm shrink-0 mt-0.5">✨</span>
                    <p className="text-[11px] text-indigo-900/80 font-medium leading-relaxed italic line-clamp-2">
                        "{gift.reason}"
                    </p>
                </div>
            </div>
        </div>

        {/* Price & Action */}
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-50">
           <div>
              <span className="block text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Цена</span>
              <span className="text-lg font-black text-gray-900">{gift.price.toLocaleString('ru-RU')} ₽</span>
           </div>
           
           <button className="bg-gray-100 hover:bg-indigo-600 text-gray-600 hover:text-white p-2.5 rounded-xl transition-all duration-300 group-hover:scale-105 active:scale-95 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
           </button>
        </div>
      </div>
    </div>
  );
};
