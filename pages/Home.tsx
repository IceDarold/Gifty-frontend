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
      
      {/* HEADER SECTION */}
      <div className="pt-10 px-4 text-center mb-10 relative">
        {/* Title */}
        <div className="relative inline-block">
            <h1 className="text-5xl font-bold tracking-tight text-white drop-shadow-md">
                Gifty<span className="text-aero-grass">AI</span>
            </h1>
            {/* Reflection of text */}
            <h1 className="text-5xl font-bold tracking-tight text-white absolute top-full left-0 opacity-20 transform scale-y-[-1] mask-image-gradient">
                Gifty<span className="text-aero-grass">AI</span>
            </h1>
        </div>
        
        <p className="text-blue-900/80 font-medium mt-2 drop-shadow-sm">
            Ваш умный помощник в мире подарков
        </p>

        {/* Mascot */}
        <div className="flex justify-center my-6">
            <Mascot emotion="happy" className="w-32 h-32 animate-float" />
        </div>

        {/* GLOSSY SEARCH BAR */}
        <div 
            onClick={startQuiz}
            className="mt-6 mx-auto max-w-sm bg-white/70 backdrop-blur-xl border border-white rounded-full p-2 pl-6 shadow-glow flex items-center justify-between cursor-pointer transition-transform hover:scale-105 group"
        >
             <div className="flex flex-col text-left">
                 <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Найти подарок</span>
                 <span className="text-lg text-blue-600 font-semibold group-hover:text-blue-500">Маме, другу, коллеге...</span>
             </div>
             
             {/* Go Button */}
             <div className="w-12 h-12 bg-gradient-to-b from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg border border-green-300 group-hover:brightness-110">
                 <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
             </div>
        </div>

        {/* Tags / Pills */}
        <div className="flex justify-center gap-3 mt-6">
            {['#Тренды', '#Гаджеты', '#Уют'].map(tag => (
                <button 
                    key={tag}
                    onClick={() => navigate('/quiz')}
                    className="px-4 py-1.5 rounded-full bg-white/40 border border-white/60 text-blue-800 text-sm font-bold shadow-sm backdrop-blur-md hover:bg-white/70 transition-colors"
                >
                    {tag}
                </button>
            ))}
        </div>
      </div>

      {/* HORIZONTAL SCROLL: "Fresh" Section */}
      <div className="mb-10 pl-4">
          <div className="flex items-center justify-between pr-4 mb-3">
              <h2 className="text-xl font-bold text-white drop-shadow-md flex items-center gap-2">
                  <span className="bg-green-400 p-1 rounded-md shadow-sm">⚡</span>
                  Выбор технологий
              </h2>
          </div>
          
          <div className="flex overflow-x-auto gap-4 pb-8 pt-2 no-scrollbar snap-x">
            {techGifts.map((gift) => (
                <div key={gift.id} className="min-w-[180px] w-[180px] snap-center">
                    <GiftCard gift={gift} onClick={openGift} />
                </div>
            ))}
          </div>
      </div>

      {/* MAIN GRID */}
      <div className="px-4 bg-white/30 backdrop-blur-md rounded-t-[2.5rem] pt-8 pb-20 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border-t border-white/40">
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-blue-900">Свежие идеи</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto mt-2 rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           {/* CTA Box */}
           <div 
             onClick={startQuiz}
             className="col-span-2 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-3xl p-6 text-white text-center shadow-lg relative overflow-hidden group cursor-pointer"
           >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2">Не знаете что выбрать?</h3>
                  <p className="mb-4 opacity-90">Наш ИИ подберет идеальный вариант за 30 секунд</p>
                  <div className="inline-block px-6 py-2 bg-white text-blue-600 rounded-full font-bold shadow-md group-hover:scale-105 transition-transform">
                      Пройти тест
                  </div>
              </div>
              {/* Decor Bubbles */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
           </div>

           {feedGifts.map((gift) => (
             <div key={gift.id}>
                <GiftCard gift={gift} onClick={openGift} />
             </div>
           ))}
        </div>
        
        <div className="mt-12 text-center">
            <Button variant="secondary" onClick={startQuiz}>
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