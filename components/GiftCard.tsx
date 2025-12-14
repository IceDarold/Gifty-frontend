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

  // Determine style type: Polaroid vs Magazine Cutout based on ID parity for variety
  const isCutout = parseInt(gift.id, 16) % 3 === 0;

  // Static random rotation per card
  const [rotation] = useState(() => Math.random() * 6 - 3);
  const [tapePos] = useState(() => Math.random() * 40 + 30); // 30% to 70%

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

  if (isCutout) {
      // STYLE 1: MAGAZINE CUTOUT (Rough edges, vivid)
      return (
        <div 
          onClick={() => onClick && onClick(gift)}
          className="relative group cursor-pointer transition-transform duration-200 hover:scale-105 hover:z-20"
          style={{ transform: `rotate(${rotation * 1.5}deg)` }}
        >
           {/* Shadow layer */}
           <div className="absolute inset-0 bg-black/30 translate-x-2 translate-y-2 torn-edge"></div>
           
           <div className="relative bg-white p-1 torn-edge overflow-hidden">
               <div className="relative aspect-square">
                   <img src={gift.image} alt={gift.title} className="w-full h-full object-cover filter contrast-125 saturate-150" />
                   {/* Halftone pattern overlay */}
                   <div className="absolute inset-0 bg-[radial-gradient(circle,black_1px,transparent_1px)] bg-[size:4px_4px] opacity-10"></div>
               </div>
               
               <div className="p-2 bg-marker-yellow">
                   <h3 className="font-marker text-lg leading-none text-black uppercase mb-1">{gift.title}</h3>
                   <span className="bg-black text-white px-1 font-typewriter text-xs font-bold">{gift.price} ₽</span>
               </div>
           </div>

           {/* Washi Tape */}
           <div className="tape bg-marker-red/50" style={{ top: '-10px', left: `${tapePos}%`, width: '40px', height: '25px', '--tape-rot': '85deg' } as any}></div>
           
           {/* Heart Button */}
           <button onClick={handleWishlist} className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md hover:scale-110 transition-transform">
               <span className="text-xl">{saved ? '❤️' : '🤍'}</span>
           </button>
        </div>
      );
  }

  // STYLE 2: POLAROID (Classic)
  return (
    <div 
      onClick={() => onClick && onClick(gift)}
      className="relative group cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-20 bg-white p-3 pb-12 shadow-lifted"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* Tape */}
      <div className="tape" style={{ top: '-15px', left: '50%', transform: 'translateX(-50%) rotate(-3deg)', width: '60px', height: '30px' }}></div>

      <div className="relative aspect-square bg-gray-100 mb-3 overflow-hidden shadow-inner">
        <img 
          src={gift.image} 
          alt={gift.title} 
          className="w-full h-full object-cover filter sepia-[0.1] contrast-[1.1]"
          loading="lazy"
        />
        {/* Glossy reflection */}
        <div className="absolute inset-0 polaroid-shine"></div>
        
        <div className={`absolute top-1 left-1 px-1.5 py-0.5 text-[8px] font-typewriter font-bold uppercase border border-black/20 ${gift.marketplace === 'Ozon' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
          {gift.marketplace}
        </div>
      </div>
      
      <div className="text-center relative">
        <h3 className="font-hand text-2xl font-bold text-gray-800 leading-none mb-1 line-clamp-2">
            {gift.title}
        </h3>
        
        {/* Price written with red pen */}
        <div className="font-hand text-xl text-marker-red transform -rotate-3 inline-block font-bold">
            {gift.price}.-
        </div>

        {/* Wishlist Scribble */}
        <button 
          onClick={handleWishlist}
          className="absolute bottom-[-30px] right-0 w-8 h-8 transition-transform active:scale-125"
        >
           <svg viewBox="0 0 100 100" className={`w-full h-full drop-shadow-sm ${saved ? 'fill-red-600 animate-scribble' : 'fill-none stroke-gray-400 stroke-[3]'}`}>
                <path d="M50 85 C 20 70 0 50 0 30 C 0 10 20 0 40 10 C 50 15 50 15 60 10 C 80 0 100 10 100 30 C 100 50 80 70 50 85 Z" />
           </svg>
        </button>
      </div>
    </div>
  );
};