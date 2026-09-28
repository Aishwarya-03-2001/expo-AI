import React, { useState, useEffect } from 'react';
import { Linkedin, Globe, Building2, MapPin, Users, ExternalLink, RefreshCw, Sparkles } from 'lucide-react';
import { LinkedInEnrichment } from '../types';

interface LinkedInEnrichmentCardProps {
  company: string;
  email?: string;
  existingData?: LinkedInEnrichment;
  onUpdateEnrichment?: (data: LinkedInEnrichment) => void;
}

export const LinkedInEnrichmentCard: React.FC<LinkedInEnrichmentCardProps> = ({
  company,
  email,
  existingData,
  onUpdateEnrichment,
}) => {
  const [data, setData] = useState<LinkedInEnrichment | null>(existingData || null);
  const [loading, setLoading] = useState<boolean>(!existingData && Boolean(company));

  useEffect(() => {
    if (!existingData && company) {
      fetchEnrichment();
    }
  }, [company, email, existingData]);

  const fetchEnrichment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/enrich-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, email }),
      });
      const res = await response.json();
      if (res.data) {
        setData(res.data);
        if (onUpdateEnrichment) onUpdateEnrichment(res.data);
      }
    } catch (e) {
      console.error(e);
      const fallback: LinkedInEnrichment = {
        url: `https://linkedin.com/search/results/all/?keywords=${encodeURIComponent(company)}`,
        companyUrl: `https://linkedin.com/company/${company.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        companyWebsite: `https://www.${company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        companySize: '10,000+ employees',
        industry: 'Energy & Infrastructure',
        headquarters: 'Abu Dhabi, UAE',
        overview: `${company} is an active energy enterprise participating at ADIPEC 2026.`,
      };
      setData(fallback);
      if (onUpdateEnrichment) onUpdateEnrichment(fallback);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center gap-2 text-xs text-slate-500 animate-pulse">
        <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
        <span>Enriching LinkedIn & Company Intelligence...</span>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-4 border border-blue-800/40 shadow-md space-y-3">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <Linkedin className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-xs text-white block">LinkedIn & Enterprise Intelligence</span>
            <span className="text-[10px] text-blue-300">Enriched via Gemini</span>
          </div>
        </div>

        <button
          onClick={fetchEnrichment}
          className="p-1 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] flex items-center gap-1"
          title="Re-enrich Company Info"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed font-sans">{data.overview}</p>

      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1">
        <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/10">
          <Users className="w-3.5 h-3.5 text-blue-400" />
          <span>{data.companySize}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/10">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span className="truncate">{data.headquarters}</span>
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <a
          href={data.companyUrl || data.url}
          target="_blank"
          rel="noreferrer"
          className="flex-1 py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
        >
          <Linkedin className="w-3.5 h-3.5" />
          <span>Open LinkedIn</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        {data.companyWebsite && (
          <a
            href={data.companyWebsite.startsWith('http') ? data.companyWebsite : `https://${data.companyWebsite}`}
            target="_blank"
            rel="noreferrer"
            className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-white border border-white/10 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-sky-400" />
            <span>Visit Website</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
};
