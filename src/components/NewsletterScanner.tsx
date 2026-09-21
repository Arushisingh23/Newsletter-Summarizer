import { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  AlertCircle,
  Copy,
  Layers
} from 'lucide-react';
import { ResearchPersona } from '../types';
import { MOCK_NEWSLETTERS } from '../data/mockNewsletters';

interface NewsletterScannerProps {
  onAnalyze: (text: string) => Promise<void>;
  isAnalyzing: boolean;
  selectedPersona: ResearchPersona;
}

export function NewsletterScanner({
  onAnalyze,
  isAnalyzing,
  selectedPersona,
}: NewsletterScannerProps) {
  const [inputText, setInputText] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const handleSelectPreset = (id: string) => {
    const item = MOCK_NEWSLETTERS.find((n) => n.id === id);
    if (item) {
      setSelectedPreset(id);
      setInputText(`[${item.sender}] ${item.subject}\n\n${item.fullContent || item.snippet}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onAnalyze(inputText);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans pb-12">
      {/* Whimsical Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Instant Newsletter Filter</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Paste Any Newsletter. Drop the Fluff.
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Got an email from Substack, TLDR, or The Rundown? Paste it below to filter out the PR announcements, score real utility, and get a 15-minute test protocol.
        </p>
      </div>

      {/* Preset Pills */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block text-center">
          Or test with this week's raw editions:
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {MOCK_NEWSLETTERS.slice(0, 4).map((n) => (
            <button
              key={n.id}
              onClick={() => handleSelectPreset(n.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                selectedPreset === n.id
                  ? 'bg-amber-100 border-amber-300 text-amber-950 shadow-2xs'
                  : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <span>{n.sender}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Paste Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between text-xs">
          <label className="font-bold text-stone-800 flex items-center gap-2">
            <FileText className="w-4 h-4 text-stone-500" />
            <span>Newsletter Text or Email Content</span>
          </label>
          <span className="text-[11px] text-stone-400 font-mono">
            {inputText.length} characters
          </span>
        </div>

        <textarea
          rows={10}
          required
          placeholder="Paste newsletter body here (e.g. 'Hey everyone, today Anthropic announced new Claude computer use, and an AI startup launched a robotic spoon...')"
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            setSelectedPreset(null);
          }}
          className="w-full bg-[#fcfbf9] border border-stone-200 rounded-2xl p-4 text-xs font-mono text-stone-900 leading-relaxed focus:outline-hidden focus:border-amber-500 focus:bg-white transition-colors"
        />

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Analyzing through persona: <strong className="text-stone-800">{selectedPersona.title}</strong>
            </span>
          </div>

          <button
            type="submit"
            disabled={isAnalyzing || !inputText.trim()}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs shadow-md transition-all active:scale-98 ${
              isAnalyzing || !inputText.trim()
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : 'bg-stone-900 hover:bg-stone-800 text-white'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
                <span>Extracting Signal & Filtering Hype...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Run 5-Axis Synthesis</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
