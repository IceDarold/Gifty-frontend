import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Mascot } from '../components/Mascot';
import { GiftCard } from '../components/GiftCard';
import { GiftDetailsModal } from '../components/GiftDetailsModal';
import { Logo } from '../components/Logo';
import { api } from '../api';
import { Gift } from '../domain/types';
import { track } from '../utils/analytics';
import { AmbientSnow } from '../components/SnowSystem';
import { useAuth } from '../components/AuthContext';

// --- Decorative Components ---

const ChristmasGarland: React.FC = () => (
  <div className="fixed top-0 left-0 right-0 h-12 z-40 pointer-events-none flex justify-around overflow-hidden">
     <div className="absolute top-[-5px] left-[-10%] right-[-10%] h-8 border-b-2 border-gray-400/30 rounded-[100%]"></div>
     {Array.from({ length: 12 }).map((_, i) => {
         const colors = ['bg-red-500', 'bg-yellow-400', 'bg-green-500', 'bg-blue-500'];
         const color = colors[i % colors.length];
         return (
             <div 
               key={i} 
               className={`relative mt-2 w-3 h-4 rounded-full ${color} animate-twinkle`}
               style={{ 
                   animationDelay: `${i * 0.2}s`,
                   boxShadow: `0 0 12px 2px ${i % 2 === 0 ? 'rgba(255,255,255,0.6)' : 'rgba(255,230,0,0.6)'}` 
               }}
             >
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1.5 bg-gray-600"></div>
             </div>
         );
     })}
  </div>
);

const DesktopDecor: React.FC = () => {
  return (
    <div className="hidden xl:block fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
        <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] bg-blue-600/10 rounded-full blur-[140px] mix-blend-screen animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] bg-purple-600/10 rounded-full blur-[140px] mix-blend-screen animate-pulse-slow" style={{animationDelay: '2s'}}></div>
    </div>
  );
};

const TypewriterText: React.FC = () => {
  const phrases = [
    "Подарок на Тайного Санту...",
    "Что подарить на Новый Год?",
    "Сюрприз под елочку...",
    "Недорогой подарок коллеге",
    "Что-то волшебное для мамы"
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
    <span className="text-white font-bold text-lg leading-tight animate-cursor block min-h-[1.5rem]">
      {text}
    </span>
  );
};

const SearchTrigger: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white/10 backdrop-blur-3xl border border-white/30 rounded-[2rem] p-3 pr-4 flex items-center gap-4 shadow-2xl cursor-pointer group transition-all hover:bg-white/20 active:scale-[0.98] mx-4 mb-8 relative overflow-hidden ring-2 ring-white/10"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out pointer-events-none rounded-[1.5rem] overflow-hidden"></div>
    <div className="relative z-20 bg-white w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:rotate-6 transition-transform duration-300">
       <Mascot className="w-16 h-16 mt-2" emotion="happy" accessory="santa-hat" floating={false} />
    </div>
    <div className="relative z-20 flex-grow text-left overflow-hidden">
      <p className="text-red-500 text-[10px] bg-white inline-block px-2 rounded-md font-black uppercase tracking-[0.1em] mb-1 shadow-sm">AI-Санта</p>
      <TypewriterText />
    </div>
    <div className="relative z-20 bg-red-500 w-10 h-10 rounded-full flex items-center justify-center shadow-lg text-white group-hover:scale-110 transition-transform">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
  </div>
);

const CategoryPills: React.FC<{ onSelect: (tag: string) => void }> = ({ onSelect }) => {
  const categories = [
    'Новый год', 'Тренды', 'Для неё', 'Для него', 'Для дома', 'Гаджеты', 'Хобби'
  ];
  return (
    <div className="flex overflow-x-auto gap-3 px-4 pb-4 no-scrollbar -mx-2 mb-4 mask-gradient-right">
      {categories.map((cat, i) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-5 py-2.5 rounded-2xl font-bold text-sm whitespace-nowrap transition-all shadow-sm backdrop-blur-md border ${i === 0 ? 'bg-red-500 text-white border-red-400 hover:bg-red-600 animate-pulse-slow' : 'bg-white/10 text-white border-white/20 hover:bg-white hover:text-brand-blue'}`}
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
  gradient?: string;
}> = ({ title, subtitle, gifts, onGiftClick, id, gradient }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (gifts.length === 0 || !scrollRef.current) return;
    const el = scrollRef.current;
    const singleSetWidth = el.scrollWidth / 4;
    el.scrollLeft = singleSetWidth;
  }, [gifts]);

  const loopedGifts = [...gifts, ...gifts, ...gifts, ...gifts];
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const singleSetWidth = el.scrollWidth / 4;
    if (el.scrollLeft >= singleSetWidth * 3) el.scrollLeft = el.scrollLeft - singleSetWidth;
    else if (el.scrollLeft <= 10) el.scrollLeft = el.scrollLeft + singleSetWidth;
  };

  if (gifts.length === 0) return null;

  return (
    <div id={id} className="mb-24 relative z-10 scroll-mt-32 group/section">
      <div className="px-6 mb-10 flex items-end justify-between">
         <div className="flex flex-col">
            <h2 className="text-4xl md:text-5xl font-black text-white leading-[0.9] tracking-[-0.06em] mb-4">
                <span className={gradient ? `text-transparent bg-clip-text bg-gradient-to-r ${gradient}` : ''}>
                    {title}
                </span>
            </h2>
            {subtitle && (
                <div className="flex items-center gap-4">
                    <div className="h-px w-8 bg-white/30"></div>
                    <p className="text-white/50 text-[11px] font-black uppercase tracking-[0.4em] leading-none">{subtitle}</p>
                </div>
            )}
         </div>
         <button className="hidden sm:block text-[11px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all group pb-1">
            Коллекция <span className="inline-block transition-transform group-hover:translate-x-1 ml-1">→</span>
         </button>
      </div>
      <div className="relative w-full mask-gradient-x overflow-visible">
         <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto no-scrollbar pb-10 px-6 cursor-grab active:cursor-grabbing snap-proximity"
            style={{ scrollBehavior: 'auto' }}
         >
            {loopedGifts.map((gift, index) => (
              <div 
                key={`${gift.id}-${index}`} 
                className="w-[190px] md:w-[240px] shrink-0 transform-gpu transition-all duration-700 ease-out hover:scale-[1.04] hover:-translate-y-2 active:scale-[0.98]"
              >
                 <div className="relative group/card">
                    <div className="absolute -inset-4 bg-gradient-to-br from-white/15 to-transparent blur-2xl opacity-0 group-hover/card:opacity-100 transition-opacity pointer-events-none rounded-[3rem]"></div>
                    <GiftCard gift={gift} onClick={onGiftClick} />
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [eyes, setEyes] = useState({ x: 0, y: 0 });
  const [docked, setDocked] = useState(false);

  const [feedGifts, setFeedGifts] = useState<Gift[]>([]);
  const [cozyGifts, setCozyGifts] = useState<Gift[]>([]);
  const [techGifts, setTechGifts] = useState<Gift[]>([]);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = 150;
      setEyes({ 
        x: (e.clientX - centerX) / 300, 
        y: (e.clientY - centerY) / 300 
      });
    };
    window.addEventListener('mousemove', handleMove);
    const handleScroll = () => setDocked(window.scrollY > 200);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [feed, cozy, tech] = await Promise.all([
          api.gifts.list({ limit: 8 }),
          api.gifts.list({ limit: 8, tag: 'уют' }),
          api.gifts.list({ limit: 8, tag: 'технологии' })
        ]);
        setFeedGifts(feed);
        setCozyGifts(cozy);
        setTechGifts(tech);
      } catch (e) { console.error(e); }
    };
    fetchData();
  }, []);

  const openGift = (gift: Gift) => {
    setSelectedGift(gift);
    setIsModalOpen(true);
  };

  const handleGiftUpdate = (updatedGift: Gift) => {
      // Update all local lists to ensure the edit is reflected everywhere
      setFeedGifts(prev => prev.map(g => g.id === updatedGift.id ? updatedGift : g));
      setCozyGifts(prev => prev.map(g => g.id === updatedGift.id ? updatedGift : g));
      setTechGifts(prev => prev.map(g => g.id === updatedGift.id ? updatedGift : g));
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden pb-12">
      <AmbientSnow />
      <ChristmasGarland />
      <DesktopDecor />
      
      {/* Header */}
      <div className="fixed top-6 left-6 z-50"><Logo variant="white" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} /></div>
      <div className="fixed top-6 right-6 z-50">
         {user ? (
             <Link to="/profile" className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-2 rounded-2xl text-white font-bold text-sm">Профиль</Link>
         ) : (
             <Link to="/login" className="bg-white text-brand-blue px-5 py-2.5 rounded-2xl font-bold text-sm shadow-lg">Войти</Link>
         )}
      </div>

      <div className="max-w-7xl mx-auto relative pt-32">
        <div className="text-center mb-16 px-6">
            <div className={`transition-all duration-700 ${docked ? 'opacity-0 scale-75' : 'opacity-100'}`}>
                <Mascot className="w-32 h-32 mx-auto mb-6 drop-shadow-2xl" eyesX={eyes.x} eyesY={eyes.y} />
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[0.9] tracking-[-0.07em]">Дарите <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">волшебство</span></h1>
            <p className="text-white/70 text-lg max-w-sm mx-auto mb-12 font-medium leading-relaxed tracking-tight">Твой персональный AI-Санта. Подберет подарок за 30 секунд.</p>
            <div className="max-w-2xl mx-auto"><SearchTrigger onClick={() => navigate('/quiz')} /></div>
            <CategoryPills onSelect={() => navigate('/quiz')} />
        </div>

        <HorizontalSection title="Магия уюта" subtitle="Согревающие подарки для дома" gifts={cozyGifts} onGiftClick={openGift} gradient="from-orange-200 to-rose-300" />
        <HorizontalSection title="Мир технологий" subtitle="Гаджеты, о которых мечтают" gifts={techGifts} onGiftClick={openGift} gradient="from-blue-200 to-indigo-400" />

        <div className="px-6 mt-28">
            <h2 className="text-4xl font-black text-white tracking-[-0.06em] mb-12">Вдохновение дня</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
                <div onClick={() => navigate('/quiz')} className="col-span-2 relative overflow-hidden rounded-[3.5rem] p-8 md:p-14 min-h-[320px] bg-white cursor-pointer group shadow-2xl">
                    <div className="relative z-20">
                        <span className="inline-block bg-red-500 text-white text-[11px] font-black px-5 py-2 rounded-xl uppercase tracking-widest mb-8">AI Magic</span>
                        <h3 className="text-brand-dark font-black text-5xl leading-[0.95] tracking-[-0.06em]">Не знаешь что дарить? <br/> Спроси у Санты</h3>
                    </div>
                    <div className="absolute bottom-8 left-8 flex items-center gap-5 text-red-500 font-black group-hover:gap-8 transition-all">
                        <div className="w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center shadow-2xl">→</div>
                        <span className="text-xl">Начать подбор</span>
                    </div>
                </div>
                {feedGifts.map(g => <GiftCard key={g.id} gift={g} onClick={openGift} />)}
            </div>
        </div>
      </div>

      {selectedGift && (
          <GiftDetailsModal 
            gift={selectedGift} 
            answers={null} 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onWishlistChange={() => {}} 
            onUpdate={handleGiftUpdate} 
          />
      )}
    </div>
  );
};