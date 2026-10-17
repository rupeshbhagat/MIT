import React, { useState, useEffect } from 'react';
import { Plus, X, Heart, Send } from 'lucide-react';
import { CampusStory, StudentUser } from '../types';
import { sound } from '../utils/audio';

interface StoriesBarProps {
  stories: CampusStory[];
  currentUser: StudentUser;
  onOpenCreateStory: () => void;
  onSelectStory: (story: CampusStory, index: number) => void;
}

export const StoriesBar: React.FC<StoriesBarProps> = ({
  stories,
  currentUser,
  onOpenCreateStory,
  onSelectStory,
}) => {
  return (
    <div className="bg-white border-b border-slate-100 py-3 px-3 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-3.5">
        {/* Current User Add Story */}
        <div className="flex flex-col items-center shrink-0 w-16 cursor-pointer" onClick={onOpenCreateStory}>
          <div className="relative">
            <div className="w-14 h-14 rounded-full p-0.5 bg-slate-200">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#8B0000] text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>
          <span className="text-[11px] text-slate-700 font-medium mt-1 truncate w-full text-center">
            Your Story
          </span>
        </div>

        {/* Campus Student Stories */}
        {stories.map((story, idx) => (
          <div
            key={story.id}
            onClick={() => onSelectStory(story, idx)}
            className="flex flex-col items-center shrink-0 w-16 cursor-pointer group"
          >
            <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#8B0000] via-amber-500 to-[#1E3A8A] transition-transform group-hover:scale-105 duration-200">
              <div className="w-14 h-14 rounded-full p-0.5 bg-white">
                <img
                  src={story.studentAvatar}
                  alt={story.studentName}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <span className="text-[11px] text-slate-800 font-medium mt-1 truncate w-full text-center">
              {story.studentName.split(' ')[0]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface StoryViewerModalProps {
  stories: CampusStory[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onSendReply: (storyId: string, replyText: string) => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  stories,
  initialIndex,
  isOpen,
  onClose,
  onSendReply,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sentFeedback, setSentFeedback] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setProgress(0);
    setIsLiked(false);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex((idx) => idx + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, currentIndex, stories.length, onClose]);

  if (!isOpen || !stories[currentIndex]) return null;

  const currentStory = stories[currentIndex];

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onSendReply(currentStory.id, replyText);
    setReplyText('');
    setSentFeedback(true);
    setTimeout(() => setSentFeedback(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-sm h-[85vh] max-h-[720px] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between border border-slate-800">
        {/* Story Progress Bars */}
        <div className="absolute top-3 inset-x-3 z-30 flex items-center gap-1.5">
          {stories.map((s, idx) => (
            <div key={s.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{
                  width:
                    idx < currentIndex
                      ? '100%'
                      : idx === currentIndex
                      ? `${progress}%`
                      : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Story Header */}
        <div className="absolute top-6 inset-x-3 z-30 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <img
              src={currentStory.studentAvatar}
              alt=""
              className="w-8 h-8 rounded-full object-cover ring-2 ring-white/80"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold leading-none">{currentStory.studentName}</p>
                <span className="text-[10px] text-white/70">{currentStory.timestamp}</span>
              </div>
              <span className="text-[10px] text-amber-300 font-medium">
                {currentStory.department}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Click zones for next / prev */}
        <div className="absolute inset-0 flex z-10">
          <div className="w-1/3 h-full cursor-pointer" onClick={handlePrev} />
          <div className="w-2/3 h-full cursor-pointer" onClick={handleNext} />
        </div>

        {/* Main Story Image */}
        <div className="relative w-full h-full flex items-center justify-center bg-black">
          <img
            src={currentStory.imageUrl}
            alt=""
            className="w-full h-full object-cover"
          />

          {/* Caption Overlay */}
          <div className="absolute bottom-20 inset-x-4 z-20 pointer-events-none">
            <div className="bg-black/60 backdrop-blur-md text-white p-3 rounded-2xl border border-white/10 shadow-lg">
              <p className="text-xs font-medium leading-relaxed">{currentStory.caption}</p>
            </div>
          </div>
        </div>

        {/* Bottom Reply Bar & Quick Emojis */}
        <div className="relative z-30 p-3 bg-gradient-to-t from-black via-black/80 to-transparent space-y-2">
          {/* Quick Reaction Emojis */}
          <div className="flex items-center justify-around px-2">
            {['🔥', '👏', '🚀', '❤️', '💡', '😍'].map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  sound.playPop();
                  onSendReply(currentStory.id, emoji);
                  setSentFeedback(true);
                  setTimeout(() => setSentFeedback(false), 2000);
                }}
                className="text-lg hover:scale-130 transition-transform active:scale-95"
              >
                {emoji}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmitReply} className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={sentFeedback ? "Sent to DM! ✓" : `Reply to ${currentStory.studentName}...`}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full bg-white/20 border border-white/30 rounded-full px-4 py-2 text-xs text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                sound.playPop();
                setIsLiked(!isLiked);
              }}
              className={`p-2 rounded-full transition-transform active:scale-125 ${
                isLiked ? 'text-rose-500 fill-rose-500' : 'text-white hover:text-rose-400'
              }`}
            >
              <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
            </button>

            <button
              type="submit"
              disabled={!replyText.trim()}
              className="p-2 rounded-full bg-white text-slate-900 disabled:opacity-40 hover:bg-amber-300 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
