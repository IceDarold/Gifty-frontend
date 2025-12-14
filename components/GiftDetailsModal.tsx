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

  // Reset & Load Logic
  useEffect(() => {
    if (isOpen) {
        setGift(initialGift);
        setSaved(isInWishlist(initialGift.id));
        setLoading(true);
        api.gifts.getById(initialGift.id)
            .then(fullGift => {
                setGift(fullGift);
            })
            .catch(err => console.error("Failed to fetch full details", err))
            .finally(() => setLoading(false));
    }
  }, [initialGift.id, isOpen]);

  if (!isOpen) return null;

  const handleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
        if (saved) {
            await api.wishlist.remove(gift.id);
        } else {
            await api.wishlist.add(gift.id);
        }
        setSaved(!saved);
        onWishlistChange();
    } catch (e) {
        console.error("Wishlist action failed", e);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Darkened room background */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto transition-opacity opacity-100"
        onClick={onClose}
      />

      {/* MANILA FOLDER CONTAINER */}
      <div className="relative w-full max-w-lg max-h-[90vh] bg-[#f0e6d2] shadow-lifted overflow-y-auto no-scrollbar transform rotate-1 rounded-sm torn-edge">
        
        {/* Folder Tab */}
        <div className="absolute top-0 right-0 w-32 h-8 bg-[#e6dcc5] border-b border-black/10 flex items-center justify-center">
            <span className="font-typewriter text-xs font-bold text-red-700">CONFIDENTIAL</span>
        </div>

        {/* Paper Clip SVG */}
        <svg className="absolute top-[-10px] left-8 w-12 h-20 text-gray-400 z-50 drop-shadow-md" viewBox="0 0 50 100" fill="none" stroke="currentColor" strokeWidth="5">
             <path d="M10 20 L10 80 A 15 15 0 0 0 40 80 L40 10 A 10 10 0 0 0 20 10 L20 70" />
        </svg>

        <div className="p-8 pt-12 relative">
             {/* Close X (Hand drawn) */}
             <button onClick={onClose} className="absolute top-4 right-4 font-marker text-2xl text-gray-500 hover:text-red-600">X</button>

             {/* MAIN PHOTO: Taped to the folder */}
             <div className="relative bg-white p-2 shadow-md transform -rotate-1 mb-6">
                 <div className="tape" style={{ top: '-15px', left: '50%', width: '50px', height: '25px', '--tape-rot': '-2deg' } as any}></div>
                 <img src={gift.image} alt={gift.title} className="w-full aspect-video object-cover filter contrast-110" />
                 <div className="absolute bottom-2 right-2 bg-black text-white font-typewriter text-xs px-1">REF: {gift.id}</div>
             </div>

             {/* Title & Price */}
             <h2 className="font-marker text-3xl mb-1 leading-none">{gift.title}</h2>
             <div className="flex items-center gap-4 mb-6">
                 <span className="font-hand text-3xl text-red-600 font-bold decoration-double underline">{gift.price} ₽</span>
                 <span className="font-typewriter text-xs bg-gray-200 px-1 rounded">{gift.marketplace}</span>
             </div>

             {/* AI Analysis (Stuck on a post-it) */}
             <div className="bg-yellow-100 p-4 shadow-sm transform rotate-1 mb-6 relative">
                 <div className="tape" style={{ top: '-10px', right: '10px', width: '30px', height: '20px', '--tape-rot': '45deg' } as any}></div>
                 <Mascot emotion="thinking" className="w-12 h-12 absolute -top-6 -left-4" />
                 <h3 className="font-marker text-sm mb-1">Почему это круто:</h3>
                 <p className="font-hand text-xl leading-6 text-gray-800">
                    "{gift.reason}"
                 </p>
             </div>

             {/* Description (Typewriter text) */}
             <div className="font-typewriter text-sm leading-relaxed text-gray-700 mb-8 border-l-2 border-gray-300 pl-4">
                 {gift.description}
             </div>

             {/* Actions */}
             <div className="flex gap-4">
                 <button 
                    onClick={handleWishlist}
                    className={`flex-1 py-3 border-2 border-black font-marker text-lg transition-colors ${saved ? 'bg-red-500 text-white' : 'bg-transparent hover:bg-black/5'}`}
                 >
                    {saved ? 'В ИЗБРАННОМ' : 'В ИЗБРАННОЕ'}
                 </button>
                 <Button fullWidth onClick={() => window.open('#', '_blank')}>
                    КУПИТЬ
                 </Button>
             </div>
        </div>

      </div>
    </div>
  );
};