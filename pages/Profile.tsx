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
    if (confirm('ERASE DATA PERMANENTLY?')) {
        await api.user.removeEvent(id);
        loadData();
    }
  };

  if (loading || !profile) return <div className="p-12 font-mono text-center text-xl">DECRYPTING USER DATA...</div>;

  return (
    <div className="relative">
      <div className="absolute top-0 right-0 stamp font-display font-black text-4xl text-error opacity-20 -rotate-12 border-4 border-error p-2 pointer-events-none select-none">
          CONFIDENTIAL
      </div>

      {/* 1. IDENTITY BLOCK */}
      <section className="mb-16 border-b-4 border-black pb-8">
          <div className="flex justify-between items-baseline mb-4">
              <h1 className="font-mono text-xs uppercase bg-black text-white px-2 py-1">Subject_Dossier</h1>
              <span className="font-mono text-xs text-acid-green bg-black px-2 py-1 animate-pulse">● SURVEILLANCE ACTIVE</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="border-l-4 border-black pl-6">
                  <h2 className="font-display font-black text-6xl uppercase leading-[0.8] mb-4">{profile.name}</h2>
                  <div className="font-mono text-sm bg-concrete inline-block px-2 border border-black">
                      CLEARANCE_LEVEL: <span className="font-bold">{profile.level.toUpperCase()}</span>
                  </div>
              </div>
              <div className="font-mono text-sm space-y-2 md:text-right p-4 border-2 border-black border-dashed bg-gray-50">
                   <div className="flex justify-between md:justify-end gap-4">
                       <span>WISHLIST_ARTIFACTS:</span> 
                       <span className="font-bold bg-black text-white px-1">{wishlistCount}</span>
                   </div>
                   <div className="flex justify-between md:justify-end gap-4">
                       <span>OBLIGATORY_EVENTS:</span> 
                       <span className="font-bold bg-black text-white px-1">{profile.events.length}</span>
                   </div>
              </div>
          </div>
      </section>

      {/* 2. CALENDAR LOG */}
      <section>
          <div className="flex justify-between items-end mb-8 border-b-2 border-black pb-2">
              <h2 className="font-display font-bold text-4xl uppercase">Obligations</h2>
              <button 
                onClick={() => setShowEventForm(!showEventForm)}
                className="font-mono text-xs font-bold uppercase hover:bg-black hover:text-white border-2 border-black px-4 py-2 transition-all shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              >
                  {showEventForm ? 'ABORT' : 'ADD_NEW_THREAT'}
              </button>
          </div>

          {showEventForm && (
              <div className="bg-acid-green border-2 border-black p-6 mb-12 shadow-[8px_8px_0px_#000]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-1">
                          <label className="font-mono text-xs uppercase font-bold">Event_Designation</label>
                          <input 
                            type="text" 
                            className="w-full bg-white border-2 border-black py-2 px-4 font-mono text-lg outline-none focus:shadow-[4px_4px_0px_#fff]"
                            value={newEvent.title}
                            onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                            placeholder="e.g. BIRTHDAY_MOM_FINAL"
                          />
                      </div>
                      <div className="space-y-1">
                          <label className="font-mono text-xs uppercase font-bold">Deadline</label>
                          <input 
                            type="date" 
                            className="w-full bg-white border-2 border-black py-2 px-4 font-mono text-sm outline-none focus:shadow-[4px_4px_0px_#fff]"
                            value={newEvent.date}
                            onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                          />
                      </div>
                  </div>
                  <Button fullWidth onClick={handleAddEvent} variant="secondary">SUBMIT TO RECORD</Button>
              </div>
          )}

          {/* TABLE LIST */}
          <div className="space-y-4">
              {profile.events.length === 0 ? (
                  <div className="py-12 border-2 border-black border-dashed font-mono text-sm text-center uppercase opacity-50">
                      // NO UPCOMING SOCIAL CONTRACTS DETECTED //
                  </div>
              ) : (
                  profile.events.map(event => (
                      <div key={event.id} className="group relative border-2 border-black p-4 bg-white hover:-translate-y-1 transition-transform">
                          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <button 
                                    onClick={() => navigate('/quiz', { state: { name: event.personName || event.title, relationship: event.relationship } })}
                                    className="bg-black text-white text-xs px-2 hover:bg-acid-green hover:text-black font-mono"
                                >
                                    SCAN
                                </button>
                                <button 
                                    onClick={() => handleRemoveEvent(event.id)}
                                    className="bg-error text-white text-xs px-2 hover:bg-black font-mono"
                                >
                                    X
                                </button>
                          </div>
                          
                          <div className="flex flex-col md:flex-row justify-between items-baseline gap-2">
                              <span className="font-mono text-xs font-bold bg-gray-200 px-1">{event.date}</span>
                              <span className="font-display font-bold text-2xl uppercase">{event.title}</span>
                              <span className="font-mono text-xs border border-black px-1 rounded-full">{event.relationship}</span>
                          </div>
                      </div>
                  ))
              )}
          </div>
      </section>
    </div>
  );
};