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
    className="bg-white/10 backdrop-blur-xl border border-white/30 rounded-3xl p-3 pr-4 flex items-center gap-4 shadow-2xl cursor-pointer group transition-all hover:bg-white/15 hover:border-white/50 active:scale-[0.98] mx-4 mb-8 relative overflow-hidden"
  >
    {/* Shine effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out pointer-events-none"></div>

    <div className="bg-gradient-to-br from-white to-indigo-50 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg text-2xl group-hover:rotate-12 transition-transform duration-300 text-indigo-600">
      ✨
    </div>
    <div className="flex-grow text-left overflow-hidden">
      <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest mb-0.5">AI-помощник</p>
      <TypewriterText />
    </div>
    <div className="bg-yellow-400 w-10 h-10 rounded-full flex items-center justify-center shadow-lg text-indigo-900 group-hover:scale-110 transition-transform">
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
          className="bg-white/5 hover:bg-white/20 hover:scale-105 active:scale-95 backdrop-blur-md border border-white/10 hover:border-white/30 text-white px-5 py-2.5 rounded-2xl font-bold text-sm whitespace-nowrap transition-all shadow-sm"
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
         {subtitle && <p className="text-indigo-200 text-sm font-medium mt-1">{subtitle}</p>}
      </div>
      <div className="flex overflow-x-auto gap-4 px-6 pb-6 no-scrollbar snap-x -mx-2 md:mx-0">
         {gifts.map((gift) => (
           <div key={gift.id} className="min-w-[200px] w-[200px] snap-center shrink-0 hover:-translate-y-1 transition-transform duration-300">
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
  const [scrollProgress, setScrollProgress] = useState(0);
  const [docked, setDocked] = useState(false);
  const [accessory, setAccessory] = useState<'none' | 'glasses' | 'scarf'>('none');
  const [emotion, setEmotion] = useState<'happy' | 'cool' | 'excited' | 'thinking'>('happy');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrollRef = useRef(0);
  
  // Eye Tracking Logic (Desktop mostly)
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      // Only track if mostly in hero mode
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

  // Scroll & Intersection Logic
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(Math.max(y / height, 0), 1);
      setScrollProgress(progress);
      
      const isDocked = y > 220; // Threshold to switch mascots
      setDocked(isDocked);

      // Automatically close menu if scrolling significantly
      if (Math.abs(y - scrollRef.current) > 50) {
          setIsMenuOpen(false);
          scrollRef.current = y;
      }

      // Section Detection for Accessories
      const cozySection = document.getElementById('section-cozy');
      const techSection = document.getElementById('section-tech');
      
      let newAccessory: 'none' | 'glasses' | 'scarf' = 'none';
      let newEmotion: 'happy' | 'cool' | 'excited' | 'thinking' = 'happy';

      if (techSection) {
          const rect = techSection.getBoundingClientRect();
          if (rect.top < window.innerHeight / 2 && rect.bottom > 100) {
              newAccessory = 'glasses';
              newEmotion = 'cool';
          }
      }
      
      if (cozySection) {
          const rect = cozySection.getBoundingClientRect();
          if (rect.top < window.innerHeight / 2 && rect.bottom > 100) {
              newAccessory = 'scarf';
              newEmotion = 'excited';
          }
      }
      
      if (!isDocked) {
          newAccessory = 'none';
          newEmotion = 'happy';
      }

      setAccessory(newAccessory);
      setEmotion(newEmotion);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { eyes, scrollProgress, docked, accessory, emotion, isMenuOpen, setIsMenuOpen };
};


// --- Main Page ---

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { eyes, scrollProgress, docked, accessory, emotion, isMenuOpen, setIsMenuOpen } = useMascotBehavior();
  
  // Data States
  const [feedGifts, setFeedGifts] = useState<Gift[]>([]);
  const [cozyGifts, setCozyGifts] = useState<Gift[]>([]);
  const [techGifts, setTechGifts] = useState<Gift[]>([]);
  
  // Modal States
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

  // Close menu on click outside
  useEffect(() => {
    const handleClick = () => setIsMenuOpen(false);
    if (isMenuOpen) window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [isMenuOpen, setIsMenuOpen]);

  return (
    <div className="min-h-screen relative overflow-x-hidden pb-12">
      
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-indigo-950 to-purple-950 -z-20"></div>
      <div className="fixed top-0 left-0 right-0 h-96 bg-gradient-to-b from-indigo-500/20 to-transparent pointer-events-none -z-10" />
      
      {/* Animated Blobs */}
      <div className="fixed -top-10 -right-10 w-80 h-80 bg-purple-600 rounded-full mix-blend-screen filter blur-[90px] opacity-40 animate-blob -z-10" />
      <div className="fixed top-40 -left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-screen filter blur-[80px] opacity-40 animate-blob animation-delay-2000 -z-10" />

      {/* --- FLOATING LOGO (Top Left) --- */}
      <div className="fixed top-4 left-4 z-50">
          <div 
            className="flex items-center gap-2 cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 p-1.5 pr-4 rounded-full shadow-lg hover:bg-white/20 transition-all active:scale-95" 
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          >
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-600 text-lg shadow-sm">G</div>
            <span className="font-bold tracking-wide text-sm text-white drop-shadow-md">
                Gifty
            </span>
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
            <div className={`absolute top-0 right-0 bg-white/90 backdrop-blur-xl border border-white/50 shadow-2xl overflow-hidden transition-all duration-300 origin-top-right rounded-[2rem] ${isMenuOpen ? 'w-56 h-auto p-4 pt-16 opacity-100 scale-100' : 'w-14 h-14 p-0 opacity-0 scale-50 pointer-events-none'}`}>
                 <div className="flex flex-col gap-2">
                    <button 
                        onClick={(e) => { e.stopPropagation(); startQuiz(); }}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-50 text-left transition-colors group"
                    >
                        <span className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-sm shadow-sm group-hover:scale-110 transition-transform">✨</span>
                        <div className="leading-none">
                            <div className="font-bold text-gray-800 text-sm">Подобрать</div>
                            <div className="text-[10px] text-gray-400">Пройти квиз</div>
                        </div>
                    </button>

                    <button 
                        onClick={(e) => { e.stopPropagation(); navigate('/wishlist'); }}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-left transition-colors group"
                    >
                        <span className="w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-sm shadow-sm group-hover:scale-110 transition-transform">❤️</span>
                        <div className="leading-none">
                            <div className="font-bold text-gray-800 text-sm">Избранное</div>
                            <div className="text-[10px] text-gray-400">Сохраненные</div>
                        </div>
                    </button>
                    
                     <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-left transition-colors group">
                        <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center text-sm shadow-sm group-hover:scale-110 transition-transform">👤</span>
                        <div className="leading-none">
                            <div className="font-bold text-gray-800 text-sm">Профиль</div>
                            <div className="text-[10px] text-gray-400">Войти</div>
                        </div>
                    </button>
                 </div>
            </div>

            {/* The Floating Mascot (Trigger) */}
            <div className={`relative w-16 h-16 transition-transform duration-300 z-20 ${isMenuOpen ? 'scale-110' : 'scale-100 hover:scale-105'}`}>
                {/* Status Ring */}
                <div className={`absolute inset-0 rounded-full border-2 transition-all duration-300 ${isMenuOpen ? 'border-indigo-400 bg-white' : 'border-white/30 bg-white/10 backdrop-blur-md'}`}></div>
                
                {/* Progress Ring (visible when closed) */}
                {!isMenuOpen && (
                   <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle 
                        cx="32" cy="32" r="30" 
                        stroke="#FCD34D" 
                        strokeWidth="3" 
                        fill="none" 
                        strokeDasharray={2 * Math.PI * 30}
                        strokeDashoffset={2 * Math.PI * 30 * (1 - scrollProgress)}
                        strokeLinecap="round"
                      />
                   </svg>
                )}

                {/* Close Icon (visible when open) */}
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90 scale-50'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                
                {/* Mascot Face (visible when closed) */}
                <div className={`absolute inset-0 flex items-center justify-center overflow-hidden rounded-full transition-all duration-300 ${isMenuOpen ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}>
                   <Mascot className="w-20 h-20 mt-4" emotion={emotion} accessory={accessory} />
                </div>
                
                {/* Accessory Badge */}
                {!isMenuOpen && accessory !== 'none' && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center text-sm shadow-md animate-pop">
                        {accessory === 'glasses' ? '⚡️' : '🧣'}
                    </div>
                )}
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
               <div className="absolute inset-0 bg-yellow-400 blur-[40px] opacity-20 rounded-full animate-pulse-slow"></div>
               <Mascot 
                    className="w-32 h-32 mb-5 drop-shadow-2xl hover:scale-105 transition-transform cursor-pointer animate-float" 
                    emotion="happy"
                    eyesX={eyes.x}
                    eyesY={eyes.y}
               />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-white mb-3 leading-[1.1] drop-shadow-lg tracking-tight">
              Дарите <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-100 to-yellow-300">
                эмоции
              </span>
            </h1>
            
            <p className="text-indigo-100/90 text-sm max-w-xs mx-auto mb-8 font-medium leading-relaxed">
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
           {/* CTA Card */}
           <div 
             onClick={startQuiz}
             className="col-span-2 relative overflow-hidden rounded-[2rem] p-6 flex flex-col justify-between min-h-[180px] cursor-pointer group shadow-2xl transition-transform hover:scale-[1.02]"
           >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 animate-gradient-xy"></div>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
              
              <div className="relative z-10">
                <span className="inline-block bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider mb-3">
                  Бесплатный подбор
                </span>
                <h3 className="text-white font-black text-2xl leading-tight">
                   Сложный случай?
                </h3>
                <p className="text-indigo-100 text-sm mt-1 font-medium">
                   Пройди квиз, и AI найдет решение
                </p>
              </div>
              <div className="relative z-10 flex items-center gap-2 text-white font-bold text-sm mt-4 group-hover:gap-3 transition-all">
                 <div className="w-8 h-8 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow-lg">
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