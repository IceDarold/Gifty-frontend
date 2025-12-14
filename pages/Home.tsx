import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Mascot } from '../components/Mascot';
import { GiftCard } from '../components/GiftCard';
import { GiftDetailsModal } from '../components/GiftDetailsModal';
import { api } from '../api';
import { Gift } from '../domain/types';
import { track } from '../utils/analytics';

const CutoutLetter: React.FC<{ char: string; color: string; rot: number }> = ({ char, color, rot }) => (
    <span 
        className={`inline-flex items-center justify-center w-10 h-12 ${color} shadow-sm border border-black/10 font-marker text-4xl text-black`}
        style={{ 
            transform: `rotate(${rot}deg)`, 
            clipPath: 'polygon(0% 5%, 100% 0%, 95% 100%, 5% 95%)' 
        }}
    >
        {char}
    </span>
);

const PaperSticker: React.FC<{ text: string; onClick: () => void; rotate: number }> = ({ text, onClick, rotate }) => (
    <button 
        onClick={onClick}
        className="bg-white texture-paper border border-gray-200 px-4 py-2 shadow-close font-typewriter text-sm font-bold hover:scale-105 transition-transform"
        style={{ transform: `rotate(${rotate}deg)` }}
    >
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-6 bg-green-200/50 backdrop-blur-sm" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}></div>
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
    <div className="min-h-screen pb-20">
      
      {/* HEADER: Ransom Note Style */}
      <div className="pt-12 px-4 text-center mb-16 relative">
        <div className="flex justify-center gap-1 mb-2 transform -rotate-2">
            <CutoutLetter char="G" color="bg-marker-red" rot={-5} />
            <CutoutLetter char="I" color="bg-white" rot={3} />
            <CutoutLetter char="F" color="bg-marker-yellow" rot={-2} />
            <CutoutLetter char="T" color="bg-black text-white" rot={4} />
            <CutoutLetter char="Y" color="bg-marker-blue" rot={-6} />
        </div>
        
        <div className="inline-block bg-white p-2 shadow-lifted transform rotate-2">
            <p className="font-typewriter text-xs tracking-widest uppercase">ИИ-Помощник v.2.0</p>
        </div>

        {/* Mascot pinned */}
        <div className="absolute top-0 right-2 w-24 h-24 transform rotate-12 z-20">
             <div className="tape" style={{top: '-10px', left: '30%', width: '40px'} as any}></div>
             <Mascot emotion="cool" />
        </div>

        {/* SEARCH: Napkin Doodle */}
        <div 
            onClick={startQuiz}
            className="mt-8 mx-auto max-w-xs bg-white texture-paper p-6 shadow-lifted cursor-pointer hover:rotate-1 transition-transform relative"
            style={{ borderRadius: '2px', clipPath: 'polygon(0 0, 100% 2%, 98% 100%, 2% 98%)' }}
        >
             {/* Coffee ring stain */}
             <div className="absolute -top-4 -right-4 w-20 h-20 border-[6px] border-[#d7ccc8] rounded-full opacity-40 pointer-events-none"></div>
             
             <div className="flex items-center gap-4">
                 <div className="text-5xl animate-bounce">🧐</div>
                 <div className="text-left">
                     <div className="font-hand text-3xl font-bold leading-none">Найти...</div>
                     <div className="font-hand text-xl text-gray-500">подарок срочно!</div>
                 </div>
             </div>
             
             <div className="absolute bottom-2 right-2 font-marker text-red-500 transform -rotate-12 opacity-80">ЖМИ!</div>
        </div>

        {/* Stickers */}
        <div className="flex justify-center gap-6 mt-10">
            <PaperSticker text="#тренды" onClick={() => navigate('/quiz')} rotate={-5} />
            <PaperSticker text="#для_гиков" onClick={() => navigate('/quiz')} rotate={5} />
        </div>
      </div>

      {/* HORIZONTAL SCROLL: Corkboard Strip */}
      <div className="mb-16 py-8 bg-paper-kraft texture-kraft relative shadow-inner border-y-4 border-[#8d6e63]">
          <div className="absolute -top-5 left-4 bg-white p-2 shadow-md transform -rotate-3 z-10">
              <span className="font-marker text-2xl text-red-600">ТОПЧИК 🔥</span>
              <div className="absolute -top-3 left-1/2 w-3 h-3 bg-gray-400 rounded-full shadow-sm border border-gray-500"></div> {/* Pushpin */}
          </div>
          
          <div className="flex overflow-x-auto gap-8 px-8 pb-4 pt-2 no-scrollbar items-center">
            {techGifts.map((gift) => (
                <div key={gift.id} className="min-w-[200px] w-[200px] shrink-0">
                    <GiftCard gift={gift} onClick={openGift} />
                </div>
            ))}
          </div>
      </div>

      {/* GRID: Scattered on Desk */}
      <div className="px-4">
        <div className="text-center mb-10">
            <span className="bg-black text-white px-4 py-2 font-typewriter text-xl font-bold transform rotate-1 inline-block">
                ЕЩЁ ИДЕИ
            </span>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-12">
           {/* CTA Card */}
           <div 
             onClick={startQuiz}
             className="col-span-2 bg-transparent border-4 border-dashed border-gray-400 p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/10 transition-colors h-48 rounded-3xl"
           >
              <h3 className="font-marker text-3xl text-gray-600 mb-2">Ничего не нравится?</h3>
              <Button variant="primary">ПРОЙТИ ТЕСТ</Button>
           </div>

           {feedGifts.map((gift) => (
             <div key={gift.id} className="h-auto">
                <GiftCard gift={gift} onClick={openGift} />
             </div>
           ))}
        </div>
        
        <div className="mt-20 text-center">
            <button onClick={startQuiz} className="font-hand text-3xl text-gray-500 hover:text-black underline decoration-wavy decoration-red-400">
               Показать больше...
            </button>
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