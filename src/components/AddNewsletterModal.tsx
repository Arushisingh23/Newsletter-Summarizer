import { useState } from 'react';
import { X, Plus, Mail, CheckCircle2 } from 'lucide-react';
import { NewsletterSubscription } from '../types';

interface AddNewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (sub: Omit<NewsletterSubscription, 'id' | 'unreadCount' | 'lastReceived'>) => void;
}

export function AddNewsletterModal({ isOpen, onClose, onAdd }: AddNewsletterModalProps) {
  const [name, setName] = useState('');
  const [sender, setSender] = useState('');
  const [category, setCategory] = useState('Tech & AI');
  const [frequency, setFrequency] = useState<'Daily' | 'Weekly'>('Daily');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      name: name.trim(),
      sender: sender.trim() || `${name.trim()} Team`,
      category,
      frequency,
      status: 'active',
      description: description.trim() || 'Curated industry insights and newsletter updates.',
    });

    setName('');
    setSender('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-150 font-sans">
      <div className="w-full max-w-md bg-white dark:bg-stone-900 border-2 border-stone-900 dark:border-stone-700 rounded-3xl p-6 shadow-[6px_6px_0px_0px_#1c1917] dark:shadow-[6px_6px_0px_0px_#f472b6] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl bg-pink-500 border-1.5 border-stone-900 dark:border-stone-700 flex items-center justify-center text-white font-bold">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-black text-stone-900 dark:text-stone-100">
              Add Newsletter to Feed
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Track incoming issues in your personal dashboard
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
              Newsletter Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. TLDR Tech, The Information, Stratechery"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-800 border-2 border-stone-900 dark:border-stone-700 text-xs font-bold text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-hidden focus:border-pink-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
              Sender or Publication
            </label>
            <input
              type="text"
              placeholder="e.g. Dan Ni, Morning Brew Inc."
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-800 border-2 border-stone-900 dark:border-stone-700 text-xs font-bold text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-hidden focus:border-pink-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-800 border-2 border-stone-900 dark:border-stone-700 text-xs font-bold text-stone-900 dark:text-stone-100"
              >
                <option value="Tech & AI">Tech & AI</option>
                <option value="Business">Business</option>
                <option value="Coding">Coding & Dev</option>
                <option value="Productivity">Productivity</option>
                <option value="Finance">Finance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as 'Daily' | 'Weekly')}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-800 border-2 border-stone-900 dark:border-stone-700 text-xs font-bold text-stone-900 dark:text-stone-100"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
              Short Description / Focus
            </label>
            <input
              type="text"
              placeholder="e.g. Daily curated tech news without fluff"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-stone-800 border-2 border-stone-900 dark:border-stone-700 text-xs font-bold text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-hidden focus:border-pink-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl border-2 border-stone-900 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-400 border-2 border-stone-900 dark:border-stone-700 text-white font-black text-xs shadow-[2px_2px_0px_0px_#1c1917] transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Dashboard</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
