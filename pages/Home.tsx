import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Mascot } from '../components/Mascot';
import { GiftCard } from '../components/GiftCard';
import { GiftDetailsModal } from '../components/GiftDetailsModal';
import { api } from '../api';
import { Gift } from '../domain/types';
import { track } from '../utils/analytics';

// --- Components ---

const SearchTrigger: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div 
    onClick={onClick}
    className="group glass-panel rounded-full p-2 pr-6 flex items-center gap-4 cursor-pointer hover:bg-white/10 transition-all duration-500 mx-4 mb-10 border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.3)]"
  >
    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform">
       <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    <div className="flex-grow text-left">
      <p className="text-white/60 text-xs font-medium uppercase tracking-widest mb-0.5">AI Concierge</p>
      <p className="text-white font-serif text-lg italic">Найти идеальный подарок...</p>
    </div>
  </div>
);

const CategoryPills: React.FC<{ onSelect: (tag: string) => void }> = ({ onSelect }) => {
  const categories = [
    'Тренды', 'Для неё', 'Для него', 'Дом', 'Технологии', 'Искусство', 'Дети'
  ];

  return (
    <div className="flex overflow-x-auto gap-3 px-6 pb-4 no-scrollbar -mx-2 mb-2">
      {categories.map((cat, i) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className="glass-panel px-5 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-all hover:bg-white/20 hover:border-white/30 text-white/90"
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

const HorizontalSection: React.FC<{ 
  title: string; 
  subtitle?: string; 
  gifts: Gift[]; 
  onGiftClick: (g: Gift) => void;
  id?: string;
}> = ({ title, subtitle, gifts, onGiftClick, id }) => {
  if (gifts.length === 0) return null;

  return (
    <div id={id} className="mb-12 relative z-10 px-0">
      <div className="px-6 mb-5">
         <h2 className="text-2xl font-serif text-white">
            {title}
         </h2>
         {subtitle && <p className="text-white/50 text-sm mt-1">{subtitle}</p>}
      </div>
      <div className="flex overflow-x-auto gap-4 px-6 pb-8 no-scrollbar snap-x">
         {gifts.map((gift) => (
           <div key={gift.id} className="min-w-[180px] w-[180px] snap-center shrink-0">
              <GiftCard gift={gift} onClick={onGiftClick} />
           </div>
         ))}
         <div className="w-2 shrink-0" />
      </div>
    </div>
  );
};

const useMascotBehavior = () => {
  const [eyes, setEyes] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const clientX = e.clientX;
      const clientY = e.clientY;
      const centerX = window.innerWidth / 2;
      const centerY = 150; 
      const maxDist = 300;
      const dx = Math.max(-maxDist, Math.min(maxDist, clientX - centerX)) / maxDist;
      const dy = Math.max(-maxDist, Math.min(maxDist, clientY - centerY)) / maxDist;
      setEyes({ x: dx, y: dy });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return { eyes };
};

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { eyes } = useMascotBehavior();
  
  const [feedGifts, setFeedGifts] = useState<Gift[]>([]);
  const [cozyGifts, setCozyGifts] = useState<Gift[]>([]);
  const [techGifts, setTechGifts] = useState<Gift[]>([]);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [feed, cozy, tech] = await Promise.all([
          api.gifts.list({ limit: 8 }),
          api.gifts.list({ limit: 6, tag: 'уют' }), 
          api.gifts.list({ limit: 6, tag: 'технологии' }) 
        ]);
        setFeedGifts(feed);
        setCozyGifts(cozy);
        setTechGifts(tech);
      } catch (e) {
        console.error("Failed to fetch home data", e);
      }
    };
    fetchData();
  }, []);

  const startQuiz = () => {
    track('start_quiz', { source: 'concierge_search' });
    navigate('/quiz');
  };

  const handleCategory = (cat: string) => {
    track('category_click', { cat });
    navigate('/quiz');
  };

  const openGift = (gift: Gift) => {
    track('home_gift_click', { id: gift.id });
    setSelectedGift(gift);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden pb-12">
      
      {/* Top Bar - Transparent & Minimal */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/80 to-transparent px-6 py-4 flex justify-between items-center backdrop-blur-[2px]">
          <div 
            className="flex items-center gap-2 cursor-pointer opacity-90" 
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          >
            <span className="font-serif italic font-bold text-2xl tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
                Gifty.
            </span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 mb-8 mt-24 px-4 text-center">
        <div className="flex justify-center mb-6">
           <div className="relative animate-float">
              <Mascot 
                  className="w-40 h-40 hover:scale-105 transition-transform duration-700 cursor-pointer" 
                  emotion="happy"
                  eyesX={eyes.x}
                  eyesY={eyes.y}
              />
              <div className="absolute inset-0 bg-indigo-500/20 blur-[50px] -z-10 rounded-full"></div>
           </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-serif text-white mb-2 leading-tight">
          Искусство <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
            Дарить Эмоции
          </span>
        </h1>
        
        <p className="text-white/60 text-sm mb-8 font-light max-w-xs mx-auto">
          Ваш персональный AI ассистент для выбора незабываемых подарков.
        </p>

        <SearchTrigger onClick={startQuiz} />
        <CategoryPills onSelect={handleCategory} />
      </div>

      <HorizontalSection 
        id="section-cozy"
        title="Уют и Тепло" 
        subtitle="Атмосферные вещи для дома"
        gifts={cozyGifts} 
        onGiftClick={openGift}
      />

      <HorizontalSection 
        id="section-tech"
        title="Технологии" 
        subtitle="Инновации и гаджеты"
        gifts={techGifts} 
        onGiftClick={openGift}
      />

      {/* Feed Section - Masonry-ish */}
      <div className="relative z-10 px-4 mt-8">
        <div className="flex items-center gap-4 mb-8">
           <div className="h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent flex-grow"></div>
           <div className="font-serif text-xl italic text-white/80">Вдохновение</div>
           <div className="h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent flex-grow"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
           {/* CTA Card */}
           <div 
             onClick={startQuiz}
             className="col-span-2 relative overflow-hidden rounded-3xl p-8 flex flex-col justify-center items-start min-h-[240px] cursor-pointer group border border-white/10"
           >
              {/* Animated Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-black opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>

              <div className="relative z-10">
                <span className="inline-block text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-2">
                  AI Подбор
                </span>
                <h3 className="text-white font-serif text-3xl mb-4 leading-tight">
                   Затрудняетесь <br/> с выбором?
                </h3>
                <p className="text-white/70 text-sm font-light mb-6 max-w-xs">
                   Пройдите короткий опрос, и наш алгоритм подберет что-то особенное.
                </p>
                <button className="bg-white text-black px-6 py-3 rounded-full font-semibold text-sm hover:bg-indigo-50 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                    Начать подбор
                </button>
              </div>
           </div>

           {feedGifts.map((gift) => (
             <div key={gift.id} className="h-auto">
                <GiftCard gift={gift} onClick={openGift} />
             </div>
           ))}
        </div>
        
        <div className="mt-16 text-center pb-8">
            <Button variant="secondary" onClick={startQuiz}>
               Показать еще
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