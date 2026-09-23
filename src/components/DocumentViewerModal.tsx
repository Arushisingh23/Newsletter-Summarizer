import { useState } from 'react';
import { 
  X, 
  FileText, 
  Printer, 
  Download, 
  Copy, 
  Check, 
  Bookmark, 
  Clock, 
  ExternalLink,
  Share2,
  FileDown
} from 'lucide-react';
import { NewsletterSummaryItem } from '../types';
import { exportSummaryToPDF } from '../lib/pdfExport';

interface DocumentViewerModalProps {
  item: NewsletterSummaryItem | null;
  isOpen: boolean;
  onClose: () => void;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
}

export function DocumentViewerModal({
  item,
  isOpen,
  onClose,
  isBookmarked = false,
  onToggleBookmark,
}: DocumentViewerModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !item) return null;

  const handlePrint = () => {
    exportSummaryToPDF(item);
  };

  const handleDownloadTxt = () => {
    const textContent = `=======================================================
${item.title.toUpperCase()}
=======================================================
Category: ${item.category}
Source: ${item.source}
Read Time: ${item.readTime || '2 min read'}
Date Generated: ${new Date(item.createdAt || Date.now()).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })}

-------------------------------------------------------
EXECUTIVE SUMMARY
-------------------------------------------------------
${item.summary}

-------------------------------------------------------
KEY HIGHLIGHTS & TAKEAWAYS
-------------------------------------------------------
${item.keyPoints && item.keyPoints.length > 0
  ? item.keyPoints.map((pt, i) => `${i + 1}. ${pt}`).join('\n')
  : '• No bullet points provided.'}

-------------------------------------------------------
WHY IT MATTERS
-------------------------------------------------------
${item.whyItMatters}

=======================================================
Summarized by Newsletter Summarizer
=======================================================
`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${item.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_summary.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyText = async () => {
    const textToCopy = `${item.title}\n\nSummary:\n${item.summary}\n\nHighlights:\n${(item.keyPoints || []).map(p => `• ${p}`).join('\n')}\n\nWhy It Matters:\n${item.whyItMatters}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150 font-sans">
      <div className="bg-[#FFFDFB] rounded-3xl max-w-2xl w-full border-2 border-stone-900 shadow-[8px_8px_0px_0px_#1c1917] overflow-hidden my-6 flex flex-col max-h-[90vh]">
        
        {/* Document Top Action Toolbar */}
        <div className="p-4 sm:px-6 border-b-2 border-stone-900 bg-[#FFF5F8] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pink-500 text-white flex items-center justify-center font-black text-sm border-1.5 border-stone-900 shadow-[2px_2px_0px_0px_#1c1917]">
              📄
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-pink-900 bg-pink-100 px-2 py-0.5 rounded-md border border-pink-200">
                  Summary Document
                </span>
                <span className="text-[11px] text-stone-500 font-bold hidden sm:inline">
                  Ready to read, copy, or print
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Copy Button */}
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 border-1.5 border-stone-900 text-stone-900 font-bold text-xs shadow-[1px_1px_0px_0px_#1c1917] transition-all active:scale-95"
              title="Copy formatted summary to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-700" />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            {/* Print / PDF Button */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-200 hover:bg-pink-300 border-1.5 border-stone-900 text-stone-900 font-bold text-xs shadow-[1px_1px_0px_0px_#1c1917] transition-all active:scale-95"
              title="Print document or save as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-pink-800" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>

            {/* Download TXT */}
            <button
              onClick={handleDownloadTxt}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 border-1.5 border-stone-900 text-stone-900 font-bold text-xs shadow-[1px_1px_0px_0px_#1c1917] transition-all active:scale-95"
              title="Download text file (.txt)"
            >
              <Download className="w-3.5 h-3.5 text-stone-700" />
              <span className="hidden md:inline">Download</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white border-1.5 border-stone-900 hover:bg-stone-100 text-stone-900 transition-colors shadow-[1px_1px_0px_0px_#1c1917] ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Paper Document Canvas View */}
        <div className="p-6 sm:p-8 overflow-y-auto bg-white flex-1 space-y-6">
          {/* Simulated Printed Page Header */}
          <div className="border-b-2 border-stone-900 pb-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-pink-100 border border-pink-300 text-pink-900 text-[11px] font-black uppercase tracking-wider">
                  {item.category}
                </span>
                <span className="text-xs font-bold text-stone-500">
                  Source: <strong className="text-stone-800">{item.source}</strong>
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-stone-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  {item.readTime || '2 min read'}
                </span>
                <span>•</span>
                <span>
                  {new Date(item.createdAt || Date.now()).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-stone-950 tracking-tight leading-snug">
              {item.title}
            </h1>
          </div>

          {/* Document Section: Executive Summary */}
          <div className="space-y-2">
            <h2 className="text-[11px] font-black uppercase tracking-wider text-pink-800">
              Executive Summary
            </h2>
            <p className="text-base text-stone-900 leading-relaxed font-medium bg-[#FFFDFB] p-4 rounded-2xl border border-stone-200">
              {item.summary}
            </p>
          </div>

          {/* Document Section: Key Highlights & Takeaways */}
          {item.keyPoints && item.keyPoints.length > 0 && (
            <div className="space-y-2.5">
              <h2 className="text-[11px] font-black uppercase tracking-wider text-pink-800">
                Key Highlights & Takeaways
              </h2>
              <div className="bg-[#FFF5F8] border-1.5 border-pink-200 rounded-2xl p-4 sm:p-5">
                <ul className="space-y-2.5">
                  {item.keyPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-stone-900 font-medium text-sm leading-relaxed">
                      <span className="w-5 h-5 rounded-full bg-pink-300 text-stone-950 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5 border border-stone-900">
                        {i + 1}
                      </span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Document Section: Why It Matters */}
          <div className="space-y-2">
            <h2 className="text-[11px] font-black uppercase tracking-wider text-stone-900">
              Why This Matters
            </h2>
            <div className="bg-white border-2 border-stone-900 rounded-2xl p-4 shadow-[2px_2px_0px_0px_#1c1917]">
              <p className="text-sm font-medium text-stone-800 leading-relaxed">
                {item.whyItMatters}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="p-4 sm:px-6 bg-[#FFFDFB] border-t-2 border-stone-900 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-stone-500 font-bold">
            Summary saved in your library
          </div>

          <div className="flex items-center gap-2">
            {onToggleBookmark && (
              <button
                onClick={onToggleBookmark}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 border-stone-900 text-xs font-black transition-all ${
                  isBookmarked
                    ? 'bg-pink-300 text-stone-900 shadow-[2px_2px_0px_0px_#1c1917]'
                    : 'bg-white hover:bg-stone-50 text-stone-800 shadow-[2px_2px_0px_0px_#1c1917]'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-stone-900' : ''}`} />
                <span>{isBookmarked ? 'Saved for Later' : 'Save for Later'}</span>
              </button>
            )}

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-400 text-white font-black text-xs border-2 border-stone-900 shadow-[2px_2px_0px_0px_#1c1917] transition-all active:scale-95"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
