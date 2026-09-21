import { useState } from 'react';
import { X, Mail, Sparkles, Check, BellRing } from 'lucide-react';
import { RoutineConfig } from '../types';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: RoutineConfig;
  onSave: (config: RoutineConfig) => void;
  userEmail?: string;
}

export function SubscribeModal({
  isOpen,
  onClose,
  config,
  onSave,
  userEmail,
}: SubscribeModalProps) {
  if (!isOpen) return null;

  const [email, setEmail] = useState(userEmail || config.recipientEmail || '');
  const [day, setDay] = useState(config.dayOfWeek || 'Monday');
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    onSave({
      ...config,
      recipientEmail: email,
      dayOfWeek: day,
      enabled: true,
    });

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150 font-sans">
      <div className="bg-[#FFFDFB] rounded-3xl max-w-md w-full border-2 border-stone-900 shadow-[6px_6px_0px_0px_#1c1917] overflow-hidden my-6 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b-2 border-stone-900 flex items-start justify-between bg-pink-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border-2 border-stone-900 text-stone-900 flex items-center justify-center text-lg shrink-0 shadow-[2px_2px_0px_0px_#1c1917]">
              📬
            </div>
            <div>
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-pink-900 bg-white px-2 py-0.5 rounded-full mb-1 border border-stone-900">
                Weekly Delivery
              </span>
              <h3 className="text-lg font-black text-stone-900">
                Get Weekly Summaries
              </h3>
              <p className="text-xs text-stone-700 font-medium">
                Sent directly to your inbox every week.
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-stone-700">
          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-stone-900 block">
              Your Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border-2 border-stone-900 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-stone-900 focus:outline-hidden focus:shadow-[3px_3px_0px_0px_#1c1917] shadow-[2px_2px_0px_0px_#1c1917] font-bold"
              />
              <Mail className="w-4 h-4 text-pink-500 absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-stone-900 block">
              Preferred Day
            </label>
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="w-full bg-white border-2 border-stone-900 rounded-xl px-3 py-2 text-xs font-bold text-stone-900 focus:outline-hidden shadow-[2px_2px_0px_0px_#1c1917]"
            >
              <option value="Monday">Monday Morning</option>
              <option value="Friday">Friday Afternoon</option>
              <option value="Sunday">Sunday Evening</option>
            </select>
          </div>

          <div className="p-3 bg-pink-50 rounded-2xl border-2 border-stone-900 text-[11px] text-stone-800 font-medium leading-relaxed flex items-center gap-2 shadow-[2px_2px_0px_0px_#1c1917]">
            <Sparkles className="w-4 h-4 text-pink-600 shrink-0" />
            <span>Short, 2-minute scannable bullet points only.</span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl hover:bg-stone-100 text-stone-700 font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-400 text-white font-black text-xs border-2 border-stone-900 shadow-[2px_2px_0px_0px_#1c1917] transition-all active:scale-95"
            >
              {isSaved ? <Check className="w-4 h-4" /> : <BellRing className="w-4 h-4" />}
              <span>{isSaved ? 'Subscribed!' : 'Subscribe'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
