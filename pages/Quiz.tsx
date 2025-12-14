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

  // Cyber Input Style
  const inputStyle = "w-full bg-black border border-cyber-green text-cyber-green placeholder-cyber-gray/50 p-4 text-xl font-mono outline-none focus:bg-cyber-green/10 focus:shadow-[0_0_10px_#00ff41] transition-all uppercase";
  const labelStyle = "text-xs font-bold text-cyber-dim font-mono mb-2 block uppercase tracking-widest";
  const questionStyle = "text-2xl md:text-3xl font-mono font-bold text-white mb-6 uppercase leading-tight";

  const renderContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="animate-pulse-glow">
            <span className={labelStyle}>// Step 1: Identification</span>
            <h2 className={questionStyle}>INPUT_TARGET_NAME:</h2>
            <div className="relative">
                <span className="absolute left-4 top-4 text-cyber-dim">{'>'}</span>
                <input
                type="text"
                placeholder="NAME..."
                value={answers.name}
                onChange={(e) => updateAnswer('name', e.target.value)}
                className={`${inputStyle} pl-10`}
                autoFocus
                />
            </div>
          </div>
        );
      case 1:
        return (
           <div className="animate-pulse-glow">
              <span className={labelStyle}>// Step 2: Chronology</span>
              <h2 className={questionStyle}>SELECT_AGE_RANGE:</h2>
              <div className="grid grid-cols-2 gap-4">
                {AGE_GROUPS.map(age => (
                  <button
                    key={age}
                    onClick={() => updateAnswer('ageGroup', age)}
                    className={`p-4 border font-mono text-sm uppercase transition-all ${answers.ageGroup === age ? 'bg-cyber-green text-black border-cyber-green' : 'bg-black text-cyber-green border-cyber-gray hover:border-cyber-green'}`}
                  >
                    [{age}]
                  </button>
                ))}
              </div>
           </div>
        );
      case 2:
        return (
          <div className="animate-pulse-glow">
             <span className={labelStyle}>// Step 3: Classification</span>
             <h2 className={questionStyle}>DEFINE_RELATION:</h2>
             <div className="grid grid-cols-2 gap-3">
              {RELATIONSHIPS.map(rel => (
                <button
                  key={rel}
                  onClick={() => updateAnswer('relationship', rel)}
                  className={`p-3 border font-mono text-xs uppercase transition-all ${answers.relationship === rel ? 'bg-cyber-alert text-black border-cyber-alert' : 'bg-black text-cyber-green border-cyber-gray hover:border-cyber-alert'}`}
                >
                  {rel}
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="animate-pulse-glow">
             <span className={labelStyle}>// Step 4: Geolocation</span>
             <h2 className={questionStyle}>TARGET_COORDINATES:</h2>
             <div className="relative">
                <span className="absolute left-4 top-4 text-cyber-dim">LOC::</span>
                <input
                type="text"
                placeholder="CITY..."
                value={answers.city}
                onChange={(e) => updateAnswer('city', e.target.value)}
                className={`${inputStyle} pl-16`}
                />
             </div>
             <p className="text-cyber-dim text-xs font-mono mt-4">[LOGISTICS_OPTIMIZATION_ENABLED]</p>
          </div>
        );
      case 4:
        return (
          <div className="animate-pulse-glow">
             <span className={labelStyle}>// Step 5: Data Mining</span>
             <h2 className={questionStyle}>INPUT_KEYWORDS:</h2>
             <textarea
              placeholder="Ex: GAMING, COOKING, SPACE..."
              value={answers.interests}
              onChange={(e) => updateAnswer('interests', e.target.value)}
              className="w-full h-40 bg-black border border-cyber-green text-cyber-green placeholder-cyber-gray/50 p-4 text-lg font-mono outline-none focus:bg-cyber-green/10 resize-none uppercase"
            />
          </div>
        );
      case 5:
        return (
           <div className="animate-pulse-glow">
             <span className={labelStyle}>// Step 6: Resources</span>
             <h2 className={questionStyle}>ALLOCATE_BUDGET:</h2>
             <div className="flex flex-col gap-3">
              {BUDGETS.map(b => (
                <button
                  key={b}
                  onClick={() => updateAnswer('budget', b)}
                  className={`p-4 border font-mono text-sm uppercase text-left transition-all flex justify-between ${answers.budget === b ? 'bg-cyber-green text-black border-cyber-green' : 'bg-black text-cyber-green border-cyber-gray hover:border-cyber-green'}`}
                >
                  <span>{b}</span>
                  {answers.budget === b && (
                     <span>[OK]</span>
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
        <div className="flex items-center justify-between mb-8 border-b border-cyber-green pb-2">
           <button onClick={prevStep} className="text-cyber-green hover:bg-cyber-green hover:text-black px-2 py-1 font-mono text-xs">
             {'< BACK'}
           </button>
           <div className="font-mono text-xs text-cyber-green">
              SEQ: {step + 1}/6
           </div>
        </div>

        {/* Progress Bar (ASCII) */}
        <div className="mb-8 font-mono text-xs text-cyber-dim tracking-widest text-center">
            [{Array(6).fill(0).map((_, i) => i <= step ? '█' : '.').join('')}]
        </div>

        {/* Content Box */}
        <div className="relative border border-cyber-gray/30 bg-cyber-black p-6 min-h-[400px]">
            {/* Corners */}
            <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-cyber-green"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-cyber-green"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-cyber-green"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-cyber-green"></div>

            {renderContent()}
        </div>

        {/* Footer Actions */}
        <div className="fixed bottom-24 left-0 right-0 px-6 z-40 pointer-events-none">
             <div className="max-w-md mx-auto pointer-events-auto">
                <Button 
                    onClick={nextStep} 
                    disabled={!isCurrentStepValid()} 
                    fullWidth
                    variant="primary"
                    className={`${!isCurrentStepValid() ? 'opacity-50 grayscale' : ''}`}
                >
                    {step === 5 ? 'RUN_ANALYSIS()' : 'NEXT_STEP >'}
                </Button>
             </div>
        </div>
      </div>
    </div>
  );
};