import React, { useEffect, useState } from 'react';
import { Gift, QuizAnswers } from '../domain/types';
import { api } from '../api';
import { isInWishlist } from '../utils/storage'; 
import { track } from '../utils/analytics';
import { Button } from './Button';
import { Mascot } from './Mascot';
import { ReviewsSection } from './ReviewsSection';

interface Props {
  gift: Gift; // Initial data (preview)
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

  // Reset to initial when opening new gift
  useEffect(() => {
    if (isOpen) {
        setGift(initialGift);
        setSaved(isInWishlist(initialGift.id));
        
        // Fetch full details (simulating network request for reviews/more info)
        setLoading(true);
        api.gifts.getById(initialGift.id)
            .then(fullGift => {
                setGift(fullGift);
            })
            .catch(err => console.error("Failed to fetch full details", err))
            .finally(() => setLoading(false));
    }
  }, [initialGift.id, isOpen]);

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

  const calculateMatchScore = () => {
    return Math.floor(Math.random() * (99 - 85) + 85);
  };

  const getPersonalizedReasons = () => {
    const reasons = [];
    if (answers) {
      if (answers.interests && answers.interests.length > 3) {
        reasons.push(`Подходит под интерес: "${answers.interests.split(',')[0].trim()}"`);
      }
      reasons.push(`Отличный выбор для категории: ${answers.relationship}`);
      if (gift.price < 5000) {
        reasons.push('Вписывается в комфортный бюджет');
      }
    } else {
      reasons.push('Хит продаж в категории ' + gift.category);
      reasons.push('Высокий рейтинг у покупателей');
    }
    return reasons;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity opacity-100"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="bg-white w-full md:w-[600px] md:h-auto md:max-h-[90vh] md:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto transform transition-transform animate-slide-up-mobile md:animate-pop relative max-h-[90vh]">
        
        {/* Header Image */}
        <div className="relative h-64 md:h-72 shrink-0 bg-gray-100 group">
          <img 
            src={gift.image} 
            alt={gift.title} 
            className="w-full h-full object-cover"
          />
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 bg-white/50 backdrop-blur-md p-2 rounded-full hover:bg-white transition-colors z-10"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="absolute top-4 right-4 flex gap-2 z-10">
             <div className="bg-green-500 text-white px-3 py-2 rounded-full font-bold text-xs shadow-lg flex items-center gap-1">
                <span>{calculateMatchScore()}% матч</span>
             </div>
             <button 
              onClick={handleWishlist}
              className={`p-2 rounded-full shadow-lg transition-colors ${saved ? 'bg-red-50 text-red-500' : 'bg-white/90 text-gray-400 hover:text-red-400'}`}
             >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
             </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 px-6 pt-6 pb-24 md:pb-6 overflow-y-auto no-scrollbar bg-white">
          
          {loading && (
             <div className="w-full h-1 animate-pulse bg-indigo-200 mb-4 rounded-full"></div>
          )}

          {/* Title & Price */}
          <div className="mb-6">
            <div className="flex justify-between items-start">
               <div>
                  <span className="inline-block bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-md font-bold mb-2">
                    {gift.marketplace}
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900 leading-tight">{gift.title}</h2>
               </div>
               <div className="text-right shrink-0 ml-4">
                  <div className="text-2xl font-black text-indigo-600">{gift.price} ₽</div>
                  <div className="text-xs text-gray-400">В наличии</div>
               </div>
            </div>
          </div>

          {/* AI Reason Box */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-4 mb-6 border border-yellow-100 relative overflow-hidden">
             <div className="flex gap-3">
               <Mascot className="w-12 h-12 shrink-0" emotion="happy" />
               <div>
                 <h3 className="font-bold text-yellow-800 text-sm mb-1">Почему это подойдет {answers?.name}?</h3>
                 <ul className="space-y-1">
                   {getPersonalizedReasons().map((r, i) => (
                     <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                       <span className="text-green-500 mt-1">✓</span> {r}
                     </li>
                   ))}
                 </ul>
               </div>
             </div>
          </div>

          {/* Reviews Section */}
          {gift.reviews && <ReviewsSection reviews={gift.reviews} />}

          {/* Description Accordion */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-2">О товаре</h3>
            <p className={`text-gray-600 text-sm leading-relaxed ${showFullDesc ? '' : 'line-clamp-3'}`}>
               {gift.description || "Описание товара загружается..."} 
               <br/><br/>
               Отличный вариант для подарка, который сочетает в себе пользу и эмоции. Доставка обычно занимает 1-2 дня.
            </p>
            {gift.description && gift.description.length > 100 && (
               <button 
                 onClick={() => setShowFullDesc(!showFullDesc)} 
                 className="text-indigo-600 text-sm font-bold mt-1 hover:underline"
               >
                 {showFullDesc ? 'Свернуть' : 'Читать полностью'}
               </button>
            )}
          </div>
          
          <div className="border-t border-gray-100 pt-4 mb-2">
             <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Детали</h4>
             <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                   <span className="text-gray-500 block">Категория</span>
                   <span className="font-medium">{gift.category}</span>
                </div>
                <div>
                   <span className="text-gray-500 block">Возраст</span>
                   <span className="font-medium">{gift.ageRange[0]}-{gift.ageRange[1]} лет</span>
                </div>
             </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 md:relative md:bg-gray-50 md:rounded-b-3xl">
           <div className="flex gap-3">
              <Button 
                variant="primary" 
                fullWidth 
                onClick={() => { track('buy_link_click', {id: gift.id}); window.open('#', '_blank'); }}
              >
                В магазин
              </Button>
              <button 
                onClick={handleWishlist}
                className="bg-indigo-50 text-indigo-600 p-3 rounded-2xl font-bold hover:bg-indigo-100 transition-colors shrink-0 aspect-square flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill={saved ? "currentColor" : "none"} stroke="currentColor">
                  <path strokeWidth={saved ? 0 : 2} fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </button>
           </div>
        </div>

      </div>
      
      {/* Mobile Slide Up Animation Keyframes */}
      <style>{`
        @keyframes slide-up-mobile {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up-mobile {
          animation: slide-up-mobile 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};
