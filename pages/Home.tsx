import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Mascot } from '../components/Mascot';
import { GiftCard } from '../components/GiftCard';
import { GiftDetailsModal } from '../components/GiftDetailsModal';
import { api } from '../api';
import { Gift } from '../domain/types';
import { track } from '../utils/analytics';

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
    <div className="min-h-screen">
      
      {/* HERO SECTION */}
      <div className="text-center mb-10 pt-4">
        
        <div className="inline-block mb-4">
            <h1 className="text-5xl font-black text-[#2d3436] tracking-tight drop-shadow-sm">
                Gifty<span className="text-[#6c5ce7]">.ai</span>
            </h1>
        </div>
        
        <div className="flex justify-center my-6 relative">
            {/* Background Blob behind mascot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white rounded-full shadow-clay -z-10"></div>
            <Mascot emotion="happy" className="w-40 h-40 animate-bounce-slow" />
        </div>

        <p className="text-gray-500 font-bold text-lg mb-8 px-8">
            Подберем подарок так, будто вы знали о нем всю жизнь.
        </p>

        {/* Big Search Bubble */}
        <div 
            onClick={startQuiz}
            className="mx-4 bg-[#f0f2f5] rounded-[2rem] p-3 shadow-clay flex items-center justify-between cursor-pointer transition-transform hover:scale-105 active:scale-95 group"
        >
             <div className="flex flex-col text-left pl-4">
                 <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Найти для кого?</span>
                 <span className="text-xl text-[#2d3436] font-extrabold group-hover:text-[#6c5ce7]">Мама, друг, коллега...</span>
             </div>
             
             <div className="w-14 h-14 bg-[#6c5ce7] rounded-full flex items-center justify-center shadow-lg text-white group-hover:bg-[#5f4dd0]">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
             </div>
        </div>
      </div>

      {/* Categories (Pills) */}
      <div className="flex overflow-x-auto gap-3 pb-8 px-2 no-scrollbar">
          {['🏠 Уют', '💻 Гаджеты', '🎨 Хобби', '⚽ Спорт'].map((cat, i) => (
             <button 
                key={cat}
                onClick={startQuiz}
                className="whitespace-nowrap px-6 py-3 rounded-[2rem] bg-[#f0f2f5] font-bold text-[#636e72] shadow-clay-sm active:shadow-clay-pressed"
             >
                 {cat}
             </button>
          ))}
      </div>

      {/* HORIZONTAL SECTION */}
      <div className="mb-10 pl-2">
          <div className="flex items-center justify-between pr-6 mb-4">
              <h2 className="text-2xl font-black text-[#2d3436]">
                  Тренды
              </h2>
          </div>
          
          <div className="flex overflow-x-auto gap-5 pb-8 pt-2 px-4 no-scrollbar snap-x -ml-4">
            {techGifts.map((gift) => (
                <div key={gift.id} className="min-w-[200px] w-[200px] snap-center first:pl-4 last:pr-4">
                    <GiftCard gift={gift} onClick={openGift} />
                </div>
            ))}
          </div>
      </div>

      {/* MAIN GRID */}
      <div className="px-2">
        <h2 className="text-2xl font-black text-[#2d3436] mb-6 px-2">Лента идей</h2>

        <div className="grid grid-cols-2 gap-4">
           {/* CTA CARD */}
           <div 
             onClick={startQuiz}
             className="col-span-2 bg-[#a29bfe] rounded-[2.5rem] p-8 text-white text-center shadow-[10px_10px_20px_rgba(162,155,254,0.4)] relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform"
           >
              {/* Inset Circles Decor */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>

              <div className="relative z-10">
                  <h3 className="text-3xl font-black mb-2">Не знаешь что подарить?</h3>
                  <p className="mb-6 font-bold opacity-90 text-lg">Запусти наш ИИ-квиз</p>
                  <div className="inline-block px-8 py-3 bg-white text-[#6c5ce7] rounded-full font-black shadow-lg">
                      Начать
                  </div>
              </div>
           </div>

           {feedGifts.map((gift) => (
             <div key={gift.id}>
                <GiftCard gift={gift} onClick={openGift} />
             </div>
           ))}
        </div>
        
        <div className="mt-12 text-center">
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