import { useState } from 'react';
import { 
  Inbox, 
  Filter, 
  Sparkles, 
  FileText, 
  Send, 
  CheckCircle, 
  XCircle, 
  Copy, 
  Check, 
  AlertTriangle,
  Upload,
  Search
} from 'lucide-react';
import { NewsletterItem, ResearchPersona } from '../types';
import { MOCK_NEWSLETTERS } from '../data/mockNewsletters';

interface NewsletterFeedProps {
  onAnalyzeCustomNewsletter: (text: string) => void;
  isAnalyzing: boolean;
  selectedPersona: ResearchPersona;
}

export function NewsletterFeed({
  onAnalyzeCustomNewsletter,
  isAnalyzing,
  selectedPersona,
}: NewsletterFeedProps) {
  const [newsletters, setNewsletters] = useState<NewsletterItem[]>(MOCK_NEWSLETTERS);
  const [selectedItem, setSelectedItem] = useState<NewsletterItem | null>(newsletters[0]);
  const [customText, setCustomText] = useState('');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'included' | 'excluded'>('all');

  const promptTemplate = `Review [newsletter label, senders, or attached issues] from [date range]. I’m researching [topic or question] for [my work or decision]. Prioritize [what matters to me] and leave out [what isn’t relevant].

Give me a short briefing of the most useful findings. For each, explain why it matters to my question, include the source and date, and suggest what I could investigate or test next. Combine repeated coverage and distinguish reported facts from author opinions or sponsored claims. Flag anything that needs checking against an original source.

Tell me which newsletters you could access and note any gaps. If you can’t access the material, tell me what to provide.`;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(promptTemplate);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleLoadSample = (sample: NewsletterItem) => {
    setCustomText(sample.fullContent || sample.snippet);
  };

  const handleRunCustomAnalysis = () => {
    if (!customText.trim()) return;
    onAnalyzeCustomNewsletter(customText);
  };

  const filteredNewsletters = newsletters.filter((n) => {
    if (filterMode === 'included') return n.status === 'included';
    if (filterMode === 'excluded') return n.status === 'excluded';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 border border-stone-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-2 border border-amber-500/30">
              <Inbox className="w-3.5 h-3.5" />
              Gmail Label: "AI News" Feed
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Newsletter Inbox & Ingestion Sandbox
            </h2>
            <p className="text-xs text-stone-300 mt-1 max-w-2xl leading-relaxed">
              Examine which newsletters are received, which stories the skill filtered out (like robot fighting leagues and AI toothbrushes), and analyze fresh issues with Gemini.
            </p>
          </div>

          <button
            onClick={handleCopyPrompt}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700 self-start md:self-auto transition-colors"
          >
            {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Diagnostic Prompt</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Feed & Live Ingestor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Newsletter Issues List */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Weekly Ingested Issues ({filteredNewsletters.length})
            </div>

            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-2 py-0.5 rounded-md ${
                  filterMode === 'all'
                    ? 'bg-stone-900 text-white font-medium'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterMode('included')}
                className={`px-2 py-0.5 rounded-md ${
                  filterMode === 'included'
                    ? 'bg-emerald-800 text-white font-medium'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Included
              </button>
              <button
                onClick={() => setFilterMode('excluded')}
                className={`px-2 py-0.5 rounded-md ${
                  filterMode === 'excluded'
                    ? 'bg-rose-800 text-white font-medium'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Excluded
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            {filteredNewsletters.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-amber-500 shadow-sm ring-1 ring-amber-400/20'
                      : 'bg-white border-stone-200 hover:border-stone-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-bold text-stone-900 text-xs block">
                        {item.sender}
                      </span>
                      <span className="font-medium text-stone-800 text-xs line-clamp-1 mt-0.5">
                        {item.subject}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 flex items-center gap-1 ${
                        item.status === 'included'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {item.status === 'included' ? (
                        <>
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          Retained Signal
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 text-rose-600" />
                          Noise Excluded
                        </>
                      )}
                    </span>
                  </div>

                  <p className="text-stone-500 text-[11px] mt-1.5 line-clamp-2">
                    {item.snippet}
                  </p>

                  <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-400 font-mono">
                    <span>{item.date}</span>
                    <span className="truncate max-w-[200px] text-stone-500">
                      {item.filterReason}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Newsletter Reader Detail */}
          {selectedItem && (
            <div className="bg-stone-50 rounded-2xl border border-stone-200 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="text-xs font-bold text-stone-900">
                  Detailed Issue: {selectedItem.sender}
                </span>
                <button
                  onClick={() => handleLoadSample(selectedItem)}
                  className="text-[11px] text-amber-700 hover:text-amber-900 font-semibold"
                >
                  Load into Analyzer &rarr;
                </button>
              </div>

              <div className="text-xs text-stone-700 whitespace-pre-wrap leading-relaxed font-mono text-[11px] bg-white p-3 rounded-xl border border-stone-200">
                {selectedItem.fullContent}
              </div>

              <div className="p-2.5 rounded-lg bg-stone-100 text-stone-700 text-[11px]">
                <strong>Filter Decision:</strong> {selectedItem.filterReason}
              </div>
            </div>
          )}
        </div>

        {/* Right: Live Custom Ingestor / Analyzer */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Live Newsletter Synthesizer (Gemini Powered)
            </h3>
            <span className="text-[11px] text-stone-400">On-demand extraction</span>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            Paste one or multiple newsletter issues or announcements here. The AI News Intel engine will process the text against your <strong>{selectedPersona.title}</strong> skill instructions and generate a fresh 5-component evaluation.
          </p>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-stone-700">
                Paste Newsletter Issue Content:
              </label>
              <span className="text-stone-400 text-[11px]">
                {customText.length} characters
              </span>
            </div>

            <textarea
              rows={9}
              placeholder="Paste newsletter issue text from Ben's Bites, The Rundown, Superhuman, TLDR, etc..."
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-900 font-mono leading-relaxed focus:outline-hidden focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Quick Preset Buttons */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
              Quick Load Test Issues:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {newsletters.slice(0, 3).map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleLoadSample(n)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                >
                  {n.sender}: {n.subject.slice(0, 26)}...
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
            <button
              onClick={() => setCustomText('')}
              className="text-xs text-stone-400 hover:text-stone-600"
            >
              Clear Text
            </button>

            <button
              onClick={handleRunCustomAnalysis}
              disabled={isAnalyzing || !customText.trim()}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-all ${
                isAnalyzing || !customText.trim()
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : 'bg-stone-900 hover:bg-stone-800 text-white active:scale-98'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : 'text-amber-400'}`} />
              <span>{isAnalyzing ? 'Analyzing with Skill...' : 'Run Skill Extraction'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
