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
    className="group border border-cyber-green/50 bg-black p-4 cursor-pointer hover:bg-cyber-green/5 transition-all mx-4 mb-8 flex items-center gap-4 relative"
  >
    <div className="absolute -left-1 -top-1 w-2 h-2 border-l border-t border-cyber-green"></div>
    <div className="absolute -right-1 -bottom-1 w-2 h-2 border-r border-b border-cyber-green"></div>

    <span className="text-cyber-green font-mono font-bold animate-blink">{'>'}</span>
    <div className="flex-grow font-mono text-sm">
      <span className="text-cyber-gray">USER_QUERY: </span>
      <span className="text-white group-hover:text-cyber-green">INITIATE_GIFT_PROTOCOL();</span>
    </div>
    <div className="bg-cyber-green/20 px-2 py-1 text-[9px] text-cyber-green border border-cyber-green/50">
        ENTER
    </div>
  </div>
);

const CategoryPills: React.FC<{ onSelect: (tag: string) => void }> = ({ onSelect }) => {
  const categories = [
    'TRENDING', 'FOR_HER', 'FOR_HIM', 'HOME_OS', 'TECH', 'ART', 'KIDS_V2'
  ];

  return (
    <div className="flex overflow-x-auto gap-2 px-4 pb-4 no-scrollbar mb-4 border-b border-cyber-gray/20">
      {categories.map((cat, i) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className="bg-black border border-cyber-gray text-cyber-gray px-4 py-2 font-mono text-xs hover:border-cyber-green hover:text-cyber-green transition-colors uppercase tracking-tight whitespace-nowrap"
        >
          [{cat}]
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
    <div id={id} className="mb-10 relative z-10 px-0">
      <div className="px-4 mb-3 border-l-4 border-cyber-green ml-4">
         <h2 className="text-lg font-mono font-bold text-white uppercase tracking-wider">
            {title}
         </h2>
         {subtitle && <p className="text-cyber-dim text-[10px] font-mono">{subtitle}</p>}
      </div>
      <div className="flex overflow-x-auto gap-3 px-4 pb-4 no-scrollbar">
         {gifts.map((gift) => (
           <div key={gift.id} className="min-w-[160px] w-[160px] shrink-0">
              <GiftCard gift={gift} onClick={onGiftClick} />
           </div>
         ))}
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
      
      {/* Hero Section */}
      <div className="relative z-10 mb-8 mt-4 px-4 text-center">
        <div className="flex justify-center mb-4">
           <div className="relative p-4 border border-cyber-green/20 bg-cyber-black/50 backdrop-blur-sm">
              <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-cyber-green"></div>
              <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-cyber-green"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-cyber-green"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-cyber-green"></div>
              <Mascot 
                  className="w-32 h-32 cursor-pointer" 
                  emotion="happy"
                  eyesX={eyes.x}
                  eyesY={eyes.y}
              />
           </div>
        </div>
        
        <h1 className="text-3xl font-mono font-bold text-white mb-2 uppercase tracking-tight glitch-text">
          GIFTY_PROTOCOL<span className="text-cyber-green">.exe</span>
        </h1>
        
        <p className="text-cyber-dim text-xs font-mono mb-8 max-w-xs mx-auto">
          > INITIALIZING AI ASSISTANT...<br/>
          > OPTIMIZING FOR MAX_HAPPINESS...
        </p>

        <SearchTrigger onClick={startQuiz} />
        <CategoryPills onSelect={handleCategory} />
      </div>

      <HorizontalSection 
        id="section-tech"
        title=">> HARDWARE_UPGRADES" 
        subtitle="[CATEGORY: TECH]"
        gifts={techGifts} 
        onGiftClick={openGift}
      />

      <HorizontalSection 
        id="section-cozy"
        title=">> COMFORT_MODULES" 
        subtitle="[CATEGORY: HOME]"
        gifts={cozyGifts} 
        onGiftClick={openGift}
      />

      {/* Feed Section */}
      <div className="relative z-10 px-4 mt-8">
        <div className="flex items-center gap-2 mb-6 border-b border-cyber-green pb-2">
           <span className="text-cyber-green animate-blink">█</span>
           <h3 className="font-mono font-bold text-white uppercase">Data_Stream</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
           {/* CTA Card */}
           <div 
             onClick={startQuiz}
             className="col-span-2 relative border border-cyber-green bg-cyber-green/10 p-6 flex flex-col justify-center items-start min-h-[200px] cursor-pointer group hover:bg-cyber-green/20 transition-colors"
           >
              <div className="absolute top-0 right-0 p-2 text-[10px] text-cyber-green font-mono">
                 SYS_MSG: HELP_NEEDED?
              </div>
              <div className="relative z-10">
                <h3 className="text-white font-mono font-bold text-2xl mb-2 uppercase">
                   Algorithm <br/> Assistant
                </h3>
                <p className="text-cyber-green/80 text-xs font-mono mb-4">
                   Execute sequence to identify optimal gift parameters.
                </p>
                <button className="bg-cyber-green text-black px-4 py-2 font-bold font-mono text-xs hover:bg-white uppercase">
                    Start_Sequence
                </button>
              </div>
           </div>

           {feedGifts.map((gift) => (
             <div key={gift.id} className="h-auto">
                <GiftCard gift={gift} onClick={openGift} />
             </div>
           ))}
        </div>
        
        <div className="mt-12 text-center pb-8 border-t border-cyber-gray/20 pt-8">
            <Button variant="secondary" onClick={startQuiz}>
               LOAD_MORE_DATA
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