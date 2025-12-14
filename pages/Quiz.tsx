import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/Button';
import { AGE_GROUPS, RELATIONSHIPS, BUDGETS } from '../constants';
import { QuizAnswers } from '../types';
import { track } from '../utils/analytics';
import { Mascot } from '../components/Mascot';

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
        return { ...INITIAL_ANSWERS, ...(location.state as any) };
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

  const renderContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="flex flex-col items-center text-center animate-pop">
             <h2 className="text-3xl font-black text-[#2d3436] mb-8">Как зовут счастливчика?</h2>
             <input
                type="text"
                placeholder="Имя..."
                value={answers.name}
                onChange={(e) => updateAnswer('name', e.target.value)}
                className="w-full h-20 bg-[#f0f2f5] rounded-[2rem] px-8 text-2xl font-bold text-[#2d3436] placeholder-gray-400 outline-none text-center shadow-[inset_6px_6px_12px_#c8c9cc,inset_-6px_-6px_12px_#ffffff] focus:shadow-[inset_8px_8px_16px_#c8c9cc,inset_-8px_-8px_16px_#ffffff] transition-all"
                autoFocus
             />
          </div>
        );
      case 1:
        return (
           <div className="animate-pop">
              <h2 className="text-3xl font-black text-[#2d3436] mb-8 text-center">Сколько лет?</h2>
              <div className="grid grid-cols-2 gap-4">
                {AGE_GROUPS.map(age => (
                  <button
                    key={age}
                    onClick={() => updateAnswer('ageGroup', age)}
                    className={`
                        py-5 rounded-[2rem] font-bold transition-all
                        ${answers.ageGroup === age 
                            ? 'bg-[#6c5ce7] text-white shadow-clay-btn scale-[1.02]' 
                            : 'bg-[#f0f2f5] text-[#2d3436] shadow-clay hover:scale-[1.02]'}
                    `}
                  >
                    {age}
                  </button>
                ))}
              </div>
           </div>
        );
      case 2:
        return (
          <div className="animate-pop">
             <h2 className="text-3xl font-black text-[#2d3436] mb-8 text-center">Кто это для тебя?</h2>
             <div className="flex flex-wrap justify-center gap-4">
              {RELATIONSHIPS.map(rel => (
                <button
                  key={rel}
                  onClick={() => updateAnswer('relationship', rel)}
                  className={`
                    px-6 py-3 rounded-full font-bold transition-all text-sm
                    ${answers.relationship === rel 
                        ? 'bg-[#fd79a8] text-white shadow-lg scale-110' 
                        : 'bg-[#f0f2f5] text-[#636e72] shadow-clay hover:scale-105'}
                  `}
                >
                  {rel}
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="text-center animate-pop">
             <h2 className="text-3xl font-black text-[#2d3436] mb-8">Из какого города?</h2>
             <input
                type="text"
                placeholder="Город..."
                value={answers.city}
                onChange={(e) => updateAnswer('city', e.target.value)}
                className="w-full h-20 bg-[#f0f2f5] rounded-[2rem] px-8 text-2xl font-bold text-[#2d3436] placeholder-gray-400 outline-none text-center shadow-[inset_6px_6px_12px_#c8c9cc,inset_-6px_-6px_12px_#ffffff]"
             />
          </div>
        );
      case 4:
        return (
          <div className="text-center animate-pop">
             <h2 className="text-3xl font-black text-[#2d3436] mb-4">Что он(а) любит?</h2>
             <p className="text-gray-400 font-bold mb-6">Хобби, работа, увлечения...</p>
             <textarea
              value={answers.interests}
              onChange={(e) => updateAnswer('interests', e.target.value)}
              className="w-full h-48 bg-[#f0f2f5] rounded-[2rem] p-6 text-xl font-bold text-[#2d3436] outline-none resize-none shadow-[inset_6px_6px_12px_#c8c9cc,inset_-6px_-6px_12px_#ffffff]"
              placeholder="Например: Любит спать, есть пиццу и играть в доту..."
            />
          </div>
        );
      case 5:
        return (
           <div className="animate-pop">
             <h2 className="text-3xl font-black text-[#2d3436] mb-8 text-center">Бюджет?</h2>
             <div className="space-y-4">
              {BUDGETS.map(b => (
                <button
                  key={b}
                  onClick={() => updateAnswer('budget', b)}
                  className={`w-full py-4 px-8 rounded-[2rem] font-bold transition-all flex justify-between items-center ${answers.budget === b ? 'bg-[#00b894] text-white shadow-lg' : 'bg-[#f0f2f5] text-[#2d3436] shadow-clay hover:scale-[1.01]'}`}
                >
                  {b}
                  {answers.budget === b && <span className="text-2xl">🤑</span>}
                </button>
              ))}
            </div>
           </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen pt-12 pb-32 px-6 flex flex-col items-center bg-[#f0f2f5]">
      
      {/* Progress Pill */}
      <div className="w-full max-w-xs h-4 bg-[#e0e5ec] rounded-full mb-8 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] relative overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#6c5ce7] to-[#a29bfe] rounded-full transition-all duration-500 ease-out shadow-[2px_0_5px_rgba(0,0,0,0.1)]"
            style={{ width: `${((step + 1) / 6) * 100}%` }}
          ></div>
      </div>

      <div className="w-full max-w-md relative flex-1 flex flex-col">
         
         {/* Mascot floating above */}
         <div className="absolute -top-20 -right-4 opacity-100 z-10">
             <Mascot emotion={step > 3 ? 'thinking' : 'happy'} className="w-24 h-24" />
         </div>

         {/* MAIN CARD */}
         <div className="bg-[#f0f2f5] shadow-clay rounded-[3rem] p-8 min-h-[400px] flex flex-col justify-center relative z-0">
            {renderContent()}
         </div>

         {/* Navigation Buttons */}
         <div className="mt-8 flex gap-4">
             {step > 0 && (
                 <button onClick={prevStep} className="w-16 h-16 rounded-full bg-[#f0f2f5] shadow-clay flex items-center justify-center text-gray-400 hover:text-[#6c5ce7] active:shadow-clay-pressed transition-all">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                 </button>
             )}
             <Button 
                onClick={nextStep} 
                disabled={!isCurrentStepValid()} 
                fullWidth 
                variant="primary"
                className="flex-1 text-xl h-16 shadow-[8px_8px_16px_rgba(108,92,231,0.3)]"
             >
                {step === 5 ? 'Готово!' : 'Дальше'}
             </Button>
         </div>

      </div>
    </div>
  );
};