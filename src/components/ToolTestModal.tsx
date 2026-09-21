import { useState } from 'react';
import { 
  X, 
  FlaskConical, 
  CheckCircle2, 
  Clock, 
  Check, 
  Square, 
  CheckSquare, 
  Save, 
  Tag
} from 'lucide-react';
import { ToolComparison, ExperimentIdea } from '../types';

interface ToolTestModalProps {
  tool: ToolComparison | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveExperiment: (exp: ExperimentIdea) => void;
  existingExperiment?: ExperimentIdea;
}

export function ToolTestModal({
  tool,
  isOpen,
  onClose,
  onSaveExperiment,
  existingExperiment,
}: ToolTestModalProps) {
  if (!isOpen || !tool) return null;

  const [notes, setNotes] = useState(existingExperiment?.notes || '');
  const [status, setStatus] = useState<ExperimentIdea['status']>(
    existingExperiment?.status || 'in_testing'
  );
  const [userVerified, setUserVerified] = useState(
    existingExperiment?.userVerified || false
  );
  const [checkedSteps, setCheckedSteps] = useState<boolean[]>([false, false, false]);
  const [savedFeedback, setSavedFeedback] = useState(false);

  // Split protocol into steps if numbered, or display nicely
  const protocolLines = tool.suggestedFirstTest
    .split(/(?=\d+\.\s+)/)
    .map((s) => s.trim())
    .filter(Boolean);

  const steps = protocolLines.length > 1 ? protocolLines : [tool.suggestedFirstTest];

  const handleToggleStep = (index: number) => {
    const updated = [...checkedSteps];
    updated[index] = !updated[index];
    setCheckedSteps(updated);
  };

  const handleSave = () => {
    const expObj: ExperimentIdea = {
      id: existingExperiment?.id || `exp-${Date.now()}`,
      title: `15-Min Test: ${tool.toolName}`,
      inspiredBy: tool.sources.join(', '),
      coreQuestion: `Can ${tool.toolName} deliver real workflow gains in everyday tasks?`,
      testProtocol: tool.suggestedFirstTest,
      expectedSignal: `Verified firsthand whether ${tool.toolName} is worth adopting.`,
      potentialPostAngle: `I tested ${tool.toolName} for 15 minutes: Here are my unfiltered results.`,
      status,
      userVerified,
      notes,
    };

    onSaveExperiment(expObj);
    setSavedFeedback(true);
    setTimeout(() => {
      setSavedFeedback(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-[#FFFDF7] rounded-3xl max-w-xl w-full border-2 border-stone-900 shadow-[6px_6px_0px_0px_#1c1917] overflow-hidden my-6 max-h-[92vh] flex flex-col font-sans">
        {/* Playful Header */}
        <div className="p-5 sm:p-6 border-b-2 border-stone-900 flex items-start justify-between bg-amber-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border-1.5 border-stone-900 text-stone-900 flex items-center justify-center font-bold shrink-0 shadow-[2px_2px_0px_0px_#1c1917] text-lg">
              🧪
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-stone-900 text-stone-900 text-[10px] font-black uppercase tracking-wider mb-1">
                <Clock className="w-3 h-3 text-stone-900" />
                15-Minute Protocol
              </div>
              <h3 className="text-lg font-black text-stone-900 tracking-tight">
                {tool.toolName}
              </h3>
              <p className="text-xs text-stone-700 font-semibold">
                {tool.category} • {tool.sources.join(' & ')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white border border-stone-900 hover:bg-stone-100 text-stone-900 transition-colors shadow-[1px_1px_0px_0px_#1c1917]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-stone-700">
          {/* Target Job Fit */}
          <div className="bg-white rounded-2xl p-4 border-2 border-stone-900 shadow-[2px_2px_0px_0px_#1c1917] space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 block">
              🎯 Best For (Target Role)
            </span>
            <p className="text-stone-900 font-semibold leading-relaxed text-xs">
              {tool.jobFitAndAudience}
            </p>
          </div>

          {/* Why Test This Tool */}
          <div className="bg-white rounded-2xl p-4 border-2 border-stone-900 shadow-[2px_2px_0px_0px_#1c1917] space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 block">
              💡 Grounded Evidence (Why It Matters)
            </span>
            <p className="text-stone-800 leading-relaxed text-xs">
              {tool.supportingEvidence}
            </p>
          </div>

          {/* Step-by-step Interactive Protocol */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
                <span>Checklist Protocol</span>
              </span>
              <span className="text-[11px] text-stone-500 font-medium">Click step when completed</span>
            </div>

            <div className="space-y-2">
              {steps.map((step, idx) => {
                const isChecked = !!checkedSteps[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => handleToggleStep(idx)}
                    className={`p-3 rounded-2xl border-2 border-stone-900 transition-all cursor-pointer flex items-start gap-3 ${
                      isChecked
                        ? 'bg-emerald-100 text-emerald-950 shadow-[1px_1px_0px_0px_#1c1917]'
                        : 'bg-white hover:bg-stone-50 shadow-[2px_2px_0px_0px_#1c1917]'
                    }`}
                  >
                    <button className="mt-0.5 text-stone-900">
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-emerald-700" />
                      ) : (
                        <Square className="w-4 h-4 text-stone-900" />
                      )}
                    </button>
                    <div className="flex-1">
                      <span className={`leading-relaxed text-xs font-medium ${isChecked ? 'line-through opacity-70' : ''}`}>
                        {step}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status & Outcome Picker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-stone-600">
                Your Test Verdict
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-white border-2 border-stone-900 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 focus:outline-hidden shadow-[2px_2px_0px_0px_#1c1917]"
              >
                <option value="to_test">⏳ Planning to test</option>
                <option value="in_testing">🧪 In active testing</option>
                <option value="completed">✅ Tested & Verified (Keep)</option>
                <option value="drafted">📝 Turning into post/guide</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-stone-600">
                Claim Verification
              </label>
              <button
                type="button"
                onClick={() => setUserVerified(!userVerified)}
                className={`w-full py-2 px-3 rounded-xl border-2 border-stone-900 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-[2px_2px_0px_0px_#1c1917] ${
                  userVerified
                    ? 'bg-emerald-400 text-stone-950'
                    : 'bg-white text-stone-800 hover:bg-stone-50'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{userVerified ? 'Claim Verified Firsthand' : 'Mark as Verified'}</span>
              </button>
            </div>
          </div>

          {/* Test Notes / Observations */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-stone-600">
              Personal Notes & Findings
            </label>
            <textarea
              rows={3}
              placeholder="What worked? Did it hallucinate? Was it fast? Note timestamps or observations..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white border-2 border-stone-900 rounded-2xl p-3 text-xs text-stone-900 font-medium leading-relaxed focus:outline-hidden shadow-[2px_2px_0px_0px_#1c1917] placeholder:text-stone-400"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-white border-t-2 border-stone-900 flex items-center justify-between">
          <span className="text-[11px] text-stone-600 font-mono font-bold">
            {tool.accessAndPricing}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl hover:bg-stone-100 text-stone-700 text-xs font-bold"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs border-2 border-stone-900 shadow-[2px_2px_0px_0px_#1c1917] active:scale-95 transition-all"
            >
              {savedFeedback ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span>{savedFeedback ? 'Saved!' : 'Save to My Lab'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
