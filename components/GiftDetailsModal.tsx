import React, { useEffect, useState } from 'react';
import { Gift, QuizAnswers } from '../domain/types';
import { api } from '../api';
import { isInWishlist, addToWishlist, removeFromWishlist } from '../utils/storage'; 
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
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [matchScore, setMatchScore] = useState(0);

  // Reset & Load Logic
  useEffect(() => {
    if (isOpen) {
        setGift(initialGift);
        setSaved(isInWishlist(initialGift.id));
        setMatchScore(0);
        
        // Animate score
        const targetScore = Math.floor(Math.random() * (98 - 85) + 85);
        setTimeout(() => setMatchScore(targetScore), 300);

        setLoading(true);
        api.gifts.getById(initialGift.id)
            .then(fullGift => {
                setGift(fullGift);
            })
            .catch(err => console.error("Failed to fetch full details", err))
            .finally(() => setLoading(false));
    }
  }, [initialGift.id, isOpen]);

  // Lock scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleEsc);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleEsc);
      };
    }
  }, [isOpen, onClose]);

  const handleWishlist = () => {
    if (saved) {
      removeFromWishlist(gift.id);
      track('remove_wishlist_modal', { id: gift.id });
    } else {
      addToWishlist(gift.id);
      track('add_wishlist_modal', { id: gift.id });
    }
    setSaved(!saved);
    onWishlistChange();
  };

  if (!isOpen) return null;

  const formatPrice = (price: number) => new Intl.NumberFormat('ru-RU').format(price) + ' ₽';

  const getMarketplaceLogo = (mp: string) => {
    switch (mp) {
        case 'Ozon':
            return (
               <div className="h-6 px-3 bg-[#005bff] rounded-md flex items-center justify-center">
                 <img 
                   src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Ozon.ru_Logo_2019.svg/320px-Ozon.ru_Logo_2019.svg.png" 
                   alt="Ozon" 
                   className="h-3.5 w-auto brightness-0 invert" 
                 />
               </div>
            );
        case 'WB':
             return (
                <div className="h-6 px-3 bg-gradient-to-r from-[#cb11ab] to-[#e617ca] rounded-md flex items-center justify-center">
                     <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Wildberries_logo.svg/320px-Wildberries_logo.svg.png" 
                        alt="WB" 
                        className="h-3.5 w-auto brightness-0 invert" 
                     />
                </div>
             );
        case 'Amazon':
             return (
                <div className="h-6 px-3 bg-[#232f3e] rounded-md flex items-center justify-center">
                     <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/320px-Amazon_logo.svg.png" 
                        alt="Amazon" 
                        className="h-4 w-auto brightness-0 invert" 
                     />
                </div>
             );
        default:
             return (
                <div className="h-6 px-3 bg-gray-800 rounded-md flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">{mp}</span>
                </div>
             );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center pointer-events-none">
      
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="bg-white w-full max-w-lg h-[90vh] sm:h-auto sm:max-h-[90vh] rounded-t-[2.5rem] sm:rounded-[2.5rem] relative z-10 overflow-hidden flex flex-col pointer-events-auto shadow-2xl animate-slide-up-mobile">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/10 hover:bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-grow overscroll-contain no-scrollbar">
           
           {/* Image Header */}
           <div className="relative h-72 sm:h-80 w-full shrink-0">
              <img 
                src={gift.image} 
                alt={gift.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80" />
              
              {/* Match Score Badge */}
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-xl px-4 py-2 rounded-2xl shadow-lg border border-white/50 flex items-center gap-2">
                 <div className="relative w-8 h-8">
                     <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path className="text-gray-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                        <path className="text-brand-purple drop-shadow-md" strokeDasharray={`${matchScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                     </svg>
                     <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-brand-dark">
                        {matchScore}%
                     </div>
                 </div>
                 <div className="flex flex-col leading-none">
                     <span className="text-[10px] font-bold text-gray-500 uppercase">Совпадение</span>
                     <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-purple">Идеально</span>
                 </div>
              </div>
           </div>

           <div className="px-6 pb-24 -mt-6 relative z-10">
              
              {/* Title & Price */}
              <div className="flex justify-between items-start mb-4">
                 <h2 className="text-2xl font-bold text-gray-900 leading-tight w-3/4">
                    {gift.title}
                 </h2>
                 <div className="text-right">
                    <div className="text-xl font-black text-brand-blue">{formatPrice(gift.price)}</div>
                    {/* Marketplace Badge */}
                    <div className="flex justify-end mt-1">
                        {getMarketplaceLogo(gift.marketplace)}
                    </div>
                 </div>
              </div>

              {/* AI Insight Block */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-2xl border border-indigo-100 mb-6 flex gap-4">
                 <div className="shrink-0">
                    <Mascot className="w-12 h-12" emotion="happy" />
                 </div>
                 <div>
                    <h3 className="text-sm font-bold text-indigo-900 mb-1 flex items-center gap-1">
                       ✨ Почему это подойдет
                    </h3>
                    <p className="text-sm text-indigo-800/80 leading-relaxed">
                       {gift.reason}
                    </p>
                 </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                 <h3 className="font-bold text-gray-900 mb-2">О товаре</h3>
                 <p className={`text-gray-600 text-sm leading-relaxed ${!showFullDesc && gift.description && gift.description.length > 150 ? 'line-clamp-3' : ''}`}>
                    {gift.description || 'Описание отсутствует.'}
                 </p>
                 {gift.description && gift.description.length > 150 && (
                    <button 
                       onClick={() => setShowFullDesc(!showFullDesc)}
                       className="text-brand-blue font-bold text-sm mt-1"
                    >
                       {showFullDesc ? 'Скрыть' : 'Читать далее'}
                    </button>
                 )}
              </div>

              {/* Reviews */}
              {gift.reviews && <ReviewsSection reviews={gift.reviews} />}

           </div>
        </div>

        {/* Footer Actions */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 px-6 pb-safe flex items-center gap-3">
             <button 
                onClick={handleWishlist}
                className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center border transition-all ${saved ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'}`}
             >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${saved ? 'fill-current' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
             </button>
             
             <Button fullWidth onClick={() => alert('Переход в магазин... (Демо)')} className="flex items-center justify-center gap-2">
                <span>Купить на</span>
                {getMarketplaceLogo(gift.marketplace)}
             </Button>
        </div>

      </div>
    </div>
  );
};