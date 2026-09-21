import { useState } from 'react';
import { 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  Save, 
  Plus, 
  X, 
  ShieldAlert, 
  Layers,
  Terminal
} from 'lucide-react';
import { ResearchPersona } from '../types';

interface SkillEditorProps {
  selectedPersona: ResearchPersona;
  onUpdatePersonaInstruction: (newOpening: string) => void;
}

export function SkillEditor({ selectedPersona, onUpdatePersonaInstruction }: SkillEditorProps) {
  const [openingInstruction, setOpeningInstruction] = useState(
    "Create a weekly intelligence report that helps Wyndo decide what to test, ignore, or turn into AI Maker content. Preserve source evidence, separate firsthand use from promotion, and prioritize operating methods over feature lists."
  );

  const [filterRules, setFilterRules] = useState<string[]>([
    "Leave out consumer novelty gimmicks (e.g. AI toothbrushes, robot battles, racing robot exhibitions)",
    "Exclude theoretical academic papers with no public weights, code, or immediate runtime access",
    "Filter out pure PR / venture funding announcements without testable artifacts",
    "Consolidate repeated multi-newsletter coverage into unified trend analysis",
    "Flag sponsored tool placements and claims requiring primary source verification",
  ]);

  const [newRule, setNewRule] = useState('');
  const [copied, setCopied] = useState(false);
  const [savedStatus, setSavedStatus] = useState(false);

  const fullSkillMarkdown = `---
name: "ai-news-intel"
description: "Turn weekly AI newsletters into high-signal practical briefings with 5-part tool evaluations and hands-on experiment designs."
---

# AI News Intel (Weekly Routine)

## Core Directive
${openingInstruction}

## Persona & Research Context
- **Target Persona**: ${selectedPersona.title}
- **Research Question**: "${selectedPersona.focusQuestion}"
- **Prioritize**: ${selectedPersona.prioritize}
- **Leave Out**: ${selectedPersona.leaveOut}

## Ingestion Scope
- **Email Source**: Gmail label \`AI News\`
- **Default Timeframe**: Past 7 days (rolling weekly window)
- **Delivery Time**: Every Monday at 9:00 AM

## Noise Filtering Directives
${filterRules.map((r, i) => `${i + 1}. ${r}`).join('\n')}

## Required 5-Component Matrix Format
Every tool selected for the report must be evaluated across:
1. **Tool Identity**: Name, model architecture, and primary operation.
2. **Job Fit & Audience**: What types of jobs and audiences those tools are best suited for.
3. **Evidence & Value**: Verifiable firsthand evidence and why it matters (distinguishing reported facts from promotional hype).
4. **Access & Pricing**: How easy they are to access and how much they cost.
5. **Suggested First Test**: The easiest ways to test them in 15–30 minutes.

## Practical Experiment Formulation
Whenever a major model or capability is announced (e.g. video comprehension, autonomous browser agents), formulate an empirical test:
- Hypothesize a specific blind spot (e.g. visual UI bounding boxes vs transcript parsing).
- Outline a 5-question test protocol.
- Check reported outputs against ground truth timestamps or code.
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullSkillMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([fullSkillMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SKILL.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddRule = () => {
    if (!newRule.trim()) return;
    setFilterRules([...filterRules, newRule.trim()]);
    setNewRule('');
  };

  const handleRemoveRule = (index: number) => {
    setFilterRules(filterRules.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onUpdatePersonaInstruction(openingInstruction);
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 border border-stone-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-2 border border-amber-500/30">
              <FileCode className="w-3.5 h-3.5" />
              Agentic Skill Architecture
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              AI News Intel Skill Configuration (SKILL.md)
            </h2>
            <p className="text-xs text-stone-300 mt-1 max-w-2xl leading-relaxed">
              A skill is a set of saved instructions, criteria, and filters that tells an AI agent how to do the research consistently each week without manual re-prompting.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-white text-xs font-medium border border-stone-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy SKILL.md'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form Controls */}
        <div className="lg:col-span-6 space-y-5">
          {/* Opening Instruction */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Opening Purpose Instruction
              </label>
              <span className="text-[11px] text-stone-400">Core guiding directive</span>
            </div>

            <p className="text-xs text-stone-500">
              This instruction establishes the filter and evaluation mindset for every newsletter issue scanned.
            </p>

            <textarea
              rows={4}
              value={openingInstruction}
              onChange={(e) => setOpeningInstruction(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-900 font-sans leading-relaxed focus:outline-hidden focus:ring-1 focus:ring-amber-500"
            />

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Save className="w-3.5 h-3.5 text-amber-400" />
                <span>{savedStatus ? 'Saved to Routine' : 'Save Directive'}</span>
              </button>
            </div>
          </div>

          {/* Noise Exclusion Rules */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Noise Filter & Exclusion Criteria
                </label>
              </div>
              <span className="text-[11px] text-stone-400">Drops irrelevant noise</span>
            </div>

            <p className="text-xs text-stone-500">
              Ensures the agent discards stories like robot fights, AI toothbrushes, or unverified funding hype.
            </p>

            <div className="space-y-2">
              {filterRules.map((rule, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-800"
                >
                  <span className="font-mono text-stone-400 text-[11px]">{idx + 1}.</span>
                  <span className="flex-1 leading-snug">{rule}</span>
                  <button
                    onClick={() => handleRemoveRule(idx)}
                    className="text-stone-400 hover:text-rose-600 p-1"
                    title="Remove rule"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Add exclusion rule (e.g., 'Drop benchmark papers lacking code')..."
                value={newRule}
                onChange={(e) => setNewRule(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddRule()}
                className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-hidden"
              />
              <button
                onClick={handleAddRule}
                className="px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold"
              >
                Add Rule
              </button>
            </div>
          </div>
        </div>

        {/* Right Code / Markdown Preview */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-500 px-1">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-stone-500" />
              Generated SKILL.md Preview
            </span>
            <span className="text-[11px] font-mono text-stone-400">Portable agent skill format</span>
          </div>

          <div className="bg-stone-950 text-stone-200 rounded-2xl p-4 border border-stone-800 font-mono text-[11px] leading-relaxed overflow-x-auto shadow-sm max-h-[580px] overflow-y-auto">
            <pre className="whitespace-pre-wrap">{fullSkillMarkdown}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
