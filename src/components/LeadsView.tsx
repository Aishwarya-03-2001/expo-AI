import React, { useState } from 'react';
import { Search, Filter, Flame, Mail, Phone, Building, User, ChevronRight, Plus, Download, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Lead, Potential } from '../types';

interface LeadsViewProps {
  leads: Lead[];
  onSelectLead: (leadId: string) => void;
  onOpenNewLeadModal: () => void;
  onOpenEmailModal: (lead: Lead) => void;
}

export const LeadsView: React.FC<LeadsViewProps> = ({
  leads,
  onSelectLead,
  onOpenNewLeadModal,
  onOpenEmailModal,
}) => {
  const [activeTab, setActiveTab] = useState<Potential | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const industries = ['All', ...Array.from(new Set(leads.map(l => l.industry)))];
  const countries = ['All', ...Array.from(new Set(leads.map(l => l.country)))];

  const filteredLeads = leads.filter(lead => {
    if (activeTab !== 'All' && lead.potential !== activeTab) return false;
    if (selectedIndustry !== 'All' && lead.industry !== selectedIndustry) return false;
    if (selectedCountry !== 'All' && lead.country !== selectedCountry) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = lead.fullName.toLowerCase().includes(q);
      const companyMatch = lead.company.toLowerCase().includes(q);
      const emailMatch = lead.email.toLowerCase().includes(q);
      const phoneMatch = lead.phone.toLowerCase().includes(q);
      return nameMatch || companyMatch || emailMatch || phoneMatch;
    }
    return true;
  });

  const handleExportCSV = () => {
    const headers = ['Full Name', 'Company', 'Job Title', 'Email', 'Phone', 'Country', 'Industry', 'Potential', 'Score', 'Deal Value'];
    const rows = filteredLeads.map(l => [
      `"${l.fullName}"`,
      `"${l.company}"`,
      `"${l.jobTitle}"`,
      `"${l.email}"`,
      `"${l.phone}"`,
      `"${l.country}"`,
      `"${l.industry}"`,
      `"${l.potential}"`,
      l.leadScore,
      `"${l.dealValue}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ADIPEC_Leads_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 pb-20 font-sans">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Leads Directory</h2>
          <p className="text-xs text-slate-500">{filteredLeads.length} prospects captured at ADIPEC</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={onOpenNewLeadModal}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transform active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Lead</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 pb-2 text-xs font-bold overflow-x-auto">
        {(['All', 'Hot', 'Warm', 'Cold', 'Not Interested'] as const).map((tab) => {
          const count = tab === 'All' ? leads.length : leads.filter(l => l.potential === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab === 'Hot' ? '🔥 Hot' : tab} ({count})
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, company, email..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              showFilters
                ? 'bg-blue-50 border-blue-600 text-blue-600'
                : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filter Drawer */}
        {showFilters && (
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Industry</label>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 bg-white text-slate-900"
              >
                {industries.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Country</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 bg-white text-slate-900"
              >
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Leads Cards List */}
      <div className="space-y-3">
        {filteredLeads.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
            No prospects found matching filters.
          </div>
        ) : (
          filteredLeads.map((lead) => (
            <div
              key={lead.id}
              onClick={() => onSelectLead(lead.id)}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-blue-500 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-50 border border-slate-200 flex items-center justify-center font-bold text-blue-600 text-base flex-shrink-0 overflow-hidden">
                  {lead.photos && lead.photos[0] ? (
                    <img src={lead.photos[0]} alt={lead.fullName} className="w-full h-full object-cover" />
                  ) : (
                    lead.fullName.charAt(0)
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                      {lead.fullName}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      lead.potential === 'Hot' ? 'bg-rose-100 text-rose-800' :
                      lead.potential === 'Warm' ? 'bg-amber-100 text-amber-800' :
                      'bg-sky-100 text-sky-800'
                    }`}>
                      {lead.potential}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 font-medium">
                    {lead.jobTitle} • <strong className="text-slate-800">{lead.company}</strong>
                  </p>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                    <span>{lead.industry}</span>
                    <span>•</span>
                    <span>{lead.country}</span>
                    <span>•</span>
                    <span className="text-emerald-600 font-bold">{lead.dealValue} Deal</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <button
                  onClick={(e) => { e.stopPropagation(); onOpenEmailModal(lead); }}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold flex items-center gap-1"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email AI</span>
                </button>

                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
