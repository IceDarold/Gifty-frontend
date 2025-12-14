import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Mascot } from '../components/Mascot';
import { GiftCard } from '../components/GiftCard';
import { GiftDetailsModal } from '../components/GiftDetailsModal';
import { api } from '../api';
import { Gift } from '../domain/types';
import { track } from '../utils/analytics';

// --- Components ---

const TypewriterText: React.FC = () => {
  const phrases = [
    "Идеальный подарок...",
    "Сюрприз маме?",
    "Что-то гиковское",
    "Бюджетно и круто",
  ];
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const handleType = () => {
      const i = loopNum % phrases.length;
      const fullText = phrases[i];

      setText(isDeleting 
        ? fullText.substring(0, text.length - 1) 
        : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? 30 : 80);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 2000); 
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(500); 
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, phrases, typingSpeed]);

  return (
    <span className="text-black font-display font-bold text-lg leading-tight animate-cursor block min-h-[1.5rem]">
      {text}
    </span>
  );
};

const SearchTrigger: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white border-2 border-black rounded-xl p-3 pr-4 flex items-center gap-4 shadow-hard cursor-pointer hover:bg-pop-cyan hover:shadow-hard-lg active:translate-x-1 active:translate-y-1 active:shadow-none transition-all mx-4 mb-8"
  >
    <div className="bg-pop-yellow border-2 border-black w-12 h-12 rounded-lg flex items-center justify-center shrink-0 text-2xl font-black">
      ?
    </div>
    <div className="flex-grow text-left overflow-hidden">
      <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-0.5">AI Поиск</p>
      <TypewriterText />
    </div>
    <div className="bg-black text-white w-10 h-10 rounded-full flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
  </div>
);

const CategoryPills: React.FC<{ onSelect: (tag: string) => void }> = ({ onSelect }) => {
  const categories = [
    '🔥 Тренды', '👩 Для неё', '👨 Для него', '🏠 Дом', '💻 Гик', '🎨 Арт', '🧸 Дети'
  ];

  return (
    <div className="flex overflow-x-auto gap-3 px-4 pb-4 no-scrollbar -mx-2 mb-4">
      {categories.map((cat, i) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className="bg-white hover:bg-pop-pink hover:text-black border-2 border-black px-5 py-2.5 rounded-lg font-bold text-sm whitespace-nowrap transition-all shadow-hard-sm hover:shadow-hard active:translate-y-1 active:shadow-none text-black"
        >
          {cat}
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
    <div id={id} className="mb-12 relative z-10 scroll-mt-32 border-t-2 border-black pt-6 bg-white mx-4 rounded-xl shadow-hard">
      <div className="px-4 mb-4">
         <h2 className="text-xl font-display font-black text-black leading-tight bg-pop-yellow inline-block px-2 border-2 border-black transform -rotate-1">
            {title}
         </h2>
         {subtitle && <p className="text-gray-600 text-sm font-bold mt-2 ml-1">{subtitle}</p>}
      </div>
      <div className="flex overflow-x-auto gap-4 px-4 pb-6 no-scrollbar snap-x">
         {gifts.map((gift) => (
           <div key={gift.id} className="min-w-[200px] w-[200px] snap-center shrink-0">
              <GiftCard gift={gift} onClick={onGiftClick} />
           </div>
         ))}
         <div className="w-2 shrink-0" />
      </div>
    </div>
  );
};

const useMascotBehavior = () => {
  const [eyes, setEyes] = useState({ x: 0, y: 0 });
  const [docked, setDocked] = useState(false);
  const [accessory, setAccessory] = useState<'none' | 'glasses' | 'scarf'>('none');
  const [emotion, setEmotion] = useState<'happy' | 'cool' | 'excited' | 'thinking'>('happy');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (docked) return;
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
  }, [docked]);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setDocked(y > 220);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { eyes, docked, accessory, emotion, isMenuOpen, setIsMenuOpen };
};

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { eyes, docked, accessory, emotion, isMenuOpen, setIsMenuOpen } = useMascotBehavior();
  
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
    setIsMenuOpen(false);
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
    <div className="min-h-screen relative overflow-x-hidden pb-12 bg-paper">
      
      {/* Top Left Logo */}
      <div className="fixed top-4 left-4 z-50">
          <div 
            className="flex items-center gap-2 cursor-pointer bg-white border-2 border-black px-3 py-1 rounded-full shadow-hard active:shadow-none active:translate-y-1 transition-all" 
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          >
            <span className="font-display font-black text-xl tracking-tight text-black">
                Gifty!
            </span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 mb-6 mt-32 min-h-[16rem]">
        <div className="px-6 pb-4 flex flex-col items-center text-center">
            
            {/* HERO MASCOT */}
            <div 
                className={`relative transition-all duration-500 ease-out origin-bottom ${docked ? 'opacity-0 scale-75 translate-y-[-20px] pointer-events-none' : 'opacity-100 scale-100'}`}
            >
               <Mascot 
                    className="w-32 h-32 mb-5 hover:scale-105 transition-transform cursor-pointer" 
                    emotion="happy"
                    eyesX={eyes.x}
                    eyesY={eyes.y}
               />
            </div>
            
            <h1 className="text-5xl font-display font-black text-black mb-3 leading-[0.9] tracking-tighter">
              ПОДАРИ <br/>
              <span className="bg-pop-pink px-2 text-white border-2 border-black shadow-hard-sm inline-block transform -rotate-2">
                ЭМОЦИИ
              </span>
            </h1>
            
            <p className="text-black font-bold text-sm max-w-xs mx-auto mb-8 bg-white border-2 border-black p-2 shadow-hard-sm">
               AI-ассистент. 30 секунд. Идеальный выбор.
            </p>
        </div>

        <SearchTrigger onClick={startQuiz} />
        <CategoryPills onSelect={handleCategory} />
      </div>

      <HorizontalSection 
        id="section-cozy"
        title="Милота 💖" 
        subtitle="Чтобы согреть душу"
        gifts={cozyGifts} 
        onGiftClick={openGift} 
      />

      <HorizontalSection 
        id="section-tech"
        title="TECH ⚡️" 
        subtitle="Мечта гика"
        gifts={techGifts} 
        onGiftClick={openGift} 
      />

      {/* Feed Section */}
      <div className="relative z-10 px-4 mt-8">
        <div className="flex items-center gap-2 mb-6 px-2">
           <div className="bg-black text-white px-3 py-1 text-xl font-display font-black transform rotate-1">
             ЛЕНТА
           </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
           {/* CTA Card */}
           <div 
             onClick={startQuiz}
             className="col-span-2 relative overflow-hidden rounded-xl border-2 border-black p-6 flex flex-col justify-between min-h-[180px] cursor-pointer group shadow-hard bg-pop-cyan hover:bg-cyan-300 transition-colors"
           >
              <div className="relative z-10">
                <span className="inline-block bg-white border-2 border-black text-black text-[10px] font-black px-2 py-1 uppercase tracking-wider mb-3">
                  Бесплатно
                </span>
                <h3 className="text-black font-display font-black text-3xl leading-none">
                   СЛОЖНО?
                </h3>
                <p className="text-black text-sm mt-2 font-bold leading-tight">
                   Пройди квиз, пусть робот думает.
                </p>
              </div>
              <div className="relative z-10 flex items-center gap-2 text-black font-black text-sm mt-4">
                 <div className="w-10 h-10 rounded-full bg-white border-2 border-black flex items-center justify-center shadow-hard-sm">
                    ➜
                 </div>
                 <span className="underline decoration-2">Начать тест</span>
              </div>
           </div>

           {feedGifts.map((gift) => (
             <div key={gift.id} className="h-auto">
                <GiftCard gift={gift} onClick={openGift} />
             </div>
           ))}
        </div>
        
        <div className="mt-12 text-center pb-8">
            <Button variant="secondary" onClick={startQuiz}>
               Загрузить ещё
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