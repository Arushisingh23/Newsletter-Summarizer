import { Trash2, AlertCircle } from 'lucide-react';
import { ExcludedStory } from '../types';
import { IllustrationThumbsSurvey, IllustrationStickyNotes, IllustrationWireframeWindow, IllustrationClipboardChecklist } from './CardIllustrations';

interface FigmaNoiseCardProps {
  story: ExcludedStory;
  index: number;
}

const NOISE_THEMES = [
  {
    bgClass: 'bg-[#FF8E8F]', // Coral Red
    label: 'CONSUMER GIMMICK',
    textColor: 'text-rose-800',
    illustration: IllustrationThumbsSurvey,
  },
  {
    bgClass: 'bg-[#FCA5A5]', // Rose
    label: 'ENTERTAINMENT TOY',
    textColor: 'text-red-800',
    illustration: IllustrationWireframeWindow,
  },
  {
    bgClass: 'bg-[#FDE047]', // Yellow
    label: 'SPECULATION',
    textColor: 'text-amber-800',
    illustration: IllustrationStickyNotes,
  },
  {
    bgClass: 'bg-[#C4B5FD]', // Soft Violet
    label: 'PREPRINT HYPOTHESIS',
    textColor: 'text-purple-800',
    illustration: IllustrationClipboardChecklist,
  },
];

export function FigmaNoiseCard({ story, index }: FigmaNoiseCardProps) {
  const theme = NOISE_THEMES[index % NOISE_THEMES.length];
  const Illustration = theme.illustration;

  return (
    <div 
      className="bg-white rounded-2xl border-2 border-stone-900 overflow-hidden shadow-[3px_3px_0px_0px_#1c1917] flex flex-col justify-between"
      style={{ minHeight: '260px' }}
    >
      {/* Diagonal top */}
      <div
        className={`${theme.bgClass} relative flex items-center justify-center pt-7 pb-10 px-4`}
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 84%, 0 100%)',
        }}
      >
        <div className="relative">
          <Illustration />
          <div className="absolute -top-1 -right-2 bg-stone-900 text-white rounded-full p-1 border border-white">
            <Trash2 className="w-3 h-3 text-rose-300" />
          </div>
        </div>
      </div>

      {/* Bottom text */}
      <div className="p-4 pt-1 flex flex-col justify-between flex-1 bg-white text-center">
        <div>
          <span className={`text-[9px] font-black uppercase tracking-widest ${theme.textColor} block mb-1`}>
            {theme.label} • {story.source.toUpperCase()}
          </span>

          <h4 className="text-xs font-bold text-stone-900 leading-snug line-clamp-2">
            {story.headline}
          </h4>
        </div>

        <div className="pt-2 mt-2 border-t border-stone-100">
          <p className="text-[10px] text-stone-500 italic line-clamp-2 leading-tight">
            "{story.reason}"
          </p>
        </div>
      </div>
    </div>
  );
}
