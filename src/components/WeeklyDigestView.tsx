import { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Bookmark, 
  FileDown, 
  Plus, 
  Mail, 
  Send, 
  Inbox, 
  RefreshCw, 
  ShieldCheck,
  CheckCircle2,
  InboxIcon
} from 'lucide-react';
import { NewsletterSummaryItem } from '../types';
import { FigmaCard } from './FigmaCard';
import { exportAllSummariesToPDF } from '../lib/pdfExport';

interface WeeklyDigestViewProps {
  items: NewsletterSummaryItem[];
  onOpenSummary: (item: NewsletterSummaryItem) => void;
  savedIds?: string[];
  onToggleBookmark?: (id: string) => void;
  onOpenSummarize?: () => void;
  userEmail?: string;
  userName?: string;
  onTriggerEmailDigest?: () => Promise<void>;
  isSendingEmail?: boolean;
  onFetchInboxNewsletters?: () => Promise<void>;
  isFetchingInbox?: boolean;
}

export function WeeklyDigestView({
  items,
  onOpenSummary,
  savedIds = [],
  onToggleBookmark,
  onOpenSummarize,
  userEmail,
  userName,
  onTriggerEmailDigest,
  isSendingEmail = false,
  onFetchInboxNewsletters,
  isFetchingInbox = false,
}: WeeklyDigestViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeSourceFilter, setActiveSourceFilter] = useState<string | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set(savedIds));

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

  // Dynamically derive ONLY the newsletters actually received on the user's mail ID
  const incomingNewsletters = useMemo(() => {
    const map = new Map<string, { name: string; count: number; lastDate: string; category: string }>();
    for (const item of items) {
      const src = item.source || 'Newsletter';
      const existing = map.get(src);
      if (!existing) {
        map.set(src, {
          name: src,
          count: 1,
          lastDate: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent',
          category: item.category || 'Tech & AI',
        });
      } else {
        existing.count += 1;
      }
    }
    return Array.from(map.values());
  }, [items]);

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
    { id: 'tech', label: 'Tech & AI', emoji: '🤖' },
    { id: 'business', label: 'Business', emoji: '📈' },
    { id: 'dev', label: 'Coding & Dev', emoji: '💻' },
    { id: 'workflow', label: 'Workflows', emoji: '⚡' },
  ];

  const filteredItems = items.filter((item) => {
    if (activeSourceFilter && item.source !== activeSourceFilter) {
      return false;
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

    if (selectedCategory === 'tech') {
      return (
        item.category.toLowerCase().includes('model') ||
        item.category.toLowerCase().includes('ai') ||
        item.category.toLowerCase().includes('tech')
      );
    }
    if (selectedCategory === 'business') {
      return (
        item.category.toLowerCase().includes('business') ||
        item.category.toLowerCase().includes('market') ||
        item.category.toLowerCase().includes('finance')
      );
    }
    if (selectedCategory === 'dev') {
      return (
        item.category.toLowerCase().includes('code') ||
        item.category.toLowerCase().includes('dev')
      );
    }
    if (selectedCategory === 'workflow') {
      return (
        item.category.toLowerCase().includes('productivity') ||
        item.category.toLowerCase().includes('workflow')
      );
    }
    return true;
  });

  const handleExportAll = () => {
    const listToExport = filteredItems.length > 0 ? filteredItems : items;
    if (listToExport.length === 0) return;
    const title = selectedCategory === 'read_later' ? 'My Read Later Digest' : 'My Inbound Newsletters Digest';
    exportAllSummariesToPDF(listToExport, title);
  };

  const displayName = userName ? userName.split(' ')[0] : 'Reader';

  return (
    <div className="space-y-6 pb-14 font-sans transition-colors duration-200">
      {/* 1. Header Hero Banner: Private to User */}
      <section className="relative overflow-hidden rounded-3xl bg-[#FFF5F8] dark:bg-stone-900 border-2 border-stone-900 dark:border-stone-700 p-6 sm:p-7 shadow-[4px_4px_0px_0px_#1c1917] dark:shadow-[4px_4px_0px_0px_#000]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-200 dark:bg-pink-950/80 text-stone-950 dark:text-pink-300 font-black text-[11px] uppercase tracking-wider border-1.5 border-stone-900 dark:border-pink-800">
              <ShieldCheck className="w-3.5 h-3.5 text-pink-700 dark:text-pink-400" />
              <span>Private Dashboard</span>
              <span>•</span>
              <span className="truncate max-w-[200px]">{userEmail || 'My Account'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-950 dark:text-white leading-tight">
              Welcome back, <span className="text-pink-600 dark:text-pink-400">{displayName}</span>!
            </h2>

            <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
              Track incoming newsletters received on <strong className="text-stone-950 dark:text-white underline">{userEmail}</strong> and view their 2-minute actionable summaries.
            </p>
          </div>

          {/* Inbox Scan Action */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
            {onFetchInboxNewsletters && (
              <button
                onClick={onFetchInboxNewsletters}
                disabled={isFetchingInbox}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-pink-500 hover:bg-pink-400 text-white font-black text-xs border-2 border-stone-900 dark:border-stone-700 shadow-[2px_2px_0px_0px_#1c1917] dark:shadow-[2px_2px_0px_0px_#000] transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                title="Scan inbox for emails and newsletters"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isFetchingInbox ? 'animate-spin' : ''}`} />
                <span>{isFetchingInbox ? 'Fetching Newsletters...' : 'Scan Inbox for Newsletters'}</span>
              </button>
            )}

            <div className="px-3.5 py-2 rounded-2xl bg-white dark:bg-stone-800 border-2 border-stone-900 dark:border-stone-700 shadow-[2px_2px_0px_0px_#1c1917] dark:shadow-[2px_2px_0px_0px_#000] text-center">
              <span className="block text-[9px] font-black uppercase text-stone-400">Summaries</span>
              <span className="text-sm font-black text-stone-900 dark:text-stone-100">{items.length}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Inbound Newsletters Tracked (Only the user's actual newsletters) */}
      <section className="bg-white dark:bg-stone-900 border-2 border-stone-900 dark:border-stone-700 rounded-3xl p-5 sm:p-6 shadow-[4px_4px_0px_0px_#1c1917] dark:shadow-[4px_4px_0px_0px_#000]">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-950 flex items-center justify-center text-pink-600 dark:text-pink-400 border border-pink-300 dark:border-pink-800 font-bold">
              <Inbox className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-stone-900 dark:text-stone-100">
                Tracked Incoming Newsletters ({incomingNewsletters.length})
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Publications received on your mail ID
              </p>
            </div>
          </div>

          {activeSourceFilter && (
            <button
              onClick={() => setActiveSourceFilter(null)}
              className="text-xs font-bold text-pink-600 dark:text-pink-400 hover:underline"
            >
              Show All Newsletters ✕
            </button>
          )}
        </div>

        {incomingNewsletters.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {incomingNewsletters.map((nl) => {
              const isSelected = activeSourceFilter === nl.name;
              return (
                <div
                  key={nl.name}
                  onClick={() => setActiveSourceFilter(isSelected ? null : nl.name)}
                  className={`cursor-pointer rounded-2xl border-2 p-3 flex flex-col justify-between transition-all select-none ${
                    isSelected
                      ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/50 shadow-[3px_3px_0px_0px_#ec4899]'
                      : 'border-stone-900 dark:border-stone-700 bg-stone-50 dark:bg-stone-850 hover:bg-white dark:hover:bg-stone-800 shadow-[2px_2px_0px_0px_#1c1917] dark:shadow-[2px_2px_0px_0px_#000]'
                  }`}
                >
                  <div>
                    <span className="text-[9px] font-black uppercase text-pink-600 dark:text-pink-400 block mb-1">
                      {nl.category}
                    </span>
                    <h4 className="font-extrabold text-xs text-stone-900 dark:text-stone-100 leading-tight line-clamp-1">
                      {nl.name}
                    </h4>
                  </div>
                  <div className="mt-3 pt-2 border-t border-stone-200 dark:border-stone-700/70 flex items-center justify-between text-[10px] text-stone-500 dark:text-stone-400 font-semibold">
                    <span>{nl.lastDate}</span>
                    <span className="px-1.5 py-0.2 rounded-md bg-pink-500 text-white font-black text-[9px]">
                      {nl.count} {nl.count === 1 ? 'issue' : 'issues'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 px-4 border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-2xl">
            <p className="text-xs text-stone-600 dark:text-stone-400 font-medium">
              No incoming newsletters tracked for <strong>{userEmail}</strong> yet.
            </p>
            <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-1">
              Click "Scan Inbox for Newsletters" above or paste an issue you received to generate your summary.
            </p>
          </div>
        )}
      </section>

      {/* 3. Send Digest By Mail Banner */}
      {items.length > 0 && onTriggerEmailDigest && (
        <section className="bg-gradient-to-r from-pink-500 to-rose-400 dark:from-pink-600 dark:to-rose-600 border-2 border-stone-900 dark:border-stone-700 rounded-3xl p-5 text-white shadow-[4px_4px_0px_0px_#1c1917] dark:shadow-[4px_4px_0px_0px_#000] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Mail className="w-4 h-4 text-white" />
              <h3 className="text-sm sm:text-base font-black text-white">
                Receive Today's Summary in Your Mailbox
              </h3>
            </div>
            <p className="text-xs text-pink-100 font-medium">
              Dispatches your 2-minute digest straight to <strong className="underline">{userEmail}</strong>
            </p>
          </div>

          <button
            onClick={onTriggerEmailDigest}
            disabled={isSendingEmail}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-stone-900 hover:bg-stone-850 dark:bg-stone-950 text-white font-black text-xs border-2 border-stone-900 dark:border-stone-700 shadow-[2px_2px_0px_0px_#ffffff] transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isSendingEmail ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Sending to {userEmail}...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5 text-pink-400" />
                <span>Send Me Today's Digest</span>
              </>
            )}
          </button>
        </section>
      )}

      {/* 4. Toolbar: Search, Filters & Summarize Button */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search your newsletter summaries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-stone-900 border-2 border-stone-900 dark:border-stone-700 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-bold text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-hidden focus:border-pink-500 shadow-[2px_2px_0px_0px_#1c1917] dark:shadow-[2px_2px_0px_0px_#000]"
            />
            <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Summarize button on Dashboard */}
            {onOpenSummarize && (
              <button
                onClick={onOpenSummarize}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-pink-500 hover:bg-pink-400 border-2 border-stone-900 dark:border-stone-700 text-white font-black text-xs shadow-[2px_2px_0px_0px_#1c1917] dark:shadow-[2px_2px_0px_0px_#000] transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Summarize a Newsletter</span>
              </button>
            )}

            {/* Export PDF */}
            {items.length > 0 && (
              <button
                onClick={handleExportAll}
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white dark:bg-stone-800 hover:bg-pink-50 dark:hover:bg-stone-700 border-2 border-stone-900 dark:border-stone-700 text-xs font-bold text-stone-900 dark:text-stone-100 shadow-[2px_2px_0px_0px_#1c1917] dark:shadow-[2px_2px_0px_0px_#000] transition-all"
              >
                <FileDown className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                <span className="hidden sm:inline">Export PDF</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
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

      {/* 5. Summaries Grid or Clean Zero-Suggestion Empty State */}
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
        <section className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-stone-900 dark:border-stone-700 p-8 sm:p-10 text-center shadow-[4px_4px_0px_0px_#1c1917] dark:shadow-[4px_4px_0px_0px_#000] max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-pink-100 dark:bg-pink-950 border-2 border-stone-900 dark:border-stone-700 flex items-center justify-center text-pink-600 dark:text-pink-400">
            <InboxIcon className="w-6 h-6" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-stone-100">
              {selectedCategory === 'read_later'
                ? 'No saved items'
                : 'No newsletters on your dashboard yet'}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
              Your dashboard only displays newsletters you receive on <strong>{userEmail}</strong>. No other suggestions or external newsletters are displayed.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
            {onFetchInboxNewsletters && (
              <button
                onClick={onFetchInboxNewsletters}
                disabled={isFetchingInbox}
                className="px-4 py-2 rounded-2xl bg-pink-500 hover:bg-pink-400 border-2 border-stone-900 dark:border-stone-700 text-white font-black text-xs shadow-[2px_2px_0px_0px_#1c1917] transition-all active:scale-95 disabled:opacity-50"
              >
                {isFetchingInbox ? 'Scanning...' : 'Scan My Inbox'}
              </button>
            )}
            {onOpenSummarize && (
              <button
                onClick={onOpenSummarize}
                className="px-4 py-2 rounded-2xl bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 border-2 border-stone-900 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-bold text-xs shadow-[2px_2px_0px_0px_#1c1917] transition-all active:scale-95"
              >
                + Paste an Issue
              </button>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
