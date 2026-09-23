import { 
  Sparkles, 
  Mail, 
  LogIn, 
  LogOut, 
  User as UserIcon,
  Sun,
  Moon
} from 'lucide-react';
import type { User } from 'firebase/auth';

interface HeaderProps {
  onOpenSubscribe?: () => void;
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Header({
  onOpenSubscribe,
  user,
  onSignIn,
  onSignOut,
  isDarkMode,
  onToggleDarkMode,
}: HeaderProps) {
  return (
    <header className="border-b-2 border-stone-900 dark:border-stone-800 bg-[#FFFDFB] dark:bg-stone-900 sticky top-0 z-30 font-sans transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand Name & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-pink-500 border-2 border-stone-900 dark:border-stone-700 flex items-center justify-center text-white shadow-[2px_2px_0px_0px_#1c1917] dark:shadow-[2px_2px_0px_0px_#f472b6] font-black text-lg">
            ✨
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-stone-900 dark:text-stone-100 font-sans">
                Newsletter Summarizer
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950/70 text-pink-900 dark:text-pink-300 font-bold border border-pink-300 dark:border-pink-800">
                {user ? 'Personal Digest' : 'Smart Highlights'}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
              Read what matters in 2 minutes
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Dark / Light Mode Toggle Button */}
          <button
            onClick={onToggleDarkMode}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 border-2 border-stone-900 dark:border-stone-700 text-stone-800 dark:text-stone-200 shadow-[2px_2px_0px_0px_#1c1917] dark:shadow-[2px_2px_0px_0px_#000] transition-all active:scale-95"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-200" />
            ) : (
              <Moon className="w-4 h-4 text-stone-700 animate-in spin-in-180 duration-200" />
            )}
          </button>

          {/* Email Digest Settings / Schedule */}
          {user && onOpenSubscribe && (
            <button
              onClick={onOpenSubscribe}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-400 border-2 border-stone-900 dark:border-stone-700 text-white font-bold text-xs shadow-[2px_2px_0px_0px_#1c1917] dark:shadow-[2px_2px_0px_0px_#000] transition-all active:scale-95"
              title="Configure email delivery preferences"
            >
              <Mail className="w-3.5 h-3.5 text-white" />
              <span>Email Schedule</span>
            </button>
          )}

          {/* User Sign In / Profile */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-pink-50 dark:bg-stone-800 border border-pink-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs font-bold">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-5 h-5 rounded-full object-cover border border-stone-900 dark:border-stone-700"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-pink-400 flex items-center justify-center text-[10px] text-white font-bold">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="max-w-[80px] sm:max-w-[110px] truncate text-[11px]">
                  {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
                </span>
              </div>
              <button
                onClick={onSignOut}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                title="Sign out of personal dashboard"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-400 border-2 border-stone-900 dark:border-stone-700 text-white font-black text-xs shadow-[2px_2px_0px_0px_#1c1917] dark:shadow-[2px_2px_0px_0px_#000] transition-all active:scale-95"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
