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
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-end p-0">
      {/* Overlay: Minimal Blur */}
      <div 
        className="absolute inset-0 bg-paper/90 backdrop-grayscale transition-opacity"
        onClick={onClose}
      />

      {/* CONTENT SHEET: Right aligned, tall */}
      <div className="relative w-full sm:w-[600px] h-full bg-paper shadow-2xl flex flex-col border-l border-ink animate-reveal overflow-y-auto no-scrollbar">
        
        {/* Header Actions */}
        <div className="flex justify-between items-center p-6 border-b border-ink/10 sticky top-0 bg-paper z-20">
            <span className="font-mono text-xs uppercase tracking-widest">Item_Ref: {gift.id}</span>
            <button 
                onClick={onClose} 
                className="font-mono text-sm hover:text-accent uppercase"
            >
                [ Close ]
            </button>
        </div>

        {/* Content Scroll */}
        <div className="flex-1">
             {/* 1. Image */}
             <div className="w-full aspect-square bg-gray-100 relative">
                 <img src={gift.image} alt={gift.title} className="w-full h-full object-cover" />
                 <div className="absolute bottom-4 left-4 font-mono text-xs bg-white/80 px-2 py-1 backdrop-blur">
                    Source: {gift.marketplace}
                 </div>
             </div>

             {/* 2. Text Data */}
             <div className="p-8 sm:p-10 flex flex-col gap-8">
                 
                 {/* Title block */}
                 <div>
                     <h2 className="font-serif text-3xl sm:text-4xl leading-tight font-light text-ink mb-4">
                         {gift.title}
                     </h2>
                     <div className="flex items-center gap-4 font-mono text-lg text-accent">
                         <span>{gift.price.toLocaleString()} RUB</span>
                         <span className="text-gray-300">/</span>
                         <span className="text-ink text-sm">{gift.reviews?.rating} ★</span>
                     </div>
                 </div>

                 {/* Analysis Block */}
                 <div className="border-l-2 border-accent pl-4 py-1">
                     <p className="font-mono text-xs uppercase text-graphite mb-2">System Reasoning</p>
                     <p className="font-serif text-xl italic text-ink leading-relaxed">
                         "{gift.reason}"
                     </p>
                 </div>

                 {/* Description */}
                 <div>
                     <p className="font-serif text-lg leading-loose text-graphite">
                        {gift.description}
                     </p>
                 </div>

                 {/* Specs (Tags) */}
                 <div className="flex flex-wrap gap-2 pt-4 border-t border-ink/10">
                    {gift.tags.map(tag => (
                        <span key={tag} className="font-mono text-xs border border-ink/20 px-2 py-1 rounded-none text-gray-500">
                            {tag}
                        </span>
                    ))}
                 </div>

             </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-ink/10 bg-paper sticky bottom-0 z-20 flex gap-4">
             <Button 
                fullWidth 
                variant="secondary"
                onClick={() => window.open('#', '_blank')}
             >
                Purchase
             </Button>
             
             <Button 
                variant="primary"
                onClick={handleWishlist}
             >
                {saved ? 'Saved' : 'Save'}
             </Button>
        </div>
      </div>
    </div>
  );
};