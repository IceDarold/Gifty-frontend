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
      {/* Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-blue-900/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Window */}
      <div className="relative w-full max-w-lg max-h-[90vh] bg-white/80 backdrop-filter backdrop-blur-xl shadow-2xl overflow-y-auto no-scrollbar rounded-t-[2rem] sm:rounded-[2rem] border border-white/50 animate-slide-up">
        
        {/* Header Image */}
        <div className="relative h-64 w-full">
            <img src={gift.image} alt={gift.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
            
            <button 
                onClick={onClose} 
                className="absolute top-4 right-4 w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
            >
                ✕
            </button>
        </div>

        <div className="p-6 sm:p-8 -mt-10 relative z-10">
             <div className="flex justify-between items-start mb-2">
                 <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                     {gift.category}
                 </span>
                 <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">
                     {gift.price} ₽
                 </span>
             </div>

             <h2 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">{gift.title}</h2>

             {/* AI Reason Box (Glass) */}
             <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 mb-8 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200/30 rounded-full blur-xl"></div>
                 <div className="flex gap-4">
                     <div className="shrink-0 pt-1">
                        <Mascot emotion="happy" className="w-12 h-12" />
                     </div>
                     <div>
                         <h3 className="font-bold text-blue-900 text-sm mb-1 uppercase opacity-70">Почему это круто</h3>
                         <p className="text-blue-900 leading-relaxed font-medium">"{gift.reason}"</p>
                     </div>
                 </div>
             </div>

             <p className="text-gray-600 leading-relaxed mb-8">{gift.description}</p>

             {/* Footer Actions */}
             <div className="flex gap-4 sticky bottom-0 bg-white/80 backdrop-blur-lg p-4 -mx-6 -mb-6 border-t border-gray-100">
                 <button 
                    onClick={handleWishlist}
                    className={`flex-1 py-3 rounded-full font-bold transition-all border ${saved ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                 >
                    {saved ? '❤️ Сохранено' : '🤍 В избранное'}
                 </button>
                 <Button fullWidth onClick={() => window.open('#', '_blank')}>
                    Купить сейчас
                 </Button>
             </div>
        </div>
      </div>
    </div>
  );
};