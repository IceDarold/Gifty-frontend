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

  // CLI Input Style
  const inputStyle = "w-full bg-black border-b-2 border-cyber-green text-cyber-green placeholder-cyber-gray/30 py-2 px-0 text-xl font-mono outline-none focus:border-white transition-all uppercase rounded-none";
  const labelStyle = "text-[10px] font-bold text-cyber-dim font-mono mb-2 block uppercase tracking-widest";
  const questionStyle = "text-xl md:text-2xl font-mono font-bold text-white mb-8 uppercase leading-tight typing-effect";

  const renderContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="animate-flicker">
            <span className={labelStyle}>// CONFIG_STEP_01: IDENTITY</span>
            <h2 className={questionStyle}>ENTER_TARGET_ID:</h2>
            <div className="relative">
                <span className="absolute -left-5 top-2 text-cyber-green animate-blink">{'>'}</span>
                <input
                type="text"
                placeholder="NAME..."
                value={answers.name}
                onChange={(e) => updateAnswer('name', e.target.value)}
                className={inputStyle}
                autoFocus
                />
            </div>
          </div>
        );
      case 1:
        return (
           <div className="animate-flicker">
              <span className={labelStyle}>// CONFIG_STEP_02: LIFECYCLE</span>
              <h2 className={questionStyle}>SELECT_AGE_BRACKET:</h2>
              <div className="grid grid-cols-2 gap-3">
                {AGE_GROUPS.map(age => (
                  <button
                    key={age}
                    onClick={() => updateAnswer('ageGroup', age)}
                    className={`p-3 border font-mono text-xs uppercase text-left relative overflow-hidden group transition-all ${answers.ageGroup === age ? 'bg-cyber-green text-black border-cyber-green' : 'bg-transparent text-cyber-green border-cyber-gray/50 hover:border-cyber-green'}`}
                  >
                    {answers.ageGroup === age && <span className="absolute right-2 top-2">●</span>}
                    [{age}]
                  </button>
                ))}
              </div>
           </div>
        );
      case 2:
        return (
          <div className="animate-flicker">
             <span className={labelStyle}>// CONFIG_STEP_03: RELATION</span>
             <h2 className={questionStyle}>DEFINE_CONNECTION:</h2>
             <div className="grid grid-cols-2 gap-3">
              {RELATIONSHIPS.map(rel => (
                <button
                  key={rel}
                  onClick={() => updateAnswer('relationship', rel)}
                  className={`p-3 border font-mono text-xs uppercase transition-all ${answers.relationship === rel ? 'bg-cyber-alert text-black border-cyber-alert shadow-neon-alert' : 'bg-transparent text-cyber-green border-cyber-gray/50 hover:border-cyber-alert hover:text-cyber-alert'}`}
                >
                  {rel}
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="animate-flicker">
             <span className={labelStyle}>// CONFIG_STEP_04: GEO_DATA</span>
             <h2 className={questionStyle}>TARGET_COORDINATES:</h2>
             <div className="relative">
                <span className="absolute -left-5 top-2 text-cyber-green animate-blink">{'>'}</span>
                <input
                type="text"
                placeholder="CITY..."
                value={answers.city}
                onChange={(e) => updateAnswer('city', e.target.value)}
                className={inputStyle}
                />
             </div>
             <div className="mt-4 p-2 border border-dashed border-cyber-dim bg-cyber-dim/10 text-[9px] font-mono text-cyber-green">
                <span className="animate-pulse">●</span> OPTIMIZING_LOGISTICS_NETWORK
             </div>
          </div>
        );
      case 4:
        return (
          <div className="animate-flicker">
             <span className={labelStyle}>// CONFIG_STEP_05: PSYCH_PROFILE</span>
             <h2 className={questionStyle}>INPUT_DATA_POINTS:</h2>
             <textarea
              placeholder="KEYWORDS: GAMING, SPACE, ART..."
              value={answers.interests}
              onChange={(e) => updateAnswer('interests', e.target.value)}
              className="w-full h-40 bg-black border border-cyber-green text-cyber-green placeholder-cyber-gray/30 p-4 text-lg font-mono outline-none focus:bg-cyber-green/5 resize-none uppercase"
            />
          </div>
        );
      case 5:
        return (
           <div className="animate-flicker">
             <span className={labelStyle}>// CONFIG_STEP_06: RESOURCES</span>
             <h2 className={questionStyle}>MAX_CREDITS:</h2>
             <div className="flex flex-col gap-2">
              {BUDGETS.map(b => (
                <button
                  key={b}
                  onClick={() => updateAnswer('budget', b)}
                  className={`p-3 border font-mono text-xs uppercase text-left transition-all flex justify-between items-center ${answers.budget === b ? 'bg-cyber-green text-black border-cyber-green' : 'bg-transparent text-cyber-green border-cyber-gray/50 hover:border-cyber-green hover:bg-cyber-green/10'}`}
                >
                  <span>{b}</span>
                  {answers.budget === b && (
                     <span className="font-bold text-[10px]">[SELECTED]</span>
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
    <div className="min-h-screen pt-20 pb-32 px-6 bg-cyber-black">
      
      <div className="max-w-md mx-auto relative z-10">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between mb-8 border-b border-cyber-green/30 pb-2">
           <button onClick={prevStep} className="text-cyber-green hover:text-white font-mono text-xs uppercase">
             {'<< PREV'}
           </button>
           <div className="font-mono text-xs text-cyber-green bg-cyber-green/10 px-2 py-1 border border-cyber-green/30">
              SEQ: {step + 1} / 6
           </div>
        </div>

        {/* ASCII Progress Bar */}
        <div className="mb-8 font-mono text-[10px] text-cyber-green tracking-widest text-center opacity-70">
            LOADING_PARAMETERS: [{Array(6).fill(0).map((_, i) => i <= step ? '█' : '░').join('')}]
        </div>

        {/* Content Box */}
        <div className="relative border-x border-cyber-green/20 bg-cyber-black min-h-[400px] px-4">
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
                    className={`${!isCurrentStepValid() ? 'opacity-50 grayscale border-cyber-gray text-cyber-gray' : ''}`}
                >
                    {step === 5 ? 'EXECUTE_PROTOCOL()' : 'NEXT_SEQUENCE >>'}
                </Button>
             </div>
        </div>
      </div>
    </div>
  );
};