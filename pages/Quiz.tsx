import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/Button';
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

  // Styles
  const cardStyle = "bg-white border-2 border-pop-black rounded-2xl p-6 shadow-hard animate-slide-up";
  const titleStyle = "text-2xl font-display font-black text-pop-black mb-6 leading-tight";
  const inputStyle = "w-full bg-gray-50 border-2 border-pop-black rounded-xl p-4 text-lg font-bold outline-none focus:shadow-hard transition-all";

  const renderContent = () => {
    switch (step) {
      case 0:
        return (
          <div className={cardStyle}>
            <div className="text-4xl mb-4">👋</div>
            <h2 className={titleStyle}>Как зовут счастливчика?</h2>
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
           <div className={cardStyle}>
              <div className="text-4xl mb-4">🎂</div>
              <h2 className={titleStyle}>Сколько лет получателю?</h2>
              <div className="grid grid-cols-2 gap-3">
                {AGE_GROUPS.map(age => (
                  <button
                    key={age}
                    onClick={() => updateAnswer('ageGroup', age)}
                    className={`p-3 rounded-xl border-2 border-pop-black font-bold text-sm transition-all ${answers.ageGroup === age ? 'bg-pop-yellow shadow-hard' : 'bg-white hover:bg-gray-50'}`}
                  >
                    {age}
                  </button>
                ))}
              </div>
           </div>
        );
      case 2:
        return (
          <div className={cardStyle}>
             <div className="text-4xl mb-4">❤️</div>
             <h2 className={titleStyle}>Кем он вам приходится?</h2>
             <div className="flex flex-wrap gap-3">
              {RELATIONSHIPS.map(rel => (
                <button
                  key={rel}
                  onClick={() => updateAnswer('relationship', rel)}
                  className={`px-4 py-2 rounded-xl border-2 border-pop-black font-bold text-sm transition-all ${answers.relationship === rel ? 'bg-pop-pink text-white shadow-hard' : 'bg-white hover:bg-gray-50'}`}
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
             <div className="text-4xl mb-4">📍</div>
             <h2 className={titleStyle}>Из какого города?</h2>
             <input
                type="text"
                placeholder="Москва, Питер..."
                value={answers.city}
                onChange={(e) => updateAnswer('city', e.target.value)}
                className={inputStyle}
             />
             <p className="mt-3 text-sm text-gray-500 font-medium">Это поможет с доставкой 🚚</p>
          </div>
        );
      case 4:
        return (
          <div className={cardStyle}>
             <div className="text-4xl mb-4">🧠</div>
             <h2 className={titleStyle}>Чем увлекается?</h2>
             <textarea
              placeholder="Например: Любит рыбалку, играет в Доту, готовит бургеры..."
              value={answers.interests}
              onChange={(e) => updateAnswer('interests', e.target.value)}
              className={`${inputStyle} h-32 resize-none`}
            />
          </div>
        );
      case 5:
        return (
           <div className={cardStyle}>
             <div className="text-4xl mb-4">💰</div>
             <h2 className={titleStyle}>Какой бюджет?</h2>
             <div className="flex flex-col gap-3">
              {BUDGETS.map(b => (
                <button
                  key={b}
                  onClick={() => updateAnswer('budget', b)}
                  className={`p-4 rounded-xl border-2 border-pop-black font-bold text-left transition-all ${answers.budget === b ? 'bg-pop-blue shadow-hard' : 'bg-white hover:bg-gray-50'}`}
                >
                  {b}
                </button>
              ))}
            </div>
           </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen pt-6 pb-32 px-4 bg-pop-bg">
      
      {/* Progress Bar */}
      <div className="max-w-md mx-auto mb-8 flex items-center gap-4">
         <button onClick={prevStep} className="w-10 h-10 rounded-full bg-white border-2 border-pop-black flex items-center justify-center font-bold hover:shadow-hard-sm transition-all">
            ←
         </button>
         <div className="flex-grow h-4 bg-white border-2 border-pop-black rounded-full overflow-hidden">
            <div 
                className="h-full bg-pop-yellow border-r-2 border-pop-black transition-all duration-300"
                style={{ width: `${((step + 1) / 6) * 100}%` }}
            ></div>
         </div>
         <div className="font-bold font-display">{step + 1}/6</div>
      </div>

      <div className="max-w-md mx-auto relative z-10">
        {renderContent()}

        {/* Floating Action */}
        <div className="fixed bottom-24 left-0 right-0 px-6 z-40 pointer-events-none">
             <div className="max-w-md mx-auto pointer-events-auto">
                <Button 
                    onClick={nextStep} 
                    disabled={!isCurrentStepValid()} 
                    fullWidth
                    variant="primary"
                    className="h-14 text-lg"
                >
                    {step === 5 ? 'Подобрать подарок! 🎉' : 'Дальше 👉'}
                </Button>
             </div>
        </div>
      </div>
    </div>
  );
};