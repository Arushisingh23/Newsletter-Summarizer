import { useState } from 'react';
import { X, Copy, Check, Mail, Sparkles, ExternalLink, Calendar } from 'lucide-react';
import { IntelligenceBriefing, RoutineConfig } from '../types';

interface EmailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  briefing: IntelligenceBriefing;
  routineConfig: RoutineConfig;
}

export function EmailPreviewModal({
  isOpen,
  onClose,
  briefing,
  routineConfig,
}: EmailPreviewModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyEmailText = () => {
    const text = `Subject: AI News Intel Briefing: ${briefing.briefingTitle}
To: ${routineConfig.recipientEmail}
Date: ${briefing.editionDate} at 9:00 AM

${briefing.executiveSummary}

---
TOOLS WORTH TRYING (5-AXIS MATRIX):
${briefing.toolComparisons
  .map(
    (t, i) => `
${i + 1}. ${t.toolName} (${t.category})
• Jobs & Audience: ${t.jobFitAndAudience}
• Evidence & Why it Matters: ${t.supportingEvidence}
• Access & Pricing: ${t.accessAndPricing}
• Suggested 15-Min Test: ${t.suggestedFirstTest}
• Sources: ${t.sources.join(', ')}
`
  )
  .join('\n')}

---
EXPERIMENTS TO PURSUE:
${briefing.experimentIdeas
  .map(
    (e, i) => `
${i + 1}. ${e.title}
• Question: ${e.coreQuestion}
• Protocol: ${e.testProtocol}
• Content Angle: ${e.potentialPostAngle}
`
  )
  .join('\n')}

---
NOISE FILTERED OUT (${briefing.excludedStories.length} items):
${briefing.excludedStories.map((s) => `• [Dropped] ${s.headline} (${s.source}) — ${s.reason}`).join('\n')}
`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-stone-200 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Email Client Header Bar */}
        <div className="bg-stone-100 p-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
            <span className="text-xs font-mono text-stone-500 ml-2">
              Inbox • Gmail AI News Routine
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyEmailText}
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 font-medium"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-stone-200 text-stone-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Email Meta Fields */}
        <div className="p-5 border-b border-stone-100 bg-stone-50/50 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-900">
              [Weekly Briefing] {briefing.briefingTitle}
            </h3>
            <span className="text-stone-400 text-[11px]">
              Every Monday, 9:00 AM
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-stone-600 text-[11px]">
            <div>
              <span className="text-stone-400">From: </span>
              <strong className="text-stone-800">AI News Intel Agent &lt;routine@agent.wyndo.ai&gt;</strong>
            </div>
            <div>
              <span className="text-stone-400">To: </span>
              <strong className="text-stone-800">{routineConfig.recipientEmail}</strong>
            </div>
            <div>
              <span className="text-stone-400">Label: </span>
              <span className="font-mono bg-stone-200/70 px-1.5 py-0.5 rounded text-stone-800">
                {routineConfig.gmailLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Email Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-stone-800 text-xs leading-relaxed font-sans">
          {/* Executive Intro */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4">
            <div className="font-bold text-amber-950 text-sm mb-1">
              Your Weekly AI News Intel Briefing
            </div>
            <p className="text-amber-900 text-xs leading-relaxed">
              {briefing.executiveSummary}
            </p>
          </div>

          {/* 5-Part Tools Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-stone-900 border-b border-stone-200 pb-1.5 uppercase tracking-wider text-[11px]">
              New AI Tools Worth Trying (5 Evaluation Axes)
            </h4>

            <div className="space-y-4">
              {briefing.toolComparisons.map((tool, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 text-sm">
                      {idx + 1}. {tool.toolName}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-stone-200 font-mono text-stone-700">
                      {tool.category}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <strong className="text-stone-500 block">Job Fit & Audience:</strong>
                      <span className="text-stone-800">{tool.jobFitAndAudience}</span>
                    </div>
                    <div>
                      <strong className="text-stone-500 block">Evidence & Why It Matters:</strong>
                      <span className="text-stone-800">{tool.supportingEvidence}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1 border-t border-stone-200/60">
                    <div>
                      <strong className="text-stone-500 block">Access & Pricing:</strong>
                      <span className="font-mono text-stone-700">{tool.accessAndPricing}</span>
                    </div>
                    <div className="bg-amber-100/60 p-2 rounded-lg border border-amber-200/60">
                      <strong className="text-amber-900 block">Suggested 15-Min Test:</strong>
                      <span className="text-amber-950 font-medium">{tool.suggestedFirstTest}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ideas & Experiments */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-stone-900 border-b border-stone-200 pb-1.5 uppercase tracking-wider text-[11px]">
              Suggestions for Next Posts & Experiments
            </h4>
            <div className="space-y-2">
              {briefing.experimentIdeas.map((exp, i) => (
                <div key={i} className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px]">
                  <span className="font-bold text-stone-900 block">{exp.title}</span>
                  <div className="text-stone-600 mt-1 italic">"{exp.coreQuestion}"</div>
                  <div className="text-amber-900 mt-1.5 font-medium">
                    ↳ Post angle: {exp.potentialPostAngle}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Excluded Noise Summary */}
          <div className="text-[11px] text-stone-500 pt-3 border-t border-stone-200">
            <strong>Noise Filtered Out ({briefing.excludedStories.length} items):</strong> Dropped consumer gadgets and entertainment novelties ({briefing.excludedStories.map((s) => s.headline.slice(0, 30) + '...').join('; ')}).
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-50 p-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>Automated by AI News Intel Weekly Scheduled Routine</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
