import { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  Mail, 
  CheckCircle2, 
  Play, 
  Settings, 
  Check, 
  AlertCircle,
  RefreshCw,
  FolderOpen,
  Send
} from 'lucide-react';
import { RoutineConfig, RoutineLog } from '../types';

interface RoutineSchedulerProps {
  config: RoutineConfig;
  onUpdateConfig: (cfg: RoutineConfig) => void;
  logs: RoutineLog[];
  onTriggerRoutine: () => void;
  isTriggering: boolean;
}

export function RoutineScheduler({
  config,
  onUpdateConfig,
  logs,
  onTriggerRoutine,
  isTriggering,
}: RoutineSchedulerProps) {
  const [dayOfWeek, setDayOfWeek] = useState(config.dayOfWeek);
  const [time, setTime] = useState(config.time);
  const [timeframeDays, setTimeframeDays] = useState(config.timeframeDays);
  const [recipientEmail, setRecipientEmail] = useState(config.recipientEmail);
  const [gmailLabel, setGmailLabel] = useState(config.gmailLabel);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleSave = () => {
    onUpdateConfig({
      ...config,
      dayOfWeek,
      time,
      timeframeDays,
      recipientEmail,
      gmailLabel,
      cron: `0 ${time.split(':')[1] || '00'} ${time.split(':')[0] || '09'} * * 1`,
    });
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 border border-stone-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-2 border border-amber-500/30">
              <Clock className="w-3.5 h-3.5" />
              Agentic Automation Engine
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Scheduled Routine: Autonomous Weekly Research
            </h2>
            <p className="text-xs text-stone-300 mt-1 max-w-2xl leading-relaxed">
              A scheduled routine executes the AI News Intel skill on a recurring cron cycle without manual prompting. It reviews newsletters under your Gmail label and delivers the formatted briefing directly to your inbox.
            </p>
          </div>

          <button
            onClick={onTriggerRoutine}
            disabled={isTriggering}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-all self-start md:self-auto ${
              isTriggering
                ? 'bg-stone-700 text-stone-300 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-400 text-stone-950 active:scale-98'
            }`}
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isTriggering ? 'animate-spin' : ''}`} />
            <span>{isTriggering ? 'Executing Scheduled Run...' : 'Trigger Scheduled Run Now'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Timing & Target Settings */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <Settings className="w-4 h-4 text-stone-500" />
              Schedule & Delivery Configuration
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
              Active Recurring Job
            </span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Run Day & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Run Frequency / Day
                </label>
                <select
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-900 focus:outline-hidden font-medium"
                >
                  <option value="Monday">Every Monday (Weekly)</option>
                  <option value="Friday">Every Friday (Weekly Review)</option>
                  <option value="Sunday">Every Sunday (Weekly Prep)</option>
                  <option value="Daily">Daily Morning Digest</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Inbox Delivery Time
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-900 focus:outline-hidden font-medium"
                />
              </div>
            </div>

            {/* Timeframe Days */}
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                Newsletter Coverage Timeframe
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={1}
                  max={30}
                  value={timeframeDays}
                  onChange={(e) => setTimeframeDays(Number(e.target.value))}
                  className="flex-1 accent-amber-500"
                />
                <span className="font-mono font-bold text-stone-900 w-16 text-right">
                  {timeframeDays} days
                </span>
              </div>
              <p className="text-[11px] text-stone-400 mt-1">
                Past 7 days prevents reading repetitive news while collecting enough signal for deep testing.
              </p>
            </div>

            {/* Recipient Email */}
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                Destination Inbox Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-3 py-2 text-stone-900 font-mono focus:outline-hidden"
                />
              </div>
            </div>

            {/* Gmail Label */}
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                Narrowed Gmail Scope Label
              </label>
              <div className="relative">
                <FolderOpen className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={gmailLabel}
                  onChange={(e) => setGmailLabel(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-3 py-2 text-stone-900 font-mono focus:outline-hidden"
                />
              </div>
              <p className="text-[11px] text-stone-400 mt-1">
                Isolating to a specific label prevents the agent from reading unrelated personal or corporate emails.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 flex justify-end">
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              {savedFeedback ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
              <span>{savedFeedback ? 'Schedule Saved' : 'Save Schedule Settings'}</span>
            </button>
          </div>
        </div>

        {/* Execution History Logs */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-stone-500" />
              Automated Execution History
            </h3>
            <span className="text-[11px] text-stone-400">Past weekly runs</span>
          </div>

          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/70 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {log.timestamp}
                  </span>
                  <span className="font-mono text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Delivered at 9:00 AM
                  </span>
                </div>

                <p className="text-stone-600 text-[11px] leading-relaxed">
                  {log.summary}
                </p>

                <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1 border-t border-stone-200/60 font-mono">
                  <span>Scanned: {log.emailsScanned} emails</span>
                  <span>Extracted: {log.itemsExtracted} tools</span>
                  <span>Sent to: {log.deliveryTarget}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-950 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Next scheduled run:</strong> Monday, September 28, 2026 at 9:00 AM. The agent will read new emails marked <code className="font-mono text-amber-900">AI News</code> over the past 7 days and compile the 5-component report.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
