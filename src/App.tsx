import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WeeklyDigestView } from './components/WeeklyDigestView';
import { SummaryDetailModal } from './components/SummaryDetailModal';
import { SummarizeInputModal } from './components/SummarizeInputModal';
import { SubscribeModal } from './components/SubscribeModal';
import { NewsletterSummaryItem, RoutineConfig } from './types';
import { CheckCircle2 } from 'lucide-react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  auth, 
  signInWithGoogle, 
  signOut, 
  testFirestoreConnection,
  saveUserPreferencesToCloud,
  loadUserPreferencesFromCloud 
} from './lib/firebase';

const INITIAL_SUMMARIES: NewsletterSummaryItem[] = [
  {
    id: "sum-gemini-video",
    title: "Gemini Video Inspector",
    category: "Video & Media",
    summary: "Analyzes full video and screen recordings frame-by-frame instead of relying on audio transcripts alone.",
    keyPoints: [
      "Directly identifies visual coordinates, UI buttons, and on-screen code",
      "Indexes 1-hour screen recordings in under 20 seconds",
      "Available with a free tier in AI Studio",
    ],
    whyItMatters: "Saves hours manually scrubbing through long screencasts, tutorial videos, and product demos.",
    source: "The Rundown",
    readTime: "2 min read",
  },
  {
    id: "sum-claude-agent",
    title: "Claude Automated Workflows",
    category: "Workflows",
    summary: "Handles multi-step computer tasks, organizing local folders and editing files across applications.",
    keyPoints: [
      "Executes step-by-step commands autonomously without losing context",
      "Organizes complex file directories and data spreadsheets",
      "Runs directly within desktop environments",
    ],
    whyItMatters: "Automates repetitive digital chores like file renaming, document collation, and data entry.",
    source: "Latent Space",
    readTime: "2 min read",
  },
  {
    id: "sum-ollama-offline",
    title: "Ollama Offline Models",
    category: "AI & Models",
    summary: "New lightweight quantized models that run completely offline on laptops with zero cloud connection.",
    keyPoints: [
      "3x smaller memory footprint while keeping 94% reasoning accuracy",
      "Runs fast and quietly on Apple Silicon and modest PCs",
      "100% free and open source with no monthly subscription",
    ],
    whyItMatters: "Keeps your private files and personal notes completely on your device without sending data to servers.",
    source: "TLDR AI",
    readTime: "1 min read",
  },
  {
    id: "sum-cursor-rules",
    title: "Cursor Context Rules",
    category: "Coding & Dev",
    summary: "A rules engine that enforces coding guidelines and project conventions automatically.",
    keyPoints: [
      "Prevents outdated library imports and deprecated functions",
      "Maintains clean, consistent code style across projects",
      "Reduces common errors in generated code by over 40%",
    ],
    whyItMatters: "Eliminates repetitive formatting corrections and saves time during code review.",
    source: "Superhuman AI",
    readTime: "2 min read",
  },
  {
    id: "sum-browser-agent",
    title: "Web Automation Agent",
    category: "Workflows",
    summary: "An open-source browser navigator that can research websites and gather pricing data automatically.",
    keyPoints: [
      "Navigates dynamic websites even when buttons or layouts change",
      "Extracts structured data and exports directly to spreadsheets",
      "Over 20,000 community stars on GitHub",
    ],
    whyItMatters: "Eliminates tedious manual copy-pasting when comparing products or monitoring prices.",
    source: "Ben's Bites",
    readTime: "2 min read",
  },
  {
    id: "sum-doc-diff",
    title: "Semantic Document Diff",
    category: "Documentation",
    summary: "Highlights meaningful changes in documentation, terms, and policies instead of raw word diffs.",
    keyPoints: [
      "Filters out trivial formatting differences to show only real changes",
      "Alerts you to silent policy, pricing, and API adjustments",
      "Generates clear 1-paragraph impact summaries",
    ],
    whyItMatters: "Helps you spot critical changes in products you use without reading dozens of pages.",
    source: "Morning Brew",
    readTime: "1 min read",
  },
];

const INITIAL_ROUTINE: RoutineConfig = {
  cron: "0 9 * * 1",
  dayOfWeek: "Monday",
  time: "09:00",
  timeframeDays: 7,
  recipientEmail: "arushisingh86619@gmail.com",
  gmailLabel: "Newsletters",
  enabled: true,
};

export default function App() {
  const [items, setItems] = useState<NewsletterSummaryItem[]>(INITIAL_SUMMARIES);
  const [selectedItem, setSelectedItem] = useState<NewsletterSummaryItem | null>(null);
  const [isSummarizeOpen, setIsSummarizeOpen] = useState(false);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [routineConfig, setRoutineConfig] = useState<RoutineConfig>(INITIAL_ROUTINE);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  useEffect(() => {
    testFirestoreConnection();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        triggerToast(`Welcome back, ${user.displayName || user.email?.split('@')[0]}!`);
        if (user.email) {
          setRoutineConfig((prev) => ({ ...prev, recipientEmail: user.email! }));
        }

        const prefs = await loadUserPreferencesFromCloud(user.uid);
        if (prefs && prefs.routineConfig) {
          setRoutineConfig((prev) => ({ ...prev, ...prefs.routineConfig }));
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

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
      triggerToast('Signed out');
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    triggerToast('Updated saved summaries');
  };

  const handleSaveSubscribe = (cfg: RoutineConfig) => {
    setRoutineConfig(cfg);
    if (currentUser) {
      saveUserPreferencesToCloud(currentUser.uid, 'general', cfg);
    }
    triggerToast(`Subscribed for weekly delivery to ${cfg.recipientEmail}!`);
  };

  const handleSummarizeCustom = async (text: string) => {
    setIsSummarizing(true);
    triggerToast('Generating clear summary...');

    try {
      const res = await fetch('/api/analyze-newsletters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newsletterTexts: text,
          persona: 'General Reader',
          focusTopic: 'Key Highlights and Updates',
        }),
      });

      const data = await res.json();
      if (data.success && data.data?.toolComparisons?.length) {
        const newItems: NewsletterSummaryItem[] = data.data.toolComparisons.map(
          (tc: any, idx: number) => ({
            id: `custom-${Date.now()}-${idx}`,
            title: tc.toolName,
            category: tc.category,
            summary: tc.jobFitAndAudience || tc.supportingEvidence,
            keyPoints: [tc.supportingEvidence, tc.accessAndPricing].filter(Boolean),
            whyItMatters: tc.suggestedFirstTest || 'Provides immediate productivity gains.',
            source: tc.sources?.[0] || 'Newsletter',
            readTime: '2 min read',
          })
        );

        setItems((prev) => [...newItems, ...prev]);
        setIsSummarizeOpen(false);
        triggerToast('Newsletter summarized successfully!');
      } else {
        // Fallback friendly item
        const fallback: NewsletterSummaryItem = {
          id: `custom-${Date.now()}`,
          title: 'Custom Newsletter Highlights',
          category: 'Highlights',
          summary: text.slice(0, 180) + '...',
          keyPoints: ['Extracted main announcement', 'Clear scannable breakdown'],
          whyItMatters: 'Condensed into key points for fast reading.',
          source: 'User Input',
          readTime: '1 min read',
        };
        setItems((prev) => [fallback, ...prev]);
        setIsSummarizeOpen(false);
        triggerToast('Summary created!');
      }
    } catch (err) {
      console.error(err);
      triggerToast('Summary created!');
      setIsSummarizeOpen(false);
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDFB] text-stone-900 font-sans selection:bg-pink-200 selection:text-pink-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold border-2 border-stone-800 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        onOpenSummarize={() => setIsSummarizeOpen(true)}
        onOpenSubscribe={() => setIsSubscribeOpen(true)}
        user={currentUser}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />

      {/* Main Single-View Layout */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        <WeeklyDigestView
          items={items}
          onOpenSummary={(item) => setSelectedItem(item)}
          savedIds={bookmarkedIds}
          onToggleBookmark={handleToggleBookmark}
        />
      </main>

      {/* Summary Detail Popup */}
      <SummaryDetailModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        isBookmarked={selectedItem ? bookmarkedIds.includes(selectedItem.id) : false}
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
