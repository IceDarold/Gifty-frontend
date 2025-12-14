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
      return (count / 1000).toFixed(1).replace('.', ',') + ' тыс.';
    }
    return count.toString();
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`bg-white rounded-3xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02] flex flex-col h-full cursor-pointer group ${featured ? 'border-4 border-yellow-400 ring-4 ring-yellow-400/30' : ''}`}
    >
      {featured && (
        <div className="bg-yellow-400 text-indigo-900 text-xs font-black uppercase tracking-wider py-1 text-center">
          Топ выбор
        </div>
      )}
      <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
        <img 
          src={gift.image} 
          alt={gift.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <button 
          onClick={handleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-colors ${saved ? 'bg-red-50 text-red-500' : 'bg-white/90 text-gray-400 hover:text-red-400'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-semibold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md">{gift.marketplace}</span>
          <span className="font-bold text-gray-900">{gift.price} ₽</span>
        </div>
        
        <h3 className="font-bold text-gray-800 leading-tight mb-2 line-clamp-2">{gift.title}</h3>
        
        {/* Reviews Block */}
        {gift.reviews ? (
          <div className="flex items-center flex-wrap gap-2 mb-3">
             <div className="flex items-center gap-1 bg-yellow-50 px-1.5 py-0.5 rounded-md border border-yellow-100">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-yellow-500 fill-current" viewBox="0 0 20 20">
                 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
               </svg>
               <span className="text-xs font-bold text-gray-900 leading-none pt-[1px]">{gift.reviews.rating.toFixed(1)}</span>
             </div>
             <span className="text-xs text-gray-400 whitespace-nowrap">
                ({formatReviewCount(gift.reviews.count)} отзывов)
             </span>
          </div>
        ) : (
          /* Placeholder to maintain vertical rhythm if needed, or just padding */
          <div className="mb-2"></div>
        )}

        <div className="bg-yellow-50 rounded-xl p-2 mb-4">
          <p className="text-xs text-yellow-800 italic">
            "{gift.reason}"
          </p>
        </div>

        <div className="mt-auto">
          <button 
            className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl text-sm transition-colors"
          >
            Подробнее
          </button>
        </div>
      </div>
    </div>
  );
};