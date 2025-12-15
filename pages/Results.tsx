import React, { useEffect, useState } from 'react';
import { GiftCard } from '../components/GiftCard';
import { GiftDetailsModal } from '../components/GiftDetailsModal';
import { api } from '../api';
import { Gift, QuizAnswers } from '../domain/types';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { Mascot } from '../components/Mascot';

export const Results: React.FC = () => {
  const [results, setResults] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<QuizAnswers | null>(null);
  
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        setAnswers(JSON.parse(stored));
        const recommendation = await api.recommendations.create(JSON.parse(stored));
        const gifts = await api.gifts.getMany(recommendation.gift_ids);
        setResults(gifts);
      } catch (err) {
        console.error(err);
        setError("ОШИБКА ПРОЯВКИ. ПОПРОБУЙТЕ ЕЩЕ РАЗ.");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <Mascot className="mb-8 animate-spin-slow" emotion="thinking" />
        <h2 className="font-handwritten font-bold text-4xl animate-pulse text-ink">Проявляем идеи...</h2>
        <div className="font-typewriter text-xs mt-4 text-pencil">
            Ищем совпадения в архивах...<br/>
            Калибруем креативность...
        </div>
      </div>
    );
  }

  if (error) return <div className="p-12 text-center font-typewriter text-stamp-red font-bold text-xl">{error}</div>;

  return (
    <div className="w-full">
      {/* HEADER: A Label maker sticker */}
      <div className="mb-12 text-center relative">
          <div className="inline-block bg-black text-white px-6 py-2 font-typewriter font-bold tracking-[0.2em] text-lg uppercase shadow-lg transform -rotate-1">
              РЕЗУЛЬТАТЫ ПОИСКА: {answers?.name}
          </div>
          <div className="mt-2 font-handwritten text-gray-500 rotate-1">
              Найдено {results.length} вариантов
          </div>
      </div>

      {/* GRID: Contact Sheet layout */}
      <div className="bg-white p-4 sm:p-8 shadow-paper relative">
          {/* Film sprocket holes decorative (CSS gradient) */}
          <div className="absolute top-0 left-0 w-full h-4 bg-black" style={{backgroundImage: 'radial-gradient(circle, transparent 20%, black 21%)', backgroundSize: '20px 20px', backgroundPosition: 'center'}}></div>
          <div className="absolute bottom-0 left-0 w-full h-4 bg-black" style={{backgroundImage: 'radial-gradient(circle, transparent 20%, black 21%)', backgroundSize: '20px 20px', backgroundPosition: 'center'}}></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-6">
              {results.map((gift, i) => (
                 <div key={gift.id} className="transform transition-transform hover:scale-[1.02] hover:z-10 relative">
                    {/* Index Number */}
                    <div className="absolute -top-2 -left-2 bg-yellow-300 w-6 h-6 rounded-full flex items-center justify-center font-typewriter text-xs font-bold shadow-sm z-20 border border-white">
                        {i + 1}
                    </div>
                    
                    <GiftCard 
                        gift={gift} 
                        variant="polaroid"
                        onClick={(g) => { setSelectedGift(g); setIsModalOpen(true); }}
                    />
                 </div>
              ))}
          </div>
      </div>
      
      <div className="mt-16 text-center">
          <Button variant="secondary" onClick={() => navigate('/quiz')}>
              ↻ ПОПРОБОВАТЬ СНОВА
          </Button>
          <div className="mt-4">
               <span className="font-handwritten text-gray-400 text-xl">Не то? Давайте перепишем анкету.</span>
          </div>
      </div>

      {selectedGift && (
        <GiftDetailsModal 
          gift={selectedGift} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          answers={answers}
          onWishlistChange={() => {}}
        />
      )}
    </div>
  );
};