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
    // Check if we came from Profile with pre-filled data
    if (location.state) {
        const { name, relationship } = location.state as { name: string, relationship: string };
        return { ...INITIAL_ANSWERS, name: name || '', relationship: relationship || '' };
    }

    const saved = localStorage.getItem('gifty_draft');
    return saved ? JSON.parse(saved) : INITIAL_ANSWERS;
  });

  // If we have pre-filled data, maybe skip the first step? 
  // For now, let's just let the user confirm it.
  
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

  const renderContent = () => {
    switch (step) {
      case 0:
        return (
          <>
            <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-lg mb-6 relative">
               <p className="text-gray-700 font-bold text-lg">Кому ищем подарок?</p>
               <p className="text-gray-500 text-sm mt-1">Как зовут счастливчика?</p>
            </div>
            <input
              type="text"
              placeholder="например, Саша"
              value={answers.name}
              onChange={(e) => updateAnswer('name', e.target.value)}
              className="w-full bg-white/20 border-2 border-white/40 focus:border-yellow-400 focus:bg-white text-white focus:text-gray-800 placeholder-indigo-200 rounded-2xl p-4 text-xl font-bold outline-none transition-all text-center"
              autoFocus
            />
          </>
        );
      case 1:
        return (
          <>
            <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-lg mb-6">
               <p className="text-gray-700 font-bold text-lg">Супер! Сколько лет {answers.name}?</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {AGE_GROUPS.map(age => (
                <button
                  key={age}
                  onClick={() => updateAnswer('ageGroup', age)}
                  className={`p-4 rounded-xl font-bold text-sm transition-all ${answers.ageGroup === age ? 'bg-yellow-400 text-indigo-900 shadow-lg scale-105' : 'bg-white/20 text-white hover:bg-white/30'}`}
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
            <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-lg mb-6">
               <p className="text-gray-700 font-bold text-lg">Кем приходится?</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {RELATIONSHIPS.map(rel => (
                <button
                  key={rel}
                  onClick={() => updateAnswer('relationship', rel)}
                  className={`px-6 py-3 rounded-full font-bold text-sm transition-all ${answers.relationship === rel ? 'bg-yellow-400 text-indigo-900 shadow-lg scale-105' : 'bg-white/20 text-white hover:bg-white/30'}`}
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
             <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-lg mb-6">
               <p className="text-gray-700 font-bold text-lg">Где живет?</p>
               <p className="text-gray-500 text-sm mt-1">Проверю наличие в локальных магазинах.</p>
            </div>
            <input
              type="text"
              placeholder="например, Москва"
              value={answers.city}
              onChange={(e) => updateAnswer('city', e.target.value)}
              className="w-full bg-white/20 border-2 border-white/40 focus:border-yellow-400 focus:bg-white text-white focus:text-gray-800 placeholder-indigo-200 rounded-2xl p-4 text-xl font-bold outline-none transition-all text-center"
            />
          </>
        );
      case 4:
        return (
          <>
            <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-lg mb-6">
               <p className="text-gray-700 font-bold text-lg">Что любит?</p>
               <p className="text-gray-500 text-sm mt-1">Хобби, работа, интересы...</p>
            </div>
            <textarea
              placeholder="любит спорт, работает в IT, обожает котиков..."
              value={answers.interests}
              onChange={(e) => updateAnswer('interests', e.target.value)}
              className="w-full h-32 bg-white/20 border-2 border-white/40 focus:border-yellow-400 focus:bg-white text-white focus:text-gray-800 placeholder-indigo-200 rounded-2xl p-4 text-lg font-medium outline-none transition-all resize-none"
            />
          </>
        );
      case 5:
        return (
          <>
            <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-lg mb-6">
               <p className="text-gray-700 font-bold text-lg">Последний вопрос! Какой бюджет?</p>
            </div>
            <div className="flex flex-col gap-3">
              {BUDGETS.map(b => (
                <button
                  key={b}
                  onClick={() => updateAnswer('budget', b)}
                  className={`p-4 rounded-xl font-bold text-left transition-all flex justify-between items-center ${answers.budget === b ? 'bg-yellow-400 text-indigo-900 shadow-lg pl-6' : 'bg-white/20 text-white hover:bg-white/30'}`}
                >
                  <span>{b}</span>
                  {answers.budget === b && (
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                     </svg>
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
    <div className="min-h-screen pt-20 pb-20 px-4">
      <div className="max-w-md mx-auto relative">
        {/* Header with Progress */}
        <div className="absolute -top-12 left-0 right-0 flex items-center justify-between px-2">
            <button onClick={prevStep} className="text-white/70 hover:text-white p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <div className="text-white/80 font-bold text-sm">
                Шаг {step + 1} / 6
            </div>
            <div className="w-8"></div>
        </div>

        {/* Content Area */}
        <div className="flex gap-4 items-start mb-4">
            <Mascot className="w-16 h-16 shrink-0" emotion={step === 4 ? 'thinking' : 'happy'} />
        </div>

        <div className="animate-pop min-h-[300px]">
            {renderContent()}
        </div>

        {/* Footer Actions */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-indigo-900/50 to-transparent">
             <div className="max-w-md mx-auto">
                <Button 
                    onClick={nextStep} 
                    disabled={!isCurrentStepValid()} 
                    fullWidth
                    className={!isCurrentStepValid() ? 'opacity-50' : ''}
                >
                    {step === 5 ? 'Показать результаты ✨' : 'Продолжить'}
                </Button>
             </div>
        </div>
      </div>
    </div>
  );
};
