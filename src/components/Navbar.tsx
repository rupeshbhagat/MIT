import React from 'react';
import { 
  Home, 
  Compass, 
  PlusSquare, 
  GraduationCap, 
  User, 
  Plus
} from 'lucide-react';
import { StudentUser } from '../types';

export type NavTab = 'feed' | 'connect' | 'create' | 'academics' | 'profile';

interface NavbarProps {
  currentTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  currentUser: StudentUser;
  onOpenCreate: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onChangeTab,
  currentUser,
  onOpenCreate,
}) => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-3 shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {/* Feed Tab */}
        <button
          onClick={() => onChangeTab('feed')}
          className={`flex flex-col items-center py-1 px-3 transition-colors ${
            currentTab === 'feed' ? 'text-[#8B0000]' : 'text-slate-400 hover:text-slate-600'
          }`}
          aria-label="Campus Feed"
        >
          <Home className={`w-5 h-5 ${currentTab === 'feed' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] font-semibold mt-0.5">Feed</span>
        </button>

        {/* Connect Tab */}
        <button
          onClick={() => onChangeTab('connect')}
          className={`flex flex-col items-center py-1 px-3 transition-colors ${
            currentTab === 'connect' ? 'text-[#8B0000]' : 'text-slate-400 hover:text-slate-600'
          }`}
          aria-label="Cross-Dept Connect"
        >
          <Compass className={`w-5 h-5 ${currentTab === 'connect' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] font-semibold mt-0.5">Connect</span>
        </button>

        {/* Create Photo Filter Post (+) Button */}
        <button
          onClick={onOpenCreate}
          className="relative -top-2 p-3 rounded-2xl bg-gradient-to-tr from-[#8B0000] via-[#9B111E] to-amber-500 text-white shadow-lg shadow-[#8B0000]/30 transition-transform active:scale-95 hover:scale-105"
          aria-label="Create Post"
        >
          <Plus className="w-5 h-5 stroke-[3]" />
        </button>

        {/* Academics & Grades Tab */}
        <button
          onClick={() => onChangeTab('academics')}
          className={`flex flex-col items-center py-1 px-3 transition-colors ${
            currentTab === 'academics' ? 'text-[#8B0000]' : 'text-slate-400 hover:text-slate-600'
          }`}
          aria-label="Grades & GPA"
        >
          <GraduationCap className={`w-5 h-5 ${currentTab === 'academics' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] font-semibold mt-0.5">Grades</span>
        </button>

        {/* Profile Tab */}
        <button
          onClick={() => onChangeTab('profile')}
          className={`flex flex-col items-center py-1 px-3 transition-colors ${
            currentTab === 'profile' ? 'text-[#8B0000]' : 'text-slate-400 hover:text-slate-600'
          }`}
          aria-label="Profile"
        >
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt=""
              className={`w-5 h-5 rounded-full object-cover ${
                currentTab === 'profile' ? 'ring-2 ring-[#8B0000]' : ''
              }`}
            />
          </div>
          <span className="text-[10px] font-semibold mt-0.5">Profile</span>
        </button>
      </div>
    </nav>
  );
};
