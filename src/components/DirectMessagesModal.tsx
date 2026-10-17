import React, { useState } from 'react';
import { 
  X, 
  Send, 
  CheckCheck, 
  Search, 
  Image as ImageIcon,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { StudentUser, DirectMessage } from '../types';
import { MOCK_STUDENTS } from '../data/mockData';
import { sound } from '../utils/audio';

interface DirectMessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: StudentUser;
  initialTargetUser?: StudentUser | null;
}

export const DirectMessagesModal: React.FC<DirectMessagesModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  initialTargetUser,
}) => {
  const [selectedStudent, setSelectedStudent] = useState<StudentUser | null>(
    initialTargetUser || MOCK_STUDENTS.find(s => s.id !== currentUser.id) || null
  );

  const [messages, setMessages] = useState<Record<string, DirectMessage[]>>({
    user_tanvi: [
      {
        id: "dm_1",
        conversationId: "conv_aarav_tanvi",
        senderId: "user_tanvi",
        senderName: "Tanvi Deshmukh",
        senderAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
        receiverId: currentUser.id,
        receiverName: currentUser.name,
        text: "Hey Aarav! Loved your edge AI wildfire project demo! We are refining the Figma UI components for our IOD submission. Want to link up at the library?",
        createdAt: "2:15 PM",
        isRead: true
      },
      {
        id: "dm_2",
        conversationId: "conv_aarav_tanvi",
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        receiverId: "user_tanvi",
        receiverName: "Tanvi Deshmukh",
        text: "Thanks Tanvi! That would be awesome. Let's sync around 4:30 PM after my Computer Networks lab.",
        createdAt: "2:20 PM",
        isRead: true
      }
    ],
    user_rohan: [
      {
        id: "dm_3",
        conversationId: "conv_aarav_rohan",
        senderId: "user_rohan",
        senderName: "Rohan Kulkarni",
        senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        receiverId: currentUser.id,
        receiverName: currentUser.name,
        text: "Bro, are you free for Robocon telemetry testing tonight?",
        createdAt: "Yesterday",
        isRead: true
      }
    ]
  });

  const [inputMessage, setInputMessage] = useState('');
  const [searchFilter, setSearchFilter] = useState('');

  if (!isOpen) return null;

  const currentChatMessages = selectedStudent ? (messages[selectedStudent.id] || []) : [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedStudent) return;

    const newDm: DirectMessage = {
      id: `dm_${Date.now()}`,
      conversationId: `conv_${currentUser.id}_${selectedStudent.id}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      receiverId: selectedStudent.id,
      receiverName: selectedStudent.name,
      text: inputMessage.trim(),
      createdAt: 'Just now',
      isRead: false
    };

    sound.playDing();
    setMessages(prev => ({
      ...prev,
      [selectedStudent.id]: [...(prev[selectedStudent.id] || []), newDm]
    }));

    setInputMessage('');
  };

  const otherStudents = MOCK_STUDENTS.filter(s => 
    s.id !== currentUser.id &&
    (s.name.toLowerCase().includes(searchFilter.toLowerCase()) || 
     s.department.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg h-[85vh] max-h-[720px] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-[#8B0000] to-[#0B2545] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            {selectedStudent && (
              <button 
                onClick={() => setSelectedStudent(null)} 
                className="p-1 rounded-full hover:bg-white/20 sm:hidden"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h2 className="text-sm font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Campus Direct Messages
              </h2>
              <p className="text-[10px] text-amber-200">Exclusive MIT ADT University Network</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop Split / Mobile View */}
        <div className="flex-1 flex overflow-hidden">
          {/* Students Sidebar (hidden on mobile when a chat is open) */}
          <div className={`w-full sm:w-48 md:w-56 border-r border-slate-200 flex flex-col bg-slate-50 ${
            selectedStudent ? 'hidden sm:flex' : 'flex'
          }`}>
            <div className="p-2 border-b border-slate-200">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-8 pr-2 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {otherStudents.map((student) => {
                const isSelected = selectedStudent?.id === student.id;
                const hasDms = messages[student.id]?.length > 0;
                return (
                  <button
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    className={`w-full p-2.5 text-left flex items-center gap-2.5 hover:bg-slate-100 transition-colors ${
                      isSelected ? 'bg-amber-50/80 border-r-2 border-[#8B0000]' : ''
                    }`}
                  >
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{student.name}</p>
                      <p className="text-[10px] text-[#8B0000] truncate font-medium">{student.department.split(' ')[0]}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Chat Conversation Area */}
          <div className={`flex-1 flex flex-col bg-white ${
            !selectedStudent ? 'hidden sm:flex items-center justify-center text-slate-400 text-xs' : 'flex'
          }`}>
            {selectedStudent ? (
              <>
                {/* Chat Top Banner */}
                <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={selectedStudent.avatar}
                      alt={selectedStudent.name}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-[#8B0000]"
                    />
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 leading-none">
                        {selectedStudent.name}
                      </h3>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {selectedStudent.department}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Verified
                  </span>
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-slate-50/50">
                  {currentChatMessages.map((msg) => {
                    const isMe = msg.senderId === currentUser.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                            isMe
                              ? 'bg-[#8B0000] text-white rounded-tr-none shadow-xs'
                              : 'bg-white text-slate-800 rounded-tl-none border border-slate-200 shadow-xs'
                          }`}
                        >
                          <p>{msg.text}</p>
                        </div>
                        <span className="text-[9px] text-slate-400 mt-1 px-1 flex items-center gap-1">
                          {msg.createdAt}
                          {isMe && <CheckCheck className="w-3 h-3 text-slate-400" />}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Quick Prompts */}
                <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  {[
                    "Let's sync for the hackathon! 🚀",
                    "Are you at the library? 📚",
                    "Loved your recent post! ✨"
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInputMessage(chip)}
                      className="text-[10px] whitespace-nowrap bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Input Bar */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-2.5 border-t border-slate-200 bg-white flex items-center gap-2"
                >
                  <input
                    type="text"
                    placeholder={`Message ${selectedStudent.name.split(' ')[0]}...`}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim()}
                    className="p-2 rounded-full bg-[#8B0000] text-white disabled:opacity-40 hover:bg-[#6B0000] transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <p>Select a student to start a campus conversation</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
