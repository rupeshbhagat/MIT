import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Share2, 
  Sparkles, 
  BellRing,
  Ticket
} from 'lucide-react';
import { CampusEvent, StudentUser } from '../types';

interface EventsViewProps {
  events: CampusEvent[];
  currentUser: StudentUser;
  onRsvpToggle: (eventId: string) => void;
}

export const EventsView: React.FC<EventsViewProps> = ({
  events,
  currentUser,
  onRsvpToggle,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [ticketModalEvent, setTicketModalEvent] = useState<CampusEvent | null>(null);

  // Live countdown to Persona Fest
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 14,
    minutes: 32,
    seconds: 40,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const categories = ['All', 'Fest', 'Hackathon', 'Design', 'Tech'];

  const filteredEvents = events.filter(e => 
    selectedCategory === 'All' || e.category === selectedCategory
  );

  return (
    <div className="pb-24 pt-2 px-3 sm:px-4 max-w-xl mx-auto space-y-4">
      {/* Featured Flagship Fest Countdown */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-amber-400/40 text-white">
        <img
          src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80"
          alt="Persona Fest"
          className="absolute inset-0 w-full h-full object-cover filter brightness-[0.35]"
        />

        <div className="relative z-10 p-5 space-y-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-[#8B0000] text-amber-300 border border-amber-400/40">
              MIT ADT FLAGSHIP FEST
            </span>
            <span className="text-xs font-semibold text-amber-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Annual Conclave
            </span>
          </div>

          <div>
            <h2 className="text-xl font-black tracking-tight text-white">
              PERSONA FEST 2026
            </h2>
            <p className="text-xs text-slate-200 mt-1 line-clamp-2">
              Annual Inter-University Cultural & Tech Conclave at Rajbaug Grand Amphitheater.
            </p>
          </div>

          {/* Countdown timer */}
          <div className="grid grid-cols-4 gap-2 pt-1 text-center">
            <div className="bg-black/60 backdrop-blur-md rounded-xl p-1.5 border border-white/10">
              <span className="text-lg font-black text-amber-300 block leading-tight">{timeLeft.days}</span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400">Days</span>
            </div>
            <div className="bg-black/60 backdrop-blur-md rounded-xl p-1.5 border border-white/10">
              <span className="text-lg font-black text-white block leading-tight">{timeLeft.hours}</span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400">Hours</span>
            </div>
            <div className="bg-black/60 backdrop-blur-md rounded-xl p-1.5 border border-white/10">
              <span className="text-lg font-black text-white block leading-tight">{timeLeft.minutes}</span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400">Mins</span>
            </div>
            <div className="bg-black/60 backdrop-blur-md rounded-xl p-1.5 border border-white/10">
              <span className="text-lg font-black text-amber-400 block leading-tight">{timeLeft.seconds}</span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400">Secs</span>
            </div>
          </div>

          <button
            onClick={() => {
              const personaEvt = events.find(e => e.id === 'evt_1');
              if (personaEvt) setTicketModalEvent(personaEvt);
            }}
            className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Ticket className="w-4 h-4" />
            <span>View Campus Digital Pass</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-[#8B0000] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Campus Events List */}
      <div className="space-y-4">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow"
          >
            <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
              <img
                src={evt.bannerUrl}
                alt={evt.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border border-white/10">
                {evt.department}
              </div>
            </div>

            <div className="p-4 space-y-2">
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                {evt.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {evt.description}
              </p>

              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-slate-600 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#8B0000]" />
                  <span>{evt.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>{evt.time}</span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2 text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{evt.venue}</span>
                </div>
              </div>

              {/* RSVP Action */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-700">
                  {evt.attendeesCount.toLocaleString()} Students RSVP'd
                </span>

                <button
                  onClick={() => onRsvpToggle(evt.id)}
                  className={`px-4 py-1.5 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5 ${
                    evt.isRsvp
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                      : 'bg-[#8B0000] text-white hover:bg-[#6B0000]'
                  }`}
                >
                  {evt.isRsvp ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Attending ✓
                    </>
                  ) : (
                    'RSVP Now'
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* TICKET / PASS MODAL */}
      {ticketModalEvent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-200 text-center animate-in zoom-in-95 duration-150">
            <div className="bg-gradient-to-r from-[#8B0000] to-[#0B2545] p-5 text-white">
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">
                MIT ADT University • Digital Gate Pass
              </span>
              <h3 className="text-base font-black mt-1">{ticketModalEvent.title}</h3>
              <p className="text-xs text-amber-200/90">{ticketModalEvent.venue}</p>
            </div>

            <div className="p-5 space-y-4">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>Student Name:</span>
                  <span className="font-bold text-slate-900">{currentUser.name}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>PRN:</span>
                  <span className="font-bold text-slate-900">{currentUser.prnNumber}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Department:</span>
                  <span className="font-bold text-[#8B0000]">{currentUser.department}</span>
                </div>
              </div>

              {/* QR Code Graphic */}
              <div className="w-36 h-36 mx-auto bg-slate-100 rounded-2xl p-2 border border-slate-200 flex items-center justify-center shadow-inner">
                <div className="w-full h-full bg-slate-900 rounded-xl flex flex-col items-center justify-center text-amber-300 font-mono text-[9px] p-2 leading-tight">
                  <div className="grid grid-cols-4 gap-1 w-full h-full p-1 opacity-90">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} className={`rounded-xs ${i % 3 === 0 ? 'bg-amber-400' : 'bg-white'}`} />
                    ))}
                  </div>
                  <span className="mt-1">SCAN AT GATE</span>
                </div>
              </div>

              <button
                onClick={() => setTicketModalEvent(null)}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Close Pass
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
