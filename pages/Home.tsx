import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GiftCard } from '../components/GiftCard';
import { GiftDetailsModal } from '../components/GiftDetailsModal';
import { api } from '../api';
import { Gift } from '../domain/types';
import { track } from '../utils/analytics';
import { Mascot } from '../components/Mascot';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [feedGifts, setFeedGifts] = useState<Gift[]>([]);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const feed = await api.gifts.list({ limit: 6 });
        setFeedGifts(feed);
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
    <div className="relative w-full h-full flex flex-col items-center">
      
      {/* 1. CENTRAL OBJECT: The "Magic Box" (Quiz Starter) */}
      <div className="mt-12 mb-24 relative group cursor-pointer" onClick={startQuiz}>
         {/* Shadow */}
         <div className="absolute bottom-0 left-4 right-4 h-4 bg-black/20 blur-xl rounded-[50%] transition-all duration-500 group-hover:scale-110 group-hover:bg-black/30"></div>
         
         {/* The Box */}
         <div className="relative w-64 h-48 bg-cardboard rounded-lg shadow-2xl transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-1 flex items-center justify-center border-t border-white/20">
             {/* Flaps */}
             <div className="absolute top-0 left-0 w-1/2 h-full bg-black/5 rounded-l-lg origin-left transform group-hover:rotate-y-12 transition-transform"></div>
             <div className="absolute top-0 right-0 w-1/2 h-full bg-black/10 rounded-r-lg origin-right transform group-hover:-rotate-y-12 transition-transform"></div>
             
             {/* Sticker */}
             <div className="z-10 bg-white p-4 shadow-sm rotate-[-2deg] transform transition-transform group-hover:rotate-[2deg]">
                 <h2 className="font-handwritten text-4xl font-bold text-stamp-red">Подобрать</h2>
                 <p className="font-typewriter text-xs text-pencil text-center mt-1">Нажми, чтобы открыть</p>
             </div>
             
             {/* Mascot peering out */}
             <div className="absolute -top-12 right-4 transition-transform duration-300 group-hover:-translate-y-4">
                 <Mascot emotion="happy" className="scale-75 rotate-12" />
             </div>
         </div>
      </div>

      {/* 2. SCATTERED OBJECTS: The Feed */}
      <div className="w-full max-w-5xl relative">
          <h3 className="font-handwritten text-3xl text-pencil mb-8 ml-8 -rotate-2 inline-block border-b-2 border-pencil/20 pb-1">
              Недавние находки:
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 sm:gap-16 px-4">
              {feedGifts.map((gift, index) => {
                  // Generate random rotation for natural feel
                  const rotation = index % 2 === 0 ? 'rotate-2' : '-rotate-1';
                  const offset = index % 3 === 0 ? 'translate-y-4' : 'translate-y-0';
                  
                  return (
                      <div key={gift.id} className={`${rotation} ${offset} transition-all duration-300 hover:z-20 hover:scale-105 hover:rotate-0`}>
                          <GiftCard 
                            gift={gift} 
                            variant="polaroid"
                            onClick={openGift} 
                          />
                      </div>
                  );
              })}
          </div>
      </div>

      {/* 3. RANDOM DESK ITEMS (Decor) */}
      <div className="absolute top-20 left-4 w-32 h-32 bg-yellow-200/20 rounded-full blur-2xl pointer-events-none"></div>
      <div className="fixed top-32 right-8 hidden xl:block pointer-events-none">
          <div className="w-24 h-24 border-4 border-black/10 rounded-full"></div> {/* Coffee stain */}
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