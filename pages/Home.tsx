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
    <div className="min-h-screen">
      
      {/* 1. HERO / POETRY */}
      <section className="mb-24 pt-12 animate-reveal">
         <div className="flex flex-col gap-6">
             <Mascot emotion="thinking" className="self-start mb-8" />
             
             <h1 className="font-serif text-4xl sm:text-6xl font-light leading-[1.1] text-ink max-w-lg">
                I calculate feelings.<br/>
                <span className="text-graphite">Then I find objects.</span>
             </h1>

             <div className="max-w-md font-mono text-sm leading-relaxed text-graphite mt-4 border-l border-ink/20 pl-4">
                <p className="mb-4">
                    Gift-giving is a data problem. Input: Person, Age, Context.
                    Output: The perfect object to convey emotion.
                </p>
                <p>
                    Let me process your request.
                </p>
             </div>

             <div className="mt-8">
                 <Button variant="primary" onClick={startQuiz}>
                     Initialize Search
                 </Button>
             </div>
         </div>
      </section>

      {/* 2. FEED / DATA STREAM */}
      <section>
          <div className="flex items-baseline justify-between mb-12 border-b border-ink pb-4">
              <h2 className="font-mono text-xs uppercase tracking-widest">
                  Live_Data_Stream
              </h2>
              <span className="font-mono text-xs text-accent animate-pulse">
                  ● Processing
              </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-16">
              {feedGifts.map((gift, index) => (
                  <div key={gift.id} className={index % 3 === 0 ? 'sm:mt-12' : ''}>
                      <GiftCard 
                        gift={gift} 
                        featured={index === 0}
                        onClick={openGift} 
                      />
                  </div>
              ))}
          </div>

          <div className="mt-24 text-center">
              <Button variant="ghost" onClick={startQuiz}>
                  View Complete Database
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