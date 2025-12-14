import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Mascot } from '../components/Mascot';
import { GiftCard } from '../components/GiftCard';
import { GiftDetailsModal } from '../components/GiftDetailsModal';
import { api } from '../api';
import { Gift } from '../domain/types';
import { track } from '../utils/analytics';

const RansomChar: React.FC<{ char: string; color: string; rotate: string }> = ({ char, color, rotate }) => (
    <span 
        className={`inline-block w-10 h-12 ${color} text-center leading-[3rem] font-marker text-3xl text-[#2b2b2b] shadow-sm mx-0.5 border-2 border-dashed border-white/20`}
        style={{ transform: rotate, clipPath: 'polygon(5% 0%, 100% 10%, 95% 100%, 0% 90%)' }}
    >
        {char}
    </span>
);

const StickerBtn: React.FC<{ text: string; color: string; onClick: () => void }> = ({ text, color, onClick }) => (
    <button 
        onClick={onClick}
        className={`${color} px-4 py-2 font-marker text-lg text-white shadow-float transform hover:scale-110 hover:z-50 transition-all duration-200`}
        style={{ 
            clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)',
            transform: `rotate(${Math.random() * 10 - 5}deg)`
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
    <div className="min-h-screen relative">
      
      {/* Header Area: Ransom Note Style */}
      <div className="pt-12 px-2 text-center mb-12 relative z-10">
        
        {/* Mascot pinned to the side */}
        <div className="absolute top-0 left-[-10px] transform -rotate-12 z-20">
            <Mascot className="w-24 h-24" emotion="cool" />
            <div className="tape-strip" style={{ top: '10px', left: '20px', width: '40px' }}></div>
        </div>

        {/* Title */}
        <div className="flex justify-center flex-wrap gap-1 mb-4">
            <RansomChar char="G" color="bg-[#ff6b6b]" rotate="rotate(-5deg)" />
            <RansomChar char="I" color="bg-[#4d96ff]" rotate="rotate(3deg)" />
            <RansomChar char="F" color="bg-[#ffeb3b]" rotate="rotate(-2deg)" />
            <RansomChar char="T" color="bg-[#6bcb77]" rotate="rotate(4deg)" />
            <RansomChar char="Y" color="bg-[#9c27b0]" rotate="rotate(-6deg)" />
            <span className="w-4"></span>
            <span className="font-doodle text-4xl mt-2 animate-wiggle-slow">?</span>
        </div>
        
        <p className="font-sans text-2xl text-craft-ink mb-6 transform rotate-1 inline-block bg-white px-2 shadow-sm">
          ИИ-помощник, который <span className="text-craft-red font-bold underline decoration-wavy">шарит</span>
        </p>

        {/* Search Bar - Looks like a torn envelope */}
        <div 
            onClick={startQuiz}
            className="mx-4 bg-white p-4 shadow-float cursor-pointer hover:scale-105 transition-transform relative group torn-bottom torn-top"
        >
             <div className="tape-strip" style={{ top: '-10px', left: '50%', transform: 'translateX(-50%) rotate(90deg)', width: '40px' }}></div>
             <div className="flex items-center gap-4">
                <span className="text-4xl group-hover:animate-spin">🔎</span>
                <div className="text-left">
                    <div className="font-marker text-xl text-[#2b2b2b]">НАЙТИ ПОДАРОК</div>
                    <div className="font-sans text-lg text-gray-500">Маме, другу, коту...</div>
                </div>
             </div>
        </div>

        {/* Stickers Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mt-8 px-4">
            <StickerBtn text="🔥 ХАЙП" color="bg-[#ff6b6b]" onClick={() => navigate('/quiz')} />
            <StickerBtn text="🎮 ГИК" color="bg-[#4d96ff]" onClick={() => navigate('/quiz')} />
            <StickerBtn text="🏡 УЮТ" color="bg-[#6bcb77]" onClick={() => navigate('/quiz')} />
        </div>
      </div>

      {/* Featured Section: Corkboard style */}
      <div className="mb-16 relative">
          <h2 className="font-marker text-3xl ml-6 mb-4 transform -rotate-2 marker-highlight inline-block">
              ТОПЧИК
          </h2>
          <div className="flex overflow-x-auto gap-8 px-8 pb-12 pt-4 no-scrollbar items-center">
            {techGifts.map((gift) => (
                <div key={gift.id} className="min-w-[200px] w-[200px] shrink-0">
                    <GiftCard gift={gift} onClick={openGift} />
                </div>
            ))}
          </div>
      </div>

      {/* Feed Section: Scattered papers */}
      <div className="px-4 pb-12">
        <div className="text-center mb-8">
            <h2 className="font-marker text-2xl inline-block border-b-4 border-[#2b2b2b] transform rotate-1">
                ЕЩЕ ИДЕИ 👇
            </h2>
        </div>

        <div className="grid grid-cols-2 gap-8">
           {/* CTA Doodle */}
           <div 
             onClick={startQuiz}
             className="col-span-2 bg-transparent border-4 border-dashed border-[#2b2b2b] rounded-none p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/20 transition-colors group h-40"
             style={{ borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px' }}
           >
              <h3 className="font-doodle text-3xl font-bold group-hover:scale-110 transition-transform">???</h3>
              <p className="font-sans text-2xl text-[#2b2b2b]">Не знаешь что брать?</p>
              <span className="font-marker text-craft-red mt-2">ЖМИ СЮДА</span>
           </div>

           {feedGifts.map((gift) => (
             <div key={gift.id} className="h-auto">
                <GiftCard gift={gift} onClick={openGift} />
             </div>
           ))}
        </div>
        
        <div className="mt-16 text-center">
            <Button variant="ghost" onClick={startQuiz}>
               БОЛЬШЕ НЕТ... (или есть?)
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