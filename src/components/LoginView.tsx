import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Lock, 
  Mail, 
  Building2, 
  GraduationCap, 
  UserCheck, 
  Eye, 
  EyeOff,
  BookOpen
} from 'lucide-react';
import { MitLogo } from './Logo';
import { StudentUser, UniversityDepartment } from '../types';
import { MOCK_STUDENTS, MIT_BRAND } from '../data/mockData';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface LoginViewProps {
  onLoginSuccess: (user: StudentUser) => void;
}

const DEPARTMENTS: UniversityDepartment[] = [
  'School of Computing',
  'MIT Institute of Design (IOD)',
  'School of Engineering & Tech',
  'School of Bioengineering',
  'MIT College of Management',
  'School of Film & Media (ISBJ)',
  'School of Architecture & Planning'
];

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'email' | 'register'>('quick');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [prn, setPrn] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState<UniversityDepartment>('School of Computing');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Quick 1-Click Student Login
  const handleSelectQuickStudent = (student: StudentUser) => {
    sound.playSuccess();
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#8B0000', '#F59E0B', '#0B2545']
    });
    localStorage.setItem('mit_logged_user_id', student.id);
    onLoginSuccess(student);
  };

  // Standard University Email Sign In
  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail.endsWith('@mituniversity.ac.in') && !trimmedEmail.endsWith('@mitwpu.edu.in')) {
      setErrorMsg('Access Restricted: Please enter an official university email ending with @mituniversity.ac.in');
      return;
    }

    if (!password) {
      setErrorMsg('Please enter your university account password or PIN.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Check if student exists in mock
      const existing = MOCK_STUDENTS.find(s => s.email.toLowerCase() === trimmedEmail);
      if (existing) {
        sound.playSuccess();
        localStorage.setItem('mit_logged_user_id', existing.id);
        onLoginSuccess(existing);
      } else {
        // Construct new user from email
        const studentName = trimmedEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, c => c.toUpperCase());
        const newUser: StudentUser = {
          id: `user_${Date.now()}`,
          name: studentName,
          email: trimmedEmail,
          department: 'School of Computing',
          yearOfStudy: '3rd Year, B.Tech',
          prnNumber: `MIT${new Date().getFullYear()}CS${Math.floor(100 + Math.random() * 900)}`,
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
          bio: "MIT ADT student passionate about campus collaboration & technology.",
          isVerified: true,
          skills: ["Fullstack", "React", "AI/ML"],
          followersCount: 140,
          followingCount: 95,
          postsCount: 3,
        };
        sound.playSuccess();
        localStorage.setItem('mit_logged_user_id', newUser.id);
        onLoginSuccess(newUser);
      }
    }, 600);
  };

  // Register New Student Form
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail.endsWith('@mituniversity.ac.in') && !trimmedEmail.endsWith('@mitwpu.edu.in')) {
      setErrorMsg('Please provide your official university email (@mituniversity.ac.in).');
      return;
    }

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const newUser: StudentUser = {
        id: `user_${Date.now()}`,
        name: name.trim(),
        email: trimmedEmail,
        department,
        yearOfStudy: '2nd Year',
        prnNumber: prn.trim() || `MIT2024${department.slice(0, 3).toUpperCase()}102`,
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
        bio: `Student at ${department} • MIT ADT University. Excited to join study groups!`,
        isVerified: true,
        skills: ["Collaboration", "Academics", "Design"],
        followersCount: 50,
        followingCount: 80,
        postsCount: 1,
      };

      sound.playSuccess();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#059669', '#F59E0B', '#8B0000']
      });
      localStorage.setItem('mit_logged_user_id', newUser.id);
      onLoginSuccess(newUser);
    }, 700);
  };

  return (
    <div className="min-h-full flex flex-col justify-between bg-slate-900 text-white relative overflow-hidden">
      {/* Background Campus Visual of Vishwashanti Dome */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1200&q=80"
          alt="MIT ADT Vishwashanti Dome"
          className="w-full h-full object-cover filter brightness-[0.25] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
      </div>

      {/* Top University Branding Bar */}
      <div className="relative z-10 px-5 pt-8 pb-4">
        <div className="flex items-center justify-between">
          <MitLogo size="md" showText={true} light={true} />
          <span className="text-[10px] font-bold text-amber-300 bg-amber-400/20 px-2.5 py-1 rounded-full border border-amber-300/30 tracking-wider uppercase">
            Campus Folks Only
          </span>
        </div>

        <div className="mt-6 text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#8B0000]/60 border border-rose-400/30 text-rose-200 text-[11px] font-semibold mb-2">
            <Sparkles className="w-3 h-3 text-amber-300" />
            Social Feed • Grades & GPA • Study Groups
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
            Welcome to <span className="text-amber-400">CampusGram</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-sm leading-relaxed">
            Exclusive campus community for MIT Art, Design and Technology University students, Rajbaug Pune.
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className="relative z-10 p-4 sm:p-5">
        <div className="bg-white/95 backdrop-blur-xl text-slate-900 rounded-3xl p-4 sm:p-5 shadow-2xl border border-white/20">
          {/* Tab Selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl mb-4 border border-slate-200">
            <button
              onClick={() => setActiveTab('quick')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'quick'
                  ? 'bg-[#8B0000] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ⚡ Fast Demo Login
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'email'
                  ? 'bg-[#8B0000] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              University Email
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'register'
                  ? 'bg-[#8B0000] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Register
            </button>
          </div>

          {errorMsg && (
            <div className="mb-3 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* TAB 1: 1-CLICK VERIFIED CAMPUS PERSONAS */}
          {activeTab === 'quick' && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
                <span>Choose verified student persona:</span>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3" /> Ready Access
                </span>
              </div>

              <div className="space-y-1.5 max-h-72 overflow-y-auto no-scrollbar">
                {MOCK_STUDENTS.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => handleSelectQuickStudent(student)}
                    className="w-full p-2.5 rounded-2xl border border-slate-200 hover:border-[#8B0000] bg-slate-50/70 hover:bg-amber-50/50 flex items-center justify-between text-left transition-all group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-[#8B0000]/20 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <p className="text-xs font-bold text-slate-900 truncate">{student.name}</p>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100 shrink-0" />
                        </div>
                        <p className="text-[10px] text-[#8B0000] font-semibold truncate">{student.department}</p>
                        <p className="text-[9px] text-slate-400 font-mono truncate">{student.email}</p>
                      </div>
                    </div>

                    <div className="w-7 h-7 rounded-xl bg-slate-200 group-hover:bg-[#8B0000] group-hover:text-white text-slate-500 flex items-center justify-center shrink-0 transition-colors">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: UNIVERSITY EMAIL SIGN IN */}
          {activeTab === 'email' && (
            <form onSubmit={handleEmailLogin} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  University Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="student.name@mituniversity.ac.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Campus Password / PIN
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-xl bg-[#8B0000] hover:bg-[#6B0000] text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                >
                  {isLoading ? 'Verifying Student Access...' : 'Sign In with University ID'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('aarav.sharma@mituniversity.ac.in');
                    setPassword('mitadt2026');
                  }}
                  className="text-[11px] text-[#8B0000] hover:underline font-semibold"
                >
                  Auto-fill demo credentials
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: REGISTER NEW STUDENT */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-2.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Full Student Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Diya Patel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  University Email
                </label>
                <input
                  type="email"
                  placeholder="diya.patel@mituniversity.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as UniversityDepartment)}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-[11px] focus:outline-none"
                  >
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    PRN Number
                  </label>
                  <input
                    type="text"
                    placeholder="MIT2024CS099"
                    value={prn}
                    onChange={(e) => setPrn(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-[11px] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-xl bg-[#8B0000] hover:bg-[#6B0000] text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                >
                  {isLoading ? 'Creating Student Profile...' : 'Complete Registration & Access'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer info */}
        <p className="text-center text-[10px] text-slate-400 mt-4">
          MIT Art, Design and Technology University • Rajbaug, Loni Kalbhor, Pune - 412201
        </p>
      </div>
    </div>
  );
};
