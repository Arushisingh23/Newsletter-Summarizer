import { X, Clock, ExternalLink, Bookmark, Check, FileDown } from 'lucide-react';
import { NewsletterSummaryItem } from '../types';
import { exportSummaryToPDF } from '../lib/pdfExport';

interface SummaryDetailModalProps {
  item: NewsletterSummaryItem | null;
  isOpen: boolean;
  onClose: () => void;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
}

export function SummaryDetailModal({
  item,
  isOpen,
  onClose,
  isBookmarked = false,
  onToggleBookmark,
}: SummaryDetailModalProps) {
  if (!isOpen || !item) return null;

  const handleExportPDF = () => {
    exportSummaryToPDF(item);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150 font-sans">
      <div className="bg-[#FFFDFB] dark:bg-stone-900 rounded-3xl max-w-lg w-full border-2 border-stone-900 dark:border-stone-700 shadow-[6px_6px_0px_0px_#1c1917] dark:shadow-[6px_6px_0px_0px_#f472b6] overflow-hidden my-6 flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b-2 border-stone-900 dark:border-stone-700 bg-pink-100 dark:bg-stone-850 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-white dark:bg-stone-800 border border-stone-900 dark:border-stone-700 text-[10px] font-black uppercase tracking-wider text-pink-900 dark:text-pink-300">
                {item.category}
              </span>
              <span className="text-xs text-stone-600 dark:text-stone-400 font-bold">
                via {item.source}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-stone-900 dark:text-stone-100 leading-tight">
              {item.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-900 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 transition-colors shadow-[1px_1px_0px_0px_#1c1917]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 text-xs text-stone-700 dark:text-stone-300">
          {/* Key Summary */}
          <div className="space-y-1.5">
            <h3 className="text-[10px] font-black uppercase tracking-wider text-pink-800 dark:text-pink-400">
              Key Summary
            </h3>
            <p className="text-sm text-stone-900 dark:text-stone-100 font-medium leading-relaxed">
              {item.summary}
            </p>
          </div>

          {/* Key Points Bullet List */}
          {item.keyPoints && item.keyPoints.length > 0 && (
            <div className="bg-pink-50/60 dark:bg-stone-800/80 rounded-2xl p-4 border border-pink-200 dark:border-stone-700 space-y-2">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-pink-900 dark:text-pink-300">
                Highlights
              </h4>
              <ul className="space-y-1.5">
                {item.keyPoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2 text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
                    <span className="text-pink-600 dark:text-pink-400 font-bold">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Why It Matters */}
          <div className="bg-white dark:bg-stone-800 rounded-2xl p-4 border-2 border-stone-900 dark:border-stone-700 shadow-[2px_2px_0px_0px_#1c1917] dark:shadow-[2px_2px_0px_0px_#000] space-y-1">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-stone-900 dark:text-stone-100">
              Why It Matters
            </h4>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
              {item.whyItMatters}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white dark:bg-stone-850 border-t-2 border-stone-900 dark:border-stone-700 flex flex-wrap items-center justify-between gap-3">
          <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            {item.readTime || '2 min read'}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPDF}
              title="Export this summary as a styled PDF"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-stone-900 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-pink-50 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold transition-all shadow-[1px_1px_0px_0px_#1c1917] dark:shadow-[1px_1px_0px_0px_#000] active:translate-y-0.5"
            >
              <FileDown className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
              <span>Export PDF</span>
            </button>

            {onToggleBookmark && (
              <button
                onClick={onToggleBookmark}
                title={isBookmarked ? 'Remove from Read Later' : 'Save to Read Later'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-stone-900 dark:border-stone-700 text-xs font-bold transition-all ${
                  isBookmarked
                    ? 'bg-pink-300 dark:bg-pink-600 text-stone-900 dark:text-white shadow-[1px_1px_0px_0px_#1c1917]'
                    : 'bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 shadow-[1px_1px_0px_0px_#1c1917] dark:shadow-[1px_1px_0px_0px_#000]'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-stone-900 dark:fill-white' : ''}`} />
                <span>{isBookmarked ? 'Saved' : 'Read Later'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-400 text-white font-bold text-xs border-2 border-stone-900 dark:border-stone-700 shadow-[2px_2px_0px_0px_#1c1917] dark:shadow-[2px_2px_0px_0px_#000] transition-all active:scale-95"
            >
              Done Reading
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
