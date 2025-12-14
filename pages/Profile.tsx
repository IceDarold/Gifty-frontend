import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { api } from '../api';
import { UserProfile, CalendarEvent } from '../domain/types';
import { track } from '../utils/analytics';
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
    if (confirm('Delete record?')) {
        await api.user.removeEvent(id);
        loadData();
    }
  };

  if (loading || !profile) return <div className="p-12 font-mono text-center">Loading Dossier...</div>;

  return (
    <div className="animate-reveal">
      
      {/* 1. IDENTITY BLOCK */}
      <section className="mb-16 border-b border-ink">
          <div className="flex justify-between items-baseline mb-2">
              <h1 className="font-mono text-xs uppercase tracking-widest text-graphite">User_Dossier_ID: {profile.name}</h1>
              <span className="font-mono text-xs text-accent">Status: Active</span>
          </div>
          
          <div className="py-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div>
                  <h2 className="font-serif text-5xl font-light mb-2">{profile.name}</h2>
                  <div className="font-mono text-sm text-graphite">
                      Level: <span className="text-ink">{profile.level}</span>
                  </div>
              </div>
              <div className="font-mono text-sm space-y-2 md:text-right">
                   <div>Wishlist_Items: <span className="text-accent">{wishlistCount}</span></div>
                   <div>Events_Tracked: <span className="text-accent">{profile.events.length}</span></div>
              </div>
          </div>
      </section>

      {/* 2. CALENDAR LOG */}
      <section>
          <div className="flex justify-between items-center mb-8">
              <h2 className="font-serif text-2xl italic">Temporal Events Log</h2>
              <button 
                onClick={() => setShowEventForm(!showEventForm)}
                className="font-mono text-xs uppercase hover:text-accent border border-ink px-3 py-1 hover:bg-ink hover:text-paper transition-all"
              >
                  {showEventForm ? '[- Cancel]' : '[+ New Record]'}
              </button>
          </div>

          {showEventForm && (
              <div className="bg-paper border border-ink p-6 mb-12 relative reticle">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-1">
                          <label className="font-mono text-xs uppercase text-graphite">Event_Title</label>
                          <input 
                            type="text" 
                            className="w-full bg-transparent border-b border-ink py-2 font-serif text-lg outline-none focus:border-accent"
                            value={newEvent.title}
                            onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                            placeholder="e.g. Father's Birthday"
                          />
                      </div>
                      <div className="space-y-1">
                          <label className="font-mono text-xs uppercase text-graphite">Date_Timestamp</label>
                          <input 
                            type="date" 
                            className="w-full bg-transparent border-b border-ink py-2 font-mono text-sm outline-none focus:border-accent"
                            value={newEvent.date}
                            onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                          />
                      </div>
                  </div>
                  <Button fullWidth onClick={handleAddEvent} variant="secondary">Commit to Database</Button>
              </div>
          )}

          {/* TABLE LIST */}
          <div className="border-t border-ink/20">
              {profile.events.length === 0 ? (
                  <div className="py-8 font-mono text-xs text-graphite text-center">No records found in database.</div>
              ) : (
                  profile.events.map(event => (
                      <div key={event.id} className="group py-6 border-b border-ink/10 flex flex-col md:flex-row justify-between items-baseline gap-4 hover:bg-white transition-colors px-2">
                          <div className="flex gap-6 items-baseline w-full md:w-auto">
                              <span className="font-mono text-xs w-24 text-graphite">{event.date}</span>
                              <span className="font-serif text-xl">{event.title}</span>
                          </div>
                          <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => navigate('/quiz', { state: { name: event.personName || event.title, relationship: event.relationship } })}
                                className="font-mono text-xs uppercase text-accent hover:underline"
                              >
                                  [Initiate Search]
                              </button>
                              <button 
                                onClick={() => handleRemoveEvent(event.id)}
                                className="font-mono text-xs uppercase text-alert hover:underline"
                              >
                                  [Delete]
                              </button>
                          </div>
                      </div>
                  ))
              )}
          </div>
      </section>

    </div>
  );
};