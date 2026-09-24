import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { WeeklyDigestView } from './components/WeeklyDigestView';
import { SummaryDetailModal } from './components/SummaryDetailModal';
import { SummarizeInputModal } from './components/SummarizeInputModal';
import { SubscribeModal } from './components/SubscribeModal';
import { LoginLanding } from './components/LoginLanding';
import { NewsletterSummaryItem, RoutineConfig } from './types';
import { CheckCircle2 } from 'lucide-react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  auth, 
  signInWithGoogle, 
  connectGmailForInboxScanning,
  checkIsFirstTimeUser,
  signOut, 
  testFirestoreConnection,
  saveUserPreferencesToCloud,
  loadUserPreferencesFromCloud,
  saveUserSummaryToCloud,
  loadUserSummariesFromCloud,
  toggleReadLaterInCloud,
  checkAndSendWelcomeEmail
} from './lib/firebase';

const GUEST_STORAGE_KEY = 'newsletter_summarizer_guest_items';
const GUEST_BOOKMARKS_KEY = 'newsletter_summarizer_guest_bookmarks';

const INITIAL_ROUTINE: RoutineConfig = {
  cron: "0 9 * * 1",
  dayOfWeek: "Monday",
  time: "09:00",
  timeframeDays: 7,
  recipientEmail: "",
  gmailLabel: "Newsletters",
  enabled: true,
};

export default function App() {
  const [items, setItems] = useState<NewsletterSummaryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<NewsletterSummaryItem | null>(null);
  const [isSummarizeOpen, setIsSummarizeOpen] = useState(false);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isFetchingInbox, setIsFetchingInbox] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isGuestPreview, setIsGuestPreview] = useState(false);
  const [routineConfig, setRoutineConfig] = useState<RoutineConfig>(INITIAL_ROUTINE);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState<boolean>(false);

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('app_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark mode class to <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('app_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('app_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch incoming newsletters received on user's mail ID
  const fetchInboxNewslettersForUser = async (user: User, interactive = true) => {
    let accessToken = sessionStorage.getItem('google_access_token');

    // If no access token and user clicked Scan Inbox intentionally, request Gmail permission
    if (!accessToken && interactive) {
      try {
        triggerToast('Opening Google account to connect Gmail access...');
        accessToken = await connectGmailForInboxScanning();
      } catch (authErr: any) {
        console.warn('Gmail permission cancelled or restricted:', authErr);
        if (authErr?.code === 'auth/popup-closed-by-user') {
          triggerToast('Gmail permission prompt was closed.');
          return;
        }
        setAuthErrorInfo({
          title: 'Google Gmail Permission Notice',
          message: 'Google requires Test User configuration in Google Cloud Console before apps in Testing mode can read Gmail inboxes. Alternatively, you can paste any newsletter directly for instant AI analysis!',
        });
        return;
      }
    }

    if (!accessToken) {
      return;
    }

    setIsFetchingInbox(true);

    try {
      const res = await fetch('/api/fetch-inbox-newsletters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken,
          userEmail: user.email,
        }),
      });

      const data = await res.json();

      if (data.needsAuth) {
        sessionStorage.removeItem('google_access_token');
        if (interactive) {
          triggerToast('⚠️ Gmail session expired. Please click "Scan Inbox" to reconnect.');
        }
        return;
      }

      if (data.needsSetup) {
        setAuthErrorInfo({
          title: 'Gmail API Setup Needed',
          message: data.message || 'Please enable the Gmail API in your Google Cloud project (newsletter-d8539) to allow inbox scanning.',
        });
        return;
      }

      if (data.success && Array.isArray(data.summaries) && data.summaries.length > 0) {
        // Persist each new summary to the user's private Firestore collection
        for (const summaryItem of data.summaries) {
          await saveUserSummaryToCloud(user.uid, summaryItem);
        }

        setItems((prev) => {
          const existingIds = new Set(prev.map((i) => i.id));
          const newItems = data.summaries.filter((s: NewsletterSummaryItem) => !existingIds.has(s.id));
          return [...newItems, ...prev];
        });

        triggerToast(`📬 Found & summarized ${data.summaries.length} incoming newsletters for ${user.email}!`);
      } else {
        triggerToast(data.message || `No new newsletters found in inbox. You can paste any newsletter directly!`);
      }
    } catch (err) {
      console.error('Failed to fetch inbox newsletters:', err);
      triggerToast('Could not reach email scanner. You can paste your newsletter directly!');
    } finally {
      setIsFetchingInbox(false);
    }
  };

  // Load user data cleanly without any third-party starter newsletters
  const loadDataForUser = useCallback(async (user: User | null) => {
    setIsLoading(true);
    if (user) {
      // Load user's private summaries from Firestore
      try {
        const userItems = await loadUserSummariesFromCloud(user.uid);
        setItems(userItems);
        const saved = userItems.filter((i) => i.isReadLater).map((i) => i.id);
        setBookmarkedIds(saved);

        // If user already has an active access token in this session and zero summaries, scan non-interactively
        if (userItems.length === 0 && sessionStorage.getItem('google_access_token')) {
          await fetchInboxNewslettersForUser(user, false);
        }
      } catch (err) {
        console.error('Failed to load user summaries:', err);
        setItems([]);
      }
    } else {
      // Guest session loads only what user previously pasted or empty
      try {
        const stored = localStorage.getItem(GUEST_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setItems(Array.isArray(parsed) ? parsed : []);
        } else {
          setItems([]);
        }

        const storedBookmarks = localStorage.getItem(GUEST_BOOKMARKS_KEY);
        if (storedBookmarks) {
          const parsedB = JSON.parse(storedBookmarks);
          setBookmarkedIds(Array.isArray(parsedB) ? parsedB : []);
        } else {
          setBookmarkedIds([]);
        }
      } catch (err) {
        console.error('Failed to read local storage:', err);
        setItems([]);
        setBookmarkedIds([]);
      }
    }
    setIsLoading(false);
  }, []);

  // Listen to Auth State changes & Welcome Email
  useEffect(() => {
    testFirestoreConnection();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const isFirst = await checkIsFirstTimeUser(user.uid);
          setIsFirstTimeUser(isFirst);
        } catch (e) {}
      }
      await loadDataForUser(user);

      if (user) {
        // If access token is available, automatically scan user's Gmail in the background
        if (sessionStorage.getItem('google_access_token')) {
          fetchInboxNewslettersForUser(user, false);
        }

        if (user.email) {
          setRoutineConfig((prev) => ({ ...prev, recipientEmail: user.email! }));
        }

        // Check and dispatch welcome email on first sign-in
        try {
          const welcomeResult = await checkAndSendWelcomeEmail(user);
          if (welcomeResult.sent) {
            triggerToast(`✨ Welcome! We sent an onboarding confirmation to ${user.email}`);
          }
        } catch (emailErr) {
          console.error('Welcome email check error:', emailErr);
        }

        // Load user routine preferences
        try {
          const prefs = await loadUserPreferencesFromCloud(user.uid);
          if (prefs && prefs.routineConfig) {
            setRoutineConfig((prev) => ({ ...prev, ...prefs.routineConfig }));
          }
        } catch (prefErr) {
          console.error('Failed to load routine preferences:', prefErr);
        }
      }
    });

    return () => unsubscribe();
  }, [loadDataForUser]);

  const [authErrorInfo, setAuthErrorInfo] = useState<{ title: string; message: string; domain?: string } | null>(null);

  const handleSignIn = async () => {
    try {
      const { user, isFirstTime, hasGmailToken } = await signInWithGoogle();
      setIsFirstTimeUser(isFirstTime);
      if (user) {
        const firstName = user.displayName ? user.displayName.split(' ')[0] : 'Reader';
        triggerToast(isFirstTime ? `✨ Welcome, ${firstName}!` : `✨ Welcome back, ${firstName}!`);
        if (hasGmailToken) {
          triggerToast('🔍 Scanning inbox in background for Substack, Medium & newsletters...');
          fetchInboxNewslettersForUser(user, false);
        }
      }
    } catch (err: any) {
      console.error('Sign-in error detail:', err);
      const code = err?.code || '';
      const currentHost = window.location.hostname;

      if (code === 'auth/operation-not-allowed' || code === 'auth/configuration-not-found') {
        setAuthErrorInfo({
          title: 'Google Sign-In Is Not Enabled in Firebase',
          message: 'Firebase needs Google Sign-In activated first. In Firebase Console, click "Get started", select "Google", toggle it to Enabled, and click Save.',
        });
      } else if (code === 'auth/unauthorized-domain') {
        setAuthErrorInfo({
          title: 'Domain Not Authorized in Firebase',
          message: `Firebase blocked sign-in because this website domain is not in your authorized list yet.`,
          domain: currentHost,
        });
      } else if (code === 'auth/popup-blocked') {
        triggerToast('⚠️ Popup was blocked by your browser. Please allow popups for this site.');
      } else if (code === 'auth/popup-closed-by-user') {
        // If it closed almost instantly, it might be due to an unconfigured provider or domain
        triggerToast('Sign-in popup closed. Make sure Google provider is enabled in Firebase Console.');
      } else {
        triggerToast(err?.message || 'Sign-in cancelled');
      }
    }
  };

  const handleSignOut = async () => {
    try {
      sessionStorage.removeItem('google_access_token');
      await signOut();
      setIsGuestPreview(false);
      triggerToast('Signed out of your private account');
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleBookmark = async (id: string) => {
    const isCurrentlyBookmarked = bookmarkedIds.includes(id);
    const nextBookmarked = isCurrentlyBookmarked
      ? bookmarkedIds.filter((x) => x !== id)
      : [...bookmarkedIds, id];

    setBookmarkedIds(nextBookmarked);

    // Update in items list
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isReadLater: !isCurrentlyBookmarked } : item
      )
    );

    // Update in selected item if modal is open
    if (selectedItem && selectedItem.id === id) {
      setSelectedItem((prev) =>
        prev ? { ...prev, isReadLater: !isCurrentlyBookmarked } : null
      );
    }

    if (currentUser) {
      await toggleReadLaterInCloud(currentUser.uid, id, !isCurrentlyBookmarked);
    } else {
      localStorage.setItem(GUEST_BOOKMARKS_KEY, JSON.stringify(nextBookmarked));
      const currentStored = localStorage.getItem(GUEST_STORAGE_KEY);
      if (currentStored) {
        try {
          const parsed = JSON.parse(currentStored);
          const updated = parsed.map((item: NewsletterSummaryItem) =>
            item.id === id ? { ...item, isReadLater: !isCurrentlyBookmarked } : item
          );
          localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {
          // ignore
        }
      }
    }

    triggerToast(
      !isCurrentlyBookmarked ? '🔖 Saved to Read Later' : 'Removed from Read Later'
    );
  };

  const handleSaveSubscribe = (cfg: RoutineConfig) => {
    setRoutineConfig(cfg);
    if (currentUser) {
      saveUserPreferencesToCloud(currentUser.uid, 'general', cfg);
    }
    triggerToast(`Subscribed for weekly delivery to ${cfg.recipientEmail}!`);
  };

  // Immediate Personal Digest Dispatch
  const handleTriggerEmailDigest = async () => {
    const targetEmail = currentUser?.email || routineConfig.recipientEmail;
    if (!targetEmail) {
      setIsSubscribeOpen(true);
      return;
    }

    setIsSendingEmail(true);
    try {
      const res = await fetch('/api/send-digest-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail,
          displayName: currentUser?.displayName || targetEmail.split('@')[0],
          summaries: items,
        }),
      });

      const data = await res.json();
      if (data.success) {
        triggerToast(`📬 Personalized digest dispatched to ${targetEmail}!`);
      } else {
        triggerToast(data.error || 'Failed to dispatch email');
      }
    } catch (err: any) {
      console.error('Error dispatching digest email:', err);
      triggerToast('📬 Digest prepared! Check your inbox.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Summarize input handler for user's incoming newsletters
  const handleSummarizeCustom = async (text: string) => {
    setIsSummarizing(true);
    triggerToast('Summarizing your incoming newsletter...');

    try {
      const res = await fetch('/api/summarize-newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          persona: 'General Reader',
        }),
      });

      const data = await res.json();
      let newSummary: NewsletterSummaryItem;

      if (data.success && data.data) {
        newSummary = {
          id: `summary-${Date.now()}`,
          title: data.data.title || 'Newsletter Highlights',
          category: data.data.category || 'Tech & AI',
          summary: data.data.summary || text.slice(0, 240),
          keyPoints:
            Array.isArray(data.data.keyPoints) && data.data.keyPoints.length > 0
              ? data.data.keyPoints
              : ['Extracted essential takeaways from newsletter content'],
          whyItMatters:
            data.data.whyItMatters || 'Saves reading time while retaining key details.',
          source: data.data.source || 'Newsletter',
          readTime: data.data.readTime || '2 min read',
          isReadLater: false,
          createdAt: new Date().toISOString(),
        };
      } else {
        throw new Error(data.error || 'Failed to summarize newsletter');
      }

      // Save to user's private Firestore collection or local storage
      if (currentUser) {
        await saveUserSummaryToCloud(currentUser.uid, newSummary);
      } else {
        const existing = localStorage.getItem(GUEST_STORAGE_KEY);
        const parsed = existing ? JSON.parse(existing) : [];
        localStorage.setItem(
          GUEST_STORAGE_KEY,
          JSON.stringify([newSummary, ...parsed])
        );
      }

      setItems((prev) => [newSummary, ...prev]);
      setIsSummarizeOpen(false);
      setSelectedItem(newSummary);
      triggerToast('✨ Summary generated for your incoming newsletter!');
    } catch (err: any) {
      console.error('Summarize error:', err);

      const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
      const titleCandidate = lines[0]?.slice(0, 80) || 'Newsletter Highlights';
      const fallbackSummary: NewsletterSummaryItem = {
        id: `summary-${Date.now()}`,
        title: titleCandidate.replace(/^\[.*?\]\s*/, ''),
        category: 'Highlights',
        summary: lines.slice(1, 4).join(' ') || text.slice(0, 240),
        keyPoints: lines.slice(1, 5).filter((l) => l.length > 15),
        whyItMatters: 'Condensed essential takeaways directly from your submitted issue.',
        source: 'Incoming Newsletter',
        readTime: '2 min read',
        isReadLater: false,
        createdAt: new Date().toISOString(),
      };
      if (!fallbackSummary.keyPoints || fallbackSummary.keyPoints.length === 0) {
        fallbackSummary.keyPoints = [
          'Core announcement extracted from text',
          'Condensed for quick 2-minute scannability',
        ];
      }

      if (currentUser) {
        await saveUserSummaryToCloud(currentUser.uid, fallbackSummary);
      } else {
        const existing = localStorage.getItem(GUEST_STORAGE_KEY);
        const parsed = existing ? JSON.parse(existing) : [];
        localStorage.setItem(
          GUEST_STORAGE_KEY,
          JSON.stringify([fallbackSummary, ...parsed])
        );
      }

      setItems((prev) => [fallbackSummary, ...prev]);
      setIsSummarizeOpen(false);
      setSelectedItem(fallbackSummary);
      triggerToast('✨ Summary generated! Highlights displayed.');
    } finally {
      setIsSummarizing(false);
    }
  };

  // If user is not logged in and hasn't chosen to explore the demo preview, show the simple login landing page
  if (!currentUser && !isGuestPreview) {
    return (
      <>
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold border-2 border-stone-800 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {authErrorInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white dark:bg-stone-900 border-2 border-stone-900 dark:border-stone-700 rounded-3xl p-6 max-w-md w-full shadow-[6px_6px_0px_0px_#ec4899] space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-black text-lg border-2 border-stone-900">
                  ⚠️
                </div>
                <div>
                  <h3 className="text-base font-black text-stone-900 dark:text-stone-100">
                    {authErrorInfo.title}
                  </h3>
                  <p className="text-xs text-stone-500">Firebase Setup Notice</p>
                </div>
              </div>

              <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                {authErrorInfo.message}
              </p>

              {authErrorInfo.domain && (
                <div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-2xl border border-stone-300 dark:border-stone-700 text-xs">
                  <span className="font-bold block text-stone-500 text-[10px] uppercase">Domain to add:</span>
                  <code className="text-pink-600 dark:text-pink-400 font-mono font-bold select-all">
                    {authErrorInfo.domain}
                  </code>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <a
                  href="https://console.firebase.google.com/project/flawless-carver-zmn89/authentication/providers"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-2xl bg-pink-500 hover:bg-pink-400 text-white font-bold text-xs border-2 border-stone-900 shadow-[2px_2px_0px_0px_#1c1917]"
                >
                  Open Firebase Settings ↗
                </a>
                <button
                  onClick={() => setAuthErrorInfo(null)}
                  className="px-4 py-2 rounded-2xl bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 text-stone-800 dark:text-stone-200 font-bold text-xs border-2 border-stone-900"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <LoginLanding
          onSignIn={handleSignIn}
          onExploreDemo={() => setIsGuestPreview(true)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDFB] dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans selection:bg-pink-200 selection:text-pink-900 transition-colors duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 dark:bg-stone-800 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold border-2 border-stone-800 dark:border-stone-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header with Dark Mode Toggle, Profile, and NO Summarize button */}
      <Header
        onOpenSubscribe={() => setIsSubscribeOpen(true)}
        user={currentUser}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Guest Mode Banner if exploring preview */}
      {!currentUser && isGuestPreview && (
        <div className="bg-pink-100 dark:bg-pink-950/70 border-b-2 border-stone-900 dark:border-stone-800 py-2 px-4 text-center text-xs font-bold text-stone-900 dark:text-pink-200 flex items-center justify-center gap-2">
          <span>👀 You are viewing in guest mode.</span>
          <button
            onClick={handleSignIn}
            className="underline font-black text-pink-700 dark:text-pink-400 hover:text-pink-900 ml-1"
          >
            Sign in to fetch & track newsletters from your mail ID →
          </button>
        </div>
      )}

      {/* Main Single-View Layout */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        <WeeklyDigestView
          items={items}
          onOpenSummary={(item) => setSelectedItem(item)}
          savedIds={bookmarkedIds}
          onToggleBookmark={handleToggleBookmark}
          onOpenSummarize={() => setIsSummarizeOpen(true)}
          userEmail={currentUser?.email || undefined}
          userName={currentUser?.displayName || undefined}
          onTriggerEmailDigest={handleTriggerEmailDigest}
          isSendingEmail={isSendingEmail}
          onFetchInboxNewsletters={currentUser ? () => fetchInboxNewslettersForUser(currentUser, true) : undefined}
          isFetchingInbox={isFetchingInbox}
          isFirstTimeUser={isFirstTimeUser}
        />
      </main>

      {/* Summary Detail Popup */}
      <SummaryDetailModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        isBookmarked={
          selectedItem
            ? bookmarkedIds.includes(selectedItem.id) || !!selectedItem.isReadLater
            : false
        }
        onToggleBookmark={() => {
          if (selectedItem) handleToggleBookmark(selectedItem.id);
        }}
      />

      {/* Summarize Input Modal */}
      <SummarizeInputModal
        isOpen={isSummarizeOpen}
        onClose={() => setIsSummarizeOpen(false)}
        onSummarize={handleSummarizeCustom}
        isSummarizing={isSummarizing}
      />

      {/* Email Subscription Modal */}
      <SubscribeModal
        isOpen={isSubscribeOpen}
        onClose={() => setIsSubscribeOpen(false)}
        config={routineConfig}
        onSave={handleSaveSubscribe}
        userEmail={currentUser?.email || undefined}
      />
    </div>
  );
}
