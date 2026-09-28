import React, { useState } from 'react';
import { Shield, Users, Database, FileText, Settings, Download, Plus, Save, Trash2, CheckCircle2 } from 'lucide-react';
import { User, Lead, EmailTemplate } from '../types';

interface AdminPortalViewProps {
  users: User[];
  leads: Lead[];
  emailTemplates: EmailTemplate[];
  onSaveTemplates: (templates: EmailTemplate[]) => void;
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({
  users,
  leads,
  emailTemplates,
  onSaveTemplates,
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'leads' | 'templates' | 'aiConfig'>('leads');
  const [templatesList, setTemplatesList] = useState<EmailTemplate[]>(emailTemplates);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [aiSystemPrompt, setAiSystemPrompt] = useState(
    'You are ExpoConnect AI running at ADIPEC 2026. Focus on identifying high decision-maker authority, predictive maintenance needs, and immediate buying timelines.'
  );

  const handleTemplateSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTemplate) {
      const updated = templatesList.map(t => t.id === editingTemplate.id ? editingTemplate : t);
      setTemplatesList(updated);
      onSaveTemplates(updated);
      setEditingTemplate(null);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
            <Shield className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Enterprise Admin Portal</h2>
            <p className="text-xs text-slate-500">Global booth controls, user permissions & AI configurations</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-xs font-bold">
          Admin Access Granted
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('leads')}
          className={`px-3 py-2 rounded-xl flex items-center gap-1.5 ${
            activeTab === 'leads' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Lead Master Table</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-3 py-2 rounded-xl flex items-center gap-1.5 ${
            activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Management</span>
        </button>

        <button
          onClick={() => setActiveTab('templates')}
          className={`px-3 py-2 rounded-xl flex items-center gap-1.5 ${
            activeTab === 'templates' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Email Templates</span>
        </button>

        <button
          onClick={() => setActiveTab('aiConfig')}
          className={`px-3 py-2 rounded-xl flex items-center gap-1.5 ${
            activeTab === 'aiConfig' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>AI Settings</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'leads' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-md">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Company</th>
                <th className="p-3">Industry</th>
                <th className="p-3">Potential</th>
                <th className="p-3">AI Score</th>
                <th className="p-3">Assigned Sales Rep</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {leads.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-bold">{l.fullName}</td>
                  <td className="p-3">{l.company}</td>
                  <td className="p-3">{l.industry}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800">
                      {l.potential}
                    </span>
                  </td>
                  <td className="p-3 font-extrabold text-blue-600">{l.leadScore}/100</td>
                  <td className="p-3">{l.assignedTo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users.map((u) => (
            <div key={u.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex items-center gap-3">
              <img src={u.avatar} alt={u.name} className="w-12 h-12 rounded-2xl object-cover" />
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{u.name}</h4>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{u.role}</p>
                <p className="text-[11px] text-slate-400">{u.email} • {u.boothId}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templatesList.map((tpl) => (
              <div key={tpl.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                  <span>{tpl.name}</span>
                  <button onClick={() => setEditingTemplate(tpl)} className="text-blue-600 font-semibold hover:underline">
                    Edit
                  </button>
                </div>
                <p className="text-slate-500 font-semibold">{tpl.subject}</p>
                <p className="text-slate-600 dark:text-slate-400 line-clamp-3 bg-slate-50 dark:bg-slate-800 p-2 rounded-xl">
                  {tpl.body}
                </p>
              </div>
            ))}
          </div>

          {editingTemplate && (
            <form onSubmit={handleTemplateSave} className="p-4 bg-white dark:bg-slate-900 border border-blue-500 rounded-2xl space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white">Edit Template: {editingTemplate.name}</h4>
              <input
                type="text"
                value={editingTemplate.subject}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, subject: e.target.value })}
                className="w-full p-2 border rounded-xl bg-slate-50 dark:bg-slate-800"
              />
              <textarea
                rows={5}
                value={editingTemplate.body}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, body: e.target.value })}
                className="w-full p-2 border rounded-xl bg-slate-50 dark:bg-slate-800"
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setEditingTemplate(null)} className="px-3 py-1 font-semibold text-slate-500">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-blue-600 text-white font-bold rounded-xl">Save Template</button>
              </div>
            </form>
          )}
        </div>
      )}

      {activeTab === 'aiConfig' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">AI Model Rules & Scoring System Prompt</h3>
          <p className="text-slate-500">Configure global Gemini AI scoring thresholds for exhibition leads</p>

          <textarea
            rows={4}
            value={aiSystemPrompt}
            onChange={(e) => setAiSystemPrompt(e.target.value)}
            className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs"
          />

          <button className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2">
            <Save className="w-4 h-4" />
            <span>Update Global AI Rules</span>
          </button>
        </div>
      )}
    </div>
  );
};
