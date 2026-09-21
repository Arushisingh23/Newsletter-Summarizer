import { useState } from 'react';
import { 
  CheckCircle, 
  ExternalLink, 
  FlaskConical, 
  Layers, 
  Search, 
  Tag, 
  DollarSign, 
  Sparkles, 
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { ToolComparison } from '../types';

interface ToolComparisonMatrixProps {
  tools: ToolComparison[];
  onLaunchExperiment: (tool: ToolComparison) => void;
}

export function ToolComparisonMatrix({ tools, onLaunchExperiment }: ToolComparisonMatrixProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');

  const categories = ['All', ...Array.from(new Set(tools.map((t) => t.category)))];

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.toolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.jobFitAndAudience.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.supportingEvidence.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.suggestedFirstTest.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 shadow-sm border border-stone-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-2 border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              Core Section • 5 Evaluation Axes
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Tools Worth Trying Matrix
            </h2>
            <p className="text-xs text-stone-300 mt-1 max-w-2xl leading-relaxed">
              Evaluating newly surfaced tools across the 5 essential components: Tool Identity, Job & Audience Fit, Supporting Evidence, Access & Pricing, and Easiest First Test Protocol.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs text-stone-400">Layout:</span>
            <div className="bg-stone-800 p-0.5 rounded-lg flex items-center border border-stone-700">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                  viewMode === 'table'
                    ? 'bg-stone-700 text-white shadow-xs'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Table View
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                  viewMode === 'cards'
                    ? 'bg-stone-700 text-white shadow-xs'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Detailed Cards
              </button>
            </div>
          </div>
        </div>

        {/* 5 Components Explainer Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mt-5 pt-4 border-t border-stone-800/80 text-[11px]">
          <div className="bg-stone-800/60 p-2 rounded-lg border border-stone-700/50">
            <span className="text-amber-400 font-bold block">1. Which Tools</span>
            <span className="text-stone-300">Name & operational model</span>
          </div>
          <div className="bg-stone-800/60 p-2 rounded-lg border border-stone-700/50">
            <span className="text-amber-400 font-bold block">2. Job & Audience Fit</span>
            <span className="text-stone-300">Who benefits & target roles</span>
          </div>
          <div className="bg-stone-800/60 p-2 rounded-lg border border-stone-700/50">
            <span className="text-amber-400 font-bold block">3. Evidence & Value</span>
            <span className="text-stone-300">Tested proof vs PR hype</span>
          </div>
          <div className="bg-stone-800/60 p-2 rounded-lg border border-stone-700/50">
            <span className="text-amber-400 font-bold block">4. Access & Pricing</span>
            <span className="text-stone-300">Friction, free tiers, and cost</span>
          </div>
          <div className="bg-stone-800/60 p-2 rounded-lg border border-stone-700/50">
            <span className="text-amber-400 font-bold block">5. First Test Protocol</span>
            <span className="text-stone-300">Easiest 15-min validation</span>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-stone-200 shadow-2xs">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-stone-400 shrink-0 ml-1" />
          <input
            type="text"
            placeholder="Search tools, audiences, test protocols, or evidence..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs text-stone-900 placeholder-stone-400 bg-transparent border-none focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-amber-100 text-amber-900 font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* View Mode 1: Table Matrix */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-100/90 text-stone-700 border-b border-stone-200 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="p-3.5 w-48">1. Tool & Category</th>
                  <th className="p-3.5 w-60">2. Job Fit & Audience</th>
                  <th className="p-3.5 w-64">3. Evidence & Why It Matters</th>
                  <th className="p-3.5 w-48">4. Access & Pricing</th>
                  <th className="p-3.5 w-72">5. Suggested First Test</th>
                  <th className="p-3.5 w-24 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredTools.map((tool, idx) => (
                  <tr
                    key={tool.toolName}
                    className="hover:bg-amber-50/40 transition-colors group"
                  >
                    {/* 1. Tool */}
                    <td className="p-3.5 align-top">
                      <div className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                        {tool.toolName}
                      </div>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-medium">
                        {tool.category}
                      </span>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {tool.sources.map((src) => (
                          <span
                            key={src}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200"
                          >
                            {src}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* 2. Job Fit & Audience */}
                    <td className="p-3.5 align-top text-stone-700 leading-relaxed">
                      {tool.jobFitAndAudience}
                    </td>

                    {/* 3. Evidence */}
                    <td className="p-3.5 align-top text-stone-700 leading-relaxed">
                      <div className="flex items-start gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{tool.supportingEvidence}</span>
                      </div>
                    </td>

                    {/* 4. Access & Pricing */}
                    <td className="p-3.5 align-top">
                      <div className="bg-stone-50 rounded-lg p-2 border border-stone-100 text-stone-700 font-mono text-[11px] leading-tight">
                        {tool.accessAndPricing}
                      </div>
                    </td>

                    {/* 5. First Test */}
                    <td className="p-3.5 align-top">
                      <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-2.5 text-amber-950 text-[11px] leading-relaxed">
                        <span className="font-bold text-amber-900 block mb-1 flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-600" />
                          15-Minute Test:
                        </span>
                        {tool.suggestedFirstTest}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="p-3.5 align-top text-right">
                      <button
                        onClick={() => onLaunchExperiment(tool)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-medium text-[11px] shadow-2xs transition-transform active:scale-95"
                        title="Draft deep experiment protocol"
                      >
                        <FlaskConical className="w-3 h-3 text-amber-400" />
                        <span>Plan</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* View Mode 2: Detailed Cards */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredTools.map((tool) => (
            <div
              key={tool.toolName}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:border-amber-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-stone-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-stone-900 text-base">{tool.toolName}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-medium">
                        {tool.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-[10px] text-stone-400 uppercase tracking-wider">Surfaced in:</span>
                      {tool.sources.map((src) => (
                        <span
                          key={src}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-medium"
                        >
                          {src}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block">
                      Signal Score
                    </span>
                    <span className="text-base font-bold text-amber-600">{tool.signalScore}/10</span>
                  </div>
                </div>

                {/* 5 Components in card */}
                <div className="mt-4 space-y-3 text-xs">
                  <div>
                    <span className="font-semibold text-stone-500 text-[11px] block uppercase tracking-wider">
                      2. Job Fit & Target Audience
                    </span>
                    <p className="text-stone-800 mt-0.5 leading-relaxed">{tool.jobFitAndAudience}</p>
                  </div>

                  <div>
                    <span className="font-semibold text-stone-500 text-[11px] block uppercase tracking-wider">
                      3. Supporting Evidence & Why It Matters
                    </span>
                    <p className="text-stone-800 mt-0.5 leading-relaxed flex items-start gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{tool.supportingEvidence}</span>
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold text-stone-500 text-[11px] block uppercase tracking-wider">
                      4. Access & Pricing
                    </span>
                    <p className="text-stone-800 mt-0.5 font-mono text-[11px] bg-stone-50 p-2 rounded-lg border border-stone-100">
                      {tool.accessAndPricing}
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold text-amber-900 text-[11px] block uppercase tracking-wider">
                      5. Suggested First Test
                    </span>
                    <div className="mt-0.5 bg-amber-50/80 border border-amber-200 rounded-lg p-2.5 text-amber-950 leading-relaxed">
                      {tool.suggestedFirstTest}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] text-stone-400">Ready to test hands-on?</span>
                <button
                  onClick={() => onLaunchExperiment(tool)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <FlaskConical className="w-3.5 h-3.5 text-amber-400" />
                  <span>Turn into Test Experiment</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
