import React from 'react';
import { 
  IllustrationChatBubbles,
  IllustrationQuadrantMatrix,
  IllustrationFlowchart,
  IllustrationGridTools,
  IllustrationSmartphoneTouch,
  IllustrationClipboardChecklist,
  IllustrationWireframeWindow,
  IllustrationStickyNotes,
  IllustrationThumbsSurvey,
  IllustrationIdBadge
} from './CardIllustrations';
import { NewsletterSummaryItem } from '../types';
import { Bookmark, ArrowUpRight, Clock } from 'lucide-react';

interface FigmaCardProps {
  item: NewsletterSummaryItem;
  index: number;
  onClick: () => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (e: React.MouseEvent) => void;
}

// Color schemes matching the Figma reference, prominently featuring pinks
const CARD_THEMES = [
  {
    // Vibrant Pink
    bgClass: 'bg-[#F472B6]',
    labelColor: 'text-pink-800',
    illustration: IllustrationChatBubbles,
  },
  {
    // Soft Peach / Coral
    bgClass: 'bg-[#FB7185]',
    labelColor: 'text-rose-800',
    illustration: IllustrationFlowchart,
  },
  {
    // Pastel Lavender Pink
    bgClass: 'bg-[#E879F9]',
    labelColor: 'text-fuchsia-800',
    illustration: IllustrationQuadrantMatrix,
  },
  {
    // Warm Sunny Yellow
    bgClass: 'bg-[#FDE047]',
    labelColor: 'text-amber-800',
    illustration: IllustrationGridTools,
  },
  {
    // Fresh Mint
    bgClass: 'bg-[#5EEAD4]',
    labelColor: 'text-teal-800',
    illustration: IllustrationSmartphoneTouch,
  },
  {
    // Sky Blue
    bgClass: 'bg-[#93C5FD]',
    labelColor: 'text-blue-800',
    illustration: IllustrationClipboardChecklist,
  },
];

export function FigmaCard({
  item,
  index,
  onClick,
  isBookmarked = false,
  onToggleBookmark,
}: FigmaCardProps) {
  const theme = CARD_THEMES[index % CARD_THEMES.length];
  const Illustration = theme.illustration;

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white dark:bg-stone-900 rounded-2xl border-2 border-stone-900 dark:border-stone-700 overflow-hidden shadow-[3px_3px_0px_0px_#1c1917] dark:shadow-[3px_3px_0px_0px_#000] hover:shadow-[5px_5px_0px_0px_#1c1917] dark:hover:shadow-[5px_5px_0px_0px_#f472b6] transition-all hover:-translate-y-1 flex flex-col justify-between select-none relative"
      style={{ minHeight: '270px' }}
    >
      {/* Bookmark Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (onToggleBookmark) onToggleBookmark(e);
        }}
        className={`absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-lg border-1.5 border-stone-900 dark:border-stone-700 flex items-center justify-center transition-transform active:scale-90 ${
          isBookmarked
            ? 'bg-pink-300 dark:bg-pink-600 text-stone-900 dark:text-white shadow-[1px_1px_0px_0px_#1c1917]'
            : 'bg-white/90 hover:bg-white dark:bg-stone-800/90 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 backdrop-blur-xs'
        }`}
        title={isBookmarked ? 'Saved' : 'Save summary'}
      >
        <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-stone-900 dark:fill-white' : ''}`} />
      </button>

      {/* Top Colored Section with Diagonal Cut */}
      <div
        className={`${theme.bgClass} relative flex items-center justify-center pt-7 pb-10 px-4 transition-colors`}
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 84%, 0 100%)',
        }}
      >
        <div className="transform group-hover:scale-105 transition-transform duration-200">
          <Illustration />
        </div>
      </div>

      {/* Bottom Section on Crisp White / Dark */}
      <div className="p-4 pt-1 flex flex-col justify-between flex-1 bg-white dark:bg-stone-900 text-center transition-colors">
        <div>
          {/* Category label */}
          <span
            className={`text-[9px] font-black uppercase tracking-widest ${theme.labelColor} block mb-1`}
          >
            {item.category.toUpperCase().slice(0, 18)}
          </span>

          {/* Title */}
          <h3 className="text-sm font-extrabold text-stone-900 dark:text-stone-100 tracking-tight leading-snug group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors line-clamp-2">
            {item.title}
          </h3>
        </div>

        {/* Source & Read Time */}
        <div className="pt-3 mt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[10px] text-stone-500 dark:text-stone-400 font-semibold">
          <span className="bg-pink-50 dark:bg-pink-950/60 text-pink-900 dark:text-pink-300 px-2 py-0.5 rounded-md border border-pink-200 dark:border-pink-800 font-bold">
            {item.source}
          </span>

          <span className="flex items-center gap-0.5 text-stone-900 dark:text-stone-100 font-bold group-hover:translate-x-0.5 transition-transform">
            <span>Read</span>
            <ArrowUpRight className="w-3 h-3 text-stone-900 dark:text-stone-100" />
          </span>
        </div>
      </div>
    </div>
  );
}
