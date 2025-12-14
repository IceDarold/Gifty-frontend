import React, { useState, useEffect } from 'react';
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

  const isCurrentStepValid = () => {
    switch (step) {
      case 0: return answers.name.length > 0;
      case 1: return answers.ageGroup.length > 0;
      case 2: return answers.relationship.length > 0;
      case 3: return answers.city.length > 0;
      case 4: return answers.interests.length > 0;
      case 5: return answers.budget.length > 0;
      default: return false;
    }
  };

  // Neo-Brutalist Styles
  const containerStyle = "bg-white border-2 border-black p-4 rounded-xl shadow-hard mb-6 relative";
  const headerTextStyle = "text-black font-display font-bold text-xl";
  const subTextStyle = "text-gray-600 font-bold text-sm mt-1";
  const inputStyle = "w-full bg-white border-2 border-black text-black placeholder-gray-400 rounded-xl p-4 text-xl font-bold outline-none focus:shadow-hard transition-all text-center";
  
  const optionBtnBase = "p-4 rounded-xl font-bold border-2 border-black transition-all text-center active:translate-y-1 active:shadow-none";
  const optionBtnSelected = "bg-pop-yellow text-black shadow-hard scale-[1.02]";
  const optionBtnDefault = "bg-white text-black hover:bg-gray-50 shadow-sm";

  const renderContent = () => {
    switch (step) {
      case 0:
        return (
          <>
            <div className={containerStyle}>
               <p className={headerTextStyle}>Кому ищем подарок?</p>
               <p className={subTextStyle}>Как зовут счастливчика?</p>
            </div>
            <input
              type="text"
              placeholder="например, Саша"
              value={answers.name}
              onChange={(e) => updateAnswer('name', e.target.value)}
              className={inputStyle}
              autoFocus
            />
          </>
        );
      case 1:
        return (
          <>
            <div className={containerStyle}>
               <p className={headerTextStyle}>Супер! Сколько лет {answers.name}?</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {AGE_GROUPS.map(age => (
                <button
                  key={age}
                  onClick={() => updateAnswer('ageGroup', age)}
                  className={`${optionBtnBase} ${answers.ageGroup === age ? optionBtnSelected : optionBtnDefault}`}
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
            <div className={containerStyle}>
               <p className={headerTextStyle}>Кем приходится?</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {RELATIONSHIPS.map(rel => (
                <button
                  key={rel}
                  onClick={() => updateAnswer('relationship', rel)}
                  className={`px-6 py-3 rounded-full font-bold text-sm border-2 border-black transition-all active:translate-y-1 active:shadow-none ${answers.relationship === rel ? 'bg-pop-pink text-black shadow-hard scale-105' : 'bg-white text-black hover:bg-gray-50'}`}
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
             <div className={containerStyle}>
               <p className={headerTextStyle}>Где живет?</p>
               <p className={subTextStyle}>Проверю наличие в локальных магазинах.</p>
            </div>
            <input
              type="text"
              placeholder="например, Москва"
              value={answers.city}
              onChange={(e) => updateAnswer('city', e.target.value)}
              className={inputStyle}
            />
          </>
        );
      case 4:
        return (
          <>
            <div className={containerStyle}>
               <p className={headerTextStyle}>Что любит?</p>
               <p className={subTextStyle}>Хобби, работа, интересы...</p>
            </div>
            <textarea
              placeholder="любит спорт, работает в IT, обожает котиков..."
              value={answers.interests}
              onChange={(e) => updateAnswer('interests', e.target.value)}
              className="w-full h-32 bg-white border-2 border-black text-black placeholder-gray-400 rounded-xl p-4 text-lg font-bold outline-none focus:shadow-hard transition-all resize-none"
            />
          </>
        );
      case 5:
        return (
          <>
            <div className={containerStyle}>
               <p className={headerTextStyle}>Последний вопрос! Бюджет?</p>
            </div>
            <div className="flex flex-col gap-3">
              {BUDGETS.map(b => (
                <button
                  key={b}
                  onClick={() => updateAnswer('budget', b)}
                  className={`p-4 rounded-xl font-bold text-left border-2 border-black transition-all flex justify-between items-center active:translate-y-1 active:shadow-none ${answers.budget === b ? 'bg-pop-cyan text-black shadow-hard pl-6' : 'bg-white text-black hover:bg-gray-50'}`}
                >
                  <span>{b}</span>
                  {answers.budget === b && (
                     <span className="text-xl">✅</span>
                  )}
                </button>
              ))}
            </div>
          </>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-40 px-4 bg-paper">
      <div className="max-w-md mx-auto relative">
        {/* Header with Progress */}
        <div className="absolute -top-12 left-0 right-0 flex items-center justify-between px-2">
            <button onClick={prevStep} className="bg-white text-black border-2 border-black hover:bg-gray-100 p-2 rounded-full shadow-hard-sm active:translate-y-0.5 active:shadow-none transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <div className="bg-pop-yellow border-2 border-black px-3 py-1 rounded-lg text-black font-black text-sm shadow-hard-sm transform rotate-2">
                ШАГ {step + 1} / 6
            </div>
            <div className="w-8"></div>
        </div>

        {/* Mascot & Content */}
        <div className="flex gap-4 items-start mb-4">
            <Mascot className="w-16 h-16 shrink-0" emotion={step === 4 ? 'thinking' : 'happy'} />
        </div>

        <div className="animate-pop min-h-[300px]">
            {renderContent()}
        </div>

        {/* Footer Actions - Positioned above the Bottom Nav */}
        <div className="fixed bottom-28 left-0 right-0 px-6 pointer-events-none z-40">
             <div className="max-w-md mx-auto pointer-events-auto">
                <Button 
                    onClick={nextStep} 
                    disabled={!isCurrentStepValid()} 
                    fullWidth
                    className={`shadow-hard-lg ${!isCurrentStepValid() ? 'opacity-50 grayscale' : 'animate-bounce-slight'}`}
                    variant="primary"
                >
                    {step === 5 ? 'ПОКАЗАТЬ РЕЗУЛЬТАТЫ 🚀' : 'ПРОДОЛЖИТЬ ->'}
                </Button>
             </div>
        </div>
      </div>
    </div>
  );
};