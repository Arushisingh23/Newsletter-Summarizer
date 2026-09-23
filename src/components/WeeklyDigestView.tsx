import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  Bookmark, 
  Clock,
  BookOpen,
  FileDown,
  Plus,
  FileText,
  Mail,
  Send,
  CheckCircle2,
  Inbox,
  Filter,
  RefreshCw,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { NewsletterSummaryItem, NewsletterSubscription } from '../types';
import { FigmaCard } from './FigmaCard';
import { exportAllSummariesToPDF } from '../lib/pdfExport';
import { AddNewsletterModal } from './AddNewsletterModal';

interface WeeklyDigestViewProps {
  items: NewsletterSummaryItem[];
  onOpenSummary: (item: NewsletterSummaryItem) => void;
  savedIds?: string[];
  onToggleBookmark?: (id: string) => void;
  onOpenSummarize?: () => void;
  onLoadSample?: () => void;
  userEmail?: string;
  userName?: string;
  onTriggerEmailDigest?: () => Promise<void>;
  isSendingEmail?: boolean;
}

const DEFAULT_SUBSCRIPTIONS: NewsletterSubscription[] = [
  {
    id: 'sub-1',
    name: 'TLDR Tech',
    sender: 'Dan Ni',
    category: 'Tech & AI',
    frequency: 'Daily',
    status: 'active',
    lastReceived: 'Today, 8:15 AM',
    unreadCount: 3,
    description: 'Byte-sized news in tech, science, and coding.',
    icon: '⚡',
  },
  {
    id: 'sub-2',
    name: 'The Rundown AI',
    sender: 'Rowan Cheung',
    category: 'AI Models',
    frequency: 'Daily',
    status: 'active',
    lastReceived: 'Today, 9:00 AM',
    unreadCount: 2,
    description: 'Stay ahead of the latest AI tools and releases.',
    icon: '🤖',
  },
  {
    id: 'sub-3',
    name: 'Morning Brew',
    sender: 'Morning Brew Team',
    category: 'Business',
    frequency: 'Daily',
    status: 'active',
    lastReceived: 'Yesterday',
    unreadCount: 1,
    description: 'Business and finance news that is actually fun to read.',
    icon: '☕',
  },
  {
    id: 'sub-4',
    name: 'Superhuman AI',
    sender: 'Zain Kahn',
    category: 'Productivity',
    frequency: 'Daily',
    status: 'active',
    lastReceived: '2d ago',
    unreadCount: 1,
    description: 'Leveraging AI for workplace speed and leverage.',
    icon: '🧠',
  },
  {
    id: 'sub-5',
    name: 'Stratechery',
    sender: 'Ben Thompson',
    category: 'Strategy',
    frequency: 'Weekly',
    status: 'active',
    lastReceived: '3d ago',
    unreadCount: 0,
    description: 'Analysis of the business, strategy, and impact of tech.',
    icon: '🚀',
  },
];

export function WeeklyDigestView({
  items,
  onOpenSummary,
  savedIds = [],
  onToggleBookmark,
  onOpenSummarize,
  onLoadSample,
  userEmail,
  userName,
  onTriggerEmailDigest,
  isSendingEmail = false,
}: WeeklyDigestViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set(savedIds));
  const [subscriptions, setSubscriptions] = useState<NewsletterSubscription[]>(() => {
    const saved = localStorage.getItem('user_newsletter_subscriptions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_SUBSCRIPTIONS;
      }
    }
    return DEFAULT_SUBSCRIPTIONS;
  });
  const [isAddSubOpen, setIsAddSubOpen] = useState(false);
  const [activeSubFilter, setActiveSubFilter] = useState<string | null>(null);

  // Sync savedIds prop
  useEffect(() => {
    setBookmarkedIds(new Set(savedIds));
  }, [savedIds]);

  const handleBookmark = (id: string) => {
    const next = new Set(bookmarkedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setBookmarkedIds(next);
    if (onToggleBookmark) onToggleBookmark(id);
  };

  const handleAddSubscription = (
    newSub: Omit<NewsletterSubscription, 'id' | 'unreadCount' | 'lastReceived'>
  ) => {
    const subWithMeta: NewsletterSubscription = {
      ...newSub,
      id: `sub-${Date.now()}`,
      unreadCount: 1,
      lastReceived: 'Just now',
      icon: '📬',
    };
    const updated = [subWithMeta, ...subscriptions];
    setSubscriptions(updated);
    localStorage.setItem('user_newsletter_subscriptions', JSON.stringify(updated));
  };

  const toggleSubStatus = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = subscriptions.map((s) =>
      s.id === id ? { ...s, status: s.status === 'active' ? ('paused' as const) : ('active' as const) } : s
    );
    setSubscriptions(updated);
    localStorage.setItem('user_newsletter_subscriptions', JSON.stringify(updated));
  };

  const readLaterCount = items.filter(
    (item) => bookmarkedIds.has(item.id) || item.isReadLater
  ).length;

  const categories = [
    { id: 'all', label: 'All Stories', emoji: '🌟' },
    { 
      id: 'read_later', 
      label: `Read Later (${readLaterCount})`, 
      emoji: '🔖' 
    },
    { id: 'ai', label: 'AI & Tech', emoji: '🤖' },
    { id: 'business', label: 'Business', emoji: '📈' },
    { id: 'coding', label: 'Coding & Dev', emoji: '💻' },
    { id: 'productivity', label: 'Productivity', emoji: '⚡' },
  ];

  const filteredItems = items.filter((item) => {
    // If active subscription filter is active
    if (activeSubFilter) {
      const sub = subscriptions.find((s) => s.id === activeSubFilter);
      if (sub) {
        const matchesSub = 
          item.source.toLowerCase().includes(sub.name.toLowerCase()) ||
          item.title.toLowerCase().includes(sub.name.toLowerCase());
        if (!matchesSub) return false;
      }
    }

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === 'all') return true;

    if (selectedCategory === 'read_later') {
      return bookmarkedIds.has(item.id) || !!item.isReadLater;
    }

    if (selectedCategory === 'ai') {
      return (
        item.category.toLowerCase().includes('model') ||
        item.category.toLowerCase().includes('ai') ||
        item.category.toLowerCase().includes('tech') ||
        item.title.toLowerCase().includes('claude') ||
        item.title.toLowerCase().includes('gemini') ||
        item.title.toLowerCase().includes('gpt')
      );
    }
    if (selectedCategory === 'business') {
      return (
        item.category.toLowerCase().includes('business') ||
        item.category.toLowerCase().includes('market') ||
        item.category.toLowerCase().includes('finance')
      );
    }
    if (selectedCategory === 'coding') {
      return (
        item.category.toLowerCase().includes('code') ||
        item.category.toLowerCase().includes('dev') ||
        item.title.toLowerCase().includes('cursor')
      );
    }
    if (selectedCategory === 'productivity') {
      return (
        item.category.toLowerCase().includes('productivity') ||
        item.category.toLowerCase().includes('workflow') ||
        item.category.toLowerCase().includes('agent')
      );
    }
    return true;
  });

  const handleExportAll = () => {
    const listToExport = filteredItems.length > 0 ? filteredItems : items;
    if (listToExport.length === 0) return;
    const title = selectedCategory === 'read_later' ? 'My Read Later Digest' : 'My Newsletter Digest';
    exportAllSummariesToPDF(listToExport, title);
  };

  const displayName = userName ? userName.split(' ')[0] : 'Reader';

  return (
    <div className="space-y-6 pb-14 font-sans transition-colors duration-200">
      {/* 1. Personalized User Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-[#FFF5F8] dark:bg-stone-900 border-2 border-stone-900 dark:border-stone-700 p-6 sm:p-7 shadow-[4px_4px_0px_0px_#1c1917] dark:shadow-[4px_4px_0px_0px_#000]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-200 dark:bg-pink-950/80 text-stone-950 dark:text-pink-300 font-black text-[11px] uppercase tracking-wider border-1.5 border-stone-900 dark:border-pink-800">
              <span>✨ Personal Dashboard</span>
              <span>•</span>
              <span>{userEmail || 'Active Workspace'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-950 dark:text-white leading-tight">
              Welcome back, <span className="text-pink-600 dark:text-pink-400">{displayName}</span>! 👋
            </h2>

            <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
              Here are the newsletters you are receiving, condensed into quick 2-minute actionable highlights.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <div className="px-4 py-3 rounded-2xl bg-white dark:bg-stone-800 border-2 border-stone-900 dark:border-stone-700 shadow-[2px_2px_0px_0px_#1c1917] dark:shadow-[2px_2px_0px_0px_#000] flex-1 sm:flex-initial">
              <span className="block text-[10px] font-black uppercase tracking-wider text-stone-400">
                Inbound Feeds
              </span>
              <span className="text-lg font-black text-stone-900 dark:text-stone-100">
                {subscriptions.filter((s) => s.status === 'active').length} Active
              </span>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-pink-100 dark:bg-pink-950/60 border-2 border-stone-900 dark:border-stone-700 shadow-[2px_2px_0px_0px_#1c1917] dark:shadow-[2px_2px_0px_0px_#000] flex-1 sm:flex-initial">
              <span className="block text-[10px] font-black uppercase tracking-wider text-pink-800 dark:text-pink-400">
                Library
              </span>
              <span className="text-lg font-black text-stone-950 dark:text-pink-200">
                {items.length} Stories
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. My Inbound Newsletters & Subscriptions Card */}
      <section className="bg-white dark:bg-stone-900 border-2 border-stone-900 dark:border-stone-700 rounded-3xl p-5 sm:p-6 shadow-[4px_4px_0px_0px_#1c1917] dark:shadow-[4px_4px_0px_0px_#000]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200 dark:border-stone-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-950 flex items-center justify-center text-pink-600 dark:text-pink-400 border border-pink-300 dark:border-pink-800 font-bold">
              <Inbox className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-stone-900 dark:text-stone-100">
                My Inbound Newsletters ({subscriptions.length})
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                All newsletters configured to feed your digest
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeSubFilter && (
              <button
                onClick={() => setActiveSubFilter(null)}
                className="text-[11px] font-bold text-pink-600 dark:text-pink-400 hover:underline px-2"
              >
                Clear Filter ✕
              </button>
            )}
            <button
              onClick={() => setIsAddSubOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-100 dark:bg-pink-950/80 hover:bg-pink-200 dark:hover:bg-pink-900 border-1.5 border-stone-900 dark:border-stone-700 text-stone-900 dark:text-pink-200 font-bold text-xs shadow-[2px_2px_0px_0px_#1c1917] dark:shadow-[2px_2px_0px_0px_#000] transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Newsletter</span>
            </button>
          </div>
        </div>

        {/* Subscriptions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {subscriptions.map((sub) => {
            const isFilterActive = activeSubFilter === sub.id;
            return (
              <div
                key={sub.id}
                onClick={() => setActiveSubFilter(isFilterActive ? null : sub.id)}
                className={`cursor-pointer rounded-2xl border-2 p-3.5 flex flex-col justify-between transition-all select-none relative ${
                  isFilterActive
                    ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/50 shadow-[3px_3px_0px_0px_#ec4899]'
                    : 'border-stone-900 dark:border-stone-700 bg-stone-50 dark:bg-stone-850 hover:bg-white dark:hover:bg-stone-800 shadow-[2px_2px_0px_0px_#1c1917] dark:shadow-[2px_2px_0px_0px_#000]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-base">{sub.icon || '📬'}</span>
                    <button
                      onClick={(e) => toggleSubStatus(sub.id, e)}
                      className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border ${
                        sub.status === 'active'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                          : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-300 dark:border-stone-700'
                      }`}
                      title="Click to toggle active/paused"
                    >
                      {sub.status}
                    </button>
                  </div>
                  <h4 className="font-extrabold text-xs text-stone-900 dark:text-stone-100 leading-snug line-clamp-1">
                    {sub.name}
                  </h4>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate">
                    {sub.sender} • {sub.frequency}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-stone-200/70 dark:border-stone-700/70 flex items-center justify-between text-[10px] font-semibold text-stone-500 dark:text-stone-400">
                  <span>{sub.lastReceived}</span>
                  {sub.unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-md bg-pink-500 text-white font-black text-[9px]">
                      {sub.unreadCount} new
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Receive Digest by Mail Action Banner */}
      <section className="bg-gradient-to-r from-pink-500 to-rose-400 dark:from-pink-600 dark:to-rose-600 border-2 border-stone-900 dark:border-stone-700 rounded-3xl p-5 sm:p-6 text-white shadow-[4px_4px_0px_0px_#1c1917] dark:shadow-[4px_4px_0px_0px_#000] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <Mail className="w-5 h-5 text-white" />
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
              Receive Your Personalized Digest by Mail
            </h3>
          </div>
          <p className="text-xs text-pink-100 font-medium">
            Delivering clean takeaways directly to <strong className="text-white underline">{userEmail || 'your verified email'}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onTriggerEmailDigest && (
            <button
              onClick={onTriggerEmailDigest}
              disabled={isSendingEmail || items.length === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-850 dark:bg-stone-950 text-white font-black text-xs border-2 border-stone-900 dark:border-stone-700 shadow-[2px_2px_0px_0px_#ffffff] transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isSendingEmail ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Dispatching Email...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-pink-400" />
                  <span>Send Me Today's Digest Now</span>
                </>
              )}
            </button>
          )}
        </div>
      </section>

      {/* 4. Filter & Search Toolbar + Dashboard Paste & Summarize Button */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search your summaries by keyword or source..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-stone-900 border-2 border-stone-900 dark:border-stone-700 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-bold text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-hidden focus:border-pink-500 shadow-[2px_2px_0px_0px_#1c1917] dark:shadow-[2px_2px_0px_0px_#000] transition-all"
            />
            <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            {/* Context-aware Summarize Button inside Dashboard */}
            {onOpenSummarize && (
              <button
                onClick={onOpenSummarize}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-pink-500 hover:bg-pink-400 border-2 border-stone-900 dark:border-stone-700 text-white font-black text-xs shadow-[2px_2px_0px_0px_#1c1917] dark:shadow-[2px_2px_0px_0px_#000] transition-all active:scale-95 cursor-pointer"
                title="Paste a new newsletter issue to summarize"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Summarize Newsletter</span>
              </button>
            )}

            {/* Export PDF */}
            {items.length > 0 && (
              <button
                onClick={handleExportAll}
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white dark:bg-stone-800 hover:bg-pink-50 dark:hover:bg-stone-700 border-2 border-stone-900 dark:border-stone-700 text-xs font-bold text-stone-900 dark:text-stone-100 shadow-[2px_2px_0px_0px_#1c1917] dark:shadow-[2px_2px_0px_0px_#000] transition-all"
                title="Export active summaries to PDF"
              >
                <FileDown className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                <span className="hidden sm:inline">Export PDF</span>
              </button>
            )}

            {/* Result Count */}
            <span className="text-xs font-bold text-stone-500 dark:text-stone-400 pl-1">
              {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>

        {/* Category & Read Later Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border-2 ${
                  isSelected
                    ? 'border-stone-900 dark:border-pink-500 bg-pink-500 text-white shadow-[2px_2px_0px_0px_#1c1917] dark:shadow-[2px_2px_0px_0px_#ec4899]'
                    : 'border-stone-900 dark:border-stone-700 bg-white dark:bg-stone-850 text-stone-800 dark:text-stone-200 hover:bg-pink-50 dark:hover:bg-stone-800 shadow-[2px_2px_0px_0px_#1c1917] dark:shadow-[2px_2px_0px_0px_#000]'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. Summaries Grid or Empty State */}
      {filteredItems.length > 0 ? (
        <section>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredItems.map((item, idx) => (
              <FigmaCard
                key={item.id}
                item={item}
                index={idx}
                isBookmarked={bookmarkedIds.has(item.id) || !!item.isReadLater}
                onToggleBookmark={() => handleBookmark(item.id)}
                onClick={() => onOpenSummary(item)}
              />
            ))}
          </div>
        </section>
      ) : (
        /* Empty State */
        <section className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-900 dark:border-stone-700 p-8 sm:p-12 text-center shadow-[4px_4px_0px_0px_#1c1917] dark:shadow-[4px_4px_0px_0px_#000] max-w-xl mx-auto space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-pink-100 dark:bg-pink-950 border-2 border-stone-900 dark:border-stone-700 flex items-center justify-center shadow-[2px_2px_0px_0px_#1c1917]">
            {selectedCategory === 'read_later' ? (
              <Bookmark className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            ) : (
              <Sparkles className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            )}
          </div>

          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-stone-100">
              {selectedCategory === 'read_later'
                ? 'No saved reading items yet'
                : activeSubFilter
                ? 'No summaries found for this subscription'
                : 'Your personal digest is clean'}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto leading-relaxed">
              {selectedCategory === 'read_later'
                ? 'Bookmark cards anytime to read them when you have a 5-minute break.'
                : 'Paste any newsletter issue into your dashboard to generate instant 2-minute takeaways.'}
            </p>
          </div>

          <div className="pt-2 flex items-center justify-center gap-3">
            {onOpenSummarize && (
              <button
                onClick={onOpenSummarize}
                className="px-4 py-2 rounded-2xl bg-pink-500 hover:bg-pink-400 border-2 border-stone-900 dark:border-stone-700 text-white font-black text-xs shadow-[2px_2px_0px_0px_#1c1917] transition-all active:scale-95"
              >
                + Summarize a Newsletter
              </button>
            )}
            {onLoadSample && (
              <button
                onClick={onLoadSample}
                className="px-4 py-2 rounded-2xl bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 border-2 border-stone-900 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-bold text-xs shadow-[2px_2px_0px_0px_#1c1917] transition-all active:scale-95"
              >
                Load Starter Feeds
              </button>
            )}
          </div>
        </section>
      )}

      {/* Add Subscription Modal */}
      <AddNewsletterModal
        isOpen={isAddSubOpen}
        onClose={() => setIsAddSubOpen(false)}
        onAdd={handleAddSubscription}
      />
    </div>
  );
}
