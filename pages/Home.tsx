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

const TerminalInput: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div 
    onClick={onClick}
    className="group relative bg-cyber-dark border border-cyber-green/40 p-5 cursor-pointer hover:border-cyber-green transition-all mx-4 mb-8 overflow-hidden"
  >
    {/* Background Grid Animation */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.03)_1px,transparent_1px)] bg-[size:10px_10px] opacity-50"></div>
    
    <div className="relative z-10 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[10px] text-cyber-dim font-mono uppercase tracking-wider">
            <span>ROOT@GIFTY:~/PROTOCOLS#</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-lg text-cyber-green text-shadow-sm">
            <span>$</span>
            <span className="group-hover:text-white transition-colors">START_SEARCH_SEQ</span>
            <span className="w-2.5 h-5 bg-cyber-green animate-blink"></span>
        </div>
    </div>
    
    <div className="absolute top-0 right-0 p-1">
        <div className="w-1 h-1 bg-cyber-green"></div>
    </div>
    <div className="absolute bottom-0 right-0 p-1">
        <div className="w-1 h-1 bg-cyber-green"></div>
    </div>
  </div>
);

const CategoryGlitch: React.FC<{ onSelect: (tag: string) => void }> = ({ onSelect }) => {
  const categories = [
    'TRENDING', 'HARDWARE', 'BIO_HACK', 'HOME_BASE', 'ART_DATA', 'LEGACY_UNIT'
  ];

  return (
    <div className="flex overflow-x-auto gap-2 px-4 pb-2 no-scrollbar mb-6">
      {categories.map((cat, i) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className="relative bg-cyber-black text-cyber-gray border border-cyber-gray/50 px-3 py-1.5 font-mono text-[10px] hover:border-cyber-green hover:text-cyber-green hover:bg-cyber-green/10 transition-all uppercase tracking-widest whitespace-nowrap active:translate-y-0.5"
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

const SectionHeader: React.FC<{ title: string; sub: string }> = ({ title, sub }) => (
    <div className="px-4 mb-4 flex items-end justify-between border-b border-cyber-green/20 pb-1 mx-4">
        <div>
            <div className="text-[9px] text-cyber-dim uppercase font-mono tracking-widest mb-0.5">{sub}</div>
            <h2 className="text-sm font-bold text-cyber-green font-mono uppercase tracking-wide">
                {title}
            </h2>
        </div>
        <div className="text-[9px] text-cyber-gray animate-pulse">Running...</div>
    </div>
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
          api.gifts.list({ limit: 8 }),
          api.gifts.list({ limit: 6, tag: 'технологии' }) 
        ]);
        setFeedGifts(feed);
        setTechGifts(tech);
      } catch (e) {
        console.error("System Error: Data fetch failed", e);
      }
    };
    fetchData();
  }, []);

  const startQuiz = () => {
    track('start_quiz', { source: 'terminal' });
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
      
      {/* Boot Sequence Hero */}
      <div className="relative z-10 mb-8 mt-2 px-4 text-center">
        
        <div className="flex justify-center mb-6">
           {/* Holographic Container */}
           <div className="relative p-6 border-x border-cyber-green/30 bg-cyber-green/5">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-cyber-green/50"></div>
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-cyber-green/50"></div>
              
              <Mascot className="w-28 h-28 opacity-90" emotion="happy" />
              
              {/* Decorative Scanning Lines */}
              <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,65,0.1)_50%)] bg-[size:100%_4px] pointer-events-none"></div>
           </div>
        </div>
        
        <div className="mb-8">
            <h1 className="text-4xl font-mono font-black text-white mb-1 uppercase tracking-tighter glitch-text" data-text="GIFTY_OS">
            GIFTY_OS
            </h1>
            <div className="flex justify-center gap-4 text-[10px] font-mono text-cyber-dim uppercase tracking-widest">
                <span>V.4.2.0</span>
                <span>•</span>
                <span>AI_CORE: ONLINE</span>
            </div>
        </div>

        <TerminalInput onClick={startQuiz} />
        <CategoryGlitch onSelect={handleCategory} />
      </div>

      {/* Tech Section */}
      <div className="mb-12">
          <SectionHeader title="Augmentations" sub=">> MODULE_CATEGORY: TECH" />
          <div className="flex overflow-x-auto gap-4 px-4 pb-4 no-scrollbar">
            {techGifts.map((gift) => (
                <div key={gift.id} className="min-w-[170px] w-[170px] shrink-0">
                    <GiftCard gift={gift} onClick={openGift} />
                </div>
            ))}
          </div>
      </div>

      {/* Feed Section as Data Stream */}
      <div className="px-4">
        <div className="flex items-center gap-2 mb-4 border-b border-cyber-gray/30 pb-2">
           <div className="w-2 h-2 bg-cyber-alert animate-pulse"></div>
           <h3 className="font-mono font-bold text-white text-sm uppercase tracking-wide">Inbound_Data_Stream</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
           {/* Promo Block */}
           <div 
             onClick={startQuiz}
             className="col-span-2 border border-dashed border-cyber-green/50 bg-cyber-green/5 p-5 flex items-center justify-between cursor-pointer hover:bg-cyber-green/10 transition-colors group"
           >
              <div>
                  <div className="text-[10px] text-cyber-green font-mono mb-1">SYS_MSG:</div>
                  <div className="text-white font-mono font-bold text-lg leading-tight uppercase">
                      Unsure_Protocol? <br/> Initiate_Scan
                  </div>
              </div>
              <div className="w-10 h-10 border border-cyber-green flex items-center justify-center text-cyber-green group-hover:bg-cyber-green group-hover:text-black transition-colors">
                  Go
              </div>
           </div>

           {feedGifts.map((gift) => (
             <div key={gift.id} className="h-auto">
                <GiftCard gift={gift} onClick={openGift} />
             </div>
           ))}
        </div>
        
        <div className="mt-10 text-center">
            <Button variant="secondary" onClick={startQuiz} fullWidth className="text-xs">
               [ LOAD_EXTENDED_MEMORY ]
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