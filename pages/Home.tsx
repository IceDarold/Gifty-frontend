import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Mascot } from '../components/Mascot';
import { GiftCard } from '../components/GiftCard';
import { GiftDetailsModal } from '../components/GiftDetailsModal';
import { api } from '../api';
import { Gift } from '../domain/types';
import { track } from '../utils/analytics';

const SearchNote: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div 
    onClick={onClick}
    className="mx-4 mb-10 bg-white border border-gray-200 p-4 shadow-paper transform rotate-1 cursor-pointer hover:rotate-0 transition-transform relative"
  >
    {/* Paper Clip */}
    <div className="absolute -top-3 right-8 w-4 h-10 border-2 border-gray-400 rounded-full bg-transparent z-10"></div>
    
    <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-2xl bg-paper-bg">
            🔍
        </div>
        <div>
            <div className="font-display text-2xl font-bold text-paper-ink">Кому ищем подарок?</div>
            <div className="font-sans text-gray-500 text-lg leading-none">Мама, друг или коллега...</div>
        </div>
    </div>
  </div>
);

const Sticker: React.FC<{ text: string; color: string; onClick: () => void }> = ({ text, color, onClick }) => (
    <button 
        onClick={onClick}
        className={`${color} px-4 py-2 font-display text-xl text-paper-ink shadow-sm transform hover:-translate-y-1 hover:scale-105 transition-all duration-200`}
        style={{ 
            clipPath: 'polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)',
            transform: `rotate(${Math.random() * 6 - 3}deg)`
        }}
    >
        {text}
    </button>
);

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [feedGifts, setFeedGifts] = useState<Gift[]>([]);
  const [techGifts, setTechGifts] = useState<Gift[]>([]);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <div className="min-h-screen relative overflow-x-hidden">
      
      {/* Hero Doodle */}
      <div className="pt-8 px-4 text-center mb-8 relative">
        <div className="absolute top-0 left-4 w-full h-full border-l border-dashed border-red-200 pointer-events-none"></div>
        
        <div className="inline-block relative">
            <Mascot className="w-28 h-28" emotion="excited" />
            <div className="absolute -top-4 -right-8">
                <div className="bg-white border border-gray-300 p-2 rounded-xl rounded-bl-none shadow-sm text-sm font-sans transform rotate-6">
                    Привет! 👋
                </div>
            </div>
        </div>

        <h1 className="font-display font-bold text-5xl text-paper-ink mt-4 mb-2 relative z-10">
          <span className="relative inline-block">
             Gifty
             <svg className="absolute -bottom-2 left-0 w-full h-3 text-paper-yellow opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" /></svg>
          </span>
        </h1>
        <p className="font-sans text-xl text-gray-600 mb-8 max-w-xs mx-auto">
          Я помогу найти что-то особенное.
        </p>

        <SearchNote onClick={startQuiz} />

        <div className="flex flex-wrap justify-center gap-4 px-2">
            <Sticker text="🔥 Тренды" color="bg-paper-red/30" onClick={() => navigate('/quiz')} />
            <Sticker text="🎮 Техно" color="bg-paper-blue/30" onClick={() => navigate('/quiz')} />
            <Sticker text="🏡 Уют" color="bg-paper-green/30" onClick={() => navigate('/quiz')} />
        </div>
      </div>

      {/* "Pinned" Section (Featured) */}
      <div className="mb-12 relative">
          <div className="px-4 mb-4 flex items-center gap-2">
              <span className="text-2xl">📌</span>
              <h2 className="font-display font-bold text-3xl underline decoration-wavy decoration-paper-yellow">Популярное</h2>
          </div>
          <div className="flex overflow-x-auto gap-6 px-6 pb-12 pt-4 no-scrollbar">
            {techGifts.map((gift) => (
                <div key={gift.id} className="min-w-[180px] w-[180px] shrink-0">
                    <GiftCard gift={gift} onClick={openGift} />
                </div>
            ))}
          </div>
      </div>

      {/* Scrapbook Grid */}
      <div className="px-4 pb-12">
        <div className="flex items-center gap-2 mb-6 justify-center">
            <div className="h-px bg-gray-300 flex-grow"></div>
            <h2 className="font-display text-2xl text-gray-400">Свежие идеи</h2>
            <div className="h-px bg-gray-300 flex-grow"></div>
        </div>

        <div className="grid grid-cols-2 gap-6">
           {/* Doodle CTA */}
           <div 
             onClick={startQuiz}
             className="col-span-2 bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-paper-blue transition-colors group"
           >
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">🤔</div>
              <h3 className="font-display text-2xl font-bold">Ничего не подошло?</h3>
              <p className="font-sans text-lg text-gray-500 underline decoration-paper-blue decoration-2">Давай поищем вместе</p>
           </div>

           {feedGifts.map((gift) => (
             <div key={gift.id} className="h-auto">
                <GiftCard gift={gift} onClick={openGift} />
             </div>
           ))}
        </div>
        
        <div className="mt-12 text-center">
            <Button variant="ghost" onClick={startQuiz}>
               Листать дальше...
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