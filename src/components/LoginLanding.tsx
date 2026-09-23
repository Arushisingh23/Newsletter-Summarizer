import { 
  Sparkles, 
  Mail, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Inbox, 
  Bookmark,
  Sun,
  Moon
} from 'lucide-react';

interface LoginLandingProps {
  onSignIn: () => void;
  onExploreDemo: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export function LoginLanding({
  onSignIn,
  onExploreDemo,
  isDarkMode,
  onToggleDarkMode,
}: LoginLandingProps) {
  return (
    <div className="min-h-screen bg-[#FFFDFB] dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans transition-colors duration-200 flex flex-col justify-between">
      {/* Top Simple Navigation */}
      <header className="border-b-2 border-stone-900 dark:border-stone-800 bg-white/70 dark:bg-stone-900/70 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-pink-500 border-2 border-stone-900 dark:border-stone-700 flex items-center justify-center text-white shadow-[2px_2px_0px_0px_#1c1917] dark:shadow-[2px_2px_0px_0px_#f472b6] font-black text-base">
              ✨
            </div>
            <div>
              <span className="font-black text-sm sm:text-base tracking-tight text-stone-900 dark:text-stone-100">
                Newsletter Summarizer
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950/80 text-pink-900 dark:text-pink-300 font-bold border border-pink-300 dark:border-pink-800">
                Public Beta
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="w-9 h-9 rounded-xl bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 border-2 border-stone-900 dark:border-stone-700 text-stone-800 dark:text-stone-200 shadow-[2px_2px_0px_0px_#1c1917] dark:shadow-[2px_2px_0px_0px_#000] flex items-center justify-center transition-all active:scale-95"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-stone-700" />
              )}
            </button>

            {/* Simple Sign In Header Button */}
            <button
              onClick={onSignIn}
              className="px-4 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-400 border-2 border-stone-900 dark:border-stone-700 text-white font-black text-xs shadow-[2px_2px_0px_0px_#1c1917] dark:shadow-[2px_2px_0px_0px_#000] transition-all active:scale-95 flex items-center gap-1.5"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero & Simple Login Card */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 flex-1 flex flex-col justify-center items-center text-center">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-950/70 border-2 border-stone-900 dark:border-pink-800 text-pink-900 dark:text-pink-200 text-xs font-black shadow-[2px_2px_0px_0px_#1c1917] dark:shadow-[2px_2px_0px_0px_#000] mb-6">
          <Sparkles className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
          <span>Your Personal Newsletter Inbox & Digest</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl font-black text-stone-950 dark:text-white tracking-tight leading-tight sm:leading-none max-w-2xl mb-4">
          Read what matters in <span className="underline decoration-pink-400 decoration-wavy decoration-2">2 minutes</span>.
        </h1>

        <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base font-medium max-w-xl leading-relaxed mb-8">
          Sign in to get your own personal dashboard. Track incoming newsletters, receive customized email digests, and read concise takeaways without inbox overload.
        </p>

        {/* Simple Sign-in Card */}
        <div className="w-full max-w-md bg-white dark:bg-stone-900 border-2 border-stone-900 dark:border-stone-700 rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_0px_#1c1917] dark:shadow-[6px_6px_0px_0px_#f472b6] mb-10 text-left">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800 mb-5">
            <div>
              <h2 className="text-base font-black text-stone-900 dark:text-stone-100">
                Simple Sign In
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                Create or access your private dashboard
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-950 flex items-center justify-center text-pink-600 dark:text-pink-400 font-bold text-xs">
              🔒
            </div>
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={onSignIn}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl bg-white hover:bg-stone-50 dark:bg-stone-800 dark:hover:bg-stone-750 border-2 border-stone-900 dark:border-stone-600 text-stone-900 dark:text-stone-100 font-bold text-sm shadow-[3px_3px_0px_0px_#1c1917] dark:shadow-[3px_3px_0px_0px_#000] transition-all active:scale-[0.98] cursor-pointer mb-3"
          >
            {/* Google SVG */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <p className="text-[11px] text-stone-500 dark:text-stone-400 text-center font-medium leading-relaxed">
            By signing in, you receive your starter newsletter feed and can opt in to get your weekly digest via email.
          </p>

          <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
            <span className="text-stone-500 dark:text-stone-400">Want to test without login?</span>
            <button
              onClick={onExploreDemo}
              className="font-bold text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1"
            >
              <span>Explore Preview</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 3 Core Value Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-left">
          <div className="bg-white dark:bg-stone-900 border-2 border-stone-900 dark:border-stone-700 rounded-2xl p-4 shadow-[3px_3px_0px_0px_#1c1917] dark:shadow-[3px_3px_0px_0px_#000]">
            <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-950 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-3 border border-pink-300 dark:border-pink-800">
              <Inbox className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black text-stone-900 dark:text-stone-100 mb-1">
              Your Inbound Feeds
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 font-medium leading-relaxed">
              See the exact newsletters you are receiving (TLDR, Morning Brew, Substack) in your private hub.
            </p>
          </div>

          <div className="bg-white dark:bg-stone-900 border-2 border-stone-900 dark:border-stone-700 rounded-2xl p-4 shadow-[3px_3px_0px_0px_#1c1917] dark:shadow-[3px_3px_0px_0px_#000]">
            <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-950 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-3 border border-pink-300 dark:border-pink-800">
              <Mail className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black text-stone-900 dark:text-stone-100 mb-1">
              Receive Digests by Mail
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 font-medium leading-relaxed">
              When you sign in, receive a welcome mail and schedule automated weekly digests directly to your inbox.
            </p>
          </div>

          <div className="bg-white dark:bg-stone-900 border-2 border-stone-900 dark:border-stone-700 rounded-2xl p-4 shadow-[3px_3px_0px_0px_#1c1917] dark:shadow-[3px_3px_0px_0px_#000]">
            <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-950 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-3 border border-pink-300 dark:border-pink-800">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black text-stone-900 dark:text-stone-100 mb-1">
              Personalized for You
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 font-medium leading-relaxed">
              Each user has their own private dashboard, reading list, and saved bookmarks in secure cloud storage.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-stone-900 dark:border-stone-800 bg-white dark:bg-stone-900 py-4 text-center text-xs text-stone-500 dark:text-stone-400">
        <p>Newsletter Summarizer • Scalable for 100+ users • Fast, private & clean</p>
      </footer>
    </div>
  );
}
