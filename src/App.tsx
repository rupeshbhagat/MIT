/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Header 
} from './components/Header';
import { 
  StoriesBar, 
  StoryViewerModal 
} from './components/StoriesBar';
import { 
  FeedPost 
} from './components/FeedPost';
import { 
  FilterStudioModal 
} from './components/FilterStudioModal';
import { 
  AcademicsView 
} from './components/AcademicsView';
import { 
  ExploreConnectView 
} from './components/ExploreConnectView';
import { 
  StudyGroupsView 
} from './components/StudyGroupsView';
import { 
  EventsView 
} from './components/EventsView';
import { 
  DirectMessagesModal 
} from './components/DirectMessagesModal';
import { 
  EmailVerificationModal 
} from './components/EmailVerificationModal';
import { 
  ProfileView 
} from './components/ProfileView';
import { 
  Navbar, 
  NavTab 
} from './components/Navbar';
import { 
  DeviceFrame 
} from './components/DeviceFrame';
import {
  LoginView
} from './components/LoginView';
import {
  CampusVibePoll
} from './components/CampusVibePoll';
import { sound } from './utils/audio';

import { 
  MOCK_STUDENTS, 
  MOCK_STORIES, 
  MOCK_POSTS, 
  MOCK_ACADEMIC_RECORD, 
  MOCK_STUDY_GROUPS, 
  MOCK_EVENTS, 
  MOCK_NOTIFICATIONS,
  MIT_BRAND
} from './data/mockData';

import { 
  StudentUser, 
  CampusPost, 
  CampusStory, 
  StudentAcademicRecord, 
  StudyGroup, 
  CampusEvent, 
  CampusNotification,
  UniversityDepartment
} from './types';

import { testConnection } from './firebase/config';
import { Sparkles, Filter, X } from 'lucide-react';

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('mit_logged_user_id');
  });

  // Current active logged-in campus student
  const [currentUser, setCurrentUser] = useState<StudentUser>(() => {
    const savedId = localStorage.getItem('mit_logged_user_id');
    return MOCK_STUDENTS.find(s => s.id === savedId) || MOCK_STUDENTS[0];
  });

  // Main navigation tab
  const [currentTab, setCurrentTab] = useState<NavTab>('feed');

  // Sub-views / Modals
  const [showFilterStudio, setShowFilterStudio] = useState<boolean>(false);
  const [showStoryViewer, setShowStoryViewer] = useState<boolean>(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number>(0);
  const [showDirectMessages, setShowDirectMessages] = useState<boolean>(false);
  const [targetDmUser, setTargetDmUser] = useState<StudentUser | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [activeSubView, setActiveSubView] = useState<'none' | 'study_groups' | 'events'>('none');

  // Data States
  const [posts, setPosts] = useState<CampusPost[]>(MOCK_POSTS);
  const [stories, setStories] = useState<CampusStory[]>(MOCK_STORIES);
  const [academicRecord, setAcademicRecord] = useState<StudentAcademicRecord>(MOCK_ACADEMIC_RECORD);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>(MOCK_STUDY_GROUPS);
  const [events, setEvents] = useState<CampusEvent[]>(MOCK_EVENTS);
  const [notifications, setNotifications] = useState<CampusNotification[]>(MOCK_NOTIFICATIONS);

  // Department feed filter
  const [activeDeptFilter, setActiveDeptFilter] = useState<string | null>(null);

  // Test Firebase connection on mount
  useEffect(() => {
    testConnection();
  }, []);

  // Post Actions
  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isNowLiked = !post.isLiked;
        return {
          ...post,
          isLiked: isNowLiked,
          likesCount: isNowLiked ? post.likesCount + 1 : Math.max(0, post.likesCount - 1),
        };
      }
      return post;
    }));
  };

  const handleAddComment = (postId: string, text: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const newComment = {
          id: `comment_${Date.now()}`,
          postId,
          authorId: currentUser.id,
          authorName: currentUser.name,
          authorAvatar: currentUser.avatar,
          authorDept: currentUser.department,
          text,
          createdAt: 'Just now',
        };
        return {
          ...post,
          commentsCount: post.commentsCount + 1,
          comments: [...(post.comments || []), newComment],
        };
      }
      return post;
    }));
  };

  const handleBookmarkPost = (postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isBookmarked: !post.isBookmarked,
        };
      }
      return post;
    }));
  };

  const handlePublishPost = (newPostData: Omit<CampusPost, 'id' | 'createdAt' | 'likesCount' | 'commentsCount'>) => {
    const newPost: CampusPost = {
      ...newPostData,
      id: `post_${Date.now()}`,
      likesCount: 1,
      isLiked: true,
      commentsCount: 0,
      comments: [],
      createdAt: 'Just now',
    };

    setPosts(prev => [newPost, ...prev]);

    // Celebrate with confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8B0000', '#F59E0B', '#0B2545']
    });
  };

  // Story Interactions
  const handleOpenStory = (story: CampusStory, index: number) => {
    setActiveStoryIndex(index);
    setShowStoryViewer(true);
  };

  const handleStoryReply = (storyId: string, replyText: string) => {
    const targetStory = stories.find(s => s.id === storyId);
    if (!targetStory) return;

    // Push into notifications & show toast
    const newNotif: CampusNotification = {
      id: `notif_${Date.now()}`,
      title: 'Story Reply Sent',
      message: `You replied to ${targetStory.studentName}: "${replyText}"`,
      type: 'like',
      timestamp: 'Just now',
      isRead: false,
      avatar: targetStory.studentAvatar,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Direct Message Opener
  const handleOpenDirectChat = (targetUser: StudentUser) => {
    setTargetDmUser(targetUser);
    setShowDirectMessages(true);
  };

  // Study Groups
  const handleJoinGroup = (groupId: string) => {
    setStudyGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        const isNowMember = !g.isMember;
        return {
          ...g,
          isMember: isNowMember,
          membersCount: isNowMember ? g.membersCount + 1 : Math.max(1, g.membersCount - 1),
        };
      }
      return g;
    }));
  };

  const handleCreateGroup = (newGroupData: Omit<StudyGroup, 'id' | 'createdAt' | 'membersCount' | 'isMember'>) => {
    const newGroup: StudyGroup = {
      ...newGroupData,
      id: `grp_${Date.now()}`,
      membersCount: 1,
      isMember: true,
      createdAt: 'Just now',
    };
    setStudyGroups(prev => [newGroup, ...prev]);
  };

  // Events RSVP
  const handleRsvpToggle = (eventId: string) => {
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        const isNowRsvp = !e.isRsvp;
        return {
          ...e,
          isRsvp: isNowRsvp,
          attendeesCount: isNowRsvp ? e.attendeesCount + 1 : Math.max(0, e.attendeesCount - 1),
        };
      }
      return e;
    }));
  };

  // Notification Selection
  const handleSelectNotification = (notif: CampusNotification) => {
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
    setIsNotificationsOpen(false);

    if (notif.type === 'grade') {
      setCurrentTab('academics');
    } else if (notif.type === 'event') {
      setCurrentTab('connect');
      setActiveSubView('events');
    } else if (notif.type === 'study_group' || notif.type === 'connect') {
      setCurrentTab('connect');
      setActiveSubView('study_groups');
    }
  };

  const handleLogout = () => {
    sound.playPop();
    localStorage.removeItem('mit_logged_user_id');
    setIsAuthenticated(false);
  };

  const unreadNotifsCount = notifications.filter(n => !n.isRead).length;

  // Filtered posts based on active department chip
  const displayedPosts = activeDeptFilter 
    ? posts.filter(p => p.authorDept === activeDeptFilter || p.departmentTag === activeDeptFilter)
    : posts;

  return (
    <DeviceFrame>
      {!isAuthenticated ? (
        <LoginView
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setIsAuthenticated(true);
          }}
        />
      ) : (
        <div className="min-h-full flex flex-col bg-slate-50 relative selection:bg-[#8B0000] selection:text-white">
          {/* Top Header */}
          <Header
            currentUser={currentUser}
            onSwitchUser={(user) => setCurrentUser(user)}
            unreadNotifsCount={unreadNotifsCount}
            unreadDMsCount={2}
            onOpenNotifications={() => setIsNotificationsOpen(!isNotificationsOpen)}
            onOpenDMs={() => {
              setTargetDmUser(null);
              setShowDirectMessages(true);
            }}
            onOpenVerificationModal={() => setShowVerificationModal(true)}
            notifications={notifications}
            isNotificationsOpen={isNotificationsOpen}
            onCloseNotifications={() => setIsNotificationsOpen(false)}
            onSelectNotification={handleSelectNotification}
            onLogout={handleLogout}
          />

          {/* MAIN BODY CONTENT BASED ON TAB */}
          <main className="flex-1">
            {/* TAB 1: SOCIAL FEED & STORIES */}
            {currentTab === 'feed' && (
              <div className="space-y-2 pb-24">
                {/* Instagram Stories Tray */}
                <StoriesBar
                  stories={stories}
                  currentUser={currentUser}
                  onOpenCreateStory={() => setShowFilterStudio(true)}
                  onSelectStory={handleOpenStory}
                />

                {/* Fun & Interactive Campus Vibe Meter & Daily Poll */}
                <CampusVibePoll />

              {/* Department Feed Filter Chips */}
              <div className="px-3 pt-1">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                  <button
                    onClick={() => setActiveDeptFilter(null)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all shrink-0 ${
                      activeDeptFilter === null
                        ? 'bg-[#8B0000] text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    All Departments
                  </button>

                  {[
                    'School of Computing',
                    'MIT Institute of Design (IOD)',
                    'School of Engineering & Tech',
                    'School of Bioengineering',
                    'MIT College of Management',
                  ].map((dept) => (
                    <button
                      key={dept}
                      onClick={() => setActiveDeptFilter(activeDeptFilter === dept ? null : dept)}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all shrink-0 flex items-center gap-1 ${
                        activeDeptFilter === dept
                          ? 'bg-[#8B0000] text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{dept.replace('School of ', '').replace('MIT ', '')}</span>
                      {activeDeptFilter === dept && <X className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Department Filter Notice */}
              {activeDeptFilter && (
                <div className="px-3">
                  <div className="p-2 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-xs text-[#8B0000]">
                    <span className="font-semibold">Showing posts from: {activeDeptFilter}</span>
                    <button
                      onClick={() => setActiveDeptFilter(null)}
                      className="text-[11px] underline font-bold"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}

              {/* Instagram Feed Posts List */}
              <div className="max-w-xl mx-auto sm:px-3 pt-1 space-y-3 sm:space-y-4">
                {displayedPosts.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-xs text-slate-500">
                    No posts yet in this department. Be the first to share a campus photo!
                  </div>
                ) : (
                  displayedPosts.map((post) => (
                    <FeedPost
                      key={post.id}
                      post={post}
                      currentUser={currentUser}
                      onLike={handleLikePost}
                      onAddComment={handleAddComment}
                      onBookmark={handleBookmarkPost}
                      onDepartmentClick={(dept) => setActiveDeptFilter(dept)}
                      onSharePost={(p) => {
                        handleStoryReply(p.id, "Shared campus post to study group!");
                        alert(`Post shared to ${currentUser.department} study circle!`);
                      }}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CROSS-DEPARTMENT CONNECT / STUDY GROUPS / EVENTS */}
          {currentTab === 'connect' && (
            <div>
              {/* Sub-view switcher header */}
              <div className="bg-white px-3 py-2 border-b border-slate-200 flex items-center justify-center gap-2">
                <button
                  onClick={() => setActiveSubView('none')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeSubView === 'none'
                      ? 'bg-[#8B0000] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  People & Mentors
                </button>
                <button
                  onClick={() => setActiveSubView('study_groups')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeSubView === 'study_groups'
                      ? 'bg-[#8B0000] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Study Groups ({studyGroups.length})
                </button>
                <button
                  onClick={() => setActiveSubView('events')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeSubView === 'events'
                      ? 'bg-[#8B0000] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Campus Events ({events.length})
                </button>
              </div>

              {activeSubView === 'none' && (
                <ExploreConnectView
                  currentUser={currentUser}
                  onOpenDirectChat={handleOpenDirectChat}
                  onOpenStudyGroups={() => setActiveSubView('study_groups')}
                  onOpenEvents={() => setActiveSubView('events')}
                />
              )}

              {activeSubView === 'study_groups' && (
                <StudyGroupsView
                  groups={studyGroups}
                  currentUser={currentUser}
                  onJoinGroup={handleJoinGroup}
                  onCreateGroup={handleCreateGroup}
                />
              )}

              {activeSubView === 'events' && (
                <EventsView
                  events={events}
                  currentUser={currentUser}
                  onRsvpToggle={handleRsvpToggle}
                />
              )}
            </div>
          )}

          {/* TAB 3: ACADEMICS & CUMULATIVE GPA TRACKER */}
          {currentTab === 'academics' && (
            <AcademicsView
              academicRecord={academicRecord}
              currentUser={currentUser}
              onUpdateRecord={(updated) => setAcademicRecord(updated)}
            />
          )}

          {/* TAB 4: PROFILE */}
          {currentTab === 'profile' && (
            <ProfileView
              currentUser={currentUser}
              posts={posts}
              academicRecord={academicRecord}
              onOpenIdCard={() => setShowVerificationModal(true)}
              onOpenAcademics={() => setCurrentTab('academics')}
              onSelectPost={(post) => {
                setActiveDeptFilter(null);
                setCurrentTab('feed');
              }}
              onLogout={handleLogout}
            />
          )}
        </main>

        {/* BOTTOM NAVIGATION BAR */}
        <Navbar
          currentTab={currentTab}
          onChangeTab={(tab) => {
            if (tab === 'create') {
              setShowFilterStudio(true);
            } else {
              setCurrentTab(tab);
            }
          }}
          currentUser={currentUser}
          onOpenCreate={() => setShowFilterStudio(true)}
        />

        {/* MODAL 1: PHOTO FILTER STUDIO */}
        <FilterStudioModal
          isOpen={showFilterStudio}
          onClose={() => setShowFilterStudio(false)}
          currentUser={currentUser}
          onPublishPost={handlePublishPost}
        />

        {/* MODAL 2: STORY VIEWER */}
        <StoryViewerModal
          stories={stories}
          initialIndex={activeStoryIndex}
          isOpen={showStoryViewer}
          onClose={() => setShowStoryViewer(false)}
          onSendReply={handleStoryReply}
        />

        {/* MODAL 3: DIRECT MESSAGES */}
        <DirectMessagesModal
          isOpen={showDirectMessages}
          onClose={() => setShowDirectMessages(false)}
          currentUser={currentUser}
          initialTargetUser={targetDmUser}
        />

        {/* MODAL 4: UNIVERSITY EMAIL VERIFICATION & DIGITAL ID CARD */}
        <EmailVerificationModal
          isOpen={showVerificationModal}
          onClose={() => setShowVerificationModal(false)}
          currentUser={currentUser}
          onVerifiedSuccess={(email) => {
            setCurrentUser(prev => ({ ...prev, email, isVerified: true }));
            confetti({
              particleCount: 100,
              spread: 80,
              origin: { y: 0.5 },
              colors: ['#059669', '#F59E0B', '#8B0000']
            });
          }}
        />
      </div>
    )}
  </DeviceFrame>
  );
}
