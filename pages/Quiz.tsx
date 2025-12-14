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

  // Notebook Styles
  const notebookStyle = {
      background: 'linear-gradient(to bottom, transparent 39px, #94a3b8 40px)',
      backgroundSize: '100% 40px',
      backgroundColor: 'white',
      lineHeight: '40px'
  };

  const inputClass = "w-full bg-transparent font-hand text-4xl text-blue-800 outline-none leading-[40px]";

  const renderContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="relative">
             <div className="font-marker text-2xl mb-8 transform -rotate-1 text-gray-800">1. Как зовут счастливчика?</div>
             <input
                type="text"
                placeholder="Имя..."
                value={answers.name}
                onChange={(e) => updateAnswer('name', e.target.value)}
                className={inputClass}
                autoFocus
             />
             <div className="absolute -right-4 top-20 text-red-500 font-doodle text-sm opacity-60 transform rotate-12">
                 *пиши разборчиво!
             </div>
          </div>
        );
      case 1:
        return (
           <div>
              <div className="font-marker text-2xl mb-6 transform rotate-1 text-gray-800">2. Сколько лет?</div>
              <div className="flex flex-wrap gap-4 pl-4">
                {AGE_GROUPS.map(age => (
                  <button
                    key={age}
                    onClick={() => updateAnswer('ageGroup', age)}
                    className={`
                        font-hand text-2xl px-3 py-1 border-2 border-black rounded-lg transform transition-all hover:scale-105
                        ${answers.ageGroup === age ? 'bg-marker-yellow rotate-[-2deg] shadow-sticker' : 'bg-white rotate-1 hover:bg-gray-50'}
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
          <div>
             <div className="font-marker text-2xl mb-6 text-gray-800">3. Кто это для тебя?</div>
             <div className="grid grid-cols-2 gap-y-4 gap-x-2">
              {RELATIONSHIPS.map((rel, i) => (
                <button
                  key={rel}
                  onClick={() => updateAnswer('relationship', rel)}
                  className={`
                    text-left font-typewriter text-lg border-b border-dashed border-gray-400 pb-1
                    ${answers.relationship === rel ? 'text-red-600 font-bold decoration-wavy underline' : 'text-gray-600'}
                  `}
                >
                  {i+1}. {rel}
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div>
             <div className="font-marker text-2xl mb-8 transform -rotate-1 text-gray-800">4. Из какого города?</div>
             <input
                type="text"
                placeholder="Город..."
                value={answers.city}
                onChange={(e) => updateAnswer('city', e.target.value)}
                className={inputClass}
             />
          </div>
        );
      case 4:
        return (
          <div>
             <div className="font-marker text-2xl mb-2 text-gray-800">5. Чем увлекается?</div>
             <p className="font-hand text-xl text-gray-500 mb-4">(игры, готовка, спать...)</p>
             <textarea
              value={answers.interests}
              onChange={(e) => updateAnswer('interests', e.target.value)}
              className={`${inputClass} h-60 resize-none`}
              style={{ lineHeight: '40px' }}
            />
          </div>
        );
      case 5:
        return (
           <div>
             <div className="font-marker text-2xl mb-6 text-gray-800">6. Бюджет?</div>
             <div className="flex flex-col gap-4">
              {BUDGETS.map((b, i) => (
                <button
                  key={b}
                  onClick={() => updateAnswer('budget', b)}
                  className={`flex items-center gap-3 font-hand text-3xl transition-all ${answers.budget === b ? 'text-green-700 font-bold translate-x-4' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <div className={`w-6 h-6 border-2 border-black rounded-sm ${answers.budget === b ? 'bg-black' : ''}`}></div>
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
    <div className="min-h-screen pt-10 pb-40 px-4">
      
      {/* SPIRAL NOTEBOOK CONTAINER */}
      <div className="max-w-md mx-auto relative group">
         
         {/* Notebook Binding */}
         <div className="absolute top-0 left-4 w-8 h-full z-20 flex flex-col gap-4 py-6">
             {[...Array(12)].map((_, i) => (
                 <div key={i} className="w-8 h-4 bg-gray-300 rounded-full border border-gray-400 shadow-inner"></div>
             ))}
         </div>

         {/* The Paper Page */}
         <div 
            className="bg-white min-h-[500px] shadow-lifted pl-16 pr-6 py-10 relative torn-edge"
            style={notebookStyle}
         >
            {/* Red margin line */}
            <div className="absolute top-0 left-12 w-0.5 h-full bg-red-200/80"></div>

            {/* Content */}
            {renderContent()}

            {/* Navigation Arrows */}
            <div className="absolute bottom-8 right-6 flex gap-4">
                <button onClick={prevStep} className="font-marker text-gray-400 hover:text-black">
                    НАЗАД
                </button>
                <button 
                    onClick={nextStep} 
                    disabled={!isCurrentStepValid()} 
                    className={`font-marker text-xl ${isCurrentStepValid() ? 'text-red-600 animate-pulse' : 'text-gray-300'}`}
                >
                    {step === 5 ? 'ГОТОВО!' : 'ДАЛЬШЕ ->'}
                </button>
            </div>
         </div>
      </div>
    </div>
  );
};