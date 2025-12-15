import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/Button';
import { Mascot } from '../components/Mascot';
import { AGE_GROUPS, RELATIONSHIPS, BUDGETS } from '../constants';
import { QuizAnswers } from '../types';
import { track } from '../utils/analytics';

const INITIAL_ANSWERS: QuizAnswers = {
  name: '',
  ageGroup: '',
  relationship: '',
  city: '',
  interests: '',
  budget: ''
};

// --- Helper Component: Speech Bubble ---
// Expert Detail: Using SVG for an organic, curved tail instead of a sharp CSS triangle
const QuestionBubble: React.FC<{ title: React.ReactNode; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="relative bg-white p-6 rounded-[2rem] shadow-xl mb-8 animate-pop text-center mx-2 z-20">
    {/* SVG Tail pointing up to the mascot */}
    <div className="absolute -top-[18px] left-1/2 -translate-x-1/2 w-12 h-6 z-0 overflow-visible">
       <svg viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
         <path d="M0 24C12 24 16 0 24 0C32 0 36 24 48 24H0Z" fill="white"/>
       </svg>
    </div>
    
    {/* Content */}
    <div className="relative z-10">
      <h2 className="text-2xl font-black text-brand-dark leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-500 font-medium mt-2 text-lg leading-snug">
          {subtitle}
        </p>
      )}
    </div>
  </div>
);

export const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(() => {
    if (location.state) {
        const { name, relationship } = location.state as { name: string, relationship: string };
        return { ...INITIAL_ANSWERS, name: name || '', relationship: relationship || '' };
    }
    const saved = localStorage.getItem('gifty_draft');
    return saved ? JSON.parse(saved) : INITIAL_ANSWERS;
  });

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const topRef = useRef<HTMLDivElement>(null); // For scrolling to top on step change

  useEffect(() => {
    localStorage.setItem('gifty_draft', JSON.stringify(answers));
  }, [answers]);

  const updateAnswer = (field: keyof QuizAnswers, value: string) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    track('quiz_step', { step: step + 1 });
    if (step === 5) {
      localStorage.setItem('gifty_answers', JSON.stringify(answers));
      navigate('/results');
    } else {
      setStep(s => s + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) setStep(s => s - 1);
    else navigate('/');
  };

  // Auto-focus logic & Scroll management
  useEffect(() => {
    // Scroll mascot into view slightly to ensure bubble is visible
    if(topRef.current && step > 0) {
        topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    const timer = setTimeout(() => {
        if ((step === 0 || step === 3) && inputRef.current) {
            inputRef.current.focus();
        }
        if (step === 4 && textAreaRef.current) {
            textAreaRef.current.focus();
        }
    }, 450); // Timing matched to animation
    return () => clearTimeout(timer);
  }, [step]);

  // Handle Enter key for inputs
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isCurrentStepValid()) {
        nextStep();
    }
  };

  const isCurrentStepValid = () => {
    switch (step) {
      case 0: return answers.name.trim().length > 0;
      case 1: return answers.ageGroup.length > 0;
      case 2: return answers.relationship.length > 0;
      case 3: return answers.city.trim().length > 0;
      case 4: return answers.interests.trim().length > 0;
      case 5: return answers.budget.length > 0;
      default: return false;
    }
  };

  const renderContent = () => {
    switch (step) {
      case 0:
        return (
          <>
            <QuestionBubble 
                title="Кому ищем подарок?" 
                subtitle="Как зовут счастливчика?" 
            />
            <input
              ref={inputRef}
              type="text"
              placeholder="Имя (например, Саша)"
              value={answers.name}
              onChange={(e) => updateAnswer('name', e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-white text-brand-dark placeholder-gray-400 rounded-3xl p-6 text-2xl font-bold outline-none ring-4 ring-transparent focus:ring-brand-blue/30 transition-all text-center shadow-xl mb-4"
            />
          </>
        );
      case 1:
        return (
          <>
            <QuestionBubble 
                title={<span>Сколько лет <span className="text-brand-purple">{answers.name}</span>?</span>}
            />
            <div className="grid grid-cols-2 gap-4 pb-4">
              {AGE_GROUPS.map(age => (
                <button
                  key={age}
                  onClick={() => updateAnswer('ageGroup', age)}
                  className={`p-4 py-6 rounded-2xl font-bold text-lg transition-all active:scale-95 flex items-center justify-center text-center min-h-[80px] leading-tight ${answers.ageGroup === age ? 'bg-white text-brand-blue shadow-xl scale-[1.02] ring-2 ring-brand-blue z-10' : 'bg-white/10 text-white border border-white/20 hover:bg-white/20 shadow-sm'}`}
                >
                  {age}
                </button>
              ))}
            </div>
          </>
        );
      case 2:
        return (
          <>
            <QuestionBubble 
                title="Кем вам приходится?" 
            />
            <div className="grid grid-cols-2 gap-3 pb-4">
              {RELATIONSHIPS.map(rel => (
                <button
                  key={rel}
                  onClick={() => updateAnswer('relationship', rel)}
                  className={`p-4 rounded-2xl font-bold text-base transition-all active:scale-95 min-h-[70px] flex items-center justify-center text-center leading-tight ${answers.relationship === rel ? 'bg-white text-brand-blue shadow-xl scale-[1.02] ring-2 ring-brand-blue z-10' : 'bg-white/10 text-white border border-white/20 hover:bg-white/20 shadow-sm'}`}
                >
                  {rel}
                </button>
              ))}
            </div>
          </>
        );
      case 3:
        return (
          <>
            <QuestionBubble 
                title="В каком городе?" 
                subtitle="Поищу в местных магазинах" 
            />
            <input
              ref={inputRef}
              type="text"
              placeholder="Город (например, Москва)"
              value={answers.city}
              onChange={(e) => updateAnswer('city', e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-white text-brand-dark placeholder-gray-400 rounded-3xl p-6 text-2xl font-bold outline-none ring-4 ring-transparent focus:ring-brand-blue/30 transition-all text-center shadow-xl mb-4"
            />
          </>
        );
      case 4:
        return (
          <>
            <QuestionBubble 
                title="Что любит человек?" 
                subtitle="Хобби, работа, увлечения..." 
            />
            <textarea
              ref={textAreaRef}
              placeholder="Например: любит футбол, работает программистом, обожает готовить..."
              value={answers.interests}
              onChange={(e) => updateAnswer('interests', e.target.value)}
              className="w-full h-48 bg-white text-brand-dark placeholder-gray-400 rounded-3xl p-6 text-xl font-medium outline-none ring-4 ring-transparent focus:ring-brand-blue/30 transition-all resize-none shadow-xl leading-relaxed mb-4"
            />
          </>
        );
      case 5:
        return (
          <>
            <QuestionBubble 
                title="Какой бюджет?" 
            />
            <div className="flex flex-col gap-3 pb-4">
              {BUDGETS.map(b => (
                <button
                  key={b}
                  onClick={() => updateAnswer('budget', b)}
                  className={`p-5 rounded-2xl font-bold text-lg text-left transition-all active:scale-[0.98] flex justify-between items-center border shadow-sm ${answers.budget === b ? 'bg-white text-brand-blue border-white shadow-xl ring-2 ring-brand-blue z-10' : 'bg-white/10 text-white border-white/20 hover:bg-white/15'}`}
                >
                  <span>{b}</span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${answers.budget === b ? 'border-brand-blue' : 'border-white/30'}`}>
                      {answers.budget === b && <div className="w-3 h-3 rounded-full bg-brand-blue" />}
                  </div>
                </button>
              ))}
            </div>
          </>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-32 px-4 flex flex-col" ref={topRef}>
      <div className="max-w-md mx-auto w-full relative flex-grow flex flex-col">
        
        {/* Header with Progress */}
        <div className="flex items-center justify-between mb-2 px-2">
            <button 
                onClick={prevStep} 
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors active:scale-90"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            
            {/* Progress Bar */}
            <div className="flex gap-1.5">
                {[0, 1, 2, 3, 4, 5].map(i => (
                    <div 
                        key={i} 
                        className={`h-1.5 rounded-full transition-all duration-300 ${i <= step ? 'w-6 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'w-2 bg-white/20'}`} 
                    />
                ))}
            </div>

            <div className="w-10" /> {/* Spacer for balance */}
        </div>

        {/* Mascot & Content Wrapper */}
        <div className="flex-grow flex flex-col">
            {/* Mascot Container */}
            <div className="flex justify-center mb-6 mt-2 relative z-10">
                <Mascot 
                    className="w-28 h-28 drop-shadow-2xl filter saturate-110" 
                    emotion={step === 4 ? 'thinking' : 'happy'} 
                />
            </div>

            {/* Bubble & Inputs */}
            <div className="w-full">
                {renderContent()}
            </div>
        </div>

        {/* Footer Actions (Fixed at bottom for easy thumb access) */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-brand-blue via-brand-blue/95 to-transparent z-50 pb-8 pt-12">
             <div className="max-w-md mx-auto">
                <Button 
                    onClick={nextStep} 
                    disabled={!isCurrentStepValid()} 
                    fullWidth
                    className={`h-16 text-xl shadow-2xl transition-all duration-300 transform ${!isCurrentStepValid() ? 'opacity-50 grayscale scale-100' : 'scale-105 animate-pulse-slow'}`}
                    variant={step === 5 ? 'secondary' : 'primary'} 
                >
                    {step === 5 ? 'Показать результаты 🎁' : 'Продолжить'}
                </Button>
             </div>
        </div>
      </div>
    </div>
  );
};