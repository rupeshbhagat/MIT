import React, { useState } from 'react';
import { Sparkles, BarChart2, Flame, Heart, PartyPopper } from 'lucide-react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

export const CampusVibePoll: React.FC = () => {
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [votes, setVotes] = useState<number[]>([184, 142, 98, 65]);

  const pollOptions = [
    { label: "Vishwashanti Dome Lawns", emoji: "🌅" },
    { label: "Central Library 3rd Floor", emoji: "📚" },
    { label: "Riverfront Promenade", emoji: "🌊" },
    { label: "Block B MakerSpace Lab", emoji: "🤖" },
  ];

  const totalVotes = votes.reduce((a, b) => a + b, 0);

  const handleVote = (index: number) => {
    if (hasVoted) return;
    sound.playPop();
    setSelectedOption(index);
    setHasVoted(true);
    setVotes(prev => {
      const next = [...prev];
      next[index] += 1;
      return next;
    });
  };

  const handleCampusCheer = () => {
    sound.playSuccess();
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#8B0000', '#F59E0B', '#0B2545']
    });
  };

  return (
    <div className="bg-gradient-to-r from-amber-500/15 via-[#8B0000]/10 to-blue-500/10 border border-amber-300/40 rounded-3xl p-4 mx-3 my-2 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          <span className="text-[11px] font-black uppercase tracking-wider text-[#8B0000] flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-rose-600 fill-rose-500" />
            Campus Vibe Check
          </span>
        </div>

        <button
          onClick={handleCampusCheer}
          className="text-[10px] font-bold bg-amber-400 hover:bg-amber-300 text-slate-900 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs transition-transform active:scale-95"
        >
          <PartyPopper className="w-3 h-3" />
          <span>Cheer MIT ADT!</span>
        </button>
      </div>

      {/* Daily Poll Question */}
      <p className="text-xs font-bold text-slate-900 mb-2">
        Where are you prepping for Endsems & Hackathon projects today?
      </p>

      {/* Poll Options */}
      <div className="space-y-1.5">
        {pollOptions.map((opt, idx) => {
          const voteCount = votes[idx];
          const pct = Math.round((voteCount / totalVotes) * 100);
          const isSelected = selectedOption === idx;

          return (
            <button
              key={idx}
              onClick={() => handleVote(idx)}
              className={`w-full relative overflow-hidden rounded-xl p-2 text-left text-xs transition-all border ${
                isSelected
                  ? 'border-[#8B0000] bg-rose-50/80 font-bold'
                  : 'border-slate-200 bg-white/80 hover:bg-white'
              }`}
            >
              {/* Animated Progress Bar Fill */}
              {hasVoted && (
                <div
                  className="absolute inset-y-0 left-0 bg-[#8B0000]/15 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              )}

              <div className="relative z-10 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-800">
                  <span>{opt.emoji}</span>
                  <span className="truncate">{opt.label}</span>
                </span>

                {hasVoted && (
                  <span className="text-[10px] font-bold text-[#8B0000]">
                    {pct}% ({voteCount})
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-2 pt-1 text-[10px] text-slate-500 font-medium px-1">
        <span>{totalVotes} Campus Votes</span>
        <span>Rajbaug Campus • Loni Kalbhor</span>
      </div>
    </div>
  );
};
