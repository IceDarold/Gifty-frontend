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
        relative cursor-pointer group bg-gray-800 border-4 transition-all duration-100
        ${featured ? 'border-yellow-400 shadow-pixel-lg' : 'border-gray-600 shadow-pixel hover:border-white hover:-translate-y-1'}
      `}
    >
      {/* Marketplace Tag (Top Left Corner) */}
      <div className="absolute top-0 left-0 bg-black text-white px-2 py-1 font-pixel text-[8px] z-10 border-b-2 border-r-2 border-gray-600">
        {gift.marketplace}
      </div>

      {/* Image Container (Pixelated) */}
      <div className="relative aspect-square w-full border-b-4 border-gray-600 bg-black overflow-hidden">
        <img 
          src={gift.image} 
          alt={gift.title} 
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          style={{ imageRendering: 'pixelated' }}
        />
        {/* Shine effect */}
        {featured && <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none"></div>}
      </div>
      
      <div className="p-3 bg-gray-800">
        <h3 className="font-console text-xl leading-5 text-white mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-yellow-300">
            {gift.title}
        </h3>
        
        <div className="flex items-center justify-between border-t-2 border-gray-600 pt-2">
             <div className="font-pixel text-xs text-green-400 flex items-center gap-1">
                <span className="text-[10px] text-gray-400">GP</span>
                {gift.price}
             </div>

             {/* Heart Button (Pixel Heart) */}
             <button 
                onClick={handleWishlist}
                className="w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform"
             >
                <div className={`w-4 h-4 relative ${saved ? 'bg-red-500' : 'bg-gray-600'}`} style={{ boxShadow: '2px 0 0 0 black, -2px 0 0 0 black, 0 -2px 0 0 black, 0 2px 0 0 black' }}></div>
             </button>
        </div>
      </div>
    </div>
  );
};