import React, { useEffect, useState } from 'react';
import { Gift, QuizAnswers } from '../domain/types';
import { api } from '../api';
import { isInWishlist } from '../utils/storage'; 
import { track } from '../utils/analytics';
import { Button } from './Button';
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
        document.body.style.overflow = 'hidden';
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
    return () => { document.body.style.overflow = 'unset'; }
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
      {/* Chaotic Overlay */}
      <div 
        className="absolute inset-0 bg-acid-green/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* CONTENT WINDOW */}
      <div className="relative w-full max-w-4xl h-[90vh] bg-white border-[3px] border-black shadow-[15px_15px_0px_#000] flex flex-col overflow-hidden animate-glitch">
        
        {/* Title Bar */}
        <div className="bg-black text-white p-2 flex justify-between items-center cursor-move">
            <span className="font-mono text-xs uppercase">System_File: {gift.id}.json</span>
            <button 
                onClick={onClose} 
                className="w-6 h-6 bg-error flex items-center justify-center border border-white hover:bg-white hover:text-black font-bold"
            >
                X
            </button>
        </div>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
             
             {/* Left: Visuals */}
             <div className="space-y-4">
                 <div className="relative border-2 border-black">
                     <img src={gift.image} alt={gift.title} className="w-full object-cover grayscale contrast-125" />
                     <div className="absolute top-2 left-2 bg-acid-green px-2 font-bold text-xl mix-blend-hard-light transform -rotate-2">
                         {gift.price} RUB
                     </div>
                 </div>
                 
                 <div className="border border-black p-4 bg-concrete font-mono text-xs">
                     <p>SOURCE: {gift.marketplace}</p>
                     <p>CATEGORY: {gift.category.toUpperCase()}</p>
                     <p>AGE_RANGE: {gift.ageRange[0]}-{gift.ageRange[1]}</p>
                 </div>
             </div>

             {/* Right: Text Dump */}
             <div className="font-mono">
                 <h2 className="font-display font-black text-4xl sm:text-5xl uppercase leading-[0.9] mb-6">
                     {gift.title}
                 </h2>

                 <div className="mb-6 relative">
                     <span className="bg-black text-white text-xs px-1 absolute -top-3 left-0">AI_OPINION</span>
                     <p className="border border-black p-4 text-sm bg-white">
                         "{gift.reason}"
                         <br/><br/>
                         <span className="text-gray-500">// Confidence: 87% // Margin of error: High</span>
                     </p>
                 </div>

                 <div className="prose font-sans text-sm border-l-4 border-acid-green pl-4 mb-8">
                     {gift.description}
                 </div>

                 <div className="flex gap-4 items-center border-t-2 border-black pt-6">
                     <Button 
                        fullWidth 
                        variant="primary"
                        onClick={() => window.open('#', '_blank')}
                     >
                        Acquire Object
                     </Button>
                     
                     <Button 
                        variant="secondary"
                        onClick={handleWishlist}
                     >
                        {saved ? 'FORGET' : 'REMEMBER'}
                     </Button>
                 </div>
             </div>
        </div>
      </div>
    </div>
  );
};