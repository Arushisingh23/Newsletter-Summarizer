import { useState } from 'react';
import { 
  X, 
  Rocket, 
  Check, 
  Copy, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  Gift, 
  Mail, 
  FolderGit2, 
  Terminal
} from 'lucide-react';

interface FreeDeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FreeDeploymentModal({ isOpen, onClose }: FreeDeploymentModalProps) {
  const [copiedVercel, setCopiedVercel] = useState(false);

  if (!isOpen) return null;

  const vercelJsonCode = `{
  "crons": [
    {
      "path": "/api/cron/weekly-briefing",
      "schedule": "0 9 * * 1"
    }
  ]
}`;

  const handleCopyVercel = () => {
    navigator.clipboard.writeText(vercelJsonCode);
    setCopiedVercel(true);
    setTimeout(() => setCopiedVercel(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-stone-200 shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-stone-900 text-stone-100 p-6 border-b border-stone-800 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-1 border border-emerald-500/30">
                100% Free Forever • Zero Dollars
              </div>
              <h3 className="text-lg font-bold text-white">
                Launch Your AI News Intel for the Public
              </h3>
              <p className="text-xs text-stone-300 mt-1">
                Follow these 4 simple steps to put your app online for everyone. No credit card required.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-stone-700 leading-relaxed">
          {/* Step 1 */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xs">1</span>
                Save Code to GitHub (Free)
              </span>
              <span className="text-[11px] font-mono text-stone-400">Step 1 of 4</span>
            </div>
            <p className="text-stone-600">
              In Google AI Studio, click the top menu &rarr; <strong>"Export to GitHub"</strong> (or download the ZIP and upload to GitHub). GitHub keeps your code safe online for $0.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xs">2</span>
                Deploy on Vercel (Free)
              </span>
              <span className="text-[11px] font-mono text-stone-400">Step 2 of 4</span>
            </div>
            <p className="text-stone-600">
              Open <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-amber-700 underline font-semibold">vercel.com</a>, log in with GitHub, click <strong>"Add New Project"</strong>, select your repository, and hit <strong>Deploy</strong>. Vercel gives you a public link like <code className="bg-stone-200 px-1 py-0.5 rounded text-stone-800">my-app.vercel.app</code> instantly!
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xs">3</span>
                Add Your Free Keys in Vercel
              </span>
              <span className="text-[11px] font-mono text-stone-400">Step 3 of 4</span>
            </div>
            <p className="text-stone-600">
              In Vercel &rarr; Settings &rarr; Environment Variables, paste these 2 free keys:
            </p>
            <ul className="list-disc list-inside space-y-1 text-stone-800 font-mono text-[11px]">
              <li><strong className="text-stone-900">GEMINI_API_KEY</strong>: Free from <a href="https://aistudio.google.com" target="_blank" rel="noreferrer" className="underline text-amber-700">aistudio.google.com</a></li>
              <li><strong className="text-stone-900">RESEND_API_KEY</strong>: Free from <a href="https://resend.com" target="_blank" rel="noreferrer" className="underline text-amber-700">resend.com</a> (gives 3,000 free emails/month!)</li>
            </ul>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-950 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xs">4</span>
                Automated Monday 9:00 AM Cron
              </span>
              <button
                onClick={handleCopyVercel}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-900 text-[11px] font-medium hover:bg-amber-100"
              >
                {copiedVercel ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedVercel ? 'Copied' : 'Copy vercel.json'}</span>
              </button>
            </div>
            <p className="text-amber-900">
              Create a file called <code className="font-mono font-bold">vercel.json</code> in your project folder. This tells Vercel to automatically ring the alarm every Monday at 9 AM and email the report!
            </p>
            <div className="bg-stone-900 text-stone-100 p-3 rounded-xl font-mono text-[11px]">
              <pre>{vercelJsonCode}</pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-50 p-4 border-t border-stone-200 flex items-center justify-between">
          <span className="text-[11px] text-stone-500">
            Firebase Auth & Firestore are already wired up in your code!
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-colors"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
}
