import { 
  Sparkles, 
  ShieldAlert, 
  TrendingUp, 
  FlaskConical, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Check, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { IntelligenceBriefing, ToolComparison } from '../types';

interface BriefingViewProps {
  briefing: IntelligenceBriefing;
  onNavigateToMatrix: () => void;
  onNavigateToExperiments: () => void;
  onLaunchExperiment: (tool: ToolComparison) => void;
}

export function BriefingView({
  briefing,
  onNavigateToMatrix,
  onNavigateToExperiments,
  onLaunchExperiment,
}: BriefingViewProps) {
  return (
    <div className="space-y-6">
      {/* Executive Briefing Banner */}
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" />
            <span>Delivered 9:00 AM • {briefing.editionDate}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            {briefing.briefingTitle}
          </h2>

          <p className="mt-3 text-stone-300 text-sm leading-relaxed">
            {briefing.executiveSummary}
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-6 pt-6 border-t border-stone-800/90">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                Newsletters Scanned
              </span>
              <span className="text-xl sm:text-2xl font-black text-white mt-0.5 block">
                {briefing.newslettersProcessedCount}+
              </span>
              <span className="text-[10px] text-stone-400">Past 7 days window</span>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                High-Signal Tools
              </span>
              <span className="text-xl sm:text-2xl font-black text-amber-400 mt-0.5 block">
                {briefing.toolComparisons.length} Evaluated
              </span>
              <span className="text-[10px] text-stone-400">5-axis comparison</span>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 block">
                Noise Filtered Out
              </span>
              <span className="text-xl sm:text-2xl font-black text-rose-400 mt-0.5 block">
                {briefing.excludedCount} Dropped
              </span>
              <span className="text-[10px] text-stone-400">Gimmicks & hype dropped</span>
            </div>
          </div>
        </div>

        {/* Subtle decorative glow */}
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Noise Exclusion Audit (As described in the user prompt: dropping robot fights and toothbrushes) */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <h3 className="font-bold text-stone-900 text-sm">
              Noise Filtering Audit: Why Stories Were Excluded
            </h3>
          </div>
          <span className="text-[11px] text-stone-500">
            {briefing.excludedStories.length} documented filter decisions
          </span>
        </div>

        <p className="text-xs text-stone-500 mt-2 mb-3">
          "Seeing what was included and what was excluded helps judge the skill itself." AI News Intel automatically stripped the following low-signal items from this week's digest:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {briefing.excludedStories.map((story, i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs flex items-start gap-2.5"
            >
              <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold uppercase tracking-wider shrink-0 mt-0.5">
                Dropped
              </span>
              <div>
                <div className="font-semibold text-stone-900 leading-snug">
                  {story.headline}
                </div>
                <div className="text-[11px] text-stone-500 mt-1 flex items-center gap-2">
                  <span className="font-medium text-stone-700">Source: {story.source}</span>
                  <span>•</span>
                  <span className="text-rose-700 italic">{story.reason}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Preview of the 5-Component Tools Matrix */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 block">
              Core Five-Part Breakdown
            </span>
            <h3 className="font-bold text-stone-900 text-base">
              Which AI Tools You Need to Try This Week
            </h3>
          </div>

          <button
            onClick={onNavigateToMatrix}
            className="flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-900 transition-colors self-start sm:self-auto"
          >
            <span>Open Full 5-Axis Matrix Table</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {briefing.toolComparisons.slice(0, 6).map((tool) => (
            <div
              key={tool.toolName}
              className="bg-stone-50/80 rounded-xl border border-stone-200 p-4 hover:border-amber-300 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-stone-900 text-sm group-hover:text-amber-800 transition-colors">
                    {tool.toolName}
                  </h4>
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                    {tool.signalScore}/10
                  </span>
                </div>

                <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-stone-200/70 text-stone-700 font-medium">
                  {tool.category}
                </span>

                <div className="mt-3 text-xs space-y-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                      Target Audience
                    </span>
                    <p className="text-stone-700 text-[11px] line-clamp-2 leading-relaxed">
                      {tool.jobFitAndAudience}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                      Suggested 15-Min Test
                    </span>
                    <p className="text-amber-950 bg-amber-100/50 p-2 rounded-lg border border-amber-200/50 text-[11px] leading-relaxed line-clamp-3">
                      {tool.suggestedFirstTest}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between">
                <span className="text-[10px] text-stone-500 font-mono">
                  {tool.sources.join(', ')}
                </span>
                <button
                  onClick={() => onLaunchExperiment(tool)}
                  className="text-[11px] font-bold text-stone-900 hover:text-amber-700 inline-flex items-center gap-1"
                >
                  <FlaskConical className="w-3 h-3 text-amber-600" />
                  <span>Test Protocol</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Next Post & Experiment Ideas */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block">
              Content & Research Pipeline
            </span>
            <h3 className="font-bold text-stone-900 text-base">
              Product Announcements Turned into Research Ideas
            </h3>
          </div>

          <button
            onClick={onNavigateToExperiments}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors self-start sm:self-auto"
          >
            <span>Open Experiment Lab</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {briefing.experimentIdeas.map((exp) => (
            <div
              key={exp.id}
              className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs flex flex-col justify-between space-y-3"
            >
              <div>
                <span className="text-[10px] font-semibold text-stone-500 block">
                  {exp.inspiredBy}
                </span>
                <h4 className="font-bold text-stone-900 text-sm mt-1 leading-snug">
                  {exp.title}
                </h4>

                <p className="text-stone-600 text-xs mt-2 italic bg-white p-2.5 rounded-lg border border-stone-200/80">
                  "{exp.coreQuestion}"
                </p>
              </div>

              <div className="pt-2 border-t border-stone-200/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Draft Post Angle:
                </span>
                <p className="text-[11px] text-stone-800 font-medium leading-relaxed">
                  {exp.potentialPostAngle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Top Industry Signals & Consensus */}
      <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5 space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-200">
          <TrendingUp className="w-4 h-4 text-stone-700" />
          <h3 className="font-bold text-stone-900 text-sm">
            Synthesized Industry Signals (Multi-Newsletter Consensus)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {briefing.topIndustrySignals.map((signal, idx) => (
            <div key={idx} className="bg-white p-3.5 rounded-xl border border-stone-200 text-xs">
              <span className="font-bold text-stone-900 block mb-1">
                {signal.trend}
              </span>
              <p className="text-stone-600 text-[11px] leading-relaxed mb-2">
                {signal.consensus}
              </p>
              <div className="text-amber-900 font-medium text-[11px] bg-amber-50 p-2 rounded-lg border border-amber-200/60">
                <strong>Action:</strong> {signal.recommendedAction}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
