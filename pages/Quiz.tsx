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
  const notebookPage = "bg-white p-6 shadow-deep relative transform min-h-[450px] mx-2 transition-all duration-300";
  // CSS Grid for lines
  const linedPaper = {
      backgroundImage: 'repeating-linear-gradient(transparent, transparent 39px, #94a3b8 40px)',
      backgroundAttachment: 'local',
      lineHeight: '40px'
  };

  const renderContent = () => {
    switch (step) {
      case 0:
        return (
          <div className={`${notebookPage} rotate-1 torn-top`}>
            <div className="absolute top-4 right-4 text-6xl opacity-10 font-marker">#1</div>
            <h2 className="font-marker text-3xl mb-8 mt-4">Кто счастливчик?</h2>
            <div className="relative">
                <input
                    type="text"
                    placeholder="Имя..."
                    value={answers.name}
                    onChange={(e) => updateAnswer('name', e.target.value)}
                    className="w-full bg-transparent font-sans text-4xl text-blue-700 outline-none pl-4"
                    style={{ background: 'repeating-linear-gradient(transparent, transparent 39px, #94a3b8 40px)', lineHeight: '40px' }}
                    autoFocus
                />
                <div className="absolute left-0 bottom-0 w-full h-1 bg-blue-200 transform -skew-x-12 opacity-50"></div>
            </div>
            <div className="mt-8 transform -rotate-2">
                <span className="bg-yellow-200 px-2 font-doodle text-sm">Не забудь проверить орфографию!</span>
            </div>
          </div>
        );
      case 1:
        return (
           <div className={`${notebookPage} -rotate-1 torn-bottom`}>
              <div className="absolute top-4 right-4 text-6xl opacity-10 font-marker">#2</div>
              <h2 className="font-marker text-3xl mb-6">Сколько лет?</h2>
              <div className="flex flex-wrap gap-4 justify-center">
                {AGE_GROUPS.map(age => (
                  <button
                    key={age}
                    onClick={() => updateAnswer('ageGroup', age)}
                    className={`
                        w-24 h-24 rounded-full flex items-center justify-center font-sans text-2xl transition-all border-4
                        ${answers.ageGroup === age 
                            ? 'bg-craft-red text-white border-craft-red scale-110 shadow-float' 
                            : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400'}
                    `}
                    style={{ borderRadius: '50% 50% 50% 50% / 60% 40% 60% 40%' }} // Imperfect circle
                  >
                    {age}
                  </button>
                ))}
              </div>
           </div>
        );
      case 2:
        return (
          <div className={`${notebookPage} rotate-2`}>
             <div className="absolute top-4 right-4 text-6xl opacity-10 font-marker">#3</div>
             <div className="tape-strip" style={{ top: '-15px', left: '40%', width: '60px' }}></div>
             <h2 className="font-marker text-3xl mb-6">Кто это для тебя?</h2>
             <div className="grid grid-cols-2 gap-4">
              {RELATIONSHIPS.map(rel => (
                <button
                  key={rel}
                  onClick={() => updateAnswer('relationship', rel)}
                  className={`
                    py-2 px-1 font-marker text-xl uppercase tracking-widest border-2 border-black
                    ${answers.relationship === rel ? 'bg-black text-white transform -rotate-1' : 'bg-transparent text-black hover:bg-gray-100'}
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
          <div className={`${notebookPage} -rotate-1 torn-top`}>
             <div className="absolute top-4 right-4 text-6xl opacity-10 font-marker">#4</div>
             <h2 className="font-marker text-3xl mb-6">Город?</h2>
             <input
                type="text"
                placeholder="Москва..."
                value={answers.city}
                onChange={(e) => updateAnswer('city', e.target.value)}
                className="w-full bg-transparent font-sans text-4xl text-blue-700 outline-none border-b-4 border-black pb-2"
             />
             <div className="mt-4 text-right">
                 <span className="font-doodle text-gray-400 text-sm">🚚 Доставка решает</span>
             </div>
          </div>
        );
      case 4:
        return (
          <div className={`${notebookPage} rotate-1`} style={linedPaper}>
             <div className="absolute top-4 right-4 text-6xl opacity-10 font-marker">#5</div>
             <h2 className="font-marker text-3xl mb-2 bg-white inline-block px-2">Интересы?</h2>
             <p className="font-sans text-gray-500 mb-4 bg-white inline-block px-2">Пиши всё что знаешь (игры, еда, спорт)...</p>
             <textarea
              value={answers.interests}
              onChange={(e) => updateAnswer('interests', e.target.value)}
              className="w-full h-60 bg-transparent font-sans text-3xl text-blue-800 outline-none resize-none leading-[40px]"
            />
          </div>
        );
      case 5:
        return (
           <div className={`${notebookPage} -rotate-1 torn-bottom`}>
             <div className="absolute top-4 right-4 text-6xl opacity-10 font-marker">#6</div>
             <h2 className="font-marker text-3xl mb-6">Бюджет?</h2>
             <div className="flex flex-col gap-3">
              {BUDGETS.map(b => (
                <button
                  key={b}
                  onClick={() => updateAnswer('budget', b)}
                  className={`text-left font-sans text-3xl transition-all pl-4 border-l-4 ${answers.budget === b ? 'border-craft-red text-craft-red font-bold pl-6' : 'border-gray-300 text-gray-400'}`}
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
    <div className="min-h-screen pt-8 pb-40 px-2 overflow-hidden">
      
      <div className="max-w-md mx-auto">
         {/* Navigation Controls */}
         <div className="flex justify-between items-center mb-6 px-4">
            <button onClick={prevStep} className="font-marker text-xl hover:underline decoration-wavy">
                ← НАЗАД
            </button>
            <div className="font-doodle bg-white px-3 py-1 rounded-full shadow-sm border border-gray-200">
                {step + 1} / 6
            </div>
         </div>

         {/* The "Paper" */}
         <div className="relative z-10 perspective-1000">
            {renderContent()}
         </div>

         {/* Next Button - A big sticker */}
         <div className="mt-8 flex justify-center">
             <Button 
                onClick={nextStep} 
                disabled={!isCurrentStepValid()} 
                variant="primary"
                className="w-full !text-2xl !py-4 shadow-deep !bg-[#2b2b2b]"
                style={{ clipPath: 'polygon(0% 0%, 100% 5%, 95% 100%, 5% 95%)' }}
             >
                {step === 5 ? 'ГОТОВО! 🎉' : 'ДАЛЬШЕ 👉'}
             </Button>
         </div>
      </div>
    </div>
  );
};