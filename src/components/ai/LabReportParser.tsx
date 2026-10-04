import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LabReport, Biomarker } from '../../types/health';
import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Volume2,
  Calendar,
  Layers,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

const SAMPLE_REPORTS_LIST = [
  {
    title: 'Comprehensive Metabolic & Lipid Panel',
    lab: 'Quest Diagnostics',
    category: 'lipid',
    rawText: `TEST NAME: COMPREHENSIVE METABOLIC & LIPID PANEL
PATIENT: Vance, Sophia · AGE: 34 · SEX: F
Total Cholesterol: 208 mg/dL (Ref: < 200 mg/dL) [HIGH]
HDL-C: 58 mg/dL (Ref: > 50 mg/dL) [NORMAL]
LDL-C: 128 mg/dL (Ref: < 100 mg/dL) [HIGH]
Triglycerides: 110 mg/dL (Ref: < 150 mg/dL) [NORMAL]
Fasting Glucose: 98 mg/dL (Ref: 70 - 99 mg/dL) [NORMAL]
HbA1c: 5.7 % (Ref: < 5.7 % Normal; 5.7-6.4 % Pre-Diabetes) [HIGH BORDERLINE]
Serum Creatinine: 0.85 mg/dL (Ref: 0.5 - 1.1 mg/dL) [NORMAL]
eGFR: 104 mL/min/1.73m2 (Ref: > 90 mL/min) [NORMAL]
hs-CRP: 1.1 mg/L (Ref: < 1.0 mg/L) [MODERATE]`,
  },
  {
    title: 'Complete Blood Count (CBC) with Platelets',
    lab: 'Metropolitan Health Pathology',
    category: 'blood',
    rawText: `TEST NAME: COMPLETE BLOOD COUNT (CBC)
Hemoglobin: 13.6 g/dL (Ref: 12.0 - 15.5 g/dL) [NORMAL]
Hematocrit: 41.2 % (Ref: 37.0 - 48.0 %) [NORMAL]
White Blood Cell (WBC): 6.4 x10^3/uL (Ref: 4.5 - 11.0 x10^3/uL) [NORMAL]
Red Blood Cell (RBC): 4.65 x10^6/uL (Ref: 4.0 - 5.2 x10^6/uL) [NORMAL]
Platelet Count: 265 x10^3/uL (Ref: 150 - 450 x10^3/uL) [NORMAL]
Neutrophils: 58 % (Ref: 40 - 70 %) [NORMAL]
Lymphocytes: 32 % (Ref: 20 - 45 %) [NORMAL]`,
  },
  {
    title: 'Thyroid Function Panel (TSH, Free T4)',
    lab: 'EndoDiagnostics Lab',
    category: 'hormone',
    rawText: `TEST NAME: THYROID COMPREHENSIVE PANEL
TSH (Thyroid Stimulating Hormone): 2.45 uIU/mL (Ref: 0.45 - 4.50 uIU/mL) [NORMAL]
Free T4 (Thyroxine): 1.22 ng/dL (Ref: 0.82 - 1.77 ng/dL) [NORMAL]
Free T3: 3.1 pg/mL (Ref: 2.0 - 4.4 pg/mL) [NORMAL]
Thyroglobulin Antibodies: Negative`,
  },
];

export const LabReportParser: React.FC = () => {
  const { labReports, addLabReport, speakText } = useApp();

  const [selectedReportId, setSelectedReportId] = useState<string>(labReports[0]?.id || '');
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [reportText, setReportText] = useState<string>('');
  const [reportTitle, setReportTitle] = useState<string>('');
  const [customFileBase64, setCustomFileBase64] = useState<string | null>(null);

  // Active view report
  const activeReport = labReports.find((r) => r.id === selectedReportId) || labReports[0];

  // Parse new report via Gemini API
  const handleParseReport = async () => {
    if (!reportText.trim() && !customFileBase64) return;
    setIsParsing(true);

    try {
      const res = await fetch('/api/parse-lab-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportText,
          reportTitle: reportTitle || 'Diagnostic Lab Panel',
          imageBase64: customFileBase64,
        }),
      });

      if (!res.ok) throw new Error('Lab report parsing error');
      const data = await res.json();

      const newReport: LabReport = {
        id: `lab_${Date.now()}`,
        title: data.reportTitle || reportTitle || 'Parsed Lab Report',
        date: new Date().toISOString().split('T')[0],
        labName: 'Uploaded / Analyzed Report',
        category: 'metabolic',
        summary: data.patientFriendlySummary,
        biomarkers: data.biomarkers || [],
        lifestyleAndDietGuidance: data.lifestyleAndDietGuidance || [],
        questionsForDoctor: data.questionsForDoctor || [],
        overallRisk: data.overallRisk || 'normal',
        verifiedByPhysician: false,
      };

      addLabReport(newReport);
      setSelectedReportId(newReport.id);
      setReportText('');
      setReportTitle('');
      setCustomFileBase64(null);

      speakText(`Lab report simplified successfully. Summary: ${data.patientFriendlySummary}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsParsing(false);
    }
  };

  const handleReadAloud = () => {
    if (!activeReport) return;
    const speech = `Laboratory Report: ${activeReport.title}. Summary: ${activeReport.summary}. Key guidance: ${activeReport.lifestyleAndDietGuidance.join('. ')}`;
    speakText(speech);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700">
            <FileText className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Lab Report Simplifier & Medical Vault
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              Demystifying complex diagnostic biomarkers into patient-friendly, reassuring clarity.
            </p>
          </div>
        </div>
      </div>

      {/* Main Vault Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (4 Cols): Report Vault List & Parse New */}
        <div className="lg:col-span-4 space-y-6">
          {/* Saved Reports Vault */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900">Medical History Reports</h2>
            <div className="space-y-2">
              {labReports.map((r) => {
                const isSelected = r.id === activeReport?.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setSelectedReportId(r.id)}
                    className={`w-full p-3 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'bg-teal-50 border-teal-600'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 line-clamp-1">{r.title}</span>
                      <span className="text-[10px] text-slate-400">{r.date}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                      <span>{r.labName}</span>
                      <span>·</span>
                      <span className="capitalize">{r.overallRisk} risk</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Parser Input Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Parse New Report</h2>
              <span className="text-xs text-teal-600 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> AI Engine
              </span>
            </div>

            {/* Quick Sample Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                Load Sample Clinical Panel
              </label>
              <div className="flex flex-col gap-1.5">
                {SAMPLE_REPORTS_LIST.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setReportTitle(sample.title);
                      setReportText(sample.rawText);
                    }}
                    className="text-left text-xs p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors"
                  >
                    {sample.title}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Report Title / Specialty
              </label>
              <input
                type="text"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                placeholder="e.g. Lipid Panel, Thyroid TSH"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Paste Lab Text or OCR Raw Data
              </label>
              <textarea
                rows={4}
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                placeholder="Paste lab text here or select a sample above..."
                className="w-full p-2.5 text-xs font-mono rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <button
              onClick={handleParseReport}
              disabled={isParsing || (!reportText.trim() && !customFileBase64)}
              className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isParsing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Translating Medical Jargon...</span>
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4" />
                  <span>Simplify Lab Report</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column (8 Cols): Simplified Report View */}
        <div className="lg:col-span-8 space-y-6">
          {activeReport ? (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <span>{activeReport.labName}</span>
                    <span>·</span>
                    <span>{activeReport.date}</span>
                    <span>·</span>
                    <span className="capitalize text-teal-700 font-semibold">{activeReport.category}</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                    {activeReport.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReadAloud}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold hover:bg-teal-100 transition-colors"
                  >
                    <Volume2 className="w-4 h-4 text-teal-600" />
                    <span>Read Aloud</span>
                  </button>
                </div>
              </div>

              {/* Patient-Friendly Summary Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  <span>Executive Plain-English Summary</span>
                </h3>
                <p className="text-xs leading-relaxed text-slate-700 mt-1">
                  {activeReport.summary}
                </p>
              </div>

              {/* Biomarkers Breakdown Table */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Biomarker Deep-Dive & Range Analysis
                </h3>
                <div className="space-y-3">
                  {activeReport.biomarkers.map((b, i) => {
                    const isNormal = b.status === 'normal';
                    const isElevated = b.status === 'elevated';
                    const isCritical = b.status === 'critical';

                    const badgeColor = isNormal
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                      : isElevated
                      ? 'text-amber-800 bg-amber-50 border-amber-200'
                      : isCritical
                      ? 'text-rose-800 bg-rose-50 border-rose-200'
                      : 'text-sky-800 bg-sky-50 border-sky-200';

                    return (
                      <div
                        key={i}
                        className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors space-y-2"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{b.name}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badgeColor} uppercase tracking-wider`}>
                              {b.status}
                            </span>
                          </div>

                          <div className="flex items-baseline gap-1 text-xs font-mono">
                            <span className="font-extrabold text-slate-900">{b.value}</span>
                            <span className="text-slate-500 font-sans">{b.unit}</span>
                            <span className="text-slate-400 font-sans ml-2">(Ref: {b.referenceRange})</span>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-500">
                          <strong className="text-slate-700">What it is: </strong>
                          {b.explanation}
                        </p>

                        <p className="text-xs text-slate-700 bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                          <strong className="text-teal-800">What your result means: </strong>
                          {b.whatItMeans}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Lifestyle & Dietary Guidance */}
              {activeReport.lifestyleAndDietGuidance?.length > 0 && (
                <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-200">
                  <h3 className="text-xs font-bold text-teal-900 uppercase tracking-wider mb-2">
                    Personalized Lifestyle & Nutrition Guidance
                  </h3>
                  <ul className="space-y-1.5">
                    {activeReport.lifestyleAndDietGuidance.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Questions for Doctor */}
              {activeReport.questionsForDoctor?.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-100/70 border border-slate-200">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Questions for Your Next Physician Consultation
                  </h3>
                  <ul className="space-y-1.5">
                    {activeReport.questionsForDoctor.map((q, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <HelpCircle className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                        <span className="italic">"{q}"</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
              <FileText className="w-8 h-8 text-slate-400 mx-auto mb-3" />
              <h2 className="text-base font-bold text-slate-900">No Lab Report Selected</h2>
              <p className="text-xs text-slate-500 mt-1">Select a report from the vault on the left or paste text to parse.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
