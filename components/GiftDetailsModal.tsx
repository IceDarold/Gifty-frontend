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

  if (!isOpen) return null;

  const handleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
        if (saved) {
            await api.wishlist.remove(gift.id);
            track('remove_wishlist_modal', { id: gift.id });
        } else {
            await api.wishlist.add(gift.id);
            track('add_wishlist_modal', { id: gift.id });
        }
        setSaved(!saved);
        onWishlistChange();
    } catch (e) {
        console.error("Wishlist action failed", e);
    }
  };

  const handleShare = () => {
    const text = `Смотри, что я нашел: ${gift.title} - ${gift.price}₽`;
    if (navigator.share) {
      navigator.share({ title: gift.title, text: text, url: window.location.href });
    } else {
      alert("Ссылка скопирована!");
    }
  };

  const getPersonalizedReasons = () => {
    const reasons = [];
    if (answers) {
      if (answers.interests && answers.interests.length > 3) {
        reasons.push(`Подходит под: "${answers.interests.split(',')[0].trim()}"`);
      }
      reasons.push(`Отличный выбор для: ${answers.relationship}`);
    } else {
      reasons.push('Хит продаж в категории ' + gift.category);
      reasons.push('Высокий рейтинг у покупателей');
    }
    return reasons;
  };

  const getMarketplaceBadge = (mp: string) => {
    switch (mp) {
        case 'Ozon':
            return (
               <img 
                 src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Ozon_App_Logo.svg" 
                 alt="Ozon" 
                 className="h-6 w-auto rounded-[6px] shadow-sm mb-2" 
               />
            );
        case 'WB':
             return (
                <div className="h-6 px-2 bg-gradient-to-r from-[#cb11ab] to-[#e617ca] rounded-[6px] flex items-center justify-center shadow-sm mb-2 w-max">
                     <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/2/22/Wildberries_Logo.svg" 
                        alt="WB" 
                        className="h-3 w-auto brightness-0 invert" 
                     />
                </div>
             );
        case 'Amazon':
             return (
                <div className="h-6 px-2 bg-[#232f3e] rounded-[6px] flex items-center justify-center shadow-sm mb-2 w-max">
                     <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" 
                        alt="Amazon" 
                        className="h-3.5 w-auto brightness-0 invert" 
                     />
                </div>
             );
        default:
             return (
                <div className="h-6 px-2 bg-gray-800 rounded-[6px] flex items-center justify-center shadow-sm mb-2 w-max">
                    <span className="text-white text-[10px] font-bold">{mp}</span>
                </div>
             );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm pointer-events-auto transition-opacity opacity-100 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="bg-white w-full md:w-[600px] h-[92vh] md:h-[85vh] md:rounded-3xl rounded-t-[2rem] shadow-2xl overflow-hidden flex flex-col pointer-events-auto transform transition-transform animate-slide-up-mobile md:animate-pop relative">
        
        {/* --- Immersive Header --- */}
        <div className="relative h-72 md:h-80 shrink-0 bg-gray-100 group">
          <img 
            src={gift.image} 
            alt={gift.title} 
            className="w-full h-full object-cover"
          />
          {/* Top Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/40 via-transparent to-transparent opacity-80" />
          
          {/* Navigation Controls */}
          <div className="absolute top-4 left-0 right-0 px-4 flex justify-between items-start z-20">
             <button 
                onClick={onClose}
                className="bg-white/20 hover:bg-white/40 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center text-white transition-all active:scale-90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <button 
                onClick={handleShare}
                className="bg-white/20 hover:bg-white/40 backdrop-blur-md w-10 h-10 rounded-full flex items-center justify-center text-white transition-all active:scale-90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
          </div>

          {/* Bottom Gradient for Text Contrast */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent" />
          
          {/* Main Title Block (Overlapping Image) */}
          <div className="absolute bottom-4 left-6 right-6 z-10">
              <div className="flex items-start justify-between gap-4">
                 <div>
                    {getMarketplaceBadge(gift.marketplace)}
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight drop-shadow-sm">{gift.title}</h2>
                 </div>
              </div>
          </div>
        </div>

        {/* --- Content Scroll --- */}
        <div className="flex-1 overflow-y-auto no-scrollbar bg-white relative">
          <div className="px-6 pb-28 pt-2">
            
            {/* Price & Score Row */}
            <div className="flex items-center justify-between mb-8">
               <div>
                  <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-purple">
                    {gift.price.toLocaleString('ru-RU')} ₽
                  </div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1">Средняя цена</div>
               </div>
               
               {/* Match Score Indicator */}
               <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs font-bold text-gray-400 uppercase">Совпадение</div>
                    <div className="text-sm font-bold text-brand-purple">Отличный выбор</div>
                  </div>
                  <div className="relative w-14 h-14 flex items-center justify-center">
                     <svg className="w-full h-full transform -rotate-90">
                       <circle cx="28" cy="28" r="24" stroke="#e5e7eb" strokeWidth="4" fill="transparent" />
                       <circle 
                         cx="28" cy="28" r="24" stroke="#AE00FF" strokeWidth="4" fill="transparent" 
                         strokeDasharray={2 * Math.PI * 24}
                         strokeDashoffset={2 * Math.PI * 24 * (1 - matchScore / 100)}
                         className="transition-all duration-1000 ease-out"
                         strokeLinecap="round"
                       />
                     </svg>
                     <span className="absolute text-sm font-black text-gray-800">{matchScore}%</span>
                  </div>
               </div>
            </div>

            {/* AI Assistant Insight */}
            <div className="mb-8 animate-slide-up-mobile" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-end gap-3 mb-2">
                    <Mascot className="w-14 h-14 shrink-0 -mb-2 z-10" emotion="happy" />
                    <div className="bg-blue-50 rounded-2xl rounded-bl-none p-4 relative border border-blue-100/50 shadow-sm flex-grow">
                        <p className="text-sm text-brand-dark font-medium leading-relaxed">
                           <span className="block font-bold text-brand-blue text-xs uppercase mb-1">Мнение AI</span>
                           "{gift.reason}"
                        </p>
                    </div>
                </div>
                {/* Visual Reasons Tags */}
                <div className="flex flex-wrap gap-2 pl-[4.5rem]">
                   {getPersonalizedReasons().map((r, i) => (
                     <span key={i} className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-full text-xs font-bold border border-gray-100">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 fill-brand-purple" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                       {r}
                     </span>
                   ))}
                </div>
            </div>

            {/* Visual Specs Grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
               <div className="bg-gray-50 p-3 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl shadow-sm">🎯</div>
                  <div>
                     <div className="text-[10px] text-gray-400 font-bold uppercase">Категория</div>
                     <div className="text-sm font-bold text-gray-800">{gift.category}</div>
                  </div>
               </div>
               <div className="bg-gray-50 p-3 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl shadow-sm">🎂</div>
                  <div>
                     <div className="text-[10px] text-gray-400 font-bold uppercase">Возраст</div>
                     <div className="text-sm font-bold text-gray-800">{gift.ageRange[0]}-{gift.ageRange[1]} лет</div>
                  </div>
               </div>
            </div>

            {/* Reviews Section */}
            {gift.reviews && <ReviewsSection reviews={gift.reviews} />}

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 text-lg mb-3">О товаре</h3>
              <div className={`relative overflow-hidden transition-all duration-300 ${showFullDesc ? 'max-h-[500px]' : 'max-h-24'}`}>
                 <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                   {gift.description || "Описание товара загружается..."}
                 </p>
                 {!showFullDesc && (
                   <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
                 )}
              </div>
              <button 
                 onClick={() => setShowFullDesc(!showFullDesc)} 
                 className="text-brand-blue text-sm font-bold mt-2 hover:underline flex items-center gap-1"
               >
                 {showFullDesc ? 'Свернуть описание' : 'Читать полностью'}
                 <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${showFullDesc ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                 </svg>
               </button>
            </div>

          </div>
        </div>

        {/* --- Floating Action Bar --- */}
        <div className="absolute bottom-6 left-6 right-6 z-30">
           <div className="bg-white/80 backdrop-blur-md border border-white/50 p-2 rounded-[1.5rem] shadow-2xl flex items-center gap-2 pr-2">
              <button 
                onClick={handleWishlist}
                className={`w-14 h-14 flex items-center justify-center rounded-full transition-all duration-300 active:scale-90 shrink-0 ${saved ? 'bg-red-50 text-red-500 shadow-inner' : 'bg-gray-100 text-gray-400 hover:text-red-400'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-7 w-7 transition-transform ${saved ? 'scale-110 fill-current' : ''}`} viewBox="0 0 20 20" fill={saved ? "currentColor" : "none"} stroke="currentColor">
                  <path strokeWidth={saved ? 0 : 2} fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </button>
              
              <Button 
                variant="primary" 
                fullWidth 
                onClick={() => { track('buy_link_click', {id: gift.id}); window.open('#', '_blank'); }}
                className="h-14 !rounded-[1.2rem] text-lg"
              >
                В магазин
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 inline-block opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Button>
           </div>
        </div>

      </div>
      
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};