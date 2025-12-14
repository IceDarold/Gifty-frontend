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
          <div className="flex flex-col items-center text-center animate-shine">
             <h2 className="text-2xl font-bold text-blue-900 mb-6">Как зовут счастливчика?</h2>
             <div className="w-full relative">
                <input
                    type="text"
                    placeholder="Введите имя..."
                    value={answers.name}
                    onChange={(e) => updateAnswer('name', e.target.value)}
                    className="w-full bg-white/50 border-2 border-white rounded-2xl px-6 py-4 text-2xl text-center text-blue-800 placeholder-blue-300 outline-none focus:bg-white/80 focus:shadow-glow transition-all"
                    autoFocus
                />
                <div className="absolute inset-0 rounded-2xl shadow-inner pointer-events-none"></div>
             </div>
          </div>
        );
      case 1:
        return (
           <div>
              <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Сколько лет?</h2>
              <div className="grid grid-cols-2 gap-4">
                {AGE_GROUPS.map(age => (
                  <button
                    key={age}
                    onClick={() => updateAnswer('ageGroup', age)}
                    className={`
                        py-4 rounded-xl font-bold transition-all relative overflow-hidden group
                        ${answers.ageGroup === age 
                            ? 'bg-gradient-to-b from-blue-400 to-blue-600 text-white shadow-glow' 
                            : 'bg-white/40 text-blue-800 hover:bg-white/60'}
                    `}
                  >
                    {/* Gloss shine */}
                    <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 rounded-t-xl pointer-events-none"></div>
                    {age}
                  </button>
                ))}
              </div>
           </div>
        );
      case 2:
        return (
          <div>
             <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Кто это для тебя?</h2>
             <div className="grid grid-cols-2 gap-3">
              {RELATIONSHIPS.map(rel => (
                <button
                  key={rel}
                  onClick={() => updateAnswer('relationship', rel)}
                  className={`
                    py-3 px-4 rounded-full text-sm font-bold border transition-all
                    ${answers.relationship === rel 
                        ? 'bg-green-500 border-green-400 text-white shadow-md' 
                        : 'bg-white/30 border-white/50 text-blue-900 hover:bg-white/50'}
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
          <div className="text-center">
             <h2 className="text-2xl font-bold text-blue-900 mb-6">Из какого города?</h2>
             <input
                type="text"
                placeholder="Москва..."
                value={answers.city}
                onChange={(e) => updateAnswer('city', e.target.value)}
                className="w-full bg-white/50 border-2 border-white rounded-2xl px-6 py-4 text-xl text-center text-blue-800 outline-none focus:shadow-glow transition-all"
             />
             <p className="mt-4 text-blue-800/60 text-sm">Мы проверим варианты доставки</p>
          </div>
        );
      case 4:
        return (
          <div className="text-center">
             <h2 className="text-2xl font-bold text-blue-900 mb-2">Чем увлекается?</h2>
             <p className="text-blue-800/60 mb-6 text-sm">Игры, спорт, кулинария, сон...</p>
             <textarea
              value={answers.interests}
              onChange={(e) => updateAnswer('interests', e.target.value)}
              className="w-full h-40 bg-white/50 border-2 border-white rounded-2xl p-4 text-lg text-blue-900 outline-none focus:shadow-glow resize-none"
              placeholder="Напишите всё, что придет в голову..."
            />
          </div>
        );
      case 5:
        return (
           <div>
             <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Бюджет?</h2>
             <div className="space-y-3">
              {BUDGETS.map(b => (
                <button
                  key={b}
                  onClick={() => updateAnswer('budget', b)}
                  className={`w-full text-left px-6 py-4 rounded-xl font-bold transition-all flex justify-between items-center ${answers.budget === b ? 'bg-white text-blue-600 shadow-lg scale-105' : 'bg-white/20 text-blue-900 hover:bg-white/30'}`}
                >
                  {b}
                  {answers.budget === b && <span className="text-green-500 text-xl">✓</span>}
                </button>
              ))}
            </div>
           </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen pt-12 pb-32 px-4 flex flex-col items-center justify-center">
      
      {/* WINDOW CONTAINER (Glassmorphism) */}
      <div className="w-full max-w-md relative">
         
         {/* Top Bar / Progress */}
         <div className="mb-6 flex items-center justify-between">
            <button onClick={prevStep} className="w-10 h-10 rounded-full bg-white/40 flex items-center justify-center text-blue-900 hover:bg-white transition-colors">
                ←
            </button>
            
            {/* Glossy Progress Tube */}
            <div className="flex-1 mx-4 h-4 bg-black/10 rounded-full overflow-hidden shadow-inner border border-white/20 relative">
                <div 
                    className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500 relative"
                    style={{ width: `${((step + 1) / 6) * 100}%` }}
                >
                    {/* Shine on progress bar */}
                    <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/40"></div>
                </div>
            </div>

            <div className="text-blue-900 font-bold font-sans">
                {step + 1}/6
            </div>
         </div>

         {/* MAIN GLASS PANEL */}
         <div className="bg-white/30 backdrop-blur-xl border border-white/60 shadow-glass rounded-[2rem] p-8 min-h-[400px] flex flex-col relative overflow-hidden">
            {/* Shine overlay */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex-1 flex flex-col justify-center relative z-10">
                {renderContent()}
            </div>

            {/* Mascot Helper */}
            <div className="absolute bottom-4 right-4 opacity-50 transform scale-50 origin-bottom-right pointer-events-none">
                <Mascot emotion="thinking" />
            </div>
         </div>

         {/* Action Button */}
         <div className="mt-8">
             <Button 
                onClick={nextStep} 
                disabled={!isCurrentStepValid()} 
                fullWidth 
                variant="primary"
                className="h-16 text-xl shadow-xl"
             >
                {step === 5 ? 'Показать результаты ✨' : 'Дальше'}
             </Button>
         </div>

      </div>
    </div>
  );
};