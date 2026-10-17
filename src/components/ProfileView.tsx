import React, { useState } from 'react';
import { 
  Grid, 
  Bookmark, 
  Settings, 
  CheckCircle2, 
  GraduationCap, 
  Award, 
  ShieldCheck, 
  Sparkles,
  MapPin,
  LogOut
} from 'lucide-react';
import { StudentUser, CampusPost, StudentAcademicRecord } from '../types';

interface ProfileViewProps {
  currentUser: StudentUser;
  posts: CampusPost[];
  academicRecord: StudentAcademicRecord;
  onOpenIdCard: () => void;
  onOpenAcademics: () => void;
  onSelectPost: (post: CampusPost) => void;
  onLogout?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  posts,
  academicRecord,
  onOpenIdCard,
  onOpenAcademics,
  onSelectPost,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');

  const userPosts = posts.filter(p => p.authorId === currentUser.id);
  const bookmarkedPosts = posts.filter(p => p.isBookmarked);

  const displayPosts = activeTab === 'posts' ? userPosts : bookmarkedPosts;

  return (
    <div className="pb-24 pt-2 px-3 sm:px-4 max-w-xl mx-auto space-y-4">
      {/* Profile Bio Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-[#8B0000]/20 shadow-md"
            />
            {currentUser.isVerified && (
              <div className="absolute bottom-0 right-0 bg-emerald-600 text-white p-1 rounded-full ring-2 ring-white">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-slate-900 truncate">
                {currentUser.name}
              </h2>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={onOpenIdCard}
                  className="text-[11px] font-bold text-[#8B0000] bg-rose-50 hover:bg-rose-100 px-2 py-1 rounded-xl transition-colors flex items-center gap-1 border border-rose-200"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  ID Card
                </button>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="p-1 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Sign Out / Switch Account"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <p className="text-xs font-bold text-[#8B0000] mt-0.5">
              {currentUser.department}
            </p>
            <p className="text-[11px] text-slate-500">
              {currentUser.yearOfStudy} • PRN: {currentUser.prnNumber}
            </p>

            {/* Quick Stats: Posts, Followers, GPA */}
            <div className="flex items-center gap-4 mt-3 pt-2.5 border-t border-slate-100 text-xs">
              <div>
                <span className="font-bold text-slate-900 block">{userPosts.length}</span>
                <span className="text-[10px] text-slate-400">Posts</span>
              </div>
              <div>
                <span className="font-bold text-slate-900 block">{currentUser.followersCount}</span>
                <span className="text-[10px] text-slate-400">Followers</span>
              </div>
              <div>
                <span className="font-bold text-slate-900 block">{currentUser.followingCount}</span>
                <span className="text-[10px] text-slate-400">Following</span>
              </div>
              <button
                onClick={onOpenAcademics}
                className="ml-auto bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-xl text-right transition-colors"
              >
                <span className="text-[10px] font-bold text-amber-800 uppercase block">CGPA</span>
                <span className="text-xs font-black text-[#8B0000]">
                  {academicRecord.cumulativeGpa} / 10
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-slate-700 mt-3.5 leading-relaxed">
          {currentUser.bio}
        </p>

        {/* Skills Tag Cloud */}
        <div className="flex items-center gap-1.5 flex-wrap mt-3">
          {currentUser.skills.map((skill, idx) => (
            <span
              key={idx}
              className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md"
            >
              #{skill}
            </span>
          ))}
        </div>
      </div>

      {/* Tabs: My Posts vs Saved */}
      <div className="flex items-center border-b border-slate-200 bg-white rounded-2xl p-1">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'posts'
              ? 'bg-[#8B0000] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          My Posts ({userPosts.length})
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'saved'
              ? 'bg-[#8B0000] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          Saved ({bookmarkedPosts.length})
        </button>
      </div>

      {/* Instagram 3-Column Grid */}
      <div className="grid grid-cols-3 gap-1.5">
        {displayPosts.map((post) => (
          <div
            key={post.id}
            onClick={() => onSelectPost(post)}
            className="relative aspect-square rounded-xl overflow-hidden bg-slate-950 cursor-pointer group"
          >
            <img
              src={post.mediaUrl}
              alt={post.caption}
              className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 filter-${post.filterName}`}
            />
            {post.filterName && post.filterName !== 'normal' && (
              <div className="absolute top-1 left-1 bg-black/60 backdrop-blur-xs text-amber-300 text-[8px] font-semibold px-1 rounded-sm">
                {post.filterName}
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 text-white text-xs font-bold">
              <span>❤️ {post.likesCount}</span>
              <span>💬 {post.commentsCount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
