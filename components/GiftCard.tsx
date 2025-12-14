import React, { useState, useEffect } from 'react';
import { Gift } from '../types';
import { addToWishlist, removeFromWishlist, isInWishlist } from '../utils/storage';
import { track } from '../utils/analytics';

interface Props {
  gift: Gift;
  featured?: boolean;
  onToggleWishlist?: () => void;
  onClick?: (gift: Gift) => void;
  layout?: 'standard' | 'compact' | 'poster';
}

export const GiftCard: React.FC<Props> = ({ gift, featured = false, onToggleWishlist, onClick, layout = 'standard' }) => {
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

  // POSTER LAYOUT (Featured)
  if (layout === 'poster' || featured) {
      return (
        <div 
          onClick={() => onClick && onClick(gift)}
          className="group relative w-full cursor-pointer mb-16 border-b border-ink/10 pb-8"
        >
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
               {/* Image Block */}
               <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden reticle text-ink">
                    <img 
                        src={gift.image} 
                        alt={gift.title} 
                        className="w-full h-full object-cover transition-all duration-1000 grayscale group-hover:grayscale-0"
                    />
                    <div className="absolute top-2 left-2 font-mono text-[10px] bg-white/80 px-1 uppercase tracking-widest">
                        Fig. {gift.id}
                    </div>
               </div>

               {/* Text Block */}
               <div className="flex flex-col h-full justify-between pt-2">
                   <div>
                        <div className="flex justify-between items-start mb-4 border-b border-ink/20 pb-2">
                            <span className="font-mono text-xs uppercase tracking-widest text-accent">Top Recommendation</span>
                            <span className="font-mono text-xs">{gift.category}</span>
                        </div>
                        <h2 className="font-serif text-4xl font-light leading-none mb-6 group-hover:text-accent transition-colors">
                            {gift.title}
                        </h2>
                        <p className="font-serif text-lg italic text-graphite mb-4 leading-relaxed pl-4 border-l border-ink/20">
                            "{gift.reason}"
                        </p>
                   </div>
                   
                   <div className="flex justify-between items-end mt-8">
                       <span className="font-mono text-2xl">{gift.price.toLocaleString()} RUB</span>
                       <button onClick={handleWishlist} className="font-mono text-xs uppercase hover:underline hover:text-accent">
                           [{saved ? 'SAVED' : 'SAVE TO ARCHIVE'}]
                       </button>
                   </div>
               </div>
           </div>
        </div>
      );
  }

  // STANDARD LAYOUT
  return (
    <div 
      onClick={() => onClick && onClick(gift)}
      className="group relative flex flex-col gap-4 cursor-pointer mb-8"
    >
      <div className="relative aspect-square w-full bg-gray-50 overflow-hidden reticle text-ink/50">
        <img 
          src={gift.image} 
          alt={gift.title} 
          className="w-full h-full object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105"
          loading="lazy"
        />
        {/* Hover Info */}
        <div className="absolute inset-0 bg-ink/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <span className="bg-paper text-ink font-mono text-xs px-2 py-1 uppercase tracking-widest">View Data</span>
        </div>
      </div>
      
      <div className="flex flex-col gap-1 border-t border-ink/10 pt-2">
        <div className="flex justify-between items-start">
             <h3 className="font-serif text-lg leading-tight font-normal text-ink group-hover:text-accent transition-colors w-3/4">
                {gift.title}
             </h3>
             <span className="font-mono text-xs shrink-0">
                {gift.price.toLocaleString()}
             </span>
        </div>
        <div className="flex justify-between items-center mt-1">
             <span className="font-mono text-[10px] text-graphite uppercase tracking-widest">{gift.category}</span>
             <button onClick={handleWishlist} className="text-lg hover:text-accent transition-colors leading-none">
                 {saved ? '●' : '○'}
             </button>
        </div>
      </div>
    </div>
  );
};