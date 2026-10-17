import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Mail, 
  KeyRound, 
  QrCode, 
  Sparkles, 
  GraduationCap,
  Building2,
  RefreshCw
} from 'lucide-react';
import { StudentUser } from '../types';
import { MitLogo } from './Logo';

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: StudentUser;
  onVerifiedSuccess?: (email: string) => void;
}

export const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onVerifiedSuccess,
}) => {
  const [emailInput, setEmailInput] = useState(currentUser.email);
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'input' | 'otp' | 'idcard'>('idcard');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const validDomains = ['mituniversity.ac.in', 'mitwpu.edu.in', 'mitpune.ac.in'];

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const emailTrimmed = emailInput.trim().toLowerCase();
    const domain = emailTrimmed.split('@')[1];

    if (!domain || !validDomains.includes(domain)) {
      setErrorMsg(`Access restricted: Please enter an official university email ending with @mituniversity.ac.in (or sister campus domains).`);
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setStep('otp');
    }, 700);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.trim().length < 4) {
      setErrorMsg('Please enter the 6-digit campus verification OTP.');
      return;
    }

    if (onVerifiedSuccess) {
      onVerifiedSuccess(emailInput);
    }
    setStep('idcard');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-[#8B0000] via-[#9B111E] to-[#0B2545] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <h2 className="text-xs font-bold tracking-wide uppercase">
              University Access & Student ID
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5">
          {step === 'idcard' && (
            <div className="space-y-4">
              <div className="text-center">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                  Exclusive Verified Student Access
                </span>
                <p className="text-xs text-slate-500 mt-1">
                  Official Digital Campus Credential for MIT ADT University
                </p>
              </div>

              {/* DIGITAL STUDENT IDENTITY CARD */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0B2545] via-[#162A45] to-[#8B0000] text-white p-4 shadow-xl border border-amber-400/40">
                {/* Background watermark */}
                <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full bg-amber-400/10 blur-xl pointer-events-none" />

                {/* ID Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/20">
                  <MitLogo size="sm" showText={true} light={true} />
                  <div className="text-right">
                    <span className="text-[9px] font-extrabold text-amber-300 uppercase tracking-widest block">
                      STUDENT ID CARD
                    </span>
                    <span className="text-[9px] text-slate-300">AY 2023 - 2027</span>
                  </div>
                </div>

                {/* ID Body */}
                <div className="flex items-start gap-3.5 mt-3.5">
                  <div className="relative shrink-0">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-400 shadow-md"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full ring-2 ring-white">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-black text-white truncate">
                      {currentUser.name}
                    </h3>
                    <p className="text-[11px] font-bold text-amber-300 truncate mt-0.5">
                      {currentUser.department}
                    </p>
                    <p className="text-[10px] text-slate-200 mt-0.5">
                      PRN: <strong className="text-white font-mono">{currentUser.prnNumber}</strong>
                    </p>
                    <p className="text-[10px] text-slate-300 truncate">
                      {currentUser.email}
                    </p>
                  </div>
                </div>

                {/* ID Footer with Hologram & QR Code */}
                <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-[9px] text-slate-300">
                  <div className="space-y-0.5">
                    <span className="text-amber-300 font-bold block uppercase tracking-wider">
                      ★ CAMPUS FOLKS ONLY ★
                    </span>
                    <span>Rajbaug Campus, Loni Kalbhor, Pune</span>
                  </div>

                  <div className="w-8 h-8 rounded-lg bg-white p-1 shrink-0 flex items-center justify-center">
                    <QrCode className="w-full h-full text-slate-900" />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => setStep('input')}
                  className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Verify Another Email
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2 rounded-xl bg-[#8B0000] hover:bg-[#6B0000] text-white font-bold text-xs shadow-md transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {step === 'input' && (
            <form onSubmit={handleSendCode} className="space-y-3">
              <div className="text-center mb-2">
                <div className="w-12 h-12 rounded-2xl bg-[#8B0000]/10 text-[#8B0000] mx-auto flex items-center justify-center mb-2">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Enter University Email
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Exclusive access requires an official <strong>@mituniversity.ac.in</strong> email.
                </p>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Student University Email
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="your.name@mituniversity.ac.in"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
                  required
                />
              </div>

              {errorMsg && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
                  {errorMsg}
                </div>
              )}

              {/* Quick Preset Buttons for easy testing */}
              <div className="pt-1">
                <span className="text-[10px] text-slate-400 font-medium block mb-1">
                  Click to auto-fill official department emails:
                </span>
                <div className="flex flex-wrap gap-1">
                  {[
                    'aarav.sharma@mituniversity.ac.in',
                    'tanvi.deshmukh@mituniversity.ac.in',
                    'rohan.kulkarni@mituniversity.ac.in'
                  ].map((email) => (
                    <button
                      key={email}
                      type="button"
                      onClick={() => setEmailInput(email)}
                      className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md"
                    >
                      {email.split('@')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full py-2.5 rounded-xl bg-[#8B0000] hover:bg-[#6B0000] text-white font-bold text-xs shadow-md transition-colors"
                >
                  {isSending ? 'Sending Verification Code...' : 'Send Campus OTP Code'}
                </button>
              </div>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-3">
              <div className="text-center mb-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 mx-auto flex items-center justify-center mb-2">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Enter Campus OTP
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verification code dispatched to <strong>{emailInput}</strong>
                </p>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 842109"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full text-center text-lg tracking-widest font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
                />
              </div>

              <button
                type="button"
                onClick={() => setVerificationCode('842109')}
                className="w-full text-center text-xs font-semibold text-[#8B0000] hover:underline"
              >
                Use Quick Demo Code: 842109
              </button>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#8B0000] hover:bg-[#6B0000] text-white font-bold text-xs shadow-md transition-colors"
                >
                  Confirm Verification & Unlock ID
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
