import { useState } from 'react';
import { X, Sparkles, FileText, ArrowRight } from 'lucide-react';
import { MOCK_NEWSLETTERS } from '../data/mockNewsletters';

interface SummarizeInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSummarize: (text: string) => void;
  isSummarizing: boolean;
}

export function SummarizeInputModal({
  isOpen,
  onClose,
  onSummarize,
  isSummarizing,
}: SummarizeInputModalProps) {
  if (!isOpen) return null;

  const [text, setText] = useState('');

  const handleSelectSample = (sampleText: string) => {
    setText(sampleText);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSummarize(text);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150 font-sans">
      <div className="bg-[#FFFDFB] dark:bg-stone-900 rounded-3xl max-w-lg w-full border-2 border-stone-900 dark:border-stone-700 shadow-[6px_6px_0px_0px_#1c1917] dark:shadow-[6px_6px_0px_0px_#f472b6] overflow-hidden my-6 flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b-2 border-stone-900 dark:border-stone-700 bg-pink-100 dark:bg-stone-850 flex items-start justify-between">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-white dark:bg-stone-800 border border-stone-900 dark:border-stone-700 text-[10px] font-black uppercase tracking-wider text-pink-900 dark:text-pink-300 mb-1">
              Quick Summarizer
            </span>
            <h3 className="text-lg font-black text-stone-900 dark:text-stone-100">
              Summarize Any Newsletter
            </h3>
            <p className="text-xs text-stone-700 dark:text-stone-400 font-medium">
              Paste email text or an article to generate key highlights.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-900 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 transition-colors shadow-[1px_1px_0px_0px_#1c1917]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {/* Sample Pills */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 dark:text-stone-400 block">
              Or pick a sample issue:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {MOCK_NEWSLETTERS.slice(0, 3).map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => handleSelectSample(`[${n.sender}] ${n.subject}\n\n${n.fullContent || n.snippet}`)}
                  className="px-2.5 py-1 rounded-lg bg-pink-50 dark:bg-stone-800 hover:bg-pink-100 dark:hover:bg-stone-700 border border-pink-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-[11px] font-bold transition-colors"
                >
                  {n.sender}
                </button>
              ))}
            </div>
          </div>

          {/* Text Area */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase tracking-wider text-stone-900 dark:text-stone-200 block">
                Newsletter Text
              </label>
            </div>
            <textarea
              rows={8}
              required
              placeholder="Paste newsletter content here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-white dark:bg-stone-850 border-2 border-stone-900 dark:border-stone-700 rounded-2xl p-3 text-xs text-stone-900 dark:text-stone-100 font-medium leading-relaxed focus:outline-hidden focus:border-pink-500 shadow-[2px_2px_0px_0px_#1c1917] dark:shadow-[2px_2px_0px_0px_#000]"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSummarizing || !text.trim()}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs border-2 border-stone-900 dark:border-stone-700 shadow-[2px_2px_0px_0px_#1c1917] dark:shadow-[2px_2px_0px_0px_#000] transition-all active:scale-95 ${
                isSummarizing || !text.trim()
                  ? 'bg-stone-200 dark:bg-stone-800 text-stone-400 border-stone-400 cursor-not-allowed shadow-none'
                  : 'bg-pink-500 hover:bg-pink-400 text-white'
              }`}
            >
              {isSummarizing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-white" />
                  <span>Summarizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Summarize Now</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
