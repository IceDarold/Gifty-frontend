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

  // Styles
  const cardStyle = "bg-white border-2 border-black rounded-2xl shadow-hard p-6 min-h-[300px] flex flex-col items-center text-center justify-center relative overflow-hidden";
  const labelStyle = "text-sm font-bold text-gray-500 uppercase tracking-widest mb-2";
  const questionStyle = "text-3xl font-display font-black text-black mb-6 leading-none";
  const inputStyle = "w-full bg-paper border-2 border-black text-black placeholder-gray-400 rounded-xl p-4 text-2xl font-bold outline-none focus:shadow-hard focus:-translate-y-1 transition-all text-center";

  const renderContent = () => {
    switch (step) {
      case 0:
        return (
          <div className={cardStyle}>
            <div className="absolute top-0 left-0 w-full h-2 bg-pop-pink"></div>
            <Mascot emotion="happy" className="w-20 h-20 mb-4" />
            <p className={labelStyle}>Вопрос 1/6</p>
            <h2 className={questionStyle}>Как зовут счастливчика?</h2>
            <input
              type="text"
              placeholder="Имя..."
              value={answers.name}
              onChange={(e) => updateAnswer('name', e.target.value)}
              className={inputStyle}
              autoFocus
            />
          </div>
        );
      case 1:
        return (
           <div className="space-y-4">
              <div className="bg-white border-2 border-black p-4 rounded-xl shadow-sm text-center">
                  <h2 className="text-2xl font-black font-display">Сколько лет?</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {AGE_GROUPS.map(age => (
                  <button
                    key={age}
                    onClick={() => updateAnswer('ageGroup', age)}
                    className={`p-4 rounded-xl font-bold border-2 border-black transition-all ${answers.ageGroup === age ? 'bg-pop-yellow text-black shadow-hard translate-x-[-2px] translate-y-[-2px]' : 'bg-white hover:bg-gray-50'}`}
                  >
                    {age}
                  </button>
                ))}
              </div>
           </div>
        );
      case 2:
        return (
          <div className="space-y-4">
             <div className="bg-white border-2 border-black p-4 rounded-xl shadow-sm text-center">
                  <h2 className="text-2xl font-black font-display">Кто он/она для тебя?</h2>
             </div>
             <div className="grid grid-cols-2 gap-3">
              {RELATIONSHIPS.map(rel => (
                <button
                  key={rel}
                  onClick={() => updateAnswer('relationship', rel)}
                  className={`p-3 rounded-xl font-bold border-2 border-black transition-all ${answers.relationship === rel ? 'bg-pop-pink text-black shadow-hard' : 'bg-white hover:bg-gray-50'}`}
                >
                  {rel}
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className={cardStyle}>
             <div className="absolute top-0 left-0 w-full h-2 bg-pop-cyan"></div>
             <Mascot emotion="thinking" className="w-20 h-20 mb-4" />
             <p className={labelStyle}>Локация</p>
             <h2 className={questionStyle}>Где живет?</h2>
             <p className="text-gray-500 text-xs font-bold mb-4">Подберу доставку</p>
             <input
              type="text"
              placeholder="Город..."
              value={answers.city}
              onChange={(e) => updateAnswer('city', e.target.value)}
              className={inputStyle}
            />
          </div>
        );
      case 4:
        return (
          <div className={cardStyle}>
             <div className="absolute top-0 left-0 w-full h-2 bg-pop-lime"></div>
             <p className={labelStyle}>Интересы</p>
             <h2 className={questionStyle}>Что любит?</h2>
             <textarea
              placeholder="Спорт, аниме, рыбалка, сон..."
              value={answers.interests}
              onChange={(e) => updateAnswer('interests', e.target.value)}
              className="w-full h-32 bg-paper border-2 border-black text-black placeholder-gray-400 rounded-xl p-4 text-xl font-bold outline-none focus:shadow-hard transition-all resize-none text-center"
            />
          </div>
        );
      case 5:
        return (
           <div className="space-y-4">
             <div className="bg-white border-2 border-black p-4 rounded-xl shadow-sm text-center">
                  <h2 className="text-2xl font-black font-display">Бюджет?</h2>
             </div>
             <div className="flex flex-col gap-3">
              {BUDGETS.map(b => (
                <button
                  key={b}
                  onClick={() => updateAnswer('budget', b)}
                  className={`p-4 rounded-xl font-bold text-left border-2 border-black transition-all flex justify-between items-center ${answers.budget === b ? 'bg-pop-cyan text-black shadow-hard translate-x-[-2px]' : 'bg-white hover:bg-gray-50'}`}
                >
                  <span>{b}</span>
                  {answers.budget === b && (
                     <span className="text-xl">✅</span>
                  )}
                </button>
              ))}
            </div>
           </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-32 px-4 bg-paper">
      <div className="max-w-md mx-auto relative">
        
        {/* Progress Bar */}
        <div className="fixed top-0 left-0 right-0 z-30 h-1.5 bg-gray-200">
           <div 
             className="h-full bg-black transition-all duration-300 ease-out"
             style={{ width: `${((step + 1) / 6) * 100}%` }}
           />
        </div>

        {/* Top Nav for Quiz */}
        <div className="flex items-center justify-between mb-6">
           <button onClick={prevStep} className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center bg-white shadow-hard-sm hover:translate-y-0.5 hover:shadow-none transition-all">
             ←
           </button>
           <div className="font-display font-black text-xl">
             ШАГ {step + 1}
           </div>
           <div className="w-10"></div> 
        </div>

        <div className="animate-pop">
            {renderContent()}
        </div>

        {/* Footer Actions */}
        <div className="fixed bottom-28 left-0 right-0 px-6 z-40 pointer-events-none">
             <div className="max-w-md mx-auto pointer-events-auto">
                <Button 
                    onClick={nextStep} 
                    disabled={!isCurrentStepValid()} 
                    fullWidth
                    className={`shadow-hard-lg text-xl py-4 border-2 border-black ${!isCurrentStepValid() ? 'opacity-50 grayscale bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
                >
                    {step === 5 ? 'ПОКАЗАТЬ РЕЗУЛЬТАТЫ 🚀' : 'ДАЛЬШЕ'}
                </Button>
             </div>
        </div>
      </div>
    </div>
  );
};