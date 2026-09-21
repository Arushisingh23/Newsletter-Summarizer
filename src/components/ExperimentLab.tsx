import { useState } from 'react';
import { 
  FlaskConical, 
  CheckSquare, 
  Square, 
  Sparkles, 
  Clock, 
  Plus, 
  CheckCircle2,
  Trash2,
  Bookmark,
  Share2,
  ArrowRight,
  Pencil,
  FileCheck
} from 'lucide-react';
import { ExperimentIdea, ResearchPersona } from '../types';

interface ExperimentLabProps {
  experiments: ExperimentIdea[];
  onUpdateExperiment: (exp: ExperimentIdea) => void;
  onAddExperiment: (exp: ExperimentIdea) => void;
  selectedPersona: ResearchPersona;
}

export function ExperimentLab({
  experiments,
  onUpdateExperiment,
  onAddExperiment,
  selectedPersona,
}: ExperimentLabProps) {
  const [selectedExpId, setSelectedExpId] = useState<string>(
    experiments[0]?.id || ''
  );
  const [newNote, setNewNote] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customQuestion, setCustomQuestion] = useState('');
  const [customProtocol, setCustomProtocol] = useState('');

  const selectedExp =
    experiments.find((e) => e.id === selectedExpId) || experiments[0];

  const handleStatusChange = (status: ExperimentIdea['status']) => {
    if (!selectedExp) return;
    onUpdateExperiment({
      ...selectedExp,
      status,
    });
  };

  const handleToggleVerified = () => {
    if (!selectedExp) return;
    onUpdateExperiment({
      ...selectedExp,
      userVerified: !selectedExp.userVerified,
    });
  };

  const handleSaveNote = () => {
    if (!selectedExp || !newNote.trim()) return;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updatedNotes = selectedExp.notes
      ? `${selectedExp.notes}\n• [${timeStr}]: ${newNote.trim()}`
      : `• [${timeStr}]: ${newNote.trim()}`;
    onUpdateExperiment({
      ...selectedExp,
      notes: updatedNotes,
    });
    setNewNote('');
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    const newObj: ExperimentIdea = {
      id: `exp-${Date.now()}`,
      title: customTitle,
      inspiredBy: 'User custom test',
      coreQuestion: customQuestion || 'Does this tool solve my daily bottleneck?',
      testProtocol: customProtocol || '1. Setup test input.\n2. Run tool.\n3. Verify output.',
      expectedSignal: 'Decide whether to integrate into daily stack.',
      potentialPostAngle: `My 15-minute empirical test of ${customTitle}.`,
      status: 'to_test',
    };

    onAddExperiment(newObj);
    setSelectedExpId(newObj.id);
    setIsAddingNew(false);
    setCustomTitle('');
    setCustomQuestion('');
    setCustomProtocol('');
  };

  const statusEmojis: Record<string, string> = {
    to_test: '⏳',
    in_testing: '🧪',
    completed: '✅',
    drafted: '📝',
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Whimsical Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold uppercase tracking-wider mb-2 border border-amber-200">
            <span>🧪 Hands-on Lab</span>
            <span className="text-amber-400">•</span>
            <span>Zero-Hype Testing</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            15-Minute Test Lab
          </h2>
          <p className="text-xs text-stone-600 mt-1 max-w-xl leading-relaxed">
            Turn theoretical announcements into bite-sized, 15-minute tests. Log observations, verify vendor claims, and track what actually works for you.
          </p>
        </div>

        <button
          onClick={() => setIsAddingNew(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-2xs transition-all active:scale-98 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Experiment</span>
        </button>
      </div>

      {/* New Experiment Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateCustom}
            className="bg-white rounded-3xl p-6 max-w-lg w-full border border-stone-200 shadow-2xl space-y-4"
          >
            <h3 className="text-base font-bold text-stone-900">
              Create a 15-Minute Test
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Tool or Feature Name</label>
                <input
                  required
                  placeholder="e.g. Cursor Rules Composer or Claude Computer Use"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="w-full bg-[#fcfbf9] border border-stone-200 rounded-xl p-2.5 text-xs focus:outline-hidden focus:border-amber-400"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">Core Question to Answer</label>
                <input
                  placeholder="e.g. Can it write clean tests without making up imports?"
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  className="w-full bg-[#fcfbf9] border border-stone-200 rounded-xl p-2.5 text-xs focus:outline-hidden focus:border-amber-400"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">Quick 3-Step Protocol</label>
                <textarea
                  rows={3}
                  placeholder="1. Provide sample file&#10;2. Run refactor prompt&#10;3. Check TypeScript compiler"
                  value={customProtocol}
                  onChange={(e) => setCustomProtocol(e.target.value)}
                  className="w-full bg-[#fcfbf9] border border-stone-200 rounded-xl p-2.5 text-xs focus:outline-hidden focus:border-amber-400"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-3 py-1.5 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-2xs"
              >
                Add to My Lab
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Grid: Experiment Selector on Left, Details on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List */}
        <div className="lg:col-span-4 space-y-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block px-1">
            Active Experiments ({experiments.length})
          </span>

          <div className="space-y-2">
            {experiments.map((exp) => {
              const isSelected = exp.id === selectedExpId;
              const emoji = statusEmojis[exp.status || 'to_test'];
              return (
                <div
                  key={exp.id}
                  onClick={() => setSelectedExpId(exp.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-xs space-y-1.5 ${
                    isSelected
                      ? 'bg-white border-amber-400 shadow-xs ring-1 ring-amber-400/30'
                      : 'bg-[#fcfbf9] hover:bg-white border-stone-200/80 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-stone-900 leading-snug">
                      {exp.title}
                    </span>
                    <span className="text-base shrink-0">{emoji}</span>
                  </div>
                  <p className="text-[11px] text-stone-500 line-clamp-1">
                    {exp.coreQuestion}
                  </p>
                  {exp.userVerified && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified Firsthand
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Detail Pane */}
        {selectedExp && (
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6 text-xs text-stone-700">
            {/* Status and Action bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  Status:
                </span>
                <select
                  value={selectedExp.status || 'to_test'}
                  onChange={(e) => handleStatusChange(e.target.value as any)}
                  className="bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 font-bold text-stone-800 text-xs focus:outline-hidden"
                >
                  <option value="to_test">⏳ To Test</option>
                  <option value="in_testing">🧪 In Testing</option>
                  <option value="completed">✅ Completed & Verified</option>
                  <option value="drafted">📝 Drafted as Post</option>
                </select>
              </div>

              <button
                onClick={handleToggleVerified}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold text-xs transition-all ${
                  selectedExp.userVerified
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-2xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{selectedExp.userVerified ? 'Claim Verified' : 'Mark as Verified'}</span>
              </button>
            </div>

            {/* Title & Core Question */}
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-stone-900 tracking-tight">
                {selectedExp.title}
              </h3>
              <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200/70 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                  ❓ Core Empirical Question
                </span>
                <p className="text-stone-900 font-medium text-xs leading-relaxed">
                  {selectedExp.coreQuestion}
                </p>
              </div>
            </div>

            {/* Step-by-Step Test Protocol */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                📋 Step-by-Step Protocol (15-30 Mins)
              </span>
              <div className="bg-[#fcfbf9] rounded-2xl p-4 border border-stone-200/80 font-mono text-xs text-stone-800 whitespace-pre-wrap leading-relaxed">
                {selectedExp.testProtocol}
              </div>
            </div>

            {/* Post Angle Hook */}
            {selectedExp.potentialPostAngle && (
              <div className="p-3.5 bg-purple-50/60 rounded-2xl border border-purple-200/70 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 block">
                  💡 Creator & Tutorial Hook
                </span>
                <p className="text-purple-950 font-medium text-xs italic">
                  "{selectedExp.potentialPostAngle}"
                </p>
              </div>
            )}

            {/* Personal Log & Observations */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                📝 Personal Test Observations
              </span>
              {selectedExp.notes ? (
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-stone-800 whitespace-pre-wrap font-sans text-xs leading-relaxed">
                  {selectedExp.notes}
                </div>
              ) : (
                <div className="text-stone-400 italic text-[11px] p-2">
                  No notes recorded yet. Write your firsthand findings below!
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Add a timestamped observation..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveNote();
                  }}
                  className="flex-1 bg-[#fcfbf9] border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-hidden focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={handleSaveNote}
                  className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs"
                >
                  Log Note
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
