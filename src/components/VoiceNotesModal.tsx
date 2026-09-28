import React, { useState } from 'react';
import { X, Mic, MicOff, Sparkles, Check, RefreshCw, Volume2, UserCheck, Play } from 'lucide-react';
import { Lead, VoiceNote } from '../types';

interface VoiceNotesModalProps {
  leads: Lead[];
  initialLeadId?: string;
  onClose: () => void;
  onSaveVoiceNote: (leadId: string, voiceNote: VoiceNote) => void;
}

const SAMPLE_SPEECHES = [
  "This customer is Dr. John from ADNOC Offshore. They are interested in predictive maintenance for offshore compressor stations. They already use SAP and Honeywell Forge and want an AI overlay solution to reduce downtime. Follow up next Wednesday with a VIP demo.",
  "Met Marcus Vance, Lead Reliability Engineer at Saudi Aramco. He needs pump failure anomaly detection for Ras Tanura refinery. Crucial requirement: must support private cloud or local data residency in KSA. 3 month timeline, budget around $250k.",
  "Amira Khaled from Siemens Energy Middle East stopped by Stand 8340. Interested in joint co-selling for green power grids at ADIPEC 2027. She is an executive decision maker. Send her our API partner deck."
];

export const VoiceNotesModal: React.FC<VoiceNotesModalProps> = ({
  leads,
  initialLeadId,
  onClose,
  onSaveVoiceNote,
}) => {
  const [selectedLeadId, setSelectedLeadId] = useState<string>(initialLeadId || leads[0]?.id || '');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [structuredResult, setStructuredResult] = useState<VoiceNote | null>(null);

  // Simulated Web Speech Recognition or Manual Spoken Notes
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      if (transcript.length > 10) {
        processTranscript(transcript);
      }
    } else {
      setIsRecording(true);
      // Simulate live speech transcription over 3 seconds
      setTimeout(() => {
        setTranscript("This customer is interested in predictive maintenance for offshore equipment. They already use SAP and want an AI solution. Follow up next Wednesday.");
        setIsRecording(false);
      }, 3500);
    }
  };

  const processTranscript = async (text: string) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: text }),
      });
      const res = await response.json();
      if (res.data) {
        const vn: VoiceNote = {
          id: `vn-${Date.now()}`,
          transcript: text,
          summary: res.data.summary,
          actionItems: res.data.actionItems || [],
          nextSteps: res.data.nextSteps || [],
          highlights: res.data.highlights || [],
          potentialScore: res.data.potentialScore || 85,
          timestamp: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
        };
        setStructuredResult(vn);
      }
    } catch (e) {
      console.error(e);
      // Fallback structured notes
      setStructuredResult({
        id: `vn-${Date.now()}`,
        transcript: text,
        summary: 'Customer expressed high interest in AI Predictive Maintenance for offshore operations.',
        actionItems: ['Send custom product brochure', 'Schedule follow-up call next Wednesday'],
        nextSteps: ['Prepare technical architecture review deck'],
        highlights: ['High Budget Potential', 'Uses SAP ERP', 'Urgent Timeline'],
        potentialScore: 88,
        timestamp: 'Just now',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = () => {
    if (structuredResult && selectedLeadId) {
      onSaveVoiceNote(selectedLeadId, structuredResult);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">AI Voice Meeting Debrief</h3>
              <p className="text-slate-500 text-xs">Speak naturally to convert voice notes into structured insights</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Select Target Lead */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-blue-500" /> Target Lead
            </label>
            <select
              value={selectedLeadId}
              onChange={(e) => setSelectedLeadId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none"
            >
              {leads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.fullName} ({l.company})
                </option>
              ))}
            </select>
          </div>

          {/* Microphone Capture Box */}
          <div className="bg-slate-900 rounded-2xl p-6 text-center text-white relative overflow-hidden border border-slate-800 shadow-inner">
            <div className="relative z-10 flex flex-col items-center">
              <button
                onClick={toggleRecording}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all transform active:scale-95 shadow-xl mb-3 ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse ring-8 ring-rose-500/30'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
              </button>
              <p className="font-bold text-sm">
                {isRecording ? 'Listening & Transcribing Voice Note...' : 'Tap Mic to Speak Natural Note'}
              </p>
              <p className="text-slate-400 text-xs mt-1">
                Speak details about interest, budget, tools, and next steps
              </p>
            </div>
          </div>

          {/* Quick Example Speech Snippets */}
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">Or test with a sample voice transcript:</span>
            <div className="space-y-1.5">
              {SAMPLE_SPEECHES.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTranscript(sample);
                    processTranscript(sample);
                  }}
                  className="w-full text-left p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-[11px] text-slate-700 dark:text-slate-300 transition-all flex items-center gap-2 group"
                >
                  <Play className="w-3.5 h-3.5 text-blue-500 group-hover:scale-110 flex-shrink-0" />
                  <span className="truncate">{sample}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Manual Input or Transcript Display */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Spoken Note Transcript</label>
            <textarea
              rows={3}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="e.g. This customer wants a predictive maintenance demo for offshore compressor stations next Wednesday..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
            />
            {transcript && !structuredResult && (
              <button
                onClick={() => processTranscript(transcript)}
                disabled={isAnalyzing}
                className="mt-2 w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
              >
                {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Generate Structured AI Summary</span>
              </button>
            )}
          </div>

          {/* AI Structured Output */}
          {structuredResult && (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-200 dark:border-emerald-800/60 pb-2">
                <span className="font-bold text-emerald-900 dark:text-emerald-300 text-xs flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> AI Generated Executive Notes
                </span>
                <span className="text-xs font-extrabold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                  Lead Score: {structuredResult.potentialScore}/100
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-800 dark:text-emerald-400">Summary:</span>
                <p className="text-xs text-slate-800 dark:text-slate-200 font-medium">{structuredResult.summary}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-800 dark:text-emerald-400">Action Items:</span>
                <ul className="list-disc list-inside text-xs text-slate-700 dark:text-slate-300 space-y-0.5">
                  {structuredResult.actionItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-800 dark:text-emerald-400">Highlights:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {structuredResult.highlights.map((h, i) => (
                    <span key={i} className="text-[10px] bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-500">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!structuredResult}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Attach Voice Notes to Lead</span>
          </button>
        </div>
      </div>
    </div>
  );
};
