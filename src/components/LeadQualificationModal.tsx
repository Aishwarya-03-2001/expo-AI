import React, { useState } from 'react';
import { X, Sparkles, Check, Flame, Clock, DollarSign, Award, ShieldAlert, ChevronRight } from 'lucide-react';
import { Lead, Industry, InterestOption, Potential, BuyingTimeline, DealValue, Priority } from '../types';

interface LeadQualificationModalProps {
  initialData?: Partial<Lead>;
  onClose: () => void;
  onSaveLead: (leadData: Partial<Lead>) => void;
}

const INDUSTRIES: Industry[] = [
  'Oil & Gas',
  'Energy',
  'Manufacturing',
  'Utilities',
  'AI',
  'Government',
  'Construction',
  'Other',
];

const INTERESTS: InterestOption[] = [
  'Predictive Maintenance',
  'AI Solutions',
  'Asset Management',
  'ERP',
  'Digital Twin',
  'Analytics',
  'Industrial IoT',
  'Sustainability',
];

const BUYING_TIMELINES: BuyingTimeline[] = ['Immediate', '1 Month', '3 Months', '6 Months', 'Next Year'];
const DEAL_VALUES: DealValue[] = ['Small', 'Medium', 'Large', 'Enterprise'];
const PRIORITIES: Priority[] = ['High', 'Medium', 'Low'];

export const LeadQualificationModal: React.FC<LeadQualificationModalProps> = ({
  initialData,
  onClose,
  onSaveLead,
}) => {
  const [fullName, setFullName] = useState(initialData?.fullName || '');
  const [company, setCompany] = useState(initialData?.company || '');
  const [jobTitle, setJobTitle] = useState(initialData?.jobTitle || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [website, setWebsite] = useState(initialData?.website || '');
  const [country, setCountry] = useState(initialData?.country || 'United Arab Emirates');

  const [industry, setIndustry] = useState<Industry>(initialData?.industry || 'Oil & Gas');
  const [interests, setInterests] = useState<InterestOption[]>(
    initialData?.interests || ['Predictive Maintenance', 'AI Solutions']
  );
  const [potential, setPotential] = useState<Potential>(initialData?.potential || 'Hot');
  const [decisionMaker, setDecisionMaker] = useState<boolean>(initialData?.decisionMaker ?? true);
  const [buyingTimeline, setBuyingTimeline] = useState<BuyingTimeline>(
    initialData?.buyingTimeline || 'Immediate'
  );
  const [dealValue, setDealValue] = useState<DealValue>(initialData?.dealValue || 'Large');
  const [priority, setPriority] = useState<Priority>(initialData?.priority || 'High');
  const [notes, setNotes] = useState(initialData?.notes || '');

  const [calculatingScore, setCalculatingScore] = useState(false);
  const [calculatedScore, setCalculatedScore] = useState<{
    score: number;
    category: 'High Potential' | 'Medium Potential' | 'Low Potential';
    reasoning: string;
  } | null>(null);

  const toggleInterest = (opt: InterestOption) => {
    if (interests.includes(opt)) {
      setInterests(interests.filter((i) => i !== opt));
    } else {
      setInterests([...interests, opt]);
    }
  };

  const handleCalculateScore = async () => {
    setCalculatingScore(true);
    try {
      const response = await fetch('/api/score-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead: {
            fullName,
            company,
            jobTitle,
            industry,
            interests,
            buyingTimeline,
            decisionMaker,
            dealValue,
            notes,
          },
        }),
      });
      const data = await response.json();
      if (data.data) {
        setCalculatedScore(data.data);
      }
    } catch (e) {
      console.error(e);
      let base = 60;
      if (decisionMaker) base += 20;
      if (buyingTimeline === 'Immediate') base += 15;
      setCalculatedScore({
        score: base,
        category: base >= 80 ? 'High Potential' : 'Medium Potential',
        reasoning: 'Calculated using decision maker authority and immediate ADIPEC timeline requirements.',
      });
    } finally {
      setCalculatingScore(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalScore = calculatedScore?.score ?? (decisionMaker && buyingTimeline === 'Immediate' ? 90 : 70);
    const category = calculatedScore?.category ?? (finalScore >= 80 ? 'High Potential' : 'Medium Potential');

    onSaveLead({
      fullName: fullName || 'New Visitor',
      company: company || 'Exhibition Prospect',
      jobTitle,
      email,
      phone,
      website,
      country,
      industry,
      interests,
      potential,
      decisionMaker,
      buyingTimeline,
      dealValue,
      priority,
      leadScore: finalScore,
      scoreCategory: category,
      scoreReasoning: calculatedScore?.reasoning,
      notes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Quick Lead Qualification (&lt; 2 mins)</h3>
              <p className="text-slate-500 text-xs">Score lead value & set buying priorities instantly</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form id="qualification-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Quick Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. John Al-Maktoum"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Company *</label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="ADNOC Offshore"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Job Title</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="VP Digital Operations"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@adnoc.ae"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* 1. Industry */}
          <div>
            <label className="block font-bold text-xs text-slate-900 dark:text-white mb-2">1. Industry</label>
            <div className="flex flex-wrap gap-2">
              {INDUSTRIES.map((ind) => (
                <button
                  type="button"
                  key={ind}
                  onClick={() => setIndustry(ind)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    industry === ind
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                  }`}
                >
                  {ind}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Interests Multi-select */}
          <div>
            <label className="block font-bold text-xs text-slate-900 dark:text-white mb-2">
              2. Solutions & Product Interests (Multi-select)
            </label>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((opt) => {
                const selected = interests.includes(opt);
                return (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => toggleInterest(opt)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                      selected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                    }`}
                  >
                    {selected && <Check className="w-3.5 h-3.5" />}
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Potential */}
          <div>
            <label className="block font-bold text-xs text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500" /> 3. Potential Rating
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['Hot', 'Warm', 'Cold', 'Not Interested'] as Potential[]).map((p) => {
                const active = potential === p;
                const colors = {
                  Hot: 'bg-rose-500 text-white border-rose-500',
                  Warm: 'bg-amber-500 text-white border-amber-500',
                  Cold: 'bg-sky-500 text-white border-sky-500',
                  'Not Interested': 'bg-slate-500 text-white border-slate-500',
                };
                return (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPotential(p)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all text-center ${
                      active
                        ? `${colors[p]} shadow-md`
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Decision Maker & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-xs text-slate-900 dark:text-white mb-2">4. Decision Maker Status</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDecisionMaker(true)}
                  className={`py-2 rounded-xl text-xs font-bold border ${
                    decisionMaker
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  Yes (Executive / Decision Maker)
                </button>
                <button
                  type="button"
                  onClick={() => setDecisionMaker(false)}
                  className={`py-2 rounded-xl text-xs font-bold border ${
                    !decisionMaker
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  No (Evaluator / Influencer)
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-xs text-slate-900 dark:text-white mb-2">Priority Level</label>
              <div className="grid grid-cols-3 gap-2">
                {PRIORITIES.map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`py-2 rounded-xl text-xs font-bold border ${
                      priority === p
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 5. Buying Timeline & Deal Value */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-xs text-slate-900 dark:text-white mb-2 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-500" /> Buying Timeline
              </label>
              <select
                value={buyingTimeline}
                onChange={(e) => setBuyingTimeline(e.target.value as BuyingTimeline)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
              >
                {BUYING_TIMELINES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-xs text-slate-900 dark:text-white mb-2 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> Estimated Deal Value
              </label>
              <select
                value={dealValue}
                onChange={(e) => setDealValue(e.target.value as DealValue)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
              >
                {DEAL_VALUES.map((d) => (
                  <option key={d} value={d}>
                    {d} ({d === 'Enterprise' ? '$500k+' : d === 'Large' ? '$200k-$500k' : d === 'Medium' ? '$50k-$200k' : '$10k-$50k'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* AI Score Calculation Card */}
          <div className="bg-gradient-to-br from-blue-900/10 via-indigo-900/10 to-slate-900/10 border border-blue-500/20 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>AI Lead Score Prediction (0-100)</span>
              </div>
              <button
                type="button"
                onClick={handleCalculateScore}
                disabled={calculatingScore}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
              >
                {calculatingScore ? 'Calculating...' : 'Recalculate AI Score'}
              </button>
            </div>

            {calculatedScore && (
              <div className="mt-2 flex items-center gap-4 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="w-14 h-14 rounded-full bg-blue-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md">
                  {calculatedScore.score}
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
                    {calculatedScore.category}
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{calculatedScore.reasoning}</p>
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
          <button type="button" onClick={onClose} className="text-xs font-semibold text-slate-500">
            Cancel
          </button>
          <button
            type="submit"
            form="qualification-form"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 transform active:scale-95 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Save Qualified Lead</span>
          </button>
        </div>
      </div>
    </div>
  );
};
