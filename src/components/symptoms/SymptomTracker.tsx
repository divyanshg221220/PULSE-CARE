import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SymptomEntry, SymptomAnalysis } from '../../types/health';
import {
  Activity,
  AlertTriangle,
  Sparkles,
  Volume2,
  Clock,
  CheckCircle2,
  HelpCircle,
  ShieldAlert,
  Flame,
  Plus,
  Trash2,
  ArrowRight,
  Info,
} from 'lucide-react';

const COMMON_SYMPTOM_TAGS = [
  'Throbbing Headache',
  'Low-grade Fever',
  'Dry Cough',
  'Shortness of Breath',
  'Dizziness / Vertigo',
  'Abdominal Cramping',
  'Nausea / Upset Stomach',
  'Chest Tightness',
  'Lumbar Back Pain',
  'Joint Pain & Stiffness',
  'Extreme Fatigue',
  'Sore Throat',
];

export const SymptomTracker: React.FC = () => {
  const { symptomLogs, addSymptomLog, updateSymptomStatus, deleteSymptomLog, profile, vitals, speakText } = useApp();

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['Throbbing Headache']);
  const [customSymptom, setCustomSymptom] = useState<string>('');
  const [bodyLocation, setBodyLocation] = useState<string>('Head & Neck');
  const [duration, setDuration] = useState<string>('few hours');
  const [severity, setSeverity] = useState<number>(5);
  const [triggers, setTriggers] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [activeAnalysis, setActiveAnalysis] = useState<SymptomAnalysis | null>(null);
  const [selectedLogId, setSelectedLogId] = useState<string>(symptomLogs[0]?.id || '');

  // Qualitative severity label
  const getSeverityInfo = (val: number) => {
    if (val <= 3) return { label: 'Mild Discomfort (1–3)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (val <= 6) return { label: 'Moderate Pain / Impairment (4–6)', color: 'text-amber-800 bg-amber-50 border-amber-200' };
    if (val <= 8) return { label: 'Severe Distress (7–8)', color: 'text-orange-800 bg-orange-50 border-orange-200' };
    return { label: 'Critical / Incapacitating (9–10)', color: 'text-rose-800 bg-rose-50 border-rose-200' };
  };

  const handleToggleTag = (tag: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAddCustomSymptom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSymptom.trim()) return;
    if (!selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms((prev) => [...prev, customSymptom.trim()]);
    }
    setCustomSymptom('');
  };

  // Run AI analysis
  const handleAnalyzeSymptoms = async () => {
    if (selectedSymptoms.length === 0) return;
    setIsAnalyzing(true);
    setActiveAnalysis(null);

    try {
      const res = await fetch('/api/analyze-symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: selectedSymptoms,
          duration,
          severity,
          bodyLocation,
          triggers,
          userProfile: profile,
          vitals: vitals[0] || {},
        }),
      });

      if (!res.ok) throw new Error('Failed to analyze symptoms');
      const analysis: SymptomAnalysis = await res.json();
      setActiveAnalysis(analysis);

      // Auto save to history
      const category = severity <= 3 ? 'mild' : severity <= 6 ? 'moderate' : severity <= 8 ? 'severe' : 'critical';
      addSymptomLog({
        symptoms: selectedSymptoms,
        bodyLocation,
        onsetDate: new Date().toISOString().split('T')[0],
        duration,
        severity,
        severityCategory: category,
        triggers: triggers.trim() || undefined,
        status: 'active',
        aiAnalysis: analysis,
      });

      speakText(
        `AI Symptom Triage Complete. Urgency: ${analysis.urgencyLevel.replace('_', ' ')}. ${analysis.urgencyExplanation}`
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReadAnalysis = (analysis: SymptomAnalysis) => {
    const text = `Symptom Analysis: Urgency level is ${analysis.urgencyLevel.replace('_', ' ')}. ${analysis.urgencyExplanation} Possible causes: ${analysis.possibleCauses.map((c) => `${c.condition} (${c.probability})`).join(', ')}. Key recommendations: ${analysis.recommendedActions.join('. ')}`;
    speakText(text);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700">
            <Activity className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Symptom Tracker & AI Clinical Triage
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              Log acute biometrics, evaluate potential differentials, and receive urgent clinical escalation advice.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Input Form vs AI Analysis & History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (5 Cols): Symptom Input Form */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Current Symptom Presentation</h2>
            <p className="text-xs text-slate-500 mt-0.5">Select symptoms and pain intensity for {profile.name}</p>
          </div>

          {/* Quick Symptom Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Common Clinical Symptoms (Click to toggle)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_SYMPTOM_TAGS.map((tag) => {
                const isSelected = selectedSymptoms.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    className={`px-2.5 py-1 text-xs rounded-lg border font-medium transition-all ${
                      isSelected
                        ? 'bg-teal-600 border-teal-600 text-white font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Symptom Input */}
          <form onSubmit={handleAddCustomSymptom} className="flex gap-2">
            <input
              type="text"
              value={customSymptom}
              onChange={(e) => setCustomSymptom(e.target.value)}
              placeholder="Or type custom symptom..."
              className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
            >
              Add
            </button>
          </form>

          {/* Selected Symptoms List */}
          {selectedSymptoms.length > 0 && (
            <div className="p-3 rounded-lg bg-teal-50/50 border border-teal-200">
              <span className="text-[11px] font-bold text-teal-900 uppercase tracking-wider block mb-1">
                Active Symptom Cluster ({selectedSymptoms.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedSymptoms.map((sym) => (
                  <span
                    key={sym}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white text-teal-900 border border-teal-200 text-xs font-semibold"
                  >
                    <span>{sym}</span>
                    <button
                      type="button"
                      onClick={() => handleToggleTag(sym)}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Body Location & Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Primary Body Location
              </label>
              <select
                value={bodyLocation}
                onChange={(e) => setBodyLocation(e.target.value)}
                className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Head & Neck">Head & Neck</option>
                <option value="Chest & Cardiovascular">Chest & Heart</option>
                <option value="Abdomen & GI">Abdomen & GI</option>
                <option value="Spine & Lower Back">Back & Spine</option>
                <option value="Limbs & Joints">Limbs & Joints</option>
                <option value="Whole Body / Systemic">Whole Body / Systemic</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Duration / Course
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Under 2 hours">Under 2 hours</option>
                <option value="6 to 12 hours">6 to 12 hours</option>
                <option value="1 to 2 days">1 to 2 days</option>
                <option value="3 to 7 days">3 to 7 days</option>
                <option value="More than 2 weeks">Chronic ({'>'}2 weeks)</option>
              </select>
            </div>
          </div>

          {/* Severity Slider (1-10) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Severity / Pain Rating</span>
              <span className={`font-bold px-2 py-0.5 rounded border text-[11px] ${getSeverityInfo(severity).color}`}>
                Level {severity}/10 · {getSeverityInfo(severity).label}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={severity}
              onChange={(e) => setSeverity(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>1 Mild</span>
              <span>5 Moderate</span>
              <span>8 Severe</span>
              <span>10 Emergency</span>
            </div>
          </div>

          {/* Triggers / Aggravating factors */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Triggers / Alleviating Notes
            </label>
            <input
              type="text"
              value={triggers}
              onChange={(e) => setTriggers(e.target.value)}
              placeholder="e.g. Worse with bright light; better when seated."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* CTA Action */}
          <button
            onClick={handleAnalyzeSymptoms}
            disabled={isAnalyzing || selectedSymptoms.length === 0}
            className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Formulating Clinical Differentials with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run AI Clinical Triage & Urgency Analysis</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column (7 Cols): Active Analysis & Past Logs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active AI Analysis Result Card */}
          {activeAnalysis ? (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">
                    AI Clinical Evaluation
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border ${
                        activeAnalysis.urgencyLevel === 'emergency_immediate'
                          ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                          : activeAnalysis.urgencyLevel === 'urgent_care'
                          ? 'bg-orange-100 text-orange-800 border-orange-300'
                          : activeAnalysis.urgencyLevel === 'routine_consultation'
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      }`}
                    >
                      {activeAnalysis.urgencyLevel.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleReadAnalysis(activeAnalysis)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold hover:bg-teal-100 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>Read Triage Aloud</span>
                </button>
              </div>

              {/* Urgency Explanation */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                <strong className="text-slate-900 block mb-0.5">Clinical Justification:</strong>
                {activeAnalysis.urgencyExplanation}
              </div>

              {/* Possible Causes Breakdown */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Differential Considerations
                </h3>
                <div className="space-y-2">
                  {activeAnalysis.possibleCauses.map((cause, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg border border-slate-200 bg-white space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{cause.condition}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                            cause.probability === 'likely'
                              ? 'bg-teal-50 text-teal-700'
                              : cause.probability === 'moderate'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {cause.probability} likelihood
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{cause.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Red Flag Warnings */}
              {activeAnalysis.redFlagWarnings?.length > 0 && (
                <div className="p-4 rounded-xl bg-rose-50/80 border border-rose-200 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-rose-900 uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>Red Flag Warning Signs — Seek ER Immediately If Present</span>
                  </div>
                  <ul className="space-y-1 text-rose-800">
                    {activeAnalysis.redFlagWarnings.map((flag, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0" />
                        <span>{flag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommended Actions & Home Care */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-200 space-y-1.5">
                  <strong className="text-teal-900 font-bold block">Recommended Clinical Steps:</strong>
                  <ul className="space-y-1 text-slate-700">
                    {activeAnalysis.recommendedActions.map((act, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <strong className="text-slate-900 font-bold block">Safe Supportive Care:</strong>
                  <ul className="space-y-1 text-slate-600">
                    {activeAnalysis.homeCareTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0 mt-1.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 italic">
                {activeAnalysis.disclaimer}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">No Active AI Analysis Running</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Select your symptoms on the left and click "Run AI Clinical Triage" to receive an immediate clinical assessment.
              </p>
            </div>
          )}

          {/* Historical Symptom Logs */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Logged Symptom Episodes</h2>
            <div className="space-y-3">
              {symptomLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">
                          {log.symptoms.join(', ')}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          Level {log.severity}/10
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span>{log.bodyLocation}</span>
                        <span>·</span>
                        <span>{log.duration}</span>
                        <span>·</span>
                        <span>{log.onsetDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <select
                        value={log.status}
                        onChange={(e: any) => updateSymptomStatus(log.id, e.target.value)}
                        className={`text-[10px] font-bold px-2 py-1 rounded border uppercase ${
                          log.status === 'resolved'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : log.status === 'improving'
                            ? 'bg-sky-50 text-sky-700 border-sky-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        <option value="active">Active</option>
                        <option value="improving">Improving</option>
                        <option value="resolved">Resolved</option>
                      </select>

                      <button
                        onClick={() => deleteSymptomLog(log.id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {log.aiAnalysis && (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-teal-700 font-medium">
                        Triage: <strong className="capitalize">{log.aiAnalysis.urgencyLevel.replace('_', ' ')}</strong>
                      </span>
                      <button
                        onClick={() => setActiveAnalysis(log.aiAnalysis!)}
                        className="font-bold text-slate-700 hover:text-teal-700 flex items-center gap-1"
                      >
                        <span>View Analysis Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
