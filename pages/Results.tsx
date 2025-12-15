import React, { useEffect, useState } from 'react';
import { GiftCard } from '../components/GiftCard';
import { GiftDetailsModal } from '../components/GiftDetailsModal';
import { api } from '../api';
import { Gift, QuizAnswers } from '../domain/types';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { track } from '../utils/analytics';
import { Mascot } from '../components/Mascot';

export const Results: React.FC = () => {
  const [results, setResults] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<QuizAnswers | null>(null);
  
  // Modal State
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Trigger re-render of wishlists buttons when changed inside modal
  const [wishlistVersion, setWishlistVersion] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const stored = localStorage.getItem('gifty_answers');
        if (!stored) {
          navigate('/quiz');
          return;
        }
        
        const parsedAnswers: QuizAnswers = JSON.parse(stored);
        setAnswers(parsedAnswers);
        
        // 1. Get Recommendations (IDs)
        const recommendation = await api.recommendations.create(parsedAnswers);
        
        // 2. Hydrate Gifts
        const gifts = await api.gifts.getMany(recommendation.gift_ids);
        
        setResults(gifts);
      } catch (err) {
        console.error(err);
        setError("Не удалось подобрать подарки. Попробуйте обновить страницу.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [navigate]);

  const handleGiftClick = (gift: Gift) => {
    track('view_gift_details', { id: gift.id });
    setSelectedGift(gift);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedGift(null), 300); // clear after animation
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center text-white">
        <Mascot className="w-24 h-24 mb-6" emotion="thinking" />
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xl font-bold animate-pulse">Анализирую интересы...</p>
        <p className="text-sm text-indigo-200 mt-2">Ищу лучшее среди тысяч товаров</p>
      </div>
    );
  }

  if (error) {
    return (
       <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <p className="text-white text-xl font-bold mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Попробовать снова</Button>
       </div>
    );
  }

  const featured = results[0];
  const others = results.slice(1);

  return (
    <div className="pt-6 px-4 pb-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Лучшие варианты</h1>
        <button className="bg-white/20 p-2 rounded-lg text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
        </button>
      </div>

      <div className="space-y-6">
        {/* Featured Item */}
        {featured && (
            <div className="animate-pop">
                <GiftCard 
                  gift={featured} 
                  featured 
                  onClick={handleGiftClick} 
                  onToggleWishlist={() => setWishlistVersion(v => v + 1)}
                />
            </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {others.map((gift) => (
                <GiftCard 
                  key={gift.id} 
                  gift={gift} 
                  onClick={handleGiftClick}
                  onToggleWishlist={() => setWishlistVersion(v => v + 1)}
                />
            ))}
        </div>
      </div>
      
      <div className="mt-8 text-center pb-8">
          <Button variant="ghost" onClick={() => navigate('/quiz')}>Начать заново</Button>
      </div>

      {/* Details Modal */}
      {selectedGift && (
        <GiftDetailsModal 
          gift={selectedGift} 
          isOpen={isModalOpen} 
          onClose={handleCloseModal}
          answers={answers}
          onWishlistChange={() => setWishlistVersion(v => v + 1)}
        />
      )}
    </div>
  );
};