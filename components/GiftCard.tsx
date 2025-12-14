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

  // Extreme random rotation for "messy desk" feel
  const [style] = useState(() => ({
    transform: `rotate(${Math.random() * 6 - 3}deg) translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`,
    zIndex: Math.floor(Math.random() * 10)
  }));

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
      className={`relative group cursor-pointer bg-white p-3 pb-10 shadow-float hover:shadow-deep transition-all duration-300 hover:z-50 hover:scale-105`}
      style={style}
    >
      {/* Tape holding the card */}
      <div className="tape-strip" style={{ top: '-15px', left: '35%', width: '60px', height: '25px' }}></div>

      {/* Image Area (Polaroid Frame) */}
      <div className="relative aspect-[1/1] w-full bg-[#1a1a1a] mb-3 overflow-hidden">
        <img 
          src={gift.image} 
          alt={gift.title} 
          className="w-full h-full object-cover filter contrast-[1.1] brightness-[0.95] sepia-[0.2]"
          loading="lazy"
        />
        
        {/* "Sticker" for Marketplace */}
        <div className={`absolute -top-2 -left-2 w-10 h-10 rounded-full flex items-center justify-center font-marker text-[10px] text-white shadow-sticker border-2 border-white transform -rotate-12 ${gift.marketplace === 'Ozon' ? 'bg-blue-500' : 'bg-purple-600'}`}>
          {gift.marketplace}
        </div>

        {/* Heart Scribble */}
        <button 
          onClick={handleWishlist}
          className={`absolute bottom-2 right-2 w-10 h-10 transition-transform active:scale-125`}
        >
           {saved ? (
             <svg viewBox="0 0 100 100" className="w-full h-full fill-craft-red stroke-none drop-shadow-md animate-scribble">
                <path d="M50 85 C 20 70 0 50 0 30 C 0 10 20 0 40 10 C 50 15 50 15 60 10 C 80 0 100 10 100 30 C 100 50 80 70 50 85 Z" />
             </svg>
           ) : (
             <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-white stroke-[4] drop-shadow-md opacity-70 hover:opacity-100">
                <path d="M50 85 C 20 70 0 50 0 30 C 0 10 20 0 40 10 C 50 15 50 15 60 10 C 80 0 100 10 100 30 C 100 50 80 70 50 85 Z" />
             </svg>
           )}
        </button>
      </div>
      
      {/* Handwritten Text */}
      <div className="text-center relative">
        <h3 className="font-sans text-2xl font-bold text-craft-ink leading-none mb-2">
            {gift.title}
        </h3>

        {/* Price circled in red marker */}
        <div className="inline-block relative px-2">
            <span className="font-marker text-xl text-craft-red">
               {gift.price}₽
            </span>
            <svg className="absolute top-[-5px] left-[-10px] w-[120%] h-[150%] pointer-events-none" viewBox="0 0 100 50" preserveAspectRatio="none">
                <path d="M5,25 Q30,5 50,25 T95,25" fill="none" stroke="#d93025" strokeWidth="2" opacity="0.4" />
                <path d="M10,40 Q50,45 90,35" fill="none" stroke="#d93025" strokeWidth="1" opacity="0.3" />
            </svg>
        </div>
      </div>
    </div>
  );
};