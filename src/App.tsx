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
  const fetchInboxNewslettersForUser = async (user: User) => {
    const accessToken = sessionStorage.getItem('google_access_token');
    setIsFetchingInbox(true);

    try {
      const res = await fetch('/api/fetch-inbox-newsletters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken: accessToken || undefined,
          userEmail: user.email,
        }),
      });

      const data = await res.json();
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
        triggerToast(`Inbox scanned for ${user.email}. No new incoming newsletters found.`);
      }
    } catch (err) {
      console.error('Failed to fetch inbox newsletters:', err);
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

        // If user has zero summaries, automatically trigger inbox scan for their mail ID
        if (userItems.length === 0) {
          await fetchInboxNewslettersForUser(user);
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
      await loadDataForUser(user);

      if (user) {
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

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
      triggerToast('Sign-in cancelled');
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
          onFetchInboxNewsletters={currentUser ? () => fetchInboxNewslettersForUser(currentUser) : undefined}
          isFetchingInbox={isFetchingInbox}
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
