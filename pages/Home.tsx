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
    className="bg-white/20 backdrop-blur-xl border border-white/40 rounded-3xl p-2 pr-3 flex items-center gap-3 shadow-2xl cursor-pointer group transition-transform hover:scale-[1.02] active:scale-95 mx-4 mb-8"
  >
    <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm text-2xl group-hover:rotate-12 transition-transform duration-300">
      🎁
    </div>
    <div className="flex-grow text-left">
      <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-0.5">AI-подбор</p>
      <p className="text-white font-bold text-lg leading-tight">Найти идеальный подарок...</p>
    </div>
    <div className="bg-yellow-400 w-10 h-10 rounded-full flex items-center justify-center shadow-lg text-indigo-900">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </div>
  </div>
);

const CategoryPills: React.FC<{ onSelect: (tag: string) => void }> = ({ onSelect }) => {
  const categories = [
    '🔥 Тренды', '👩 Для неё', '👨 Для него', '🏠 Дом', '💻 Гаджеты', '🎨 Хобби', '🧸 Детям'
  ];

  return (
    <div className="flex overflow-x-auto gap-3 px-4 pb-4 no-scrollbar -mx-2">
      {categories.map((cat, i) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all"
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

// --- Main Page ---

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [feedGifts, setFeedGifts] = useState<Gift[]>([]);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch a mixed "Feed" of items
      const items = await api.gifts.list({ limit: 12 });
      setFeedGifts(items);
    };
    fetchData();
  }, []);

  const startQuiz = () => {
    track('start_quiz', { source: 'concierge_search' });
    navigate('/quiz');
  };

  const handleCategory = (cat: string) => {
    // In real app: filter feed. For now: Start quiz with context
    track('category_click', { cat });
    navigate('/quiz');
  };

  const openGift = (gift: Gift) => {
    track('home_gift_click', { id: gift.id });
    setSelectedGift(gift);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen pb-24 relative overflow-x-hidden">
      
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 right-0 h-96 bg-gradient-to-b from-indigo-600/30 to-transparent pointer-events-none" />
      <div className="fixed -top-20 -right-20 w-80 h-80 bg-purple-500 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-pulse" />
      <div className="fixed top-40 -left-20 w-60 h-60 bg-blue-400 rounded-full mix-blend-screen filter blur-[80px] opacity-30 animate-blob" />

      {/* Header / Nav Area */}
      <div className="relative pt-6 px-6 flex justify-between items-center z-10 mb-2">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-black text-indigo-600 text-lg shadow-lg">G</div>
           <span className="font-bold text-white tracking-wide opacity-90">Gifty AI</span>
        </div>
        <button className="text-white/80 hover:text-white">
           <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
              <span className="text-sm">👤</span>
           </div>
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 mb-6">
        <div className="px-6 pt-4 pb-2 flex flex-col items-center text-center">
            <Mascot className="w-28 h-28 mb-4 drop-shadow-2xl" emotion="happy" />
            
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight drop-shadow-md">
              Умный подбор <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400">
                идеальных подарков
              </span>
            </h1>
            
            <p className="text-indigo-100/80 text-sm max-w-xs mx-auto mb-6 font-medium">
               Искусственный интеллект, который сэкономит твое время и нервы.
            </p>
        </div>

        {/* The "Magic" Search Bar */}
        <SearchTrigger onClick={startQuiz} />

        {/* Categories */}
        <CategoryPills onSelect={handleCategory} />
      </div>

      {/* Feed Section (Masonry-like Grid) */}
      <div className="relative z-10 px-4 mt-6">
        <div className="flex items-center gap-2 mb-4 px-2">
           <span className="text-xl">✨</span>
           <h2 className="text-xl font-bold text-white">Вдохновение дня</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
           {/* CTA Card injected into grid */}
           <div 
             onClick={startQuiz}
             className="col-span-2 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-5 flex flex-col justify-between shadow-xl border border-white/10 min-h-[160px] cursor-pointer relative overflow-hidden group"
           >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-white/20 transition-colors"></div>
              <div>
                <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">Квиз</span>
                <h3 className="text-white font-bold text-xl mt-2 leading-tight">
                   Не знаешь,<br/>что подарить?
                </h3>
              </div>
              <div className="flex items-center gap-2 text-yellow-300 font-bold text-sm mt-4">
                 <span>Пройти тест</span>
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                 </svg>
              </div>
           </div>

           {/* Gifts Feed */}
           {feedGifts.map((gift) => (
             <div key={gift.id} className="h-auto">
                <GiftCard gift={gift} onClick={openGift} />
             </div>
           ))}
        </div>
        
        <div className="mt-8 text-center">
            <p className="text-white/60 text-sm mb-4">Показано {feedGifts.length} идей</p>
            <Button variant="secondary" onClick={startQuiz}>
               Загрузить больше через квиз
            </Button>
        </div>
      </div>

      {/* Sticky Bottom CTA (Mobile Only - appears on scroll in real app, simplified here) */}
      <div className="fixed bottom-20 right-4 z-40 md:hidden">
         <button 
           onClick={startQuiz}
           className="bg-yellow-400 hover:bg-yellow-300 text-indigo-900 rounded-full p-4 shadow-2xl border-4 border-white/20 animate-pop"
         >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
         </button>
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
