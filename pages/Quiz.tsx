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

  // Glassy Input Styles
  const inputStyle = "w-full bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-2xl p-6 text-2xl font-serif text-center outline-none focus:bg-white/10 focus:border-white/30 focus:shadow-[0_0_30px_rgba(100,100,255,0.2)] transition-all";
  const labelStyle = "text-xs font-bold text-indigo-300 uppercase tracking-widest mb-4 block";
  const questionStyle = "text-3xl md:text-4xl font-serif text-white mb-8 leading-tight";

  const renderContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="text-center animate-fade-in">
            <Mascot emotion="happy" className="w-24 h-24 mx-auto mb-6 opacity-90" />
            <span className={labelStyle}>Персонализация</span>
            <h2 className={questionStyle}>Как зовут счастливчика?</h2>
            <input
              type="text"
              placeholder="Введите имя..."
              value={answers.name}
              onChange={(e) => updateAnswer('name', e.target.value)}
              className={inputStyle}
              autoFocus
            />
          </div>
        );
      case 1:
        return (
           <div className="text-center animate-fade-in">
              <span className={labelStyle}>Возраст</span>
              <h2 className={questionStyle}>Сколько лет {answers.name || 'ему/ей'}?</h2>
              <div className="grid grid-cols-2 gap-4">
                {AGE_GROUPS.map(age => (
                  <button
                    key={age}
                    onClick={() => updateAnswer('ageGroup', age)}
                    className={`p-4 rounded-2xl font-medium transition-all duration-300 ${answers.ageGroup === age ? 'bg-indigo-600 text-white shadow-lg border border-indigo-400' : 'glass-panel text-white/80 hover:bg-white/10'}`}
                  >
                    {age}
                  </button>
                ))}
              </div>
           </div>
        );
      case 2:
        return (
          <div className="text-center animate-fade-in">
             <span className={labelStyle}>Отношения</span>
             <h2 className={questionStyle}>Кто этот человек для вас?</h2>
             <div className="grid grid-cols-2 gap-3">
              {RELATIONSHIPS.map(rel => (
                <button
                  key={rel}
                  onClick={() => updateAnswer('relationship', rel)}
                  className={`p-3 rounded-2xl font-medium transition-all duration-300 ${answers.relationship === rel ? 'bg-fuchsia-600 text-white shadow-lg border border-fuchsia-400' : 'glass-panel text-white/80 hover:bg-white/10'}`}
                >
                  {rel}
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="text-center animate-fade-in">
             <Mascot emotion="thinking" className="w-24 h-24 mx-auto mb-6 opacity-90" />
             <span className={labelStyle}>Локация</span>
             <h2 className={questionStyle}>Где он или она живет?</h2>
             <p className="text-white/50 text-sm mb-6 font-light">Это поможет подобрать доступные варианты доставки</p>
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
          <div className="text-center animate-fade-in">
             <span className={labelStyle}>Интересы & Хобби</span>
             <h2 className={questionStyle}>Чем увлекается?</h2>
             <textarea
              placeholder="Например: Любит готовить, фанат Marvel, занимается йогой..."
              value={answers.interests}
              onChange={(e) => updateAnswer('interests', e.target.value)}
              className="w-full h-40 bg-white/5 border border-white/10 text-white placeholder-white/30 rounded-2xl p-6 text-xl font-medium outline-none focus:bg-white/10 focus:border-white/30 focus:shadow-[0_0_30px_rgba(100,100,255,0.2)] transition-all resize-none text-center"
            />
          </div>
        );
      case 5:
        return (
           <div className="text-center animate-fade-in">
             <span className={labelStyle}>Финансы</span>
             <h2 className={questionStyle}>Комфортный бюджет?</h2>
             <div className="flex flex-col gap-3">
              {BUDGETS.map(b => (
                <button
                  key={b}
                  onClick={() => updateAnswer('budget', b)}
                  className={`p-5 rounded-2xl font-medium text-left transition-all duration-300 flex justify-between items-center ${answers.budget === b ? 'bg-indigo-600 text-white shadow-lg border border-indigo-400' : 'glass-panel text-white/80 hover:bg-white/10'}`}
                >
                  <span>{b}</span>
                  {answers.budget === b && (
                     <span className="text-lg">✨</span>
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
    <div className="min-h-screen pt-24 pb-32 px-6 relative">
      
      <div className="max-w-md mx-auto relative z-10">
        
        {/* Top Nav */}
        <div className="flex items-center justify-between mb-8">
           <button onClick={prevStep} className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-all">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
           </button>
           <div className="flex gap-1">
              {[0,1,2,3,4,5].map(i => (
                  <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i <= step ? 'w-6 bg-white shadow-[0_0_10px_white]' : 'w-2 bg-white/20'}`} />
              ))}
           </div>
           <div className="w-10"></div> 
        </div>

        {/* Content Card */}
        <div className="glass-panel p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-xl border border-white/5 min-h-[450px] flex flex-col justify-center">
            {renderContent()}
        </div>

        {/* Footer Actions */}
        <div className="fixed bottom-28 left-0 right-0 px-6 z-40 pointer-events-none">
             <div className="max-w-md mx-auto pointer-events-auto">
                <Button 
                    onClick={nextStep} 
                    disabled={!isCurrentStepValid()} 
                    fullWidth
                    variant="primary"
                    className={`${!isCurrentStepValid() ? 'opacity-50 grayscale' : 'animate-pulse-glow'}`}
                >
                    {step === 5 ? 'Подобрать Подарки ✨' : 'Далее'}
                </Button>
             </div>
        </div>
      </div>
      
      <style>{`
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; opacity: 0; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};