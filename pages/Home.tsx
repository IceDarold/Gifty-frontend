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

const Marquee: React.FC = () => (
  <div className="bg-pop-yellow border-y-2 border-black py-2 overflow-hidden relative z-20 transform -rotate-1 mt-14 mb-8 shadow-sm">
    <div className="whitespace-nowrap animate-marquee flex gap-8">
      {[...Array(6)].map((_, i) => (
         <div key={i} className="flex gap-8 items-center font-display font-black text-lg uppercase tracking-widest text-black">
            <span>🔥 Тренды</span>
            <span className="text-white text-stroke-black">★</span>
            <span>Идеи подарков</span>
            <span className="text-white text-stroke-black">★</span>
            <span>AI Подбор</span>
            <span className="text-white text-stroke-black">★</span>
         </div>
      ))}
    </div>
  </div>
);

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
    className="group bg-white border-2 border-black rounded-2xl p-4 flex items-center gap-4 shadow-hard cursor-pointer hover:bg-pop-lime transition-all active:translate-x-1 active:translate-y-1 active:shadow-none mx-6 mb-8 relative overflow-hidden"
  >
    {/* Decorative dots */}
    <div className="absolute top-2 right-2 flex gap-1">
        <div className="w-2 h-2 rounded-full border border-black bg-pop-pink"></div>
        <div className="w-2 h-2 rounded-full border border-black bg-pop-cyan"></div>
    </div>

    <div className="bg-black text-white w-14 h-14 rounded-xl flex items-center justify-center shrink-0 text-3xl font-black group-hover:rotate-12 transition-transform">
      ?
    </div>
    <div className="flex-grow text-left overflow-hidden z-10">
      <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-0.5 group-hover:text-black">AI Поиск</p>
      <TypewriterText />
    </div>
    <div className="bg-white border-2 border-black w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
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
    <div className="flex overflow-x-auto gap-3 px-6 pb-4 no-scrollbar -mx-2 mb-4">
      {categories.map((cat, i) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className="bg-white hover:bg-pop-pink hover:text-black border-2 border-black px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all shadow-hard-sm hover:shadow-hard active:translate-y-1 active:shadow-none text-black flex items-center gap-2"
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
  bgColor?: string;
}> = ({ title, subtitle, gifts, onGiftClick, id, bgColor = "bg-white" }) => {
  if (gifts.length === 0) return null;

  return (
    <div id={id} className={`mb-12 relative z-10 scroll-mt-32 border-y-2 border-black py-8 ${bgColor}`}>
      <div className="px-6 mb-4 flex items-end justify-between">
         <div>
            <h2 className="text-2xl font-display font-black text-black leading-none uppercase italic tracking-tighter">
                {title}
            </h2>
            {subtitle && <p className="text-gray-600 text-xs font-bold mt-1 font-mono uppercase">{subtitle}</p>}
         </div>
         <div className="hidden md:block">
            <span className="text-3xl">→</span>
         </div>
      </div>
      <div className="flex overflow-x-auto gap-4 px-6 pb-4 no-scrollbar snap-x">
         {gifts.map((gift) => (
           <div key={gift.id} className="min-w-[200px] w-[200px] snap-center shrink-0">
              <GiftCard gift={gift} onClick={onGiftClick} />
           </div>
         ))}
         <div className="w-4 shrink-0" />
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
    <div className="min-h-screen relative overflow-x-hidden pb-12 bg-paper">
      
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b-2 border-black px-4 py-3 flex justify-between items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          >
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-display font-black rounded-lg text-lg">G</div>
            <span className="font-display font-black text-xl tracking-tight text-black">
                Gifty!
            </span>
        </div>
        <div className="text-xs font-mono font-bold text-gray-400">v2.0</div>
      </div>

      <Marquee />

      {/* Hero Section */}
      <div className="relative z-10 mb-8 px-4 text-center">
        <div className="flex justify-center mb-4">
           <div className="relative">
              <Mascot 
                  className="w-32 h-32 hover:scale-105 transition-transform cursor-pointer" 
                  emotion="happy"
                  eyesX={eyes.x}
                  eyesY={eyes.y}
              />
              {/* Speech Bubble */}
              <div className="absolute -top-4 -right-12 bg-white border-2 border-black px-3 py-1 rounded-xl rounded-bl-none shadow-hard-sm animate-float">
                  <span className="font-bold text-xs">Я помогу! ✌️</span>
              </div>
           </div>
        </div>
        
        <h1 className="text-5xl font-display font-black text-black mb-4 leading-[0.9] tracking-tighter">
          ПОДАРИ <br/>
          <span className="bg-pop-pink px-2 text-white border-2 border-black shadow-hard-sm inline-block transform -rotate-2 mt-1">
            ЭМОЦИИ
          </span>
        </h1>

        <SearchTrigger onClick={startQuiz} />
        <CategoryPills onSelect={handleCategory} />
      </div>

      <HorizontalSection 
        id="section-cozy"
        title="Милота 💖" 
        subtitle="Для души и уюта"
        gifts={cozyGifts} 
        onGiftClick={openGift}
        bgColor="bg-pop-yellow/10"
      />

      <HorizontalSection 
        id="section-tech"
        title="TECH ⚡️" 
        subtitle="Гаджеты будущего"
        gifts={techGifts} 
        onGiftClick={openGift}
        bgColor="bg-pop-cyan/10"
      />

      {/* Feed Section */}
      <div className="relative z-10 px-4 mt-8">
        <div className="flex items-center gap-3 mb-6">
           <div className="bg-black text-white px-4 py-2 text-xl font-display font-black transform -rotate-1 shadow-hard-sm">
             ЛЕНТА
           </div>
           <div className="h-1 bg-black flex-grow rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
           {/* CTA Card - Double Width */}
           <div 
             onClick={startQuiz}
             className="col-span-2 relative overflow-hidden rounded-xl border-2 border-black p-6 flex flex-col justify-between min-h-[220px] cursor-pointer group shadow-hard bg-pop-cyan hover:bg-cyan-300 transition-colors"
           >
              {/* Pattern */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)] bg-[length:20px_20px]"></div>

              <div className="relative z-10">
                <span className="inline-block bg-white border-2 border-black text-black text-[10px] font-black px-2 py-1 uppercase tracking-wider mb-3 shadow-sm transform -rotate-2">
                  Бесплатно
                </span>
                <h3 className="text-black font-display font-black text-3xl leading-[0.9] mt-2">
                   НЕ ЗНАЕШЬ <br/> ЧТО ВЗЯТЬ?
                </h3>
              </div>
              <div className="relative z-10 flex items-center justify-between mt-4">
                 <p className="text-black text-xs font-bold max-w-[60%]">
                    Ответь на 6 вопросов, и AI подберет идеальный вариант.
                 </p>
                 <div className="w-12 h-12 rounded-full bg-white border-2 border-black flex items-center justify-center shadow-hard-sm group-hover:scale-110 transition-transform">
                    ➜
                 </div>
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