import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Mascot } from '../components/Mascot';
import { GiftCard } from '../components/GiftCard';
import { GiftDetailsModal } from '../components/GiftDetailsModal';
import { api } from '../api';
import { Gift } from '../domain/types';
import { track } from '../utils/analytics';

const SearchBar: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div 
    onClick={onClick}
    className="mx-4 mb-8 bg-white border-2 border-pop-black rounded-2xl p-2 shadow-hard flex items-center gap-3 cursor-pointer hover:-translate-y-1 hover:shadow-hard-lg transition-all"
  >
    <div className="bg-pop-yellow p-3 rounded-xl border-2 border-pop-black">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pop-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    </div>
    <div className="flex-grow">
        <div className="font-bold text-pop-black">Найти подарок...</div>
        <div className="text-xs text-gray-500 font-medium">Маме, другу, коллеге</div>
    </div>
  </div>
);

const CategoryPills: React.FC<{ onSelect: (tag: string) => void }> = ({ onSelect }) => {
  const categories = [
    { name: '🔥 Тренды', color: 'bg-pop-pink' }, 
    { name: '🎮 Техно', color: 'bg-pop-blue' }, 
    { name: '🏡 Уют', color: 'bg-pop-yellow' }, 
    { name: '🎨 Хобби', color: 'bg-purple-200' },
    { name: '🧸 Детям', color: 'bg-green-200' }
  ];

  return (
    <div className="flex overflow-x-auto gap-3 px-4 pb-4 no-scrollbar mb-4">
      {categories.map((cat, i) => (
        <button
          key={cat.name}
          onClick={() => onSelect(cat.name)}
          className={`${cat.color} border-2 border-pop-black px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap shadow-hard-sm hover:-translate-y-1 transition-transform`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [feedGifts, setFeedGifts] = useState<Gift[]>([]);
  const [techGifts, setTechGifts] = useState<Gift[]>([]);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Simple eye tracking for mascot
  const [eyes, setEyes] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setEyes({ 
          x: (e.clientX - window.innerWidth / 2) / 100, 
          y: (e.clientY - 200) / 100 
      });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [feed, tech] = await Promise.all([
          api.gifts.list({ limit: 6 }),
          api.gifts.list({ limit: 4, tag: 'технологии' }) 
        ]);
        setFeedGifts(feed);
        setTechGifts(tech);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  const startQuiz = () => {
    track('start_quiz', { source: 'home' });
    navigate('/quiz');
  };

  const openGift = (gift: Gift) => {
    track('home_gift_click', { id: gift.id });
    setSelectedGift(gift);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen pb-12 overflow-x-hidden">
      
      {/* Hero Section */}
      <div className="pt-8 px-4 text-center mb-6 relative">
        <div className="absolute top-4 right-8 text-4xl animate-bounce-slow opacity-20 rotate-12">🎁</div>
        <div className="absolute top-20 left-4 text-3xl animate-bounce-slow opacity-20 -rotate-12" style={{ animationDelay: '0.5s' }}>✨</div>

        <div className="flex justify-center mb-6">
           <Mascot className="w-32 h-32" eyesX={eyes.x} eyesY={eyes.y} />
        </div>
        
        <h1 className="text-4xl font-display font-black text-pop-black mb-2 leading-tight">
          Gifty <span className="bg-pop-yellow px-2 transform -rotate-2 inline-block border-2 border-pop-black shadow-sm">AI</span>
        </h1>
        <p className="text-gray-600 font-medium mb-6 max-w-xs mx-auto">
          Подберем идеальный подарок за пару кликов. Без стресса!
        </p>

        <SearchBar onClick={startQuiz} />
        <CategoryPills onSelect={() => navigate('/quiz')} />
      </div>

      {/* Featured Section */}
      <div className="mb-10">
          <div className="flex items-center justify-between px-4 mb-4">
              <h2 className="text-xl font-display font-bold border-b-4 border-pop-yellow inline-block">
                  Популярное
              </h2>
          </div>
          <div className="flex overflow-x-auto gap-4 px-4 pb-8 no-scrollbar">
            {techGifts.map((gift) => (
                <div key={gift.id} className="min-w-[160px] w-[160px] shrink-0">
                    <GiftCard gift={gift} onClick={openGift} />
                </div>
            ))}
          </div>
      </div>

      {/* Feed Grid */}
      <div className="px-4">
        <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
            <span className="text-2xl">👀</span> Лента идей
        </h2>

        <div className="grid grid-cols-2 gap-4">
           {/* CTA Block */}
           <div 
             onClick={startQuiz}
             className="col-span-2 bg-pop-purple border-2 border-pop-black rounded-2xl p-6 shadow-hard cursor-pointer hover:-translate-y-1 transition-transform relative overflow-hidden"
           >
              <div className="relative z-10 flex flex-col items-start text-white">
                  <h3 className="font-display font-black text-2xl mb-2">Не знаешь что выбрать?</h3>
                  <Button variant="secondary" className="text-xs">Пройти квиз</Button>
              </div>
              <div className="absolute -right-4 -bottom-4 text-8xl opacity-20 rotate-12">🤔</div>
           </div>

           {feedGifts.map((gift) => (
             <div key={gift.id} className="h-auto">
                <GiftCard gift={gift} onClick={openGift} />
             </div>
           ))}
        </div>
        
        <div className="mt-8 text-center">
            <Button variant="ghost" onClick={startQuiz}>
               Загрузить еще...
            </Button>
        </div>
      </div>

      {selectedGift && (
        <GiftDetailsModal 
          gift={selectedGift} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          answers={null}
          onWishlistChange={() => {}} 
        />
      )}
    </div>
  );
};