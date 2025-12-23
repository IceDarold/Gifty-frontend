import React, { useEffect, useState } from 'react';
import { GiftCard } from '../components/GiftCard';
import { GiftDetailsModal } from '../components/GiftDetailsModal';
import { api } from '../api';
import { Gift, QuizAnswers, RecommendationsResponse } from '../domain/types';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { track } from '../utils/analytics';
import { Mascot } from '../components/Mascot';
import { useDevMode } from '../components/DevModeContext';

const LoadingScreen: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center text-white bg-brand-dark overflow-hidden relative">
    <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-blue/20 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-purple/20 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
    </div>
    <div className="relative z-10 animate-float">
        <Mascot className="w-32 h-32 mb-8 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]" emotion="thinking" accessory="glasses" />
    </div>
    <h2 className="text-2xl font-black mb-3 animate-pulse">Анализирую магию...</h2>
    <div className="flex gap-2 justify-center mb-8">
        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
    </div>
    <p className="text-white/50 text-sm max-w-xs font-medium">Ищу идеальные совпадения среди тысяч вариантов</p>
  </div>
);

export const Results: React.FC = () => {
  const [response, setResponse] = useState<RecommendationsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<QuizAnswers | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const { isDevMode } = useDevMode();
  
  // Modal State
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [wishlistVersion, setWishlistVersion] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const stored = localStorage.getItem('gifty_answers');
        if (!stored) {
          navigate('/quiz');
          return;
        }
        
        const parsedAnswers: QuizAnswers = JSON.parse(stored);
        setAnswers(parsedAnswers);
        
        // Use the new generate endpoint which returns full Gift objects
        const recResponse = await api.recommendations.create(parsedAnswers);
        setResponse(recResponse);
        track('results_shown', { count: recResponse.gifts.length });
      } catch (err) {
        console.error(err);
        setError("Не удалось подобрать подарки. Попробуйте обновить страницу.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [navigate]);

  const handleGiftClick = (gift: Gift) => {
    track('view_gift_details', { id: gift.id });
    setSelectedGift(gift);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedGift(null), 300);
  };

  if (loading) return <LoadingScreen />;

  if (error || !response) {
    return (
       <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-brand-dark text-white">
          <Mascot emotion="surprised" className="w-32 h-32 mb-6" />
          <p className="text-xl font-bold mb-6">{error || 'Что-то пошло не так'}</p>
          <Button onClick={() => window.location.reload()}>Попробовать снова</Button>
          <button onClick={() => navigate('/')} className="mt-4 text-white/50 hover:text-white text-sm font-bold">На главную</button>
       </div>
    );
  }

  const featured = response.featuredGift;
  const others = response.gifts.filter(g => g.id !== featured.id);

  return (
    <div className="min-h-screen bg-brand-dark pt-24 pb-20 overflow-x-hidden relative">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-20%] w-[600px] h-[600px] bg-brand-blue/20 rounded-full blur-[120px] opacity-60"></div>
          <div className="absolute top-[20%] left-[-20%] w-[500px] h-[500px] bg-brand-purple/20 rounded-full blur-[120px] opacity-60"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-10 animate-fade-in-up">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <span className="bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold text-white/80 uppercase tracking-widest">
                        AI Подборка
                    </span>
                    {answers?.name && (
                        <span className="text-white/40 text-sm font-bold">для {answers.name}</span>
                    )}
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
                    Идеальные <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-purple">совпадения</span>
                </h1>
            </div>
            
            {/* Debug Button - Only in Dev Mode */}
            {isDevMode && (
                <div className="flex gap-2">
                    <button 
                        onClick={() => setShowDebug(!showDebug)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${showDebug ? 'bg-green-500 text-white' : 'bg-white/5 hover:bg-white/10 text-white/50'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                    </button>
                </div>
            )}
        </div>

        {isDevMode && showDebug && (
            <div className="bg-black/50 backdrop-blur-xl rounded-2xl p-4 mb-8 text-[10px] font-mono text-green-400 border border-white/10 overflow-hidden shadow-2xl animate-pop">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-lg mb-2">🛠 Debug Info</p>
                    <p>Engine: {response.engineVersion}</p>
                    <p>Run ID: {response.quizRunId}</p>
                    <p>Gifts Found: {response.gifts.length}</p>
                </div>
                <div className="text-right">
                    <p>User Budget: {answers?.budget}</p>
                    <p>User Age: {answers?.ageGroup}</p>
                </div>
            </div>
            <p className="mt-2 text-white/50 border-b border-white/10 pb-1 mb-2">Full Payload:</p>
            <pre className="mt-1 overflow-x-auto max-h-40">{JSON.stringify(answers, null, 2)}</pre>
            {response.debug && (
                <>
                    <p className="mt-4 text-white/50 border-b border-white/10 pb-1 mb-2">Backend Debug:</p>
                    <pre className="mt-1 overflow-x-auto max-h-40">{JSON.stringify(response.debug, null, 2)}</pre>
                </>
            )}
            </div>
        )}

        <div className="space-y-8">
            {/* Featured Section */}
            {featured && (
                <div className="relative group perspective-1000 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-blue to-brand-purple blur-3xl opacity-20 rounded-[3rem] group-hover:opacity-30 transition-opacity duration-700"></div>
                    <div className="relative">
                        <div className="absolute -top-6 -right-6 z-20 hidden md:block animate-float">
                            <div className="bg-white text-brand-dark font-black text-sm px-4 py-2 rounded-xl shadow-xl transform rotate-6 border-2 border-brand-purple">
                                №1 Выбор AI 🏆
                            </div>
                        </div>
                        <GiftCard 
                            gift={featured} 
                            featured 
                            onClick={handleGiftClick} 
                            onToggleWishlist={() => setWishlistVersion(v => v + 1)}
                        />
                    </div>
                </div>
            )}

            {/* Grid Section */}
            <div>
                <h3 className="text-white/60 font-bold uppercase tracking-widest text-xs mb-6 pl-2">Другие отличные варианты</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {others.map((gift, idx) => (
                        <div key={gift.id} className="animate-fade-in-up" style={{ animationDelay: `${0.2 + idx * 0.05}s` }}>
                            <GiftCard 
                                gift={gift} 
                                onClick={handleGiftClick}
                                onToggleWishlist={() => setWishlistVersion(v => v + 1)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
        
        {/* Footer Action */}
        <div className="mt-16 text-center pb-8 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 border border-white/5 inline-block w-full max-w-2xl">
                <Mascot emotion="happy" className="w-24 h-24 mx-auto mb-4" />
                <h3 className="text-2xl font-black text-white mb-2">Не нашли то самое?</h3>
                <p className="text-white/60 mb-8 max-w-md mx-auto">Попробуйте уточнить запрос или изменить параметры поиска.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="secondary" onClick={() => navigate('/quiz')}>
                        Попробовать еще раз
                    </Button>
                    <button 
                        onClick={() => navigate('/')}
                        className="px-8 py-3.5 rounded-2xl font-bold text-white/70 hover:text-white hover:bg-white/10 transition-all border border-white/10"
                    >
                        На главную
                    </button>
                </div>
            </div>
        </div>

        {selectedGift && (
            <GiftDetailsModal 
            gift={selectedGift} 
            isOpen={isModalOpen} 
            onClose={handleCloseModal}
            answers={answers}
            onWishlistChange={() => setWishlistVersion(v => v + 1)}
            />
        )}
      </div>
      
      <style>{`
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0; 
        }
      `}</style>
    </div>
  );
};