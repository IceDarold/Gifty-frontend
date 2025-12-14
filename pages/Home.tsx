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
      
      {/* HERO SECTION: Title Screen */}
      <div className="text-center mb-12 relative border-4 border-dashed border-gray-700 p-8 bg-black/50">
        
        <div className="flex justify-center mb-6">
            <Mascot emotion="happy" className="w-24 h-24" />
        </div>

        <h1 className="font-pixel text-4xl md:text-5xl text-yellow-400 mb-4 drop-shadow-[4px_4px_0_rgba(180,50,50,1)] leading-relaxed">
            GIFTY<br/>QUEST
        </h1>
        
        <div className="font-console text-2xl text-green-400 mb-8 animate-pulse">
            PRESS START TO FIND GIFT
        </div>

        {/* Start Button */}
        <div className="flex justify-center">
            <Button variant="primary" onClick={startQuiz} className="text-sm px-8 py-4 animate-bounce">
                START GAME
            </Button>
        </div>

        {/* Decorative 'Copyright' */}
        <div className="mt-8 font-pixel text-[8px] text-gray-500">
            © 2025 AI CORP. ALL RIGHTS RESERVED.
        </div>
      </div>

      {/* MARQUEE BANNER */}
      <div className="bg-yellow-400 text-black font-pixel text-xs py-2 overflow-hidden border-y-4 border-black mb-12">
          <div className="whitespace-nowrap animate-scanline flex gap-8" style={{ animation: 'marquee 10s linear infinite' }}>
              <span>★ NEW ITEMS AVAILABLE ★</span>
              <span>★ LEVEL UP YOUR GIFTING ★</span>
              <span>★ CRITICAL HIT DEALS ★</span>
              <span>★ NEW ITEMS AVAILABLE ★</span>
              <span>★ LEVEL UP YOUR GIFTING ★</span>
          </div>
          <style>{`@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
      </div>

      {/* HORIZONTAL SCROLL: "RARE LOOT" */}
      <div className="mb-12">
          <div className="flex items-center justify-between px-2 mb-4">
              <h2 className="font-pixel text-sm text-white flex items-center gap-2">
                  <span className="text-yellow-400">★</span> RARE LOOT
              </h2>
          </div>
          
          <div className="flex overflow-x-auto gap-4 pb-8 px-2 no-scrollbar snap-x">
            {techGifts.map((gift) => (
                <div key={gift.id} className="min-w-[220px] w-[220px] snap-center">
                    <GiftCard gift={gift} onClick={openGift} />
                </div>
            ))}
          </div>
      </div>

      {/* GRID: "WORLD MAP" */}
      <div className="px-2">
        <div className="border-b-4 border-white mb-8 pb-2">
            <h2 className="font-pixel text-sm text-white">WORLD MAP ITEMS</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
           {/* CTA Box */}
           <div 
             onClick={startQuiz}
             className="col-span-2 bg-retro-primary border-4 border-white p-6 text-white text-center shadow-pixel cursor-pointer hover:bg-blue-600 group relative overflow-hidden"
           >
              <div className="relative z-10">
                  <h3 className="font-pixel text-sm mb-4 text-yellow-300">NEED A GUIDE?</h3>
                  <p className="font-console text-xl mb-4">Let the AI Wizard help you choose.</p>
                  <span className="inline-block border-2 border-white px-4 py-2 font-pixel text-[10px] group-hover:bg-white group-hover:text-blue-600 transition-colors">
                      CONSULT WIZARD
                  </span>
              </div>
              {/* Pixel Pattern BG */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(white 2px, transparent 2px)', backgroundSize: '8px 8px' }}></div>
           </div>

           {feedGifts.map((gift) => (
             <div key={gift.id}>
                <GiftCard gift={gift} onClick={openGift} />
             </div>
           ))}
        </div>
        
        <div className="mt-12 text-center">
            <Button variant="secondary" onClick={startQuiz}>
               LOAD MORE...
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