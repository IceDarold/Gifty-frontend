import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/Button';
import { Mascot } from '../components/Mascot';
import { RELATIONSHIPS } from '../constants';
import { QuizAnswers } from '../types';
import { track } from '../utils/analytics';
import { inclineName } from '../utils/stringUtils';

// --- Icons ---
const Icons = {
  NewYear: () => <span className="text-3xl">🎄</span>,
  Birthday: () => <span className="text-3xl">🎂</span>,
  Wedding: () => <span className="text-3xl">💍</span>,
  Anniversary: () => <span className="text-3xl">💑</span>,
  JustBecause: () => <span className="text-3xl">🎁</span>,
  Edit: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9"></path>
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
    </svg>
  ),
  Male: () => <span className="text-3xl">👨</span>,
  Female: () => <span className="text-3xl">👩</span>,
  Unisex: () => <span className="text-3xl">✨</span>,
  Vibes: {
    Cozy: () => <span className="text-3xl">☕️</span>,
    Practical: () => <span className="text-3xl">🛠</span>,
    Wow: () => <span className="text-3xl">🚀</span>,
    Emotional: () => <span className="text-3xl">🥹</span>,
  }
};

const INITIAL_ANSWERS: QuizAnswers = {
  name: '',
  ageGroup: '25',
  recipientGender: null,
  occasion: '',
  relationship: '',
  vibe: '',
  city: '',
  interests: '',
  budget: ''
};

const INTEREST_TAGS = [
  'Технологии', 'Кулинария', 'Спорт', 'Чтение', 'Путешествия', 
  'Дом и уют', 'Красота', 'Кино', 'Музыка', 'Творчество', 
  'Игры', 'Здоровье', 'Эко', 'Стиль'
];

const OCCASIONS = [
  { id: 'new_year', label: 'Новый год', desc: 'Главный праздник', Icon: Icons.NewYear },
  { id: 'birthday', label: 'День рождения', desc: 'Личный праздник', Icon: Icons.Birthday },
  { id: 'wedding', label: 'Свадьба', desc: 'Начало истории', Icon: Icons.Wedding },
  { id: 'anniversary', label: 'Годовщина', desc: 'Важная дата', Icon: Icons.Anniversary },
  { id: 'just_because', label: 'Просто так', desc: 'Без повода', Icon: Icons.JustBecause }
];

const VIBES = [
  { id: 'cozy', label: 'Уют и тепло', icon: Icons.Vibes.Cozy, desc: 'Хюгге, спокойствие' },
  { id: 'practical', label: 'Практично', icon: Icons.Vibes.Practical, desc: 'Польза в деле' },
  { id: 'wow', label: 'Вау-эффект', icon: Icons.Vibes.Wow, desc: 'Удивить всех' },
  { id: 'emotional', label: 'Эмоции', icon: Icons.Vibes.Emotional, desc: 'До слез' }
];

// --- Components ---

const StepHeader: React.FC<{ title: React.ReactNode; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="text-center mb-10 animate-fade-in-up">
    <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight mb-3 drop-shadow-xl">
      {title}
    </h2>
    {subtitle && (
      <p className="text-white/60 text-lg font-medium">
        {subtitle}
      </p>
    )}
  </div>
);

const SelectionCard: React.FC<{ 
  selected: boolean; 
  onClick: () => void; 
  icon?: React.ReactNode; 
  label: string; 
  desc?: string;
  className?: string;
}> = ({ selected, onClick, icon, label, desc, className = '' }) => (
  <button
    onClick={onClick}
    className={`group relative w-full text-left p-5 rounded-3xl transition-all duration-300 border backdrop-blur-md flex items-center gap-5 outline-none focus:ring-4 focus:ring-brand-purple/30 ${
      selected 
        ? 'bg-white text-brand-dark border-white shadow-[0_0_30px_rgba(255,255,255,0.2)] scale-[1.02] z-10' 
        : 'bg-white/5 text-white border-white/10 hover:bg-white/10 hover:border-white/20 active:scale-[0.98]'
    } ${className}`}
  >
    {icon && (
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-300 ${
        selected ? 'bg-brand-blue/10' : 'bg-white/10 group-hover:bg-white/20'
      }`}>
        {icon}
      </div>
    )}
    <div className="flex-1 min-w-0">
      <div className="font-bold text-lg leading-tight truncate">{label}</div>
      {desc && (
        <div className={`text-xs font-medium mt-1 truncate ${selected ? 'text-brand-dark/60' : 'text-white/40'}`}>
          {desc}
        </div>
      )}
    </div>
    
    {/* Radio Indicator */}
    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
      selected ? 'border-brand-blue' : 'border-white/20 group-hover:border-white/40'
    }`}>
      {selected && <div className="w-3 h-3 bg-brand-blue rounded-full" />}
    </div>
  </button>
);

const AgePicker: React.FC<{ value: string, onChange: (val: string) => void }> = ({ value, onChange }) => {
  const ages = Array.from({ length: 100 }, (_, i) => i);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
        const parsed = parseInt(value);
        const initial = isNaN(parsed) ? 25 : parsed;
        const stride = 76; // 60px item + 16px gap
        const offset = 30; // Half item width to center
        scrollRef.current.scrollLeft = initial * stride + offset;
    }
  }, []);

  const handleScroll = () => {
      if (scrollRef.current) {
          const stride = 76;
          const offset = 30;
          const index = Math.round((scrollRef.current.scrollLeft - offset) / stride);
          
          if (index >= 0 && index < ages.length) {
              if (index.toString() !== value) {
                  onChange(index.toString());
              }
          }
      }
  };

  const handleClick = (age: number) => {
      if (scrollRef.current) {
          const stride = 76;
          const offset = 30;
          scrollRef.current.scrollTo({
              left: age * stride + offset,
              behavior: 'smooth'
          });
      }
  };

  return (
    <div className="relative w-full h-32 flex items-center group">
        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#0B0033]/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#0B0033]/80 to-transparent z-10 pointer-events-none" />
        
        {/* Selection Marker */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[64px] -translate-x-1/2 border-x-2 border-brand-purple/50 bg-white/5 rounded-2xl z-0 pointer-events-none backdrop-blur-sm" />

        <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex items-center gap-4 overflow-x-auto no-scrollbar px-[50%] snap-x snap-mandatory py-4 w-full"
        >
            {ages.map((age) => (
                <button
                    key={age}
                    onClick={() => handleClick(age)}
                    className={`snap-center shrink-0 w-[60px] h-[60px] rounded-xl flex items-center justify-center text-3xl font-black transition-all duration-300 ${
                        value === age.toString() 
                            ? 'text-white scale-125 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]' 
                            : 'text-white/20 hover:text-white/50 scale-90'
                    }`}
                >
                    {age}
                </button>
            ))}
        </div>
        <div className="absolute bottom-[-20px] left-0 right-0 text-center text-xs font-bold text-brand-purple uppercase tracking-widest opacity-80">
            {parseInt(value) % 10 === 1 && parseInt(value) !== 11 ? 'год' : (parseInt(value) % 10 >= 2 && parseInt(value) % 10 <= 4 && (parseInt(value) < 10 || parseInt(value) > 20)) ? 'года' : 'лет'}
        </div>
    </div>
  );
};

// --- Main Quiz Component ---

export const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(0);
  
  const [answers, setAnswers] = useState<QuizAnswers>(() => {
    if (location.state) {
        const { name, relationship } = location.state as { name: string, relationship: string };
        return { ...INITIAL_ANSWERS, name: name || '', relationship: relationship || '' };
    }
    try {
        const saved = localStorage.getItem('gifty_draft');
        // Merge with INITIAL_ANSWERS to ensure no keys are missing
        return saved ? { ...INITIAL_ANSWERS, ...JSON.parse(saved) } : INITIAL_ANSWERS;
    } catch (e) {
        return INITIAL_ANSWERS;
    }
  });

  // Custom inputs state
  const [customOccasion, setCustomOccasion] = useState('');
  const [isCustomOccasion, setIsCustomOccasion] = useState(false);
  const [customRelationship, setCustomRelationship] = useState('');
  const [isCustomRelationship, setIsCustomRelationship] = useState(false);
  const [customVibe, setCustomVibe] = useState('');
  const [isCustomVibe, setIsCustomVibe] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    localStorage.setItem('gifty_draft', JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
      const timer = setTimeout(() => {
          if (inputRef.current) inputRef.current.focus();
          if (textAreaRef.current) textAreaRef.current.focus();
      }, 400);
      return () => clearTimeout(timer);
  }, [step]);

  const updateAnswer = (field: keyof QuizAnswers, value: any) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    track('quiz_step', { step: step + 1 });
    if (step === 8) {
      const finalAnswers = { ...answers };
      const combinedInterests = [...selectedTags, ...(answers.interests ? [answers.interests] : [])].join(', ');
      finalAnswers.interests = combinedInterests;
      
      if (isCustomOccasion) finalAnswers.occasion = customOccasion;
      if (isCustomRelationship) finalAnswers.relationship = customRelationship;
      if (isCustomVibe) finalAnswers.vibe = customVibe;
      
      // Ensure budget is clean number
      finalAnswers.budget = (finalAnswers.budget || '').replace(/\D/g, '');
      
      localStorage.setItem('gifty_answers', JSON.stringify(finalAnswers));
      navigate('/results');
    } else {
      setStep(s => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (step > 0) {
        setStep(s => s - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        navigate('/');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isCurrentStepValid()) nextStep();
  };

  const isCurrentStepValid = () => {
    switch (step) {
      case 0: return (answers.name || '').trim().length > 0;
      case 1: return true; 
      case 2: return !!answers.recipientGender;
      case 3: return isCustomOccasion ? customOccasion.trim().length > 0 : (answers.occasion || '').length > 0;
      case 4: return isCustomRelationship ? customRelationship.trim().length > 0 : (answers.relationship || '').length > 0;
      case 5: return isCustomVibe ? customVibe.trim().length > 0 : (answers.vibe || '').length > 0;
      case 6: return (answers.city || '').trim().length > 0;
      case 7: return ((answers.interests || '').trim().length > 0 || selectedTags.length > 0);
      case 8: return (answers.budget || '').length > 0 && parseInt(answers.budget) > 0;
      default: return false;
    }
  };

  const toggleTag = (tag: string) => {
      setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const getGenderLabels = () => {
      const age = parseInt(answers.ageGroup) || 25;
      if (age <= 12) return { female: 'Девочка', male: 'Мальчик' };
      if (age <= 20) return { female: 'Девушка', male: 'Парень' };
      return { female: 'Женщина', male: 'Мужчина' };
  };

  const renderContent = () => {
    const genderLabels = getGenderLabels();

    return (
        <div key={step} className={`w-full max-w-lg mx-auto animate-fade-in`}>
            {step === 0 && (
                <>
                    <StepHeader title="Как зовут счастливчика?" subtitle="Начнем с малого" />
                    <div className="relative group">
                        <input
                            ref={inputRef}
                            type="text"
                            value={answers.name}
                            onChange={(e) => updateAnswer('name', e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Имя"
                            className="w-full bg-transparent text-center text-5xl font-black text-white placeholder-white/10 outline-none border-b-2 border-white/20 focus:border-brand-blue transition-all pb-4 caret-brand-blue"
                        />
                    </div>
                </>
            )}

            {step === 1 && (
                <>
                    <StepHeader title={`Сколько лет ${inclineName(answers.name || '', 'dative')}?`} subtitle="Чтобы попасть в точку" />
                    <div className="py-10">
                        <AgePicker value={answers.ageGroup} onChange={(val) => updateAnswer('ageGroup', val)} />
                    </div>
                </>
            )}

            {step === 2 && (
                <>
                    <StepHeader title="Пол получателя" subtitle="Для уточнения интересов" />
                    <div className="grid grid-cols-1 gap-4">
                        {[
                            { id: 'female', label: genderLabels.female, Icon: Icons.Female },
                            { id: 'male', label: genderLabels.male, Icon: Icons.Male },
                            { id: 'unisex', label: 'Не важно', Icon: Icons.Unisex }
                        ].map((g) => (
                            <SelectionCard
                                key={g.id}
                                label={g.label}
                                icon={<g.Icon />}
                                selected={answers.recipientGender === g.id}
                                onClick={() => { updateAnswer('recipientGender', g.id); setTimeout(nextStep, 250); }}
                            />
                        ))}
                    </div>
                </>
            )}

            {step === 3 && (
                <>
                    <StepHeader title="По какому поводу?" subtitle="Контекст решает всё" />
                    <div className="grid grid-cols-1 gap-3 mb-6">
                        {OCCASIONS.map(occ => (
                            <SelectionCard
                                key={occ.id}
                                label={occ.label}
                                desc={occ.desc}
                                icon={<occ.Icon />}
                                selected={!isCustomOccasion && answers.occasion === occ.label}
                                onClick={() => { setIsCustomOccasion(false); updateAnswer('occasion', occ.label); setTimeout(nextStep, 250); }}
                            />
                        ))}
                        <SelectionCard 
                            label="Свой вариант"
                            desc="Опишите своими словами"
                            icon={<Icons.Edit />}
                            selected={isCustomOccasion}
                            onClick={() => { setIsCustomOccasion(true); updateAnswer('occasion', ''); }}
                        />
                    </div>
                    {isCustomOccasion && (
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Например: Выпускной"
                            value={customOccasion}
                            onChange={(e) => setCustomOccasion(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full bg-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/30 font-bold outline-none border border-white/20 focus:border-brand-purple"
                        />
                    )}
                </>
            )}

            {step === 4 && (
                <>
                    <StepHeader title="Кто этот человек для вас?" />
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        {RELATIONSHIPS.map(rel => (
                            <button
                                key={rel}
                                onClick={() => { setIsCustomRelationship(false); updateAnswer('relationship', rel); setTimeout(nextStep, 250); }}
                                className={`p-4 rounded-2xl font-bold text-sm transition-all border ${
                                    !isCustomRelationship && answers.relationship === rel
                                    ? 'bg-white text-brand-blue border-white shadow-lg scale-105'
                                    : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                                }`}
                            >
                                {rel}
                            </button>
                        ))}
                        <button
                            onClick={() => { setIsCustomRelationship(true); updateAnswer('relationship', ''); }}
                            className={`p-4 rounded-2xl font-bold text-sm transition-all border col-span-2 ${
                                isCustomRelationship
                                ? 'bg-white text-brand-blue border-white shadow-lg'
                                : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                            }`}
                        >
                            Другое
                        </button>
                    </div>
                    {isCustomRelationship && (
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Кем приходится?"
                            value={customRelationship}
                            onChange={(e) => setCustomRelationship(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full bg-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/30 font-bold outline-none border border-white/20 focus:border-brand-purple"
                        />
                    )}
                </>
            )}

            {step === 5 && (
                <>
                    <StepHeader title="Какое настроение?" subtitle="Эмоциональный окрас" />
                    <div className="grid grid-cols-1 gap-3 mb-6">
                        {VIBES.map(v => (
                            <SelectionCard
                                key={v.id}
                                label={v.label}
                                desc={v.desc}
                                icon={<v.icon />}
                                selected={!isCustomVibe && answers.vibe === v.label}
                                onClick={() => { setIsCustomVibe(false); updateAnswer('vibe', v.label); setTimeout(nextStep, 250); }}
                            />
                        ))}
                        <SelectionCard
                            label="Свой вариант"
                            icon={<Icons.Edit />}
                            selected={isCustomVibe}
                            onClick={() => { setIsCustomVibe(true); updateAnswer('vibe', ''); }}
                        />
                    </div>
                    {isCustomVibe && (
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Опишите вайб..."
                            value={customVibe}
                            onChange={(e) => setCustomVibe(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full bg-white/10 rounded-2xl px-6 py-4 text-white placeholder-white/30 font-bold outline-none border border-white/20 focus:border-brand-purple"
                        />
                    )}
                </>
            )}

            {step === 6 && (
                <>
                    <StepHeader title="Город доставки" subtitle="Чтобы найти товары рядом" />
                    <div className="relative group">
                        <div className="absolute top-1/2 left-0 -translate-y-1/2 text-white/30">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        </div>
                        <input
                            ref={inputRef}
                            type="text"
                            value={answers.city}
                            onChange={(e) => updateAnswer('city', e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Москва"
                            className="w-full bg-transparent pl-12 text-4xl font-black text-white placeholder-white/10 outline-none border-b-2 border-white/20 focus:border-brand-blue transition-all pb-4 caret-brand-blue"
                        />
                    </div>
                </>
            )}

            {step === 7 && (
                <>
                    <StepHeader title="Интересы и хобби" subtitle="Чем подробнее, тем лучше" />
                    <div className="flex flex-wrap gap-2 mb-8 justify-center">
                        {INTEREST_TAGS.map(tag => (
                            <button
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                                    selectedTags.includes(tag) 
                                    ? 'bg-white text-brand-dark border-white shadow-lg scale-105' 
                                    : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                                }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <textarea
                            ref={textAreaRef}
                            value={answers.interests}
                            onChange={(e) => updateAnswer('interests', e.target.value)}
                            placeholder="Напишите всё, что знаете: любит Гарри Поттера, мечтает о собаке, пьет много кофе..."
                            className="w-full h-40 bg-white/10 rounded-3xl p-6 text-white placeholder-white/30 font-medium text-lg outline-none border border-white/10 focus:border-brand-purple focus:bg-white/15 transition-all resize-none shadow-inner"
                        />
                    </div>
                </>
            )}

            {step === 8 && (
                <>
                    <StepHeader title="Бюджет" subtitle="Сколько готовы потратить?" />
                    <div className="relative mb-8">
                        <input
                            ref={inputRef}
                            type="text"
                            inputMode="numeric"
                            placeholder="0"
                            value={(answers.budget || '').replace(/\D/g, '')}
                            onChange={(e) => updateAnswer('budget', e.target.value.replace(/\D/g, ''))}
                            onKeyDown={handleKeyDown}
                            className="w-full bg-transparent text-center text-6xl font-black text-white placeholder-white/10 outline-none border-b-2 border-white/20 focus:border-brand-blue transition-all pb-4"
                        />
                        <span className="absolute top-1/2 right-4 -translate-y-1/2 text-2xl font-bold text-white/30">₽</span>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-3">
                        {[1000, 3000, 5000, 10000, 15000, 25000].map(amount => (
                            <button
                                key={amount}
                                onClick={() => updateAnswer('budget', amount.toString())}
                                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all border border-white/5"
                            >
                                {amount.toLocaleString()} ₽
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
  };

  return (
    <div className="min-h-screen pt-safe-top pb-safe-bottom flex flex-col relative overflow-hidden bg-brand-dark">
      
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-brand-blue/20 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-purple/20 rounded-full blur-[120px] animate-blob" />
      </div>

      {/* Navigation Bar */}
      <div className="relative z-50 px-6 py-6 flex items-center justify-between">
          <button 
            onClick={prevStep}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white transition-all active:scale-90 border border-white/10 backdrop-blur-md"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-80"><path d="M15 18l-6-6 6-6"/></svg>
          </button>

          {/* Segmented Progress */}
          <div className="flex gap-1.5 absolute left-1/2 -translate-x-1/2">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div 
                    key={i} 
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                        i <= step ? 'w-6 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'w-1.5 bg-white/10'
                    }`} 
                  />
              ))}
          </div>

          <div className="w-12 h-12" /> {/* Spacer */}
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col items-center justify-center px-6 relative z-10">
          
          {/* Mascot stays constant but reacts */}
          <div className="mb-8 transition-transform duration-500 hover:scale-105 cursor-pointer">
             <Mascot 
                className="w-32 h-32 md:w-40 md:h-40 drop-shadow-2xl" 
                emotion={step === 0 ? 'happy' : step === 7 ? 'thinking' : step === 8 ? 'cool' : 'excited'}
                accessory="santa-hat"
             />
          </div>

          <div className="w-full">
              {renderContent()}
          </div>
      </div>

      {/* Bottom Action Area */}
      <div className="p-6 pb-8 relative z-50">
         <div className="max-w-lg mx-auto">
            <Button 
                onClick={nextStep} 
                disabled={!isCurrentStepValid()} 
                fullWidth 
                className={`h-16 text-xl rounded-2xl shadow-xl transition-all duration-500 ${
                    !isCurrentStepValid() 
                    ? 'opacity-30 grayscale cursor-not-allowed bg-white/10 text-white' 
                    : 'bg-gradient-to-r from-brand-blue to-brand-purple text-white hover:scale-[1.02] active:scale-95 shadow-[0_0_40px_rgba(37,99,235,0.4)]'
                }`}
            >
                <div className="flex items-center justify-center gap-2">
                    {step === 8 ? 'Сотворить магию' : 'Далее'}
                    {isCurrentStepValid() && step !== 8 && (
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    )}
                    {step === 8 && <span className="text-2xl">✨</span>}
                </div>
            </Button>
         </div>
      </div>

      {/* Animations Styles */}
      <style>{`
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in {
            animation: fadeInUp 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};