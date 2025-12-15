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
      {/* Darkened Room Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* THE FOLDER OBJECT */}
      <div className="relative w-full max-w-4xl h-[85vh] bg-[#f0e6d2] shadow-2xl rounded-sm transform rotate-1 flex flex-col overflow-hidden paper-texture">
        
        {/* Folder Tab */}
        <div className="absolute -top-8 left-8 w-48 h-10 bg-[#f0e6d2] rounded-t-lg shadow-sm flex items-center px-4">
             <span className="font-typewriter font-bold text-xs uppercase tracking-widest text-ink">DELO № {gift.id}</span>
        </div>

        {/* Close Button (Red Stamp) */}
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full border-2 border-stamp-red text-stamp-red flex items-center justify-center font-bold text-xl rotate-12 hover:bg-stamp-red hover:text-white transition-colors"
        >
            X
        </button>

        {/* Content Area (Paper inside folder) */}
        <div className="flex-1 overflow-y-auto p-8 bg-white m-2 shadow-inner rounded-sm relative">
            {/* Paper texture */}
             <div className="absolute inset-0 opacity-20 pointer-events-none" style={{backgroundImage: 'url("data:image/svg+xml,...")'}}></div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                 
                 {/* Visuals: Paperclipped Photo */}
                 <div className="relative">
                     {/* Paperclip */}
                     <div className="absolute -top-4 right-1/2 translate-x-1/2 w-8 h-16 border-4 border-gray-400 rounded-full z-20"></div>
                     
                     <div className="bg-white p-2 shadow-lg rotate-[-2deg]">
                         <img src={gift.image} alt={gift.title} className="w-full object-cover filter contrast-110" />
                     </div>

                     <div className="mt-8 bg-yellow-100 p-4 shadow-sm rotate-1 font-handwritten text-xl text-ink transform relative">
                         <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-tape/50 rotate-[-1deg]"></div>
                         <p>Цена: <span className="font-bold">{gift.price} ₽</span></p>
                         <p>Где найти: {gift.marketplace}</p>
                     </div>
                 </div>

                 {/* Text: Typed Report */}
                 <div className="font-typewriter text-ink">
                     <h2 className="text-3xl font-bold mb-6 underline decoration-wavy decoration-pencil/30">{gift.title}</h2>
                     
                     <div className="mb-6 p-4 border-l-4 border-red-900/20 bg-gray-50">
                         <span className="block text-xs text-gray-400 mb-1">МНЕНИЕ ИИ-ЭКСПЕРТА:</span>
                         <p className="italic">"{gift.reason}"</p>
                     </div>

                     <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed mb-8 font-sans">
                         {gift.description}
                     </div>

                     <div className="flex gap-4 items-center border-t-2 border-dashed border-gray-300 pt-6 mt-auto">
                         <Button 
                            variant="primary"
                            onClick={() => window.open('#', '_blank')}
                         >
                            ЗАКАЗАТЬ
                         </Button>
                         
                         <Button 
                            variant="secondary"
                            onClick={handleWishlist}
                         >
                            {saved ? 'В АРХИВ' : 'СОХРАНИТЬ'}
                         </Button>
                     </div>
                 </div>
             </div>
        </div>
      </div>
    </div>
  );
};