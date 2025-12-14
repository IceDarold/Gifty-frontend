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
      className={`relative group cursor-pointer bg-cyber-black border ${featured ? 'border-cyber-green shadow-neon' : 'border-cyber-gray/40'} hover:border-cyber-green transition-all duration-200`}
    >
      {/* Image Block with HUD Overlay */}
      <div className="relative aspect-[3/4] w-full overflow-hidden border-b border-cyber-gray/40 group-hover:border-cyber-green/50">
        <img 
          src={gift.image} 
          alt={gift.title} 
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300 filter grayscale group-hover:grayscale-0"
          loading="lazy"
        />
        
        {/* Tech Overlay Lines */}
        <div className="absolute inset-0 border-[0.5px] border-cyber-green/10 m-1 pointer-events-none"></div>
        <div className="absolute top-2 left-2 w-2 h-2 border-l border-t border-cyber-green pointer-events-none"></div>
        <div className="absolute bottom-2 right-2 w-2 h-2 border-r border-b border-cyber-green pointer-events-none"></div>

        {/* Top Right Label */}
        <div className="absolute top-0 right-0 bg-black/80 backdrop-blur-sm px-2 py-0.5 border-l border-b border-cyber-green/30">
          <span className="text-[7px] font-mono text-cyber-green uppercase tracking-widest">{gift.marketplace.slice(0,3).toUpperCase()}</span>
        </div>

        {/* Wishlist Action */}
        <button 
          onClick={handleWishlist}
          className={`absolute bottom-0 right-0 w-8 h-8 flex items-center justify-center border-l border-t transition-colors ${saved ? 'bg-cyber-alert text-black border-cyber-alert' : 'bg-black/80 text-cyber-green border-cyber-green/30 hover:bg-cyber-green hover:text-black'}`}
        >
           {saved ? '★' : '+'}
        </button>
      </div>
      
      {/* Data Block */}
      <div className="p-3 font-mono">
        <h3 className="text-[10px] text-white font-bold leading-tight mb-2 uppercase line-clamp-2 h-6 overflow-hidden group-hover:text-cyber-green transition-colors">
            {gift.title}
        </h3>

        <div className="flex items-end justify-between pt-2 border-t border-cyber-gray/20 border-dashed">
           <div>
               <div className="text-[7px] text-cyber-dim uppercase tracking-wider">VALUE</div>
               <span className="text-xs font-bold text-cyber-green">{gift.price}₽</span>
           </div>
           
           <div className="text-right">
                <div className="text-[7px] text-cyber-dim uppercase tracking-wider">RATING</div>
                <div className="flex items-center gap-0.5">
                    <span className="text-[9px] text-cyber-green font-bold">{gift.reviews ? gift.reviews.rating : '-'}</span>
                    <span className="text-[7px] text-cyber-gray">/5</span>
                </div>
           </div>
        </div>
      </div>
    </div>
  );
};