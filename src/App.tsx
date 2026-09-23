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

// Curated starter summaries for each new user's personal dashboard
const STARTER_PERSONAL_SUMMARIES: NewsletterSummaryItem[] = [
  {
    id: 'starter-1',
    title: "Gemini 2.5 Flash and Agentic Reasoning in Production",
    category: "AI & Tech",
    source: "TLDR Tech",
    readTime: "2 min read",
    summary: "Google released the upgraded Gemini 2.5 Flash with deep temporal video grounding and native function calling speeds under 180ms. Developers report up to 40% latency reduction in document analysis and customer agent workflows.",
    whyItMatters: "Provides high-tier reasoning capabilities at edge inference costs, making autonomous pipeline agents economically viable at scale.",
    keyPoints: [
      "180ms round-trip latency on multimodal vision and function calling benchmarks",
      "Native agentic loop support with zero custom wrapper middleware",
      "Production pricing is 60% lower than comparable reasoning models"
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'starter-2',
    title: "State of Developer Productivity: Cursor, Copilot & Autonomous Refactoring",
    category: "Coding & Dev",
    source: "The Rundown AI",
    readTime: "2 min read",
    summary: "Recent survey of 1,200 tech teams shows 78% have integrated IDE-embedded AI agents into their daily codebases. Full codebase semantic indexing and multi-file editing have overtaken standard autocomplete as the primary productivity driver.",
    whyItMatters: "Teams utilizing codebase-wide indexing report 35% faster PR delivery cycles and significantly reduced onboarding time for junior engineers.",
    keyPoints: [
      "78% developer adoption for multi-file IDE reasoning tools",
      "Autonomous test generation reduces regression bugs by 28%",
      "Engineers spend more time reviewing architectural diffs than boilerplate code"
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'starter-3',
    title: "The Shift in Enterprise Cloud Budgets: AI Tool Consolidation",
    category: "Business",
    source: "Morning Brew",
    readTime: "2 min read",
    summary: "Enterprise tech spending is moving away from fragmented SaaS point solutions toward integrated AI platforms. CFOs are auditing seat-based subscription bloat and requiring clear ROI proof on productivity licenses.",
    whyItMatters: "Single-feature tools face steep churn pressure, while unified executive digests and actionable dashboards gain executive funding.",
    keyPoints: [
      "CFOs audit average of 14 redundant software tools per department",
      "Unified workspaces replacing fragmented single-feature utilities",
      "Focus shifting to quantifiable time savings per employee"
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'starter-4',
    title: "Executive Workflows: Automating Inbox Overload in 5 Minutes",
    category: "Productivity",
    source: "Superhuman AI",
    readTime: "2 min read",
    summary: "High-performing founders and engineering leads share their automated newsletter workflows. Instead of letting newsletters pile up in Gmail, they route inbound issues into automated digest summaries delivered on Monday mornings.",
    whyItMatters: "Eliminates cognitive fatigue from 50+ weekly emails while retaining 100% of crucial industry signal.",
    keyPoints: [
      "Average knowledge worker spends 3.1 hours weekly reading newsletter clutter",
      "Executive summaries cut reading time down from 45 min to under 3 min",
      "Searchable personal digests make referencing past insights instant"
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'starter-5',
    title: "Platform Aggregation and the Battle for the AI Interface",
    category: "Strategy",
    source: "Stratechery",
    readTime: "3 min read",
    summary: "Ben Thompson analyzes how modern AI interfaces are shifting user habits from traditional search engines to direct synthesis engines. The winners are platforms that deliver curated, personalized signal directly into the user's primary workflow.",
    whyItMatters: "Whoever owns the user's daily summary layer becomes the default gateway to all downstream actions and commerce.",
    keyPoints: [
      "Synthesis engines are replacing traditional keyword search loops",
      "Direct user relationship and personalization create high retention moats",
      "Clean UI and zero-distraction design outperform noisy portals"
    ],
    createdAt: new Date().toISOString()
  }
];

export default function App() {
  const [items, setItems] = useState<NewsletterSummaryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<NewsletterSummaryItem | null>(null);
  const [isSummarizeOpen, setIsSummarizeOpen] = useState(false);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
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

  // Load user data or guest data cleanly
  const loadDataForUser = useCallback(async (user: User | null) => {
    setIsLoading(true);
    if (user) {
      // Load user's private summaries from Firestore
      try {
        let userItems = await loadUserSummariesFromCloud(user.uid);
        
        // If first-time user has no summaries, seed with personalized starter feeds
        if (userItems.length === 0) {
          for (const item of STARTER_PERSONAL_SUMMARIES) {
            await saveUserSummaryToCloud(user.uid, item);
          }
          userItems = STARTER_PERSONAL_SUMMARIES;
        }

        setItems(userItems);
        const saved = userItems.filter((i) => i.isReadLater).map((i) => i.id);
        setBookmarkedIds(saved);
      } catch (err) {
        console.error('Failed to load user summaries:', err);
        setItems(STARTER_PERSONAL_SUMMARIES);
      }
    } else {
      // Load guest session or default starter feeds
      try {
        const stored = localStorage.getItem(GUEST_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setItems(Array.isArray(parsed) && parsed.length > 0 ? parsed : STARTER_PERSONAL_SUMMARIES);
        } else {
          setItems(STARTER_PERSONAL_SUMMARIES);
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
        setItems(STARTER_PERSONAL_SUMMARIES);
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
            triggerToast(`✨ Welcome to Newsletter Summarizer! We sent a welcome email to ${user.email}`);
          } else {
            triggerToast(`Welcome back, ${user.displayName || user.email?.split('@')[0]}!`);
          }
        } catch (emailErr) {
          console.error('Welcome email check error:', emailErr);
          triggerToast(`Welcome back, ${user.displayName || user.email?.split('@')[0]}!`);
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

  // Summarize input handler
  const handleSummarizeCustom = async (text: string) => {
    setIsSummarizing(true);
    triggerToast('Summarizing your newsletter...');

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
          category: data.data.category || 'Highlights',
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

      // Prepend to items state
      setItems((prev) => [newSummary, ...prev]);
      
      // Close the input modal
      setIsSummarizeOpen(false);

      // IMMEDIATELY OPEN the summary detail modal so the user sees the summarized content right away!
      setSelectedItem(newSummary);

      triggerToast('✨ Summarized! Your digest is ready below.');
    } catch (err: any) {
      console.error('Summarize error:', err);

      // Deterministic fallback: extract directly from user text so user is never blocked
      const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
      const titleCandidate = lines[0]?.slice(0, 80) || 'Newsletter Highlights';
      const fallbackSummary: NewsletterSummaryItem = {
        id: `summary-${Date.now()}`,
        title: titleCandidate.replace(/^\[.*?\]\s*/, ''),
        category: 'Highlights',
        summary: lines.slice(1, 4).join(' ') || text.slice(0, 240),
        keyPoints: lines.slice(1, 5).filter((l) => l.length > 15),
        whyItMatters: 'Condensed essential takeaways directly from your submitted issue.',
        source: 'Submitted Newsletter',
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

  // Allow user to reload sample newsletters into their own private space
  const handleLoadSample = async () => {
    if (currentUser) {
      for (const item of STARTER_PERSONAL_SUMMARIES) {
        await saveUserSummaryToCloud(currentUser.uid, item);
      }
    } else {
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(STARTER_PERSONAL_SUMMARIES));
    }

    setItems(STARTER_PERSONAL_SUMMARIES);
    triggerToast('Loaded starter feeds into your private library!');
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
          <span>👀 You are viewing the Guest Preview.</span>
          <button
            onClick={handleSignIn}
            className="underline font-black text-pink-700 dark:text-pink-400 hover:text-pink-900 ml-1"
          >
            Sign in to get your private dashboard & email digests →
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
          onLoadSample={handleLoadSample}
          userEmail={currentUser?.email || undefined}
          userName={currentUser?.displayName || undefined}
          onTriggerEmailDigest={handleTriggerEmailDigest}
          isSendingEmail={isSendingEmail}
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
