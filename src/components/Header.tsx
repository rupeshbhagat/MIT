import React, { useState } from 'react';
import { Bell, Send, CheckCircle2, ChevronDown, UserCheck, ShieldCheck, LogOut, Volume2, VolumeX } from 'lucide-react';
import { MitLogo } from './Logo';
import { StudentUser, CampusNotification } from '../types';
import { MOCK_STUDENTS } from '../data/mockData';
import { sound } from '../utils/audio';

interface HeaderProps {
  currentUser: StudentUser;
  onSwitchUser: (user: StudentUser) => void;
  unreadNotifsCount: number;
  unreadDMsCount: number;
  onOpenNotifications: () => void;
  onOpenDMs: () => void;
  onOpenVerificationModal: () => void;
  notifications: CampusNotification[];
  isNotificationsOpen: boolean;
  onCloseNotifications: () => void;
  onSelectNotification: (notif: CampusNotification) => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSwitchUser,
  unreadNotifsCount,
  unreadDMsCount,
  onOpenNotifications,
  onOpenDMs,
  onOpenVerificationModal,
  notifications,
  isNotificationsOpen,
  onCloseNotifications,
  onSelectNotification,
  onLogout,
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(sound.enabled);

  const toggleSound = () => {
    sound.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) sound.playPop();
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3.5 py-2.5 shadow-xs">
      <div className="flex items-center justify-between">
        {/* Left: University Logo */}
        <div className="flex items-center gap-1">
          <MitLogo size="sm" showText={true} />
        </div>

        {/* Right Actions: Verification Pill, Notifications, DMs */}
        <div className="flex items-center gap-2">
          {/* Quick Department / User Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium transition-colors border border-slate-200/80"
              title="Switch campus student persona"
            >
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-5 h-5 rounded-full object-cover ring-1 ring-[#8B0000]"
              />
              <span className="max-w-[70px] truncate hidden sm:inline-block">
                {currentUser.name.split(' ')[0]}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {/* User Dropdown */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                  <span>Switch Campus Student</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="space-y-1 mt-1">
                  {MOCK_STUDENTS.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => {
                        onSwitchUser(student);
                        setShowUserDropdown(false);
                      }}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs transition-colors ${
                        student.id === currentUser.id 
                          ? 'bg-[#8B0000]/10 text-[#8B0000] font-semibold' 
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <img 
                        src={student.avatar} 
                        alt={student.name} 
                        className="w-7 h-7 rounded-full object-cover shrink-0" 
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <p className="truncate font-medium">{student.name}</p>
                          {student.isVerified && (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 fill-emerald-100 shrink-0" />
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 truncate">{student.department}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 px-1 space-y-1">
                  <button 
                    onClick={() => {
                      setShowUserDropdown(false);
                      onOpenVerificationModal();
                    }}
                    className="w-full text-center py-1.5 text-[11px] font-medium text-[#8B0000] hover:bg-[#8B0000]/5 rounded-lg flex items-center justify-center gap-1"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>View Student ID & Verification</span>
                  </button>

                  {onLogout && (
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onLogout();
                      }}
                      className="w-full text-center py-1.5 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center justify-center gap-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out / Switch Account</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sound Toggle Button */}
          <button
            onClick={toggleSound}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
            title={soundEnabled ? "Mute interactive sounds" : "Enable interactive sounds"}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-amber-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Campus Email Verified Pill */}
          <button
            onClick={onOpenVerificationModal}
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-semibold transition-colors"
            title="Verified MIT University Student Access"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
            <span className="hidden xs:inline">Verified</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
              aria-label="Campus Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#8B0000] text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown Panel */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                <div className="p-3 bg-gradient-to-r from-[#8B0000] to-[#0B2545] text-white flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-amber-300" />
                    <h3 className="text-xs font-bold tracking-wide">Campus Notifications</h3>
                  </div>
                  <button 
                    onClick={onCloseNotifications} 
                    className="text-[11px] text-amber-200 hover:underline"
                  >
                    Done
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => onSelectNotification(notif)}
                      className={`p-3 text-left hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-2.5 ${
                        !notif.isRead ? 'bg-amber-50/50' : ''
                      }`}
                    >
                      {notif.avatar ? (
                        <img 
                          src={notif.avatar} 
                          alt="" 
                          className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5" 
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#8B0000]/10 text-[#8B0000] flex items-center justify-center shrink-0 mt-0.5">
                          <Bell className="w-4 h-4" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-slate-800 truncate">{notif.title}</p>
                          <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{notif.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Direct Messages Icon */}
          <button
            onClick={onOpenDMs}
            className="relative p-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
            aria-label="Direct Messages"
          >
            <Send className="w-5 h-5 -rotate-12" />
            {unreadDMsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadDMsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
