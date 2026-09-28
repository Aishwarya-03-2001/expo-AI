import React, { useState } from 'react';
import { X, Mail, Sparkles, Copy, Check, Send, Save, Edit3, RefreshCw } from 'lucide-react';
import { Lead } from '../types';

interface EmailGeneratorModalProps {
  lead: Lead;
  senderName: string;
  onClose: () => void;
  onSendEmail: (subject: string, body: string) => void;
  onSaveTemplate?: (name: string, subject: string, body: string) => void;
  onOpenMeetingRequestModal?: () => void;
}

export const EmailGeneratorModal: React.FC<EmailGeneratorModalProps> = ({
  lead,
  senderName,
  onClose,
  onSendEmail,
  onSaveTemplate,
  onOpenMeetingRequestModal,
}) => {
  const [subject, setSubject] = useState(
    `Great meeting you at ADIPEC 2026 - ${lead.company}`
  );
  const [body, setBody] = useState(
    `Hi ${lead.fullName.split(' ')[0] || lead.fullName},\n\nIt was a pleasure meeting you during ADIPEC 2026 at Abu Dhabi.\n\nThank you for taking the time to discuss ${lead.company}'s digital transformation and operational efficiency goals.\n\nBased on our conversation regarding ${lead.interests.join(', ')}, I believe our AI-powered predictive maintenance platform can significantly improve operational uptime and prevent unexpected asset failures.\n\nAs discussed, I would be delighted to schedule a detailed demonstration next week at your convenience.\n\nLooking forward to connecting soon.\n\nBest regards,\n${senderName}\nExpoConnect AI Team`
  );

  const [customInstruction, setCustomInstruction] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead,
          customInstruction,
          senderName,
        }),
      });
      const data = await response.json();
      if (data.data) {
        setSubject(data.data.subject);
        setBody(data.data.body);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = () => {
    setSentSuccess(true);
    onSendEmail(subject, body);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">AI Follow-up Email Generator</h3>
              <p className="text-slate-500 text-xs">Personalized follow-up for {lead.fullName} ({lead.company})</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto max-h-[72vh]">
          {/* Post-ADIPEC Meeting Banner */}
          {onOpenMeetingRequestModal && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-900 block">Need to schedule a Post-ADIPEC follow-up?</span>
                <span className="text-[10px] text-indigo-700">Send an interactive email with Date & Time selection.</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenMeetingRequestModal();
                }}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs whitespace-nowrap"
              >
                Open Meeting Request
              </button>
            </div>
          )}

          {/* Custom Instruction Prompt */}
          <div className="bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-2xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-500" /> Refine Email Tone or Add Context
              </span>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm"
              >
                {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Regenerate Email</span>
              </button>
            </div>
            <input
              type="text"
              value={customInstruction}
              onChange={(e) => setCustomInstruction(e.target.value)}
              placeholder="e.g. Emphasize $750k budget savings, ask for Tuesday 11 AM VIP lounge meeting..."
              className="w-full px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800/60 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          {/* Email Subject */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subject Line</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-xs"
            />
          </div>

          {/* Email Body Editor */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Email Message Body</label>
              <button
                onClick={handleCopy}
                className="text-xs text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1 hover:underline"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
              </button>
            </div>
            <textarea
              rows={10}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-sans leading-relaxed"
            />
          </div>

          {sentSuccess && (
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 border border-emerald-300">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Email sent successfully & recorded in lead timeline!</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
          <div className="flex gap-2">
            {onSaveTemplate && (
              <button
                type="button"
                onClick={() => onSaveTemplate(`ADIPEC Template (${lead.company})`, subject, body)}
                className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Template</span>
              </button>
            )}
            <button
              onClick={() => window.open(`mailto:${lead.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)}
              className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Open Mail App</span>
            </button>
          </div>

          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-500">
              Cancel
            </button>
            <button
              onClick={handleSend}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 transform active:scale-95 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Send Follow-up Email</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
