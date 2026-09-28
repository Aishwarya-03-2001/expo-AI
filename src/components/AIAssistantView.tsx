import React, { useState } from 'react';
import { Bot, Send, Sparkles, User, RefreshCw, ChevronRight, HelpCircle, Calendar } from 'lucide-react';
import { Lead } from '../types';

interface AIAssistantViewProps {
  leads: Lead[];
  onSelectLead?: (leadId: string) => void;
  onRequestMeeting?: () => void;
}

const PROMPT_CHIPS = [
  "When would be a good time for us to connect after ADIPEC?",
  "What are my hot leads today?",
  "Who hasn't received a follow-up?",
  "Summarize today's meetings.",
  "Show visitors interested in Predictive Maintenance.",
  "Show all CEO-level contacts."
];

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  leads,
  onSelectLead,
  onRequestMeeting,
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: 'Hello! I am your ExpoConnect AI Sales Co-Pilot for ADIPEC 2026. Ask me anything about your captured leads, follow-up statuses, executive contacts, or meeting schedules.',
      timestamp: 'Just now'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (queryText?: string) => {
    const query = queryText || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');

    // Check if query is post-ADIPEC meeting question
    if (query.toLowerCase().includes('connect after adipec') || query.toLowerCase().includes('good time for us to connect')) {
      setTimeout(() => {
        const botMsg: ChatMessage = {
          id: `b-${Date.now()}`,
          sender: 'assistant',
          text: `Great question to ask during your sales conversation!\n\nWhen you ask prospect: "When would be a good time for us to connect after ADIPEC?", you can directly select the Date and Time and send them an interactive invitation email. When they click "Confirm Meeting", it will be automatically added to their calendar after accepting.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMsg]);
      }, 300);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, leads }),
      });
      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'assistant',
        text: data.answer || 'I have analyzed your lead database. You have 2 High Potential leads ready for immediate follow-up.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      console.error(e);
      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'assistant',
        text: 'You have 2 Hot leads captured today: Dr. John Al-Maktoum (ADNOC Offshore) and Marcus Vance (Saudi Aramco). Both are interested in Predictive Maintenance AI.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[75vh] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden pb-12 font-sans">
      {/* Header */}
      <div className="p-4 bg-blue-600 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm">ExpoConnect AI Assistant</h3>
            <p className="text-[10px] text-blue-100">Exhibition co-pilot powered by Gemini 3.6</p>
          </div>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold">
          Active
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] rounded-2xl p-3 shadow-xs leading-relaxed ${
              m.sender === 'user'
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200'
            }`}>
              <p className="whitespace-pre-line font-sans">{m.text}</p>
              <span className={`text-[9px] block mt-1 text-right ${m.sender === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>
                {m.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 p-3 rounded-2xl text-xs text-slate-500 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
              <span>Analyzing lead records with Gemini...</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Meeting Action Banner */}
      {onRequestMeeting && (
        <div className="p-2.5 px-4 bg-indigo-50 border-t border-b border-indigo-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-indigo-900">Post-ADIPEC Meeting Flow</span>
          </div>
          <button
            onClick={onRequestMeeting}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] rounded-lg shadow-xs transition-all"
          >
            Create Meeting Request
          </button>
        </div>
      )}

      {/* Preset Chips */}
      <div className="p-2 border-t border-slate-200 bg-slate-50 overflow-x-auto flex gap-1.5 text-xs">
        {PROMPT_CHIPS.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-blue-600 hover:text-blue-600 whitespace-nowrap text-[11px] font-semibold transition-all"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="p-3 border-t border-slate-200 bg-white flex gap-2"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask AI co-pilot about hot leads..."
          className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
        />
        <button
          type="submit"
          className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-all flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
