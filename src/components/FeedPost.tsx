import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  MoreHorizontal, 
  MapPin, 
  CheckCircle2, 
  Sparkles,
  Share2
} from 'lucide-react';
import { CampusPost, StudentUser } from '../types';
import { sound } from '../utils/audio';

interface FeedPostProps {
  post: CampusPost;
  currentUser: StudentUser;
  onLike: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onBookmark: (postId: string) => void;
  onDepartmentClick?: (dept: string) => void;
  onSharePost?: (post: CampusPost) => void;
}

export const FeedPost: React.FC<FeedPostProps> = ({
  post,
  currentUser,
  onLike,
  onAddComment,
  onBookmark,
  onDepartmentClick,
  onSharePost,
}) => {
  const [commentInput, setCommentInput] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [activeReaction, setActiveReaction] = useState<string | null>(null);

  const handleDoubleTap = () => {
    sound.playPop();
    if (!post.isLiked) {
      onLike(post.id);
    }
    setShowHeartBurst(true);
    setTimeout(() => setShowHeartBurst(false), 900);
  };

  const handleReactionClick = (emoji: string) => {
    sound.playPop();
    setActiveReaction(emoji);
    setTimeout(() => setActiveReaction(null), 1500);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment(post.id, commentInput.trim());
    setCommentInput('');
  };

  return (
    <article className="bg-white border-y sm:border border-slate-200 sm:rounded-3xl mb-4 sm:mb-6 overflow-hidden shadow-xs hover:shadow-md transition-shadow">
      {/* Post Top Header */}
      <div className="flex items-center justify-between p-3.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative">
            <img
              src={post.authorAvatar}
              alt={post.authorName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-[#8B0000]/30"
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-xs text-slate-900 truncate">
                {post.authorName}
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100 shrink-0" />
            </div>

            {/* University Department Badge */}
            <div className="flex items-center gap-1.5 mt-0.5">
              <button
                onClick={() => onDepartmentClick && onDepartmentClick(post.authorDept)}
                className="text-[10px] font-semibold text-[#8B0000] bg-rose-50 hover:bg-rose-100 px-1.5 py-0.2 rounded-md transition-colors truncate max-w-[170px]"
              >
                {post.authorDept}
              </button>

              {post.campusLocation && (
                <span className="text-[10px] text-slate-400 flex items-center gap-0.5 truncate">
                  • <MapPin className="w-2.5 h-2.5 inline text-slate-400 shrink-0" /> {post.campusLocation}
                </span>
              )}
            </div>
          </div>
        </div>

        <button className="text-slate-400 hover:text-slate-600 p-1 rounded-full">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Main Image with Instagram-like Filter */}
      <div 
        className="relative aspect-square w-full bg-slate-950 overflow-hidden cursor-pointer select-none group"
        onDoubleClick={handleDoubleTap}
      >
        <img
          src={post.mediaUrl}
          alt={post.caption}
          className={`w-full h-full object-cover transition-transform duration-500 filter-${post.filterName}`}
          style={post.filterCustomStyle ? { filter: post.filterCustomStyle } : undefined}
          loading="lazy"
        />

        {/* Applied Filter Badge */}
        {post.filterName && post.filterName !== 'normal' && (
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-amber-300 text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/10">
            <Sparkles className="w-2.5 h-2.5 text-amber-400" />
            <span className="capitalize">{post.filterName}</span>
          </div>
        )}

        {/* University Watermark in bottom corner */}
        <div className="absolute bottom-2.5 right-2.5 bg-black/50 backdrop-blur-md text-white/90 text-[9px] font-semibold tracking-wider px-2 py-0.5 rounded-md border border-white/10 uppercase">
          MIT ADT • Rajbaug
        </div>

        {/* Double-tap Heart Burst Animation */}
        {showHeartBurst && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none animate-in zoom-in-50 fade-in duration-200">
            <Heart className="w-24 h-24 text-white fill-rose-500 drop-shadow-2xl animate-bounce" />
          </div>
        )}

        {/* Floating Active Emoji Reaction */}
        {activeReaction && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none animate-in zoom-in-50 fade-in duration-150">
            <span className="text-6xl drop-shadow-2xl animate-bounce">{activeReaction}</span>
          </div>
        )}
      </div>

      {/* Action Buttons: Like, Comment, Share, Bookmark + Emoji Bar */}
      <div className="px-3.5 pt-3 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Like */}
            <button
              onClick={() => {
                sound.playPop();
                onLike(post.id);
              }}
              className={`transition-transform active:scale-125 ${
                post.isLiked ? 'text-rose-600 fill-rose-600' : 'text-slate-700 hover:text-rose-500'
              }`}
              aria-label="Like post"
            >
              <Heart className={`w-6 h-6 ${post.isLiked ? 'fill-current' : ''}`} />
            </button>

            {/* Comment */}
            <button
              onClick={() => setShowAllComments(!showAllComments)}
              className="text-slate-700 hover:text-slate-900 transition-colors"
              aria-label="View comments"
            >
              <MessageCircle className="w-6 h-6" />
            </button>

            {/* Share */}
            <button
              onClick={() => onSharePost && onSharePost(post)}
              className="text-slate-700 hover:text-slate-900 transition-colors"
              aria-label="Share post"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* Bookmark */}
          <button
            onClick={() => onBookmark(post.id)}
            className={`transition-colors ${
              post.isBookmarked ? 'text-[#8B0000] fill-[#8B0000]' : 'text-slate-700 hover:text-slate-900'
            }`}
            aria-label="Save post"
          >
            <Bookmark className={`w-5 h-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Fun Campus Quick Reaction Emojis */}
        <div className="flex items-center gap-2 mt-2 pt-1.5 border-t border-slate-100/70 overflow-x-auto no-scrollbar">
          <span className="text-[10px] text-slate-400 font-semibold shrink-0">React:</span>
          {['🔥', '🎓', '🚀', '❤️', '👏', '💡'].map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleReactionClick(emoji)}
              className="text-xs hover:scale-125 transition-transform p-0.5 active:scale-95"
              title={`React with ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Likes Count */}
        <p className="text-xs font-bold text-slate-900 mt-1.5">
          {post.likesCount.toLocaleString()} {post.likesCount === 1 ? 'like' : 'likes'}
        </p>

        {/* Caption & Author */}
        <div className="mt-1 text-xs text-slate-800 leading-relaxed">
          <span className="font-bold text-slate-900 mr-1.5">{post.authorName}</span>
          <span>{post.caption}</span>
        </div>

        {/* Hashtags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
            {post.tags.map((tag, i) => (
              <span
                key={i}
                className="text-[11px] font-medium text-[#1E3A8A] hover:underline cursor-pointer"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Comments section */}
        {post.comments && post.comments.length > 0 && (
          <div className="mt-2 text-xs">
            {post.comments.length > 1 && !showAllComments && (
              <button
                onClick={() => setShowAllComments(true)}
                className="text-[11px] text-slate-500 hover:text-slate-700 font-medium"
              >
                View all {post.comments.length} comments
              </button>
            )}

            <div className="space-y-1 mt-1">
              {(showAllComments ? post.comments : post.comments.slice(-1)).map((c) => (
                <div key={c.id} className="text-xs text-slate-700">
                  <span className="font-bold text-slate-900 mr-1.5">{c.authorName}</span>
                  <span className="text-slate-600">{c.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Time Stamp */}
        <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-2 font-medium">
          {post.createdAt}
        </p>
      </div>

      {/* Quick Add Comment Form */}
      <form
        onSubmit={handleCommentSubmit}
        className="border-t border-slate-100 px-3.5 py-2.5 flex items-center gap-2 bg-slate-50/50"
      >
        <img
          src={currentUser.avatar}
          alt=""
          className="w-6 h-6 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
        />
        <input
          type="text"
          placeholder="Add a campus comment..."
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          className="flex-1 bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
        />
        {commentInput.trim() && (
          <button
            type="submit"
            className="text-xs font-bold text-[#8B0000] hover:text-[#6B0000] transition-colors"
          >
            Post
          </button>
        )}
      </form>
    </article>
  );
};
