import React, { useState } from 'react';
import { 
  Search, 
  Users, 
  Sparkles, 
  MessageSquare, 
  UserPlus, 
  CheckCircle2, 
  Filter, 
  GraduationCap, 
  Send,
  ArrowRight
} from 'lucide-react';
import { StudentUser, UniversityDepartment } from '../types';
import { MOCK_STUDENTS } from '../data/mockData';

interface ExploreConnectViewProps {
  currentUser: StudentUser;
  onOpenDirectChat: (targetUser: StudentUser) => void;
  onOpenStudyGroups: () => void;
  onOpenEvents: () => void;
}

const DEPARTMENTS: ('All' | UniversityDepartment)[] = [
  'All',
  'School of Computing',
  'MIT Institute of Design (IOD)',
  'School of Engineering & Tech',
  'School of Bioengineering',
  'MIT College of Management',
  'School of Film & Media (ISBJ)'
];

export const ExploreConnectView: React.FC<ExploreConnectViewProps> = ({
  currentUser,
  onOpenDirectChat,
  onOpenStudyGroups,
  onOpenEvents,
}) => {
  const [selectedDept, setSelectedDept] = useState<'All' | UniversityDepartment>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [followedUserIds, setFollowedUserIds] = useState<string[]>([]);

  const filteredStudents = MOCK_STUDENTS.filter(student => {
    if (student.id === currentUser.id) return false;
    const matchesDept = selectedDept === 'All' || student.department === selectedDept;
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
      student.prnNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const toggleFollow = (studentId: string) => {
    setFollowedUserIds(prev => 
      prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]
    );
  };

  return (
    <div className="pb-24 pt-2 px-3 sm:px-4 max-w-xl mx-auto space-y-4">
      {/* Top Cross-Department Collaboration Banner */}
      <div className="bg-gradient-to-r from-[#0B2545] via-[#1E3A8A] to-[#8B0000] text-white rounded-3xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-amber-300 text-[10px] font-bold tracking-wider uppercase border border-white/15 mb-2">
            <Sparkles className="w-3 h-3 text-amber-300" />
            Cross-Department Network
          </div>
          <h2 className="text-base sm:text-lg font-black tracking-tight leading-tight">
            Connect Across Faculties at MIT ADT
          </h2>
          <p className="text-xs text-slate-200 mt-1 leading-relaxed">
            Pair with designers from IOD, engineers from SOET, and strategists from Management for Hackathons and Capstone projects.
          </p>

          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/15">
            <button
              onClick={onOpenStudyGroups}
              className="px-3 py-1.5 rounded-xl bg-white text-slate-900 text-xs font-bold hover:bg-amber-300 transition-colors flex items-center gap-1 shadow-sm"
            >
              <Users className="w-3.5 h-3.5 text-[#8B0000]" />
              Study Groups
            </button>
            <button
              onClick={onOpenEvents}
              className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-colors flex items-center gap-1"
            >
              <span>Campus Fests & Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by student name, skill (Figma, Python, ROS), PRN..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
        />
      </div>

      {/* Department Filter Carousel */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {DEPARTMENTS.map((dept) => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedDept === dept
                ? 'bg-[#8B0000] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Student Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
          <span>Campus Students ({filteredStudents.length})</span>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> All Verified Students
          </span>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 text-slate-500 text-xs">
            No students found matching your criteria. Try adjusting the search query or department filter.
          </div>
        ) : (
          filteredStudents.map((student) => {
            const isFollowing = followedUserIds.includes(student.id);
            return (
              <div
                key={student.id}
                className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#8B0000]/20 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-xs text-slate-900 truncate">
                          {student.name}
                        </h3>
                        {student.isVerified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100 shrink-0" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium shrink-0">
                        {student.yearOfStudy}
                      </span>
                    </div>

                    {/* Department Tag */}
                    <p className="text-[11px] font-bold text-[#8B0000] mt-0.5 truncate">
                      {student.department}
                    </p>

                    {/* Bio */}
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
                      {student.bio}
                    </p>

                    {/* Skills pills */}
                    <div className="flex items-center gap-1 flex-wrap mt-2">
                      {student.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Actions: Direct Chat & Follow */}
                    <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-100">
                      <button
                        onClick={() => onOpenDirectChat(student)}
                        className="flex-1 py-1.5 rounded-xl bg-[#8B0000] hover:bg-[#6B0000] text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Send className="w-3 h-3 -rotate-12" />
                        Direct Message
                      </button>

                      <button
                        onClick={() => toggleFollow(student.id)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors flex items-center gap-1 ${
                          isFollowing
                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                        }`}
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        {isFollowing ? 'Connected' : 'Connect'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
