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

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center pointer-events-none">
      
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-brand-dark/80 backdrop-blur-md pointer-events-auto transition-opacity duration-300" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="bg-[#FAFAFA] w-full max-w-lg h-[92vh] sm:h-auto sm:max-h-[85vh] rounded-t-[2.5rem] sm:rounded-[2.5rem] relative z-10 overflow-hidden flex flex-col pointer-events-auto shadow-[0_-10px_40px_rgba(0,0,0,0.4)] animate-slide-up-mobile">
        
        {/* Close Button (Floating) */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 z-30 w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur-xl rounded-full flex items-center justify-center transition-all active:scale-90 shadow-lg border border-white/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-grow overscroll-contain no-scrollbar relative">
           
           {/* --- IMAGE HEADER --- */}
           <div className="relative h-[45vh] sm:h-[400px] w-full shrink-0 group">
              <img 
                src={gift.image} 
                alt={gift.title} 
                className="w-full h-full object-cover"
              />
              
              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent opacity-60 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA]/60 to-transparent bottom-[-2px] h-32 pointer-events-none" />

              {/* Match Score Badge (Decorated) */}
              <div className="absolute top-5 left-5 z-20 animate-pop">
                 <div className="bg-white/90 backdrop-blur-md pl-2 pr-3 py-1.5 rounded-full shadow-lg border border-white/60 flex items-center gap-2">
                     <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center text-white font-black text-xs shadow-inner">
                        {matchScore}%
                     </div>
                     <span className="text-xs font-bold text-gray-800 tracking-wide uppercase">AI-Подбор</span>
                 </div>
              </div>
           </div>

           {/* --- CONTENT BODY --- */}
           <div className="px-6 pb-28 -mt-8 relative z-10">
              
              {/* Title & Price Header */}
              <div className="text-center mb-6">
                 <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-2 tracking-tight">
                    {gift.title}
                 </h2>
                 <div className="inline-flex items-baseline gap-2 bg-white px-4 py-1 rounded-full shadow-sm border border-gray-100">
                    <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
                        {formatPrice(gift.price)}
                    </span>
                 </div>
              </div>

              {/* Tags Row */}
              {gift.tags && gift.tags.length > 0 && (
                  <div className="flex justify-center flex-wrap gap-2 mb-8">
                      {gift.tags.slice(0, 4).map(tag => (
                          <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-gray-200">
                              {tag}
                          </span>
                      ))}
                  </div>
              )}

              {/* Santa's Verdict (Key Value Prop) */}
              <div className="relative bg-gradient-to-br from-red-50 to-orange-50 p-5 rounded-3xl border border-red-100 mb-8 shadow-sm overflow-hidden">
                 {/* Decorative Snowflakes */}
                 <div className="absolute -top-2 -right-2 text-red-100 opacity-50 transform rotate-12">
                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L14 5H18L16 8L18 11H14L12 14L10 11H6L8 8L6 5H10L12 2Z"/></svg>
                 </div>

                 <div className="relative z-10 flex gap-4">
                     <div className="shrink-0 pt-1">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-red-100">
                            🎅
                        </div>
                     </div>
                     <div>
                        <h3 className="text-sm font-black text-red-900 mb-1 flex items-center gap-1 uppercase tracking-wide">
                           Вердикт Санты
                        </h3>
                        <p className="text-sm text-red-900/80 font-medium leading-relaxed">
                           "{gift.reason}"
                        </p>
                     </div>
                 </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                 <h3 className="font-bold text-gray-900 mb-3 text-lg flex items-center gap-2">
                    <span>📝</span> О подарке
                 </h3>
                 <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm text-gray-600 text-sm leading-7 font-medium">
                     <p className={`${!showFullDesc && gift.description && gift.description.length > 200 ? 'line-clamp-4' : ''}`}>
                        {gift.description || 'Описание отсутствует.'}
                     </p>
                     {gift.description && gift.description.length > 200 && (
                        <button 
                           onClick={() => setShowFullDesc(!showFullDesc)}
                           className="text-brand-blue font-bold text-sm mt-2 hover:underline"
                        >
                           {showFullDesc ? 'Свернуть описание' : 'Читать всё описание'}
                        </button>
                     )}
                 </div>
              </div>

              {/* Reviews */}
              {gift.reviews && (
                <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
                   <ReviewsSection reviews={gift.reviews} />
                </div>
              )}

           </div>
        </div>

        {/* Footer Actions (Glassmorphism) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pb-safe z-40 pointer-events-none">
            {/* Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/90 to-transparent -z-10" />
            
            <div className="flex items-center gap-3 pointer-events-auto max-w-lg mx-auto">
                 <button 
                    onClick={handleWishlist}
                    className={`w-16 h-16 shrink-0 rounded-[1.25rem] flex items-center justify-center transition-all duration-300 shadow-xl border-2 ${saved ? 'bg-white border-red-100 text-red-500 scale-95' : 'bg-white border-white text-gray-300 hover:text-red-400 hover:scale-105'}`}
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 transition-transform ${saved ? 'fill-current animate-pop' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                 </button>
                 
                 <Button 
                    fullWidth 
                    onClick={() => alert('Переход в магазин... (Демо)')} 
                    className="h-16 rounded-[1.25rem] shadow-xl shadow-brand-purple/20 bg-gradient-to-r from-brand-blue to-brand-purple hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-between px-6 border-2 border-white/20"
                 >
                    <span className="font-bold text-lg">Купить подарок</span>
                    <div className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </div>
                 </Button>
            </div>
        </div>

      </div>
    </div>
  );
};