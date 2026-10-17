import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  MessageSquare, 
  Calendar, 
  Building2, 
  Check, 
  Send, 
  X,
  Search,
  Sparkles
} from 'lucide-react';
import { StudyGroup, StudentUser, UniversityDepartment, GroupChatMessage } from '../types';

interface StudyGroupsViewProps {
  groups: StudyGroup[];
  currentUser: StudentUser;
  onJoinGroup: (groupId: string) => void;
  onCreateGroup: (newGroup: Omit<StudyGroup, 'id' | 'createdAt' | 'membersCount' | 'isMember'>) => void;
  onSendGroupMessage?: (groupId: string, text: string) => void;
}

const UNIVERSITY_DEPTS: UniversityDepartment[] = [
  'School of Computing',
  'MIT Institute of Design (IOD)',
  'School of Engineering & Tech',
  'School of Bioengineering',
  'MIT College of Management',
  'School of Film & Media (ISBJ)',
  'School of Architecture & Planning'
];

export const StudyGroupsView: React.FC<StudyGroupsViewProps> = ({
  groups,
  currentUser,
  onJoinGroup,
  onCreateGroup,
  onSendGroupMessage,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeChatGroup, setActiveChatGroup] = useState<StudyGroup | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [groupMessages, setGroupMessages] = useState<Record<string, GroupChatMessage[]>>({
    grp_1: [
      {
        id: "m_1",
        groupId: "grp_1",
        senderId: "user_aarav",
        senderName: "Aarav Sharma",
        senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        senderDept: "School of Computing",
        text: "Hey everyone! The telemetry server is running on port 8080. Looking for IOD folks to test the mobile dashboard UI.",
        createdAt: "10:30 AM"
      },
      {
        id: "m_2",
        groupId: "grp_1",
        senderId: "user_rohan",
        senderName: "Rohan Kulkarni",
        senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        senderDept: "School of Engineering & Tech",
        text: "The carbon fiber propeller mounts just finished curing in the lab. Ready for test flights!",
        createdAt: "10:45 AM"
      }
    ]
  });

  // Form states for creating group
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [targetDepts, setTargetDepts] = useState<UniversityDepartment[]>(['MIT Institute of Design (IOD)']);
  const [meetingSchedule, setMeetingSchedule] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !topic.trim()) return;

    onCreateGroup({
      name,
      topic,
      description,
      primaryDept: currentUser.department,
      targetDepts,
      createdBy: currentUser.id,
      creatorName: currentUser.name,
      creatorAvatar: currentUser.avatar,
      meetingSchedule: meetingSchedule || 'TBD on group chat',
    });

    setName('');
    setTopic('');
    setDescription('');
    setShowCreateModal(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeChatGroup) return;

    const newMsg: GroupChatMessage = {
      id: `msg_${Date.now()}`,
      groupId: activeChatGroup.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderDept: currentUser.department,
      text: chatInput.trim(),
      createdAt: 'Just now'
    };

    setGroupMessages(prev => ({
      ...prev,
      [activeChatGroup.id]: [...(prev[activeChatGroup.id] || []), newMsg]
    }));

    if (onSendGroupMessage) {
      onSendGroupMessage(activeChatGroup.id, chatInput.trim());
    }

    setChatInput('');
  };

  return (
    <div className="pb-24 pt-2 px-3 sm:px-4 max-w-xl mx-auto space-y-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#8B0000] to-[#0B2545] text-white rounded-3xl p-4 sm:p-5 shadow-lg relative overflow-hidden flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block mb-1">
            Multidisciplinary Hub
          </span>
          <h2 className="text-base sm:text-lg font-black tracking-tight">
            Campus Study Groups & Projects
          </h2>
          <p className="text-xs text-slate-200 mt-1 max-w-xs">
            Form collaborative teams across computing, design, and robotics.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="p-3 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-2xl shadow-md font-bold transition-transform active:scale-95 flex items-center gap-1.5 text-xs shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Group</span>
        </button>
      </div>

      {/* Study Groups List */}
      <div className="space-y-3">
        {groups.map((group) => (
          <div
            key={group.id}
            className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold text-[#8B0000] bg-rose-50 px-2 py-0.5 rounded-full inline-block">
                  {group.topic}
                </span>
                <h3 className="font-bold text-sm text-slate-900 mt-1">
                  {group.name}
                </h3>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full shrink-0">
                <Users className="w-3.5 h-3.5 text-slate-600" />
                <span>{group.membersCount} members</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {group.description}
            </p>

            {/* Target Departments Tag */}
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-semibold text-slate-400">Collaborating with:</span>
              {group.targetDepts.map((d, i) => (
                <span
                  key={i}
                  className="text-[10px] font-bold text-[#1E3A8A] bg-blue-50 px-2 py-0.5 rounded-md"
                >
                  {d}
                </span>
              ))}
            </div>

            {/* Meeting Schedule */}
            {group.meetingSchedule && (
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-2 font-medium">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span>{group.meetingSchedule}</span>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center gap-2 mt-3 pt-2">
              <button
                onClick={() => setActiveChatGroup(group)}
                className="flex-1 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#8B0000]" />
                Group Chat
              </button>

              <button
                onClick={() => onJoinGroup(group.id)}
                className={`px-4 py-1.5 rounded-xl font-bold text-xs transition-colors flex items-center gap-1 ${
                  group.isMember
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-[#8B0000] text-white hover:bg-[#6B0000]'
                }`}
              >
                {group.isMember ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Joined
                  </>
                ) : (
                  'Join Squad'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE NEW STUDY GROUP MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3">
          <div className="bg-white rounded-3xl w-full max-w-md p-5 border border-slate-200 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#8B0000]" />
                Create Cross-Dept Study Group
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 mt-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Group Name</label>
                <input
                  type="text"
                  placeholder="e.g. Endsem DSA Study Circle, UI Design Sprint"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Topic / Objective</label>
                <input
                  type="text"
                  placeholder="e.g. LeetCode Mediums & Hackathon Capstone"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Group Description</label>
                <textarea
                  rows={2}
                  placeholder="What skills are you seeking? When do you plan to meet?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Collaborating Department</label>
                <select
                  value={targetDepts[0]}
                  onChange={(e) => setTargetDepts([e.target.value as UniversityDepartment])}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
                >
                  {UNIVERSITY_DEPTS.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Meeting Time / Location</label>
                <input
                  type="text"
                  placeholder="e.g. Mon & Wed 5 PM @ Central Library"
                  value={meetingSchedule}
                  onChange={(e) => setMeetingSchedule(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#8B0000] hover:bg-[#6B0000] text-white font-bold text-xs shadow-md transition-colors"
                >
                  Publish Campus Study Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ACTIVE GROUP CHAT DRAWER */}
      {activeChatGroup && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md h-[80vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
            {/* Chat Header */}
            <div className="p-3.5 bg-gradient-to-r from-[#8B0000] to-[#0B2545] text-white flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold truncate max-w-[240px]">
                  {activeChatGroup.name}
                </h3>
                <p className="text-[10px] text-amber-200">{activeChatGroup.topic}</p>
              </div>
              <button
                onClick={() => setActiveChatGroup(null)}
                className="p-1 rounded-full hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50">
              {(groupMessages[activeChatGroup.id] || []).map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2 ${isMe ? 'flex-row-reverse' : ''}`}
                  >
                    <img
                      src={msg.senderAvatar}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover shrink-0 mt-1"
                    />
                    <div className={`max-w-[75%] rounded-2xl p-2.5 text-xs ${
                      isMe 
                        ? 'bg-[#8B0000] text-white rounded-tr-none' 
                        : 'bg-white text-slate-800 rounded-tl-none border border-slate-200 shadow-xs'
                    }`}>
                      {!isMe && (
                        <p className="text-[10px] font-bold text-[#8B0000] mb-0.5">
                          {msg.senderName} • {msg.senderDept.split(' ')[0]}
                        </p>
                      )}
                      <p className="leading-relaxed">{msg.text}</p>
                      <span className={`text-[9px] block text-right mt-1 ${isMe ? 'text-white/70' : 'text-slate-400'}`}>
                        {msg.createdAt}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                placeholder="Message group members..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="p-2 rounded-full bg-[#8B0000] text-white disabled:opacity-40 hover:bg-[#6B0000] transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
