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
  const sheetStyle = "bg-white p-8 shadow-paper relative transform rotate-1 transition-all duration-500 min-h-[400px]";
  const questionStyle = "font-display font-bold text-3xl text-paper-ink mb-6";
  const inputStyle = "w-full bg-transparent border-b-2 border-gray-300 text-2xl font-sans py-2 px-1 outline-none focus:border-paper-blue transition-colors placeholder-gray-300";

  const renderContent = () => {
    switch (step) {
      case 0:
        return (
          <div className={sheetStyle}>
            <div className="absolute top-0 right-0 p-4 opacity-10 font-display text-9xl pointer-events-none">#1</div>
            <h2 className={questionStyle}>Кого будем радовать?</h2>
            <p className="font-sans text-gray-500 text-lg mb-4">Напиши имя:</p>
            <input
              type="text"
              placeholder="Например: Аня"
              value={answers.name}
              onChange={(e) => updateAnswer('name', e.target.value)}
              className={inputStyle}
              autoFocus
            />
          </div>
        );
      case 1:
        return (
           <div className={`${sheetStyle} -rotate-1`}>
              <div className="absolute top-0 right-0 p-4 opacity-10 font-display text-9xl pointer-events-none">#2</div>
              <h2 className={questionStyle}>Сколько лет?</h2>
              <div className="grid grid-cols-2 gap-4">
                {AGE_GROUPS.map(age => (
                  <button
                    key={age}
                    onClick={() => updateAnswer('ageGroup', age)}
                    className={`p-3 font-sans text-xl border-2 rounded-messy-sm transition-all ${answers.ageGroup === age ? 'border-paper-ink bg-paper-yellow shadow-sketch' : 'border-gray-200 text-gray-500 hover:border-gray-400'}`}
                  >
                    {age}
                  </button>
                ))}
              </div>
           </div>
        );
      case 2:
        return (
          <div className={sheetStyle}>
             <div className="absolute top-0 right-0 p-4 opacity-10 font-display text-9xl pointer-events-none">#3</div>
             <h2 className={questionStyle}>Кто этот человек для тебя?</h2>
             <div className="flex flex-wrap gap-3">
              {RELATIONSHIPS.map(rel => (
                <button
                  key={rel}
                  onClick={() => updateAnswer('relationship', rel)}
                  className={`px-4 py-2 font-display text-xl border-b-2 transition-all ${answers.relationship === rel ? 'border-paper-red text-paper-red font-bold' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                >
                  {rel}
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className={`${sheetStyle} rotate-1`}>
             <div className="absolute top-0 right-0 p-4 opacity-10 font-display text-9xl pointer-events-none">#4</div>
             <h2 className={questionStyle}>Где он/она живет?</h2>
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
          <div className={sheetStyle}>
             <div className="absolute top-0 right-0 p-4 opacity-10 font-display text-9xl pointer-events-none">#5</div>
             <h2 className={questionStyle}>Что любит?</h2>
             <p className="font-sans text-gray-400 mb-2 text-sm">(игры, котиков, спать...)</p>
             <textarea
              value={answers.interests}
              onChange={(e) => updateAnswer('interests', e.target.value)}
              className="w-full h-40 bg-[url('https://www.transparenttextures.com/patterns/notebook.png')] bg-white border border-gray-200 p-4 font-sans text-xl outline-none focus:shadow-md resize-none leading-loose"
              style={{ lineHeight: '2rem' }}
            />
          </div>
        );
      case 5:
        return (
           <div className={`${sheetStyle} -rotate-1`}>
             <div className="absolute top-0 right-0 p-4 opacity-10 font-display text-9xl pointer-events-none">#6</div>
             <h2 className={questionStyle}>Бюджет?</h2>
             <div className="flex flex-col gap-2 pl-4 border-l-2 border-red-300">
              {BUDGETS.map(b => (
                <button
                  key={b}
                  onClick={() => updateAnswer('budget', b)}
                  className={`text-left font-sans text-xl py-2 px-2 transition-all flex items-center gap-2 ${answers.budget === b ? 'text-paper-ink font-bold translate-x-2' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <span className={`w-4 h-4 border-2 rounded-full inline-block ${answers.budget === b ? 'bg-paper-ink border-paper-ink' : 'border-gray-300'}`}></span>
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
    <div className="min-h-screen pt-4 pb-32 px-4 bg-paper-dark">
      
      <div className="max-w-md mx-auto">
         {/* Simple Back button */}
         <button onClick={prevStep} className="mb-4 font-display text-xl text-gray-500 hover:text-black">
            ← Назад
         </button>

         {/* Paper Stack Container */}
         <div className="relative z-10">
            {/* Pages beneath decoration */}
            <div className="absolute top-2 left-1 w-full h-full bg-white shadow-sm rotate-2 rounded-sm opacity-50"></div>
            <div className="absolute top-1 left-2 w-full h-full bg-white shadow-sm -rotate-1 rounded-sm opacity-70"></div>
            
            {renderContent()}
         </div>

         {/* Action */}
         <div className="mt-8 flex justify-center">
             <Button 
                onClick={nextStep} 
                disabled={!isCurrentStepValid()} 
                variant="primary"
                className="w-48 !text-2xl"
             >
                {step === 5 ? 'Готово! 🎉' : 'Дальше ->'}
             </Button>
         </div>

         <div className="mt-4 text-center font-sans text-gray-400">
            Страница {step + 1} из 6
         </div>
      </div>
    </div>
  );
};