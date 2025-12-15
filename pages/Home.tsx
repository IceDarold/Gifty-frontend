import React, { useEffect, useState, useRef, useCallback } from 'react';
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
    "Найти идеальный подарок...",
    "Что подарить маме на ДР?",
    "Сюрприз для девушки...",
    "Недорогой подарок коллеге",
    "Что-то необычное для гика"
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
        setTimeout(() => setIsDeleting(true), 2000); // Pause at end
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(500); // Pause before new word
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, phrases, typingSpeed]);

  return (
    <span className="text-white font-bold text-lg leading-tight animate-cursor block min-h-[1.5rem]">
      {text}
    </span>
  );
};

const SearchTrigger: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white/10 backdrop-blur-2xl border border-white/30 rounded-[1.5rem] p-3 pr-4 flex items-center gap-4 shadow-2xl cursor-pointer group transition-all hover:bg-white/20 active:scale-[0.98] mx-4 mb-8 relative overflow-hidden"
  >
    {/* Shine effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out pointer-events-none"></div>

    <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg text-2xl group-hover:rotate-12 transition-transform duration-300">
      ✨
    </div>
    <div className="flex-grow text-left overflow-hidden">
      <p className="text-brand-blue text-[10px] bg-white inline-block px-1.5 rounded-md font-bold uppercase tracking-widest mb-1 shadow-sm">AI-помощник</p>
      <TypewriterText />
    </div>
    <div className="bg-brand-blue w-10 h-10 rounded-full flex items-center justify-center shadow-lg text-white group-hover:scale-110 transition-transform">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
  </div>
);

const CategoryPills: React.FC<{ onSelect: (tag: string) => void }> = ({ onSelect }) => {
  const categories = [
    '🔥 Тренды', '👩 Для неё', '👨 Для него', '🏠 Дом', '💻 Гаджеты', '🎨 Хобби', '🧸 Детям'
  ];

  return (
    <div className="flex overflow-x-auto gap-3 px-4 pb-4 no-scrollbar -mx-2 mb-4 mask-gradient-right">
      {categories.map((cat, i) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className="bg-white/10 hover:bg-white hover:text-brand-blue hover:scale-105 active:scale-95 backdrop-blur-md border border-white/20 hover:border-white text-white px-5 py-2.5 rounded-2xl font-bold text-sm whitespace-nowrap transition-all shadow-sm"
          style={{ animationDelay: `${i * 0.05}s` }}
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
    <div id={id} className="mb-10 relative z-10 scroll-mt-32">
      <div className="px-6 mb-4">
         <h2 className="text-xl font-bold text-white leading-tight flex items-center gap-2">
            {title}
         </h2>
         {subtitle && <p className="text-white/70 text-sm font-medium mt-1">{subtitle}</p>}
      </div>
      <div className="flex overflow-x-auto gap-4 px-6 pb-8 no-scrollbar snap-x -mx-2 md:mx-0">
         {gifts.map((gift) => (
           <div key={gift.id} className="min-w-[160px] w-[160px] md:min-w-[180px] md:w-[180px] snap-center shrink-0">
              <GiftCard gift={gift} onClick={onGiftClick} />
           </div>
         ))}
         <div className="w-2 shrink-0" /> {/* Spacer */}
      </div>
    </div>
  );
};

// --- Interactive Mascot Logic ---

const useMascotBehavior = () => {
  const [eyes, setEyes] = useState({ x: 0, y: 0 });
  const [docked, setDocked] = useState(false);
  const [accessory, setAccessory] = useState<'none' | 'glasses' | 'scarf'>('none');
  const [emotion, setEmotion] = useState<'happy' | 'cool' | 'excited' | 'thinking'>('happy');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrollRef = useRef(0);
  
  // Performance: Use requestAnimationFrame for eye tracking
  const requestRef = useRef<number>(0);
  
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      // Only track if mostly in hero mode
      if (docked) return;

      if (requestRef.current) return; // Drop frame if busy

      requestRef.current = requestAnimationFrame(() => {
          const clientX = e.clientX;
          const clientY = e.clientY;
          const centerX = window.innerWidth / 2;
          const centerY = 150; 
    
          const maxDist = 300;
          const dx = Math.max(-maxDist, Math.min(maxDist, clientX - centerX)) / maxDist;
          const dy = Math.max(-maxDist, Math.min(maxDist, clientY - centerY)) / maxDist;
    
          setEyes({ x: dx, y: dy });
          requestRef.current = 0;
      });
    };

    window.addEventListener('mousemove', handleMove);
    return () => {
        window.removeEventListener('mousemove', handleMove);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [docked]);

  // Scroll & Intersection Logic
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      
      const isDocked = y > 220; // Threshold to switch mascots
      setDocked(isDocked);

      // Automatically close menu if scrolling significantly
      if (Math.abs(y - scrollRef.current) > 50) {
          setIsMenuOpen(false);
          scrollRef.current = y;
      }

      setAccessory('none');
      setEmotion(docked ? 'happy' : 'happy');
    };

    // Simple throttle for scroll
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
    const throttledScroll = () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                handleScroll();
                scrollTimeout = null;
            }, 50);
        }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [docked]);

  return { eyes, docked, accessory, emotion, isMenuOpen, setIsMenuOpen };
};


// --- Main Page ---

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { eyes, docked, accessory, emotion, isMenuOpen, setIsMenuOpen } = useMascotBehavior();
  
  // Data States
  const [feedGifts, setFeedGifts] = useState<Gift[]>([]);
  const [cozyGifts, setCozyGifts] = useState<Gift[]>([]);
  const [techGifts, setTechGifts] = useState<Gift[]>([]);
  
  // Modal States
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Logo Path Logic
  // Try: /logo.png -> /public/logo.png -> logo.png -> Fallback Text
  const logoPaths = ['/logo.png', '/public/logo.png', 'logo.png'];
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);
  const [logoError, setLogoError] = useState(false);

  const handleLogoError = () => {
    const nextIndex = currentLogoIndex + 1;
    if (nextIndex < logoPaths.length) {
      setCurrentLogoIndex(nextIndex);
    } else {
      setLogoError(true);
    }
  };

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

  // Close menu on click outside
  useEffect(() => {
    const handleClick = () => setIsMenuOpen(false);
    if (isMenuOpen) window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [isMenuOpen, setIsMenuOpen]);

  return (
    <div className="min-h-screen relative overflow-x-hidden pb-12">
      
      {/* Dynamic Background Elements - Bubbles */}
      <div className="fixed inset-0 bg-transparent -z-20"></div>
      
      <div className="fixed -top-10 -right-10 w-96 h-96 bg-brand-purple/40 rounded-full mix-blend-screen filter blur-[100px] animate-blob -z-10" />
      <div className="fixed top-40 -left-10 w-80 h-80 bg-brand-blue/40 rounded-full mix-blend-screen filter blur-[90px] animate-blob animation-delay-2000 -z-10" />

      {/* --- FLOATING LOGO (Top Left) --- */}
      <div className="fixed top-4 left-4 z-50">
          <div 
            className="cursor-pointer transition-transform active:scale-95" 
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          >
             {!logoError ? (
                <img 
                    src={logoPaths[currentLogoIndex]}
                    alt="Gifty AI" 
                    className="h-10 w-auto object-contain drop-shadow-sm" 
                    onError={handleLogoError}
                />
             ) : (
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 pr-4 rounded-full border border-white/20">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-black text-brand-blue text-lg shadow-sm">G</div>
                    <span className="font-bold tracking-wide text-sm text-white drop-shadow-md">Gifty</span>
                </div>
             )}
        </div>
      </div>

      {/* --- SMART ASSISTANT HUB (Top Right) --- */}
      <div 
        onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
        className={`fixed top-4 right-4 z-50 flex flex-col items-end transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isMenuOpen ? 'w-56' : 'w-auto'}`}
      >
        {/* The Capsule / Toggle */}
        <div className={`relative flex items-center gap-3 cursor-pointer transition-all duration-500 ${docked ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[-20px] pointer-events-none'}`}>
            
            {/* Expanded Menu Container */}
            <div className={`absolute top-0 right-0 bg-white/95 backdrop-blur-xl border border-white/50 shadow-2xl overflow-hidden transition-all duration-300 origin-top-right rounded-[2rem] ${isMenuOpen ? 'w-56 h-auto p-4 pt-16 opacity-100 scale-100' : 'w-14 h-14 p-0 opacity-0 scale-50 pointer-events-none'}`}>
                 <div className="flex flex-col gap-2">
                    <button 
                        onClick={(e) => { e.stopPropagation(); startQuiz(); }}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-left transition-colors group"
                    >
                        <span className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center text-sm shadow-sm group-hover:scale-110 transition-transform">✨</span>
                        <div className="leading-none">
                            <div className="font-bold text-gray-800 text-sm">Подобрать</div>
                            <div className="text-[10px] text-gray-400">Пройти квиз</div>
                        </div>
                    </button>

                    <button 
                        onClick={(e) => { e.stopPropagation(); navigate('/wishlist'); }}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50 text-left transition-colors group"
                    >
                        <span className="w-8 h-8 rounded-full bg-brand-purple text-white flex items-center justify-center text-sm shadow-sm group-hover:scale-110 transition-transform">❤️</span>
                        <div className="leading-none">
                            <div className="font-bold text-gray-800 text-sm">Избранное</div>
                            <div className="text-[10px] text-gray-400">Сохраненные</div>
                        </div>
                    </button>
                    
                     <button 
                        onClick={(e) => { e.stopPropagation(); navigate('/profile'); }}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-left transition-colors group"
                     >
                        <span className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm shadow-sm group-hover:scale-110 transition-transform">👤</span>
                        <div className="leading-none">
                            <div className="font-bold text-gray-800 text-sm">Профиль</div>
                            <div className="text-[10px] text-gray-400">Календарь</div>
                        </div>
                    </button>
                 </div>
            </div>

            {/* The Floating Mascot (Trigger) */}
            <div className={`relative w-16 h-16 transition-transform duration-300 z-20 ${isMenuOpen ? 'scale-110' : 'scale-100 hover:scale-105'}`}>
                {/* Status Ring / Border */}
                <div className={`absolute inset-0 rounded-full border-2 transition-all duration-300 ${isMenuOpen ? 'border-brand-blue bg-white' : 'border-white/20 bg-white/10 backdrop-blur-md shadow-sm'}`}></div>
                
                {/* Close Icon (visible when open) */}
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90 scale-50'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                
                {/* Mascot Face (visible when closed) */}
                <div className={`absolute inset-0 flex items-center justify-center overflow-hidden rounded-full transition-all duration-300 ${isMenuOpen ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}>
                   <Mascot className="w-20 h-20 mt-4" emotion={emotion} accessory={accessory} />
                </div>
            </div>
            
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 mb-6 mt-32 min-h-[16rem]">
        <div className="px-6 pb-4 flex flex-col items-center text-center">
            
            {/* HERO MASCOT (Disappears on scroll) */}
            <div 
                className={`relative transition-all duration-500 ease-out origin-bottom ${docked ? 'opacity-0 scale-75 translate-y-[-20px] pointer-events-none' : 'opacity-100 scale-100'}`}
            >
               <div className="absolute inset-0 bg-white blur-[50px] opacity-20 rounded-full animate-pulse-slow"></div>
               <Mascot 
                    className="w-32 h-32 mb-5 drop-shadow-2xl hover:scale-105 transition-transform cursor-pointer animate-float" 
                    emotion="happy"
                    eyesX={eyes.x}
                    eyesY={eyes.y}
               />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-white mb-3 leading-[1.1] drop-shadow-lg tracking-tight">
              Дарите <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
                эмоции
              </span>
            </h1>
            
            <p className="text-white/80 text-sm max-w-xs mx-auto mb-8 font-medium leading-relaxed">
               Твой персональный AI-ассистент.<br/> Подберет подарок за 30 секунд.
            </p>
        </div>

        {/* Search */}
        <SearchTrigger onClick={startQuiz} />

        {/* Categories */}
        <CategoryPills onSelect={handleCategory} />
      </div>

      {/* Horizontal Sections with IDs for Scroll Detection */}
      <HorizontalSection 
        id="section-cozy"
        title="Милые идеи для неё 💖" 
        subtitle="Уютные подарки, чтобы согреть душу"
        gifts={cozyGifts} 
        onGiftClick={openGift} 
      />

      <HorizontalSection 
        id="section-tech"
        title="Техно-тренды ⚡️" 
        subtitle="Гаджеты, о которых все мечтают"
        gifts={techGifts} 
        onGiftClick={openGift} 
      />

      {/* Feed Section */}
      <div className="relative z-10 px-4 mt-6">
        <div className="flex items-center gap-2 mb-6 px-2">
           <span className="text-2xl animate-pulse">✨</span>
           <h2 className="text-2xl font-bold text-white">Вдохновение дня</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
           {/* CTA Card */}
           <div 
             onClick={startQuiz}
             className="col-span-2 relative overflow-hidden rounded-[2rem] p-6 flex flex-col justify-between min-h-[180px] cursor-pointer group shadow-2xl transition-transform hover:scale-[1.02] bg-white"
           >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
              
              <div className="relative z-10">
                <span className="inline-block bg-brand-blue text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider mb-3">
                  Бесплатный подбор
                </span>
                <h3 className="text-brand-dark font-black text-2xl leading-tight">
                   Сложный случай?
                </h3>
                <p className="text-gray-500 text-sm mt-1 font-medium">
                   Пройди квиз, и AI найдет решение
                </p>
              </div>
              <div className="relative z-10 flex items-center gap-2 text-brand-blue font-bold text-sm mt-4 group-hover:gap-3 transition-all">
                 <div className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                 </div>
                 <span>Начать тест</span>
              </div>
           </div>

           {/* Gifts Feed */}
           {feedGifts.map((gift) => (
             <div key={gift.id} className="h-auto">
                <GiftCard gift={gift} onClick={openGift} />
             </div>
           ))}
        </div>
        
        <div className="mt-12 text-center pb-8">
            <Button variant="secondary" onClick={startQuiz}>
               Загрузить больше через квиз
            </Button>
        </div>
      </div>

      {/* Modal */}
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