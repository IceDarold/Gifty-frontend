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
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-[#a29bfe]/20 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* CLAY MODAL */}
      <div className="relative w-full max-w-lg max-h-[92vh] bg-[#f0f2f5] shadow-2xl overflow-y-auto no-scrollbar rounded-t-[3rem] sm:rounded-[3rem] animate-slide-up pb-8">
        
        {/* Close Button */}
        <button 
            onClick={onClose} 
            className="absolute top-6 right-6 w-12 h-12 bg-white/50 rounded-full flex items-center justify-center text-gray-500 z-20 backdrop-blur-md hover:bg-white transition-colors"
        >
            ✕
        </button>

        {/* Image Header */}
        <div className="relative h-80 w-full p-4 pb-0">
            <div className="w-full h-full rounded-[2.5rem] overflow-hidden shadow-[inset_4px_4px_10px_rgba(0,0,0,0.1),inset_-4px_-4px_10px_rgba(255,255,255,1)] p-2 bg-[#f0f2f5]">
                 <img src={gift.image} alt={gift.title} className="w-full h-full object-cover rounded-[2rem]" />
            </div>
        </div>

        <div className="px-8 pt-6">
             <div className="flex justify-between items-start mb-4">
                 <span className="bg-[#dfe6e9] text-[#636e72] px-4 py-2 rounded-[1rem] text-sm font-bold shadow-inner">
                     {gift.category}
                 </span>
                 <span className="text-3xl font-black text-[#6c5ce7]">
                     {gift.price} ₽
                 </span>
             </div>

             <h2 className="text-3xl font-black text-[#2d3436] mb-6 leading-tight">{gift.title}</h2>

             {/* AI Reason Bubble */}
             <div className="bg-[#f0f2f5] shadow-clay rounded-[2rem] p-6 mb-8 flex items-start gap-4">
                 <div className="shrink-0">
                    <Mascot emotion="excited" className="w-16 h-16" />
                 </div>
                 <div>
                     <h3 className="font-extrabold text-[#6c5ce7] text-sm mb-1 uppercase tracking-wide">Почему это круто</h3>
                     <p className="text-[#2d3436] font-bold leading-relaxed">"{gift.reason}"</p>
                 </div>
             </div>

             <p className="text-[#636e72] font-medium leading-relaxed mb-8 text-lg">{gift.description}</p>

             {/* Action Bar */}
             <div className="flex gap-4 sticky bottom-4">
                 <button 
                    onClick={handleWishlist}
                    className={`flex-1 py-4 rounded-[2rem] font-bold transition-all shadow-clay active:shadow-clay-pressed ${saved ? 'bg-[#ff7675] text-white' : 'bg-[#f0f2f5] text-[#636e72]'}`}
                 >
                    {saved ? '❤️' : '🤍 В избранное'}
                 </button>
                 <Button fullWidth onClick={() => window.open('#', '_blank')} className="shadow-[0_10px_20px_rgba(108,92,231,0.4)]">
                    Купить
                 </Button>
             </div>
        </div>
      </div>
    </div>
  );
};