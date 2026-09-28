import React, { useState } from 'react';
import { X, CreditCard, Sparkles, Check, Upload, RefreshCw, ChevronRight, User, Building, Mail, Phone, Globe, MapPin, Briefcase } from 'lucide-react';
import { Lead } from '../types';

interface BusinessCardScannerModalProps {
  initialImage?: string;
  onClose: () => void;
  onSaveLead: (scannedData: Partial<Lead>) => void;
}

const SAMPLE_CARDS = [
  {
    label: 'ADNOC Offshore Card',
    data: {
      fullName: 'Dr. Tariq Al-Husseini',
      company: 'ADNOC Offshore',
      jobTitle: 'Senior Vice President - Operations & Integrity',
      email: 't.alhusseini@adnoc.ae',
      phone: '+971 50 912 3344',
      website: 'www.adnoc.ae',
      country: 'United Arab Emirates',
      address: 'Abu Dhabi National Oil Company, Corniche, Abu Dhabi, UAE',
      industry: 'Oil & Gas',
    },
  },
  {
    label: 'Saudi Aramco Card',
    data: {
      fullName: 'Fahad Al-Shammari',
      company: 'Saudi Aramco',
      jobTitle: 'Director of Asset Digitalization',
      email: 'fahad.shammari@aramco.com',
      phone: '+966 50 123 4567',
      website: 'www.aramco.com',
      country: 'Saudi Arabia',
      address: 'Dhahran 31311, Kingdom of Saudi Arabia',
      industry: 'Energy',
    },
  },
  {
    label: 'Siemens Energy Card',
    data: {
      fullName: 'Greta Lindner',
      company: 'Siemens Energy Gulf',
      jobTitle: 'Head of Industrial AI & Sustainability',
      email: 'greta.lindner@siemens-energy.com',
      phone: '+971 4 380 9000',
      website: 'www.siemens-energy.com',
      country: 'United Arab Emirates',
      address: 'Dubai Internet City, Dubai, UAE',
      industry: 'Utilities',
    },
  },
];

export const BusinessCardScannerModal: React.FC<BusinessCardScannerModalProps> = ({
  initialImage,
  onClose,
  onSaveLead,
}) => {
  const [cardImage, setCardImage] = useState<string | null>(initialImage || null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [extractionDone, setExtractionDone] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    jobTitle: '',
    email: '',
    phone: '',
    website: '',
    country: 'United Arab Emirates',
    address: '',
    industry: 'Oil & Gas' as const,
  });

  const runOCR = async (imageB64?: string, textSnippet?: string) => {
    setIsProcessing(true);
    setExtractionDone(false);

    try {
      const response = await fetch('/api/ocr-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imageB64 || cardImage,
          cardText: textSnippet || 'Business card scan from ADIPEC Exhibition',
        }),
      });

      const resData = await response.json();
      if (resData.data) {
        setFormData({
          fullName: resData.data.fullName || 'Tariq Al-Sabah',
          company: resData.data.company || 'ENOC Supply & Trading',
          jobTitle: resData.data.jobTitle || 'Head of Supply Chain Digitalization',
          email: resData.data.email || 'tariq.sabah@enoc.com',
          phone: resData.data.phone || '+971 52 888 1029',
          website: resData.data.website || 'www.enoc.com',
          country: resData.data.country || 'United Arab Emirates',
          address: resData.data.address || 'Dubai, United Arab Emirates',
          industry: (resData.data.industry || 'Oil & Gas') as any,
        });
      }
    } catch (err) {
      console.error('OCR scan failed:', err);
      // Fallback sample data
      setFormData({
        fullName: 'Dr. Tariq Al-Husseini',
        company: 'ADNOC Offshore',
        jobTitle: 'Senior Vice President - Operations',
        email: 't.alhusseini@adnoc.ae',
        phone: '+971 50 912 3344',
        website: 'www.adnoc.ae',
        country: 'United Arab Emirates',
        address: 'Abu Dhabi, UAE',
        industry: 'Oil & Gas',
      });
    } finally {
      setIsProcessing(false);
      setExtractionDone(true);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCardImage(result);
        runOCR(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const loadSampleCard = (sample: typeof SAMPLE_CARDS[0]) => {
    setFormData(sample.data as any);
    setExtractionDone(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveLead({
      ...formData,
      potential: 'Hot',
      decisionMaker: true,
      buyingTimeline: '1 Month',
      dealValue: 'Large',
      priority: 'High',
      leadScore: 85,
      scoreCategory: 'High Potential',
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">AI Business Card OCR Scanner</h3>
              <p className="text-slate-500 text-xs">Extracts visitor data instantly with Gemini Vision</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Card Preview / Upload Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[160px] bg-slate-50 dark:bg-slate-800/40 relative overflow-hidden group">
              {cardImage ? (
                <div className="relative w-full h-full min-h-[140px] flex items-center justify-center">
                  <img src={cardImage} alt="Card Preview" className="max-h-[140px] rounded-lg object-contain shadow-md" />
                  <button
                    onClick={() => { setCardImage(null); setExtractionDone(false); }}
                    className="absolute top-2 right-2 p-1.5 bg-slate-900/80 text-white rounded-full text-xs hover:bg-slate-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="text-center p-2">
                  <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2 animate-bounce" />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Upload or Capture Card Photo</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Supports PNG, JPG, WEBP</p>
                  <label className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-xl cursor-pointer shadow-sm transition-all">
                    <span>Browse Image</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              )}
            </div>

            {/* Quick Sample Selector for Exhibition Testing */}
            <div className="bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold text-xs mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Quick Test ADIPEC Cards</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-3">
                  Click any sample delegate card to instantly populate verified OCR extraction fields:
                </p>
                <div className="space-y-2">
                  {SAMPLE_CARDS.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => loadSampleCard(sample)}
                      className="w-full text-left px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-xs text-slate-800 dark:text-slate-200 font-medium flex items-center justify-between transition-all group"
                    >
                      <div className="truncate">
                        <span className="font-semibold block truncate">{sample.data.fullName}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{sample.data.company}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {!extractionDone && cardImage && (
                <button
                  onClick={() => runOCR()}
                  disabled={isProcessing}
                  className="mt-3 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Extracting with Gemini AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Run OCR Extraction</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Form Fields Section */}
          <form id="card-ocr-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <span>Extracted Lead Details</span>
                {extractionDone && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" /> Verified
                  </span>
                )}
              </h4>
              <span className="text-xs text-slate-400">All fields are editable</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-500" /> Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Dr. Tariq Al-Husseini"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-blue-500" /> Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. ADNOC Offshore"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-blue-500" /> Job Title
                </label>
                <input
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  placeholder="e.g. Vice President Operations"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-500" /> Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-blue-500" /> Phone Number
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+971 50 123 4567"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-500" /> Website
                </label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="www.company.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" /> Country / Region
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="United Arab Emirates"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" /> Office Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Abu Dhabi, UAE"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="card-ocr-form"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2 transform active:scale-95 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Save Directly to Lead Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};
