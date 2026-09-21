import { useState } from 'react';
import { 
  Sparkles, 
  Mail, 
  FileText, 
  LogIn, 
  LogOut, 
  User as UserIcon,
  Plus
} from 'lucide-react';
import type { User } from 'firebase/auth';

interface HeaderProps {
  onOpenSummarize: () => void;
  onOpenSubscribe: () => void;
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
}

export function Header({
  onOpenSummarize,
  onOpenSubscribe,
  user,
  onSignIn,
  onSignOut,
}: HeaderProps) {
  return (
    <header className="border-b-2 border-stone-900 bg-white sticky top-0 z-30 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-pink-400 border-2 border-stone-900 flex items-center justify-center text-white shadow-[2px_2px_0px_0px_#1c1917] font-black text-lg">
            ✨
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-stone-900 font-sans">
                Newsletter Summarizer
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-100 text-pink-900 font-bold border border-pink-300">
                Weekly Digest
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-medium">
              Read what matters in 2 minutes
            </p>
          </div>
        </div>

        {/* Action Buttons with Pink Styling */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenSummarize}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-pink-100 hover:bg-pink-200 border-2 border-stone-900 text-stone-900 font-bold text-xs shadow-[2px_2px_0px_0px_#1c1917] transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-pink-700" />
            <span>Summarize Newsletter</span>
          </button>

          <button
            onClick={onOpenSubscribe}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-400 border-2 border-stone-900 text-white font-bold text-xs shadow-[2px_2px_0px_0px_#1c1917] transition-all active:scale-95"
          >
            <Mail className="w-3.5 h-3.5 text-white" />
            <span>Get Weekly Email</span>
          </button>

          {/* User Sign In / Profile */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-pink-50 border border-pink-200 text-stone-900 text-xs font-bold">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-5 h-5 rounded-full object-cover border border-stone-900"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <UserIcon className="w-4 h-4 text-pink-600" />
                )}
                <span className="max-w-[70px] truncate text-[11px]">
                  {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
                </span>
              </div>
              <button
                onClick={onSignOut}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-900 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 border-2 border-stone-900 text-stone-900 font-bold text-xs shadow-[2px_2px_0px_0px_#1c1917] transition-all active:scale-95"
            >
              <LogIn className="w-3.5 h-3.5 text-stone-700" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
