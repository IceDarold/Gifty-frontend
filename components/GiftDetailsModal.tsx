import React, { useEffect, useState } from 'react';
import { Gift, QuizAnswers } from '../domain/types';
import { api } from '../api';
import { isInWishlist } from '../utils/storage'; 
import { track } from '../utils/analytics';
import { Button } from './Button';
import { Mascot } from './Mascot';
import { ReviewsSection } from './ReviewsSection';

interface Props {
  gift: Gift;
  answers: QuizAnswers | null;
  isOpen: boolean;
  onClose: () => void;
  onWishlistChange: () => void;
}

export const GiftDetailsModal: React.FC<Props> = ({ gift: initialGift, answers, isOpen, onClose, onWishlistChange }) => {
  const [gift, setGift] = useState<Gift>(initialGift);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
        setGift(initialGift);
        setSaved(isInWishlist(initialGift.id));
        setLoading(true);
        api.gifts.getById(initialGift.id)
            .then(fullGift => {
                setGift(fullGift);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }
  }, [initialGift.id, isOpen]);

  if (!isOpen) return null;

  const handleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
        if (saved) await api.wishlist.remove(gift.id);
        else await api.wishlist.add(gift.id);
        setSaved(!saved);
        onWishlistChange();
    } catch (e) {
        console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Dim Background */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-grayscale"
        onClick={onClose}
      />

      {/* ITEM WINDOW */}
      <div className="relative w-full max-w-lg max-h-[90vh] bg-blue-900 border-[6px] border-white shadow-pixel-lg overflow-y-auto no-scrollbar animate-float-pixel">
        
        {/* Title Bar */}
        <div className="bg-white text-black p-2 font-pixel text-xs flex justify-between items-center sticky top-0 z-20">
            <span>ITEM_INFO.EXE</span>
            <button onClick={onClose} className="hover:bg-red-500 hover:text-white px-2">X</button>
        </div>

        <div className="p-4">
             {/* Header Section */}
             <div className="flex gap-4 mb-6 items-start">
                 <div className="w-24 h-24 bg-black border-4 border-gray-500 shrink-0">
                     <img src={gift.image} alt="item" className="w-full h-full object-cover" style={{ imageRendering: 'pixelated' }} />
                 </div>
                 <div>
                     <h2 className="font-pixel text-xs text-yellow-400 mb-2 leading-loose">{gift.title}</h2>
                     <div className="font-pixel text-[10px] text-green-400 mb-1">
                         COST: {gift.price} G
                     </div>
                     <span className="bg-gray-700 text-white px-1 font-console text-sm border border-gray-500">
                         TYPE: {gift.category}
                     </span>
                 </div>
             </div>

             {/* Description Box */}
             <div className="bg-black border-2 border-gray-600 p-4 font-console text-lg text-gray-300 mb-6 leading-relaxed">
                 <span className="text-blue-400 font-bold">DESCRIPTION:</span><br/>
                 {gift.description}
             </div>

             {/* AI Reason (Wizard Note) */}
             <div className="bg-green-900/30 border-2 border-green-500 p-4 mb-6 relative">
                 <div className="absolute -top-3 left-4 bg-blue-900 px-2 font-pixel text-[8px] text-green-400">WIZARD SAYS</div>
                 <p className="font-console text-lg text-green-100 italic">"{gift.reason}"</p>
             </div>

             {/* Actions */}
             <div className="flex flex-col gap-3">
                 <Button 
                    fullWidth 
                    variant="primary" 
                    onClick={() => window.open('#', '_blank')}
                 >
                    EQUIP (BUY NOW)
                 </Button>
                 
                 <Button 
                    fullWidth 
                    variant="secondary"
                    onClick={handleWishlist}
                 >
                    {saved ? 'DROP FROM INVENTORY' : 'ADD TO INVENTORY'}
                 </Button>
             </div>
        </div>
      </div>
    </div>
  );
};