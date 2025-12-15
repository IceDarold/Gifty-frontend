import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Gift, QuizAnswers } from '../domain/types';
import { api } from '../api';
import { isInWishlist, addToWishlist, removeFromWishlist } from '../utils/storage'; 
import { track } from '../utils/analytics';
import { Button } from './Button';
import { ReviewsSection } from './ReviewsSection';
import { GiftCard } from './GiftCard';
import { BetaRegistrationModal } from './BetaRegistrationModal';

interface Props {
  gift: Gift;
  answers: QuizAnswers | null;
  isOpen: boolean;
  onClose: () => void;
  onWishlistChange: () => void;
}

export const GiftDetailsModal: React.FC<Props> = ({ gift: initialGift, answers, isOpen, onClose, onWishlistChange }) => {
  const [gift, setGift] = useState<Gift>(initialGift);
  const [similarGifts, setSimilarGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [matchScore, setMatchScore] = useState(0);
  
  // Registration Modal State
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  
  const contentRef = useRef<HTMLDivElement>(null);

  // Initialize and update when props or internal navigation changes
  useEffect(() => {
    if (isOpen) {
        // Reset or set initial state based on the current target gift
    }
  }, [isOpen]);

  // Specific effect to handle data fetching when the displayed gift ID changes
  useEffect(() => {
    if (!isOpen) return;
    
    // 1. Reset visual states
    setSaved(isInWishlist(gift.id));
    setMatchScore(0);
    setShowFullDesc(false);
    if(contentRef.current) contentRef.current.scrollTop = 0;

    // 2. Animate Score only if answers exist
    if (answers) {
        const targetScore = Math.floor(Math.random() * (99 - 88) + 88);
        setTimeout(() => setMatchScore(targetScore), 400);
    }

    // 3. Fetch Full Details & Similar
    setLoading(true);
    
    Promise.all([
        api.gifts.getById(gift.id),
        api.gifts.getSimilar(gift.id)
    ])
    .then(([fullGift, similar]) => {
        setGift(fullGift);
        setSimilarGifts(similar);
    })
    .catch(err => console.error(err))
    .finally(() => setLoading(false));

  }, [gift.id, isOpen, answers]);

  // Sync with prop when modal opens first time
  useEffect(() => {
      if(isOpen && initialGift.id !== gift.id) {
          setGift(initialGift);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialGift.id, isOpen]); 

  // Handle Escape and Body Lock
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

  const handleSwitchGift = (newGift: Gift) => {
      setGift(newGift);
      track('click_similar_gift', { from: gift.id, to: newGift.id });
  };

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

  const handleBuyClick = () => {
      track('click_buy', { id: gift.id });
      setIsRegistrationOpen(true);
  };

  if (!isOpen) return null;

  const formatPrice = (price: number) => new Intl.NumberFormat('ru-RU').format(price) + ' ₽';

  return createPortal(
    <>
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center pointer-events-none">
      
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-[#0B0033]/60 backdrop-blur-xl pointer-events-auto transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className={`bg-white w-full max-w-2xl h-[96vh] sm:h-[90vh] sm:max-h-[850px] rounded-t-[3rem] sm:rounded-[3rem] relative z-10 flex flex-col pointer-events-auto shadow-[0_0_50px_rgba(0,0,0,0.3)] transform transition-transform duration-500 overflow-hidden ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-40 w-11 h-11 bg-black/10 hover:bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center transition-transform active:scale-90 border border-white/20 text-white shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Scrollable Content */}
        <div ref={contentRef} className="flex-grow overflow-y-auto no-scrollbar relative pb-32 bg-[#FAFAFA]">
           
           {/* --- IMMERSIVE HEADER --- */}
           <div className="relative h-[50vh] sm:h-[450px] w-full shrink-0">
              <img 
                src={gift.image} 
                alt={gift.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#FAFAFA]" />
              
              {/* Floating Match Score - SHOWN ONLY IF ANSWERS EXIST */}
              {answers && matchScore > 0 && (
                <div className="absolute bottom-6 right-6 animate-pop">
                    <div className="bg-white/80 backdrop-blur-xl p-2 pr-4 rounded-2xl shadow-xl border border-white/50 flex items-center gap-3">
                        <div className="relative w-12 h-12">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                            <path className="text-gray-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                            <path className="text-brand-blue drop-shadow-[0_0_4px_rgba(0,111,255,0.5)]" strokeDasharray={`${matchScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-brand-blue">
                            {matchScore}%
                            </div>
                        </div>
                        <div>
                            <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">AI Match</div>
                            <div className="text-xs font-bold text-gray-800">Идеально</div>
                        </div>
                    </div>
                </div>
              )}
           </div>

           {/* --- BODY CONTENT --- */}
           <div className="px-6 sm:px-10 -mt-6 relative z-10">
              
              {/* Title Block */}
              <div className="mb-6">
                 <div className="flex flex-wrap gap-2 mb-3">
                     {gift.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-3 py-1 bg-white text-gray-600 text-[11px] font-bold uppercase tracking-wider rounded-lg shadow-sm border border-gray-100/50">
                              {tag}
                          </span>
                      ))}
                 </div>
                 <h2 className="text-3xl sm:text-4xl font-black text-brand-dark leading-[1.1] mb-2 tracking-tight">
                    {gift.title}
                 </h2>
                 <div className="text-2xl font-medium text-gray-400">
                    {formatPrice(gift.price)}
                 </div>
              </div>

              {/* AI Verdict Card */}
              <div className="relative overflow-hidden rounded-[2rem] p-6 mb-8 shadow-lg group">
                 {/* Magical Background */}
                 <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#ec4899] opacity-10 group-hover:opacity-15 transition-opacity" />
                 <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-blue/20 blur-[50px] rounded-full" />

                 <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center text-white shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-black text-brand-dark uppercase tracking-widest">
                            Почему это круто
                        </h3>
                    </div>
                    <p className="text-base sm:text-lg text-brand-dark/80 font-medium leading-relaxed italic">
                        "{gift.reason}"
                    </p>
                 </div>
              </div>

              {/* Description */}
              <div className="mb-10">
                 <h3 className="text-lg font-bold text-brand-dark mb-4">О товаре</h3>
                 <div className={`relative text-gray-600 text-base leading-relaxed font-medium transition-all duration-300 ${!showFullDesc && gift.description && gift.description.length > 250 ? 'max-h-32 overflow-hidden' : 'max-h-[1000px]'}`}>
                     <p>{gift.description || 'Описание отсутствует.'}</p>
                     
                     {/* Fade for truncation */}
                     {!showFullDesc && gift.description && gift.description.length > 250 && (
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#FAFAFA] to-transparent" />
                     )}
                 </div>
                 
                 {gift.description && gift.description.length > 250 && (
                    <button 
                       onClick={() => setShowFullDesc(!showFullDesc)}
                       className="mt-2 text-brand-blue font-bold text-sm hover:underline flex items-center gap-1"
                    >
                       {showFullDesc ? 'Скрыть детали' : 'Читать полностью'}
                       <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${showFullDesc ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                       </svg>
                    </button>
                 )}
              </div>

              {/* Reviews */}
              {gift.reviews && (
                <div className="mb-8">
                   <ReviewsSection reviews={gift.reviews} />
                </div>
              )}

              {/* Similar Products */}
              {similarGifts.length > 0 && (
                  <div className="mb-12 border-t border-gray-100 pt-8">
                      <h3 className="text-xl font-bold text-brand-dark mb-4 px-1">Вам может понравиться</h3>
                      <div className="overflow-x-auto no-scrollbar -mx-6 px-6 pb-4">
                          <div className="flex gap-4 w-max">
                              {similarGifts.map(similar => (
                                  <div 
                                    key={similar.id} 
                                    className="w-[160px] shrink-0"
                                    onClick={() => handleSwitchGift(similar)}
                                  >
                                      <GiftCard gift={similar} />
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              )}
           </div>
        </div>

        {/* Floating Action Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-50 p-6 pointer-events-none">
            <div className="max-w-xl mx-auto flex items-center gap-4 pointer-events-auto">
                 {/* Wishlist Button */}
                 <button 
                    onClick={handleWishlist}
                    className={`w-[4.5rem] h-[4.5rem] rounded-[1.5rem] flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.12)] border transition-all duration-300 active:scale-95 ${saved ? 'bg-white border-red-100 text-[#F91155]' : 'bg-white/90 backdrop-blur-xl border-white/40 text-gray-400 hover:text-gray-600'}`}
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 transition-transform duration-300 ${saved ? 'fill-current scale-110' : ''}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={saved ? 0 : 2} fill={saved ? "currentColor" : "none"}>
                       <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                 </button>

                 {/* Buy Button */}
                 <Button 
                    fullWidth 
                    onClick={handleBuyClick} 
                    className="h-[4.5rem] rounded-[1.5rem] shadow-[0_8px_30px_rgba(0,111,255,0.3)] text-xl relative overflow-hidden group border-2 border-white/10"
                 >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out" />
                    <span className="relative z-10 flex items-center justify-center gap-3">
                        Купить
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </span>
                 </Button>
            </div>
            
            {/* Gradient Fade for Bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA]/80 to-transparent -z-10 rounded-b-[3rem]" />
        </div>

      </div>
    </div>
    
    {/* Beta Registration Overlay */}
    {isRegistrationOpen && <BetaRegistrationModal onClose={() => setIsRegistrationOpen(false)} />}
    </>,
    document.body
  );
};