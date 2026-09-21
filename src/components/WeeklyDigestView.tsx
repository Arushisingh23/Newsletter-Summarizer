import { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Bookmark, 
  Clock,
  BookOpen
} from 'lucide-react';
import { NewsletterSummaryItem } from '../types';
import { FigmaCard } from './FigmaCard';

interface WeeklyDigestViewProps {
  items: NewsletterSummaryItem[];
  onOpenSummary: (item: NewsletterSummaryItem) => void;
  savedIds?: string[];
  onToggleBookmark?: (id: string) => void;
}

export function WeeklyDigestView({
  items,
  onOpenSummary,
  savedIds = [],
  onToggleBookmark,
}: WeeklyDigestViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set(savedIds));

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

  const categories = [
    { id: 'all', label: 'All Stories', emoji: '🌟' },
    { id: 'ai', label: 'AI & Models', emoji: '🤖' },
    { id: 'coding', label: 'Coding & Dev', emoji: '💻' },
    { id: 'workflow', label: 'Workflows', emoji: '⚡' },
    { id: 'multimodal', label: 'Video & Audio', emoji: '🎥' },
  ];

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'ai') {
      return (
        item.category.toLowerCase().includes('model') ||
        item.category.toLowerCase().includes('ai') ||
        item.title.toLowerCase().includes('claude') ||
        item.title.toLowerCase().includes('ollama')
      );
    }
    if (selectedCategory === 'coding') {
      return (
        item.category.toLowerCase().includes('code') ||
        item.title.toLowerCase().includes('cursor') ||
        item.title.toLowerCase().includes('dev')
      );
    }
    if (selectedCategory === 'workflow') {
      return (
        item.category.toLowerCase().includes('automation') ||
        item.category.toLowerCase().includes('workflow') ||
        item.category.toLowerCase().includes('agent')
      );
    }
    if (selectedCategory === 'multimodal') {
      return (
        item.category.toLowerCase().includes('video') ||
        item.category.toLowerCase().includes('multimodal')
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Clean Pink Header Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-[#FFF5F8] border-2 border-stone-900 p-6 sm:p-8 shadow-[4px_4px_0px_0px_#1c1917]">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-200 text-stone-900 font-black text-[11px] uppercase tracking-wider border-1.5 border-stone-900">
            <span>✨ Weekly Briefing</span>
            <span className="text-stone-900">•</span>
            <span>Monday Edition</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-900 leading-tight">
            Catch up on this week’s news in{' '}
            <span className="bg-pink-300 px-2 py-0.5 rounded-lg border-1.5 border-stone-900 inline-block rotate-[-1deg]">
              2 minutes
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
            We read through 50+ tech and AI newsletters so you don’t have to. Here are the most important stories, clearly summarized into key takeaways.
          </p>

          {/* Quick Stats Pill */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border-1.5 border-stone-900 text-xs font-bold text-stone-900 shadow-[2px_2px_0px_0px_#1c1917]">
              <span>📬</span>
              <span><strong>52</strong> Newsletters Read</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-pink-200 border-1.5 border-stone-900 text-xs font-black text-stone-950 shadow-[2px_2px_0px_0px_#1c1917]">
              <span>⏱️</span>
              <span><strong>6</strong> Stories • ~2 Min Each</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search summaries by topic or source..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border-2 border-stone-900 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-bold text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:shadow-[3px_3px_0px_0px_#ec4899] shadow-[2px_2px_0px_0px_#1c1917] transition-all"
            />
            <Search className="w-4 h-4 text-stone-900 absolute left-3.5 top-3" />
          </div>

          {/* Result Count */}
          <span className="text-xs font-bold text-stone-500 self-end sm:self-auto">
            Showing {filteredItems.length} summaries
          </span>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border-2 border-stone-900 ${
                  isSelected
                    ? 'bg-pink-500 text-white shadow-[2px_2px_0px_0px_#1c1917]'
                    : 'bg-white text-stone-800 hover:bg-pink-50 shadow-[2px_2px_0px_0px_#1c1917]'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* The Requested Figma Cards Grid */}
      <section>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredItems.map((item, idx) => (
            <FigmaCard
              key={item.id}
              item={item}
              index={idx}
              isBookmarked={bookmarkedIds.has(item.id)}
              onToggleBookmark={() => handleBookmark(item.id)}
              onClick={() => onOpenSummary(item)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
