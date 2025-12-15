import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { api } from '../api';
import { UserProfile } from '../domain/types';
import { RELATIONSHIPS } from '../constants';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Event Form
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', personName: '', relationship: RELATIONSHIPS[0] });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [user, wishlistIds] = await Promise.all([api.user.get(), api.wishlist.getAll()]);
      setProfile(user);
      setWishlistCount(wishlistIds.length);
    } catch (e) { console.error(e); } 
    finally { setLoading(false); }
  };

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.date) return;
    await api.user.addEvent(newEvent);
    setShowEventForm(false);
    setNewEvent({ title: '', date: '', personName: '', relationship: RELATIONSHIPS[0] });
    loadData();
  };

  const handleRemoveEvent = async (id: string) => {
    if (confirm('Вычеркнуть из планера?')) {
        await api.user.removeEvent(id);
        loadData();
    }
  };

  if (loading || !profile) return <div className="p-12 font-typewriter text-center text-xl text-pencil">Листаем страницы...</div>;

  return (
    <div className="relative w-full max-w-4xl mx-auto perspective-1000">
      {/* LEATHER NOTEBOOK BINDING */}
      <div className="absolute top-0 bottom-0 left-0 w-8 md:w-12 bg-[#3e2723] rounded-l-lg shadow-2xl z-20 flex flex-col items-center py-8 gap-4">
          {[...Array(6)].map((_, i) => (
              <div key={i} className="w-full h-2 bg-[#1b100e] opacity-50 border-b border-white/10"></div>
          ))}
      </div>

      {/* OPEN NOTEBOOK PAGE */}
      <div className="bg-[#fdfbf7] min-h-[80vh] ml-4 md:ml-6 pl-8 md:pl-12 pr-8 py-12 shadow-paper rounded-r-lg relative texture-paper">
          
          {/* RINGS */}
          <div className="absolute top-0 bottom-0 left-2 w-4 flex flex-col justify-evenly py-8 z-30">
              {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-4 border-gray-400 bg-transparent -ml-6 shadow-sm"></div>
              ))}
          </div>

          {/* BOOKMARK */}
          <div className="absolute -top-4 right-16 w-8 h-32 bg-red-800 shadow-md z-30 rounded-b-sm"></div>

          {/* 1. IDENTITY CARD (Paperclipped) */}
          <div className="relative mb-16 rotate-1">
              {/* Paperclip */}
              <div className="absolute -top-4 right-1/2 w-8 h-20 border-4 border-gray-400 rounded-full z-20 -translate-x-1/2"></div>
              
              <div className="bg-white p-6 shadow-floating max-w-lg mx-auto border border-gray-200 transform rotate-[-1deg]">
                  <div className="flex items-center gap-6">
                      <div className="w-24 h-24 bg-gray-100 border-2 border-gray-300 p-1 rotate-[-2deg]">
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-4xl grayscale">
                              {profile.avatarEmoji}
                          </div>
                      </div>
                      <div>
                          <h1 className="font-handwritten text-4xl text-ink underline decoration-dashed decoration-gray-300 mb-2">{profile.name}</h1>
                          <div className="font-typewriter text-xs text-pencil space-y-1">
                              <p>СТАТУС: {profile.level}</p>
                              <p>СОХРАНЕНО: {wishlistCount} идей</p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          {/* 2. CALENDAR / PLANNER SECTION */}
          <div className="relative">
              <div className="flex justify-between items-end mb-6 border-b-2 border-pencil/20 pb-2">
                  <h2 className="font-handwritten text-3xl text-ink">Важные Даты</h2>
                  <button 
                    onClick={() => setShowEventForm(!showEventForm)}
                    className="font-typewriter text-xs text-pencil hover:text-stamp-red border border-pencil/30 px-2 py-1 rounded-sm bg-white shadow-sm"
                  >
                      {showEventForm ? '- ОТМЕНА' : '+ ЗАПИСАТЬ'}
                  </button>
              </div>

              {/* HANDWRITTEN EVENTS */}
              <div className="space-y-6 relative min-h-[200px]">
                  {/* Notebook lines background */}
                  <div className="absolute inset-0 z-0 pointer-events-none" style={{background: 'repeating-linear-gradient(transparent, transparent 31px, #a3d4f7 32px)'}}></div>

                  {showEventForm && (
                      <div className="relative z-10 bg-yellow-100 p-4 shadow-floating rotate-1 w-full max-w-sm ml-auto mb-8 transform transition-all">
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-tape/50 rotate-1"></div>
                          <h3 className="font-handwritten text-xl mb-2 text-ink">Новое событие:</h3>
                          <div className="space-y-2">
                              <input 
                                type="text" 
                                className="w-full bg-transparent border-b border-pencil/50 font-handwritten text-lg focus:outline-none placeholder:text-gray-400"
                                value={newEvent.title}
                                onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                                placeholder="Название (ДР мамы)..."
                              />
                              <input 
                                type="date" 
                                className="w-full bg-transparent font-typewriter text-sm focus:outline-none text-pencil"
                                value={newEvent.date}
                                onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                              />
                              <Button variant="secondary" onClick={handleAddEvent} className="mt-2 w-full text-xs">Вписать</Button>
                          </div>
                      </div>
                  )}

                  {profile.events.length === 0 ? (
                      <div className="relative z-10 text-center py-12 opacity-50 font-handwritten text-2xl rotate-[-2deg]">
                          Пока ничего не запланировано...
                      </div>
                  ) : (
                      profile.events.map(event => (
                          <div key={event.id} className="relative z-10 group flex items-baseline gap-4 py-1 px-2 hover:bg-yellow-50/50 transition-colors">
                              <span className="font-typewriter text-xs text-red-700 w-24">{event.date}</span>
                              <span className="font-handwritten text-2xl text-ink flex-grow">{event.title}</span>
                              <span className="font-typewriter text-[10px] text-gray-400 uppercase tracking-widest">{event.relationship}</span>
                              
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                  <button 
                                    onClick={() => navigate('/quiz', { state: { name: event.personName || event.title, relationship: event.relationship } })}
                                    title="Подобрать подарок"
                                    className="text-lg hover:scale-110 transition-transform"
                                  >
                                      🎁
                                  </button>
                                  <button 
                                    onClick={() => handleRemoveEvent(event.id)}
                                    title="Удалить"
                                    className="text-lg hover:scale-110 transition-transform text-red-500"
                                  >
                                      ✕
                                  </button>
                              </div>
                              
                              {/* Strike-through effect on hover (optional) */}
                              {/* <div className="absolute bottom-2 left-0 w-full h-px bg-blue-300 opacity-20"></div> */}
                          </div>
                      ))
                  )}
              </div>
          </div>
      </div>
    </div>
  );
};