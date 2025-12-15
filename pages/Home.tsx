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
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const feed = await api.gifts.list({ limit: 8 });
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
    <div className="min-h-screen relative overflow-hidden">
      
      {/* 1. ANTI-HERO */}
      <section className="mb-32 mt-12 relative">
         {/* Background Giant Text */}
         <h1 className="font-display font-black text-[12vw] leading-[0.8] tracking-tighter uppercase text-gray-100 absolute -top-10 -left-10 z-0 select-none pointer-events-none">
             Consume<br/>Consume<br/>Consume
         </h1>

         <div className="relative z-10 pl-4 sm:pl-12 pt-8">
             <div className="inline-block bg-black text-white px-2 py-1 font-mono text-xs mb-4 -rotate-2">
                 BETA v.0.0.1 (Unstable)
             </div>
             
             <h2 className="font-display font-bold text-5xl sm:text-7xl leading-[0.9] mb-8 mix-blend-exclusion text-white sm:text-black">
                 We judge<br/>
                 your friends.<br/>
                 <span className="text-stroke text-outline text-black sm:text-gray-400">So you don't have to.</span>
             </h2>

             <div className="max-w-md bg-white border-2 border-black p-6 shadow-[8px_8px_0px_#000] rotate-1">
                <p className="font-mono text-sm mb-4">
                    Buying gifts is a social ritual designed to prove affection through material exchange. Our algorithms minimize the risk of social rejection.
                </p>
                <Button variant="primary" onClick={startQuiz}>
                    Initiate Protocol
                </Button>
                <div className="mt-2 text-[10px] text-gray-500">
                    * Results may vary based on your honesty.
                </div>
             </div>
         </div>
         
         <Mascot emotion="cool" className="absolute right-0 top-20 hidden sm:block rotate-12" />
      </section>

      {/* 2. CHAOTIC FEED */}
      <section className="relative z-10 px-2">
          <div className="flex justify-between items-end border-b-4 border-black mb-12">
              <h3 className="font-display font-black text-4xl uppercase">
                  Objects
              </h3>
              <span className="font-mono text-xs bg-acid-green px-2 mb-2">
                  Live Feed // Not Curated
              </span>
          </div>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
              {feedGifts.map((gift, index) => (
                  <div key={gift.id} className="break-inside-avoid">
                      <GiftCard 
                        gift={gift} 
                        variant={index % 2 === 0 ? 'brutal' : 'minimal'}
                        onClick={openGift} 
                      />
                  </div>
              ))}
          </div>

          <div className="mt-32 text-center relative">
              <div className="absolute top-1/2 left-0 w-full h-px bg-black -z-10"></div>
              <Button variant="secondary" onClick={startQuiz} className="rotate-3">
                  I demand more options
              </Button>
          </div>
      </section>

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