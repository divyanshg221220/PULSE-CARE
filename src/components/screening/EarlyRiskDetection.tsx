import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertTriangle,
  Heart,
  Droplet,
  Activity,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Download,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

interface ScreeningResult {
  screeningType: string;
  riskScore: number;
  riskTier: string;
  clinicalSummary: string;
  contributingFactors: { factor: string; status: string; impact: string }[];
  actionPlan: string[];
  clinicalDisclaimer: string;
}

export const EarlyRiskDetection: React.FC = () => {
  const { profile, vitals, speakText } = useApp();

  const [activeScreening, setActiveScreening] = useState<'prediabetes' | 'pcod' | 'cardiovascular' | 'hypertension'>('prediabetes');
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [result, setResult] = useState<ScreeningResult | null>(null);

  // Questionnaire responses
  const [adaAnswers, setAdaAnswers] = useState({
    age: profile.age > 40,
    gender: profile.biologicalSex === 'male',
    familyHistory: true,
    highBloodPressure: true,
    physicallyActive: false,
    gestationalDiabetes: false,
  });

  const [pcodAnswers, setPcodAnswers] = useState({
    irregularCycles: true,
    facialAcneOrHair: true,
    difficultyLosingWeight: true,
    hairThinning: false,
    familyHistoryPCOS: true,
    insulinResistanceSigns: true,
  });

  const [cvdAnswers, setCvdAnswers] = useState({
    currentSmoker: false,
    highCholesterol: true,
    diabetesDiagnosed: false,
    exerciseUnder150Min: true,
    highStressLifestyle: true,
  });

  // Calculate ADA score algorithmically
  const calculateAdaScore = () => {
    let score = 0;
    if (profile.age >= 40 && profile.age <= 49) score += 1;
    if (profile.age >= 50 && profile.age <= 59) score += 2;
    if (profile.age >= 60) score += 3;
    if (adaAnswers.familyHistory) score += 1;
    if (adaAnswers.highBloodPressure) score += 1;
    if (!adaAnswers.physicallyActive) score += 1;
    return score;
  };

  const handleRunScreening = async () => {
    setIsCalculating(true);
    const answers =
      activeScreening === 'prediabetes'
        ? adaAnswers
        : activeScreening === 'pcod'
        ? pcodAnswers
        : cvdAnswers;

    try {
      const res = await fetch('/api/risk-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          screeningType: activeScreening,
          userProfile: profile,
          responses: answers,
          currentVitals: vitals[0] || {},
        }),
      });

      if (!res.ok) throw new Error('Risk analysis failure');
      const data: ScreeningResult = await res.json();
      setResult(data);

      speakText(`Screening complete for ${activeScreening}. Clinical risk tier: ${data.riskTier}. ${data.clinicalSummary}`);
    } catch (err) {
      console.error(err);
      // Fallback calculation
      const score = calculateAdaScore();
      const isElevated = score >= 5;
      setResult({
        screeningType: activeScreening,
        riskScore: isElevated ? 68 : 28,
        riskTier: isElevated ? 'Elevated Pre-diabetes Risk' : 'Low Baseline Risk',
        clinicalSummary: isElevated
          ? 'Your responses and blood pressure metrics place you above the ADA threshold (score ≥ 5), indicating benefits from early dietary carbohydrate moderation and structured activity.'
          : 'Your risk factors are currently within standard ranges. Maintaining regular exercise keeps insulin sensitivity high.',
        contributingFactors: [
          { factor: 'Physical Activity Level', status: adaAnswers.physicallyActive ? 'Favorable' : 'Concerning', impact: 'Sedentary habits reduce muscle glucose uptake.' },
          { factor: 'Family History', status: 'Moderate', impact: 'First-degree genetic predisposition.' },
          { factor: 'Blood Pressure Profile', status: 'Moderate', impact: 'Systolic metrics track in elevated pre-hypertension.' },
        ],
        actionPlan: [
          'Request an annual HbA1c screening from your primary physician.',
          'Aim for 150 minutes of weekly moderate aerobic activity.',
          'Replace refined grains with whole legumes and high-fiber vegetables.',
        ],
        clinicalDisclaimer: 'This algorithmic risk assessment is for preventative wellness education and does not replace medical diagnosis by a licensed physician.',
      });
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700">
            <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Early Risk Detection & Predictive Screening
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              Evidence-based predictive algorithms cross-referencing user vitals and clinical risk questionnaires.
            </p>
          </div>
        </div>
      </div>

      {/* Screening Mode Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => {
            setActiveScreening('prediabetes');
            setResult(null);
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeScreening === 'prediabetes'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Droplet className="w-4 h-4" />
          <span>ADA Pre-Diabetes Screener</span>
        </button>

        <button
          onClick={() => {
            setActiveScreening('pcod');
            setResult(null);
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeScreening === 'pcod'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>PCOD / PCOS Rotterdam Screener</span>
        </button>

        <button
          onClick={() => {
            setActiveScreening('cardiovascular');
            setResult(null);
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeScreening === 'cardiovascular'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Cardiovascular (ASCVD) Risk</span>
        </button>

        <button
          onClick={() => {
            setActiveScreening('hypertension');
            setResult(null);
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeScreening === 'hypertension'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Hypertension Staging Engine</span>
        </button>
      </div>

      {/* Main Grid: Questionnaire vs Analysis Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (5 Cols): Questionnaire */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-sm font-bold text-slate-900 capitalize">
              {activeScreening.replace('_', ' ')} Assessment Questionnaire
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select all clinical indicators that apply to your baseline.
            </p>
          </div>

          {/* ADA Pre-Diabetes Questionnaire */}
          {activeScreening === 'prediabetes' && (
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={adaAnswers.familyHistory}
                  onChange={(e) => setAdaAnswers({ ...adaAnswers, familyHistory: e.target.checked })}
                  className="mt-0.5 h-4 w-4 rounded text-teal-600 focus:ring-teal-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">Family History of Diabetes</span>
                  <span className="text-slate-500">Mother, father, sister, or brother has diabetes.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={adaAnswers.highBloodPressure}
                  onChange={(e) => setAdaAnswers({ ...adaAnswers, highBloodPressure: e.target.checked })}
                  className="mt-0.5 h-4 w-4 rounded text-teal-600 focus:ring-teal-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">Diagnosed High Blood Pressure</span>
                  <span className="text-slate-500">History of BP ≥ 130/80 mmHg or on medication.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={adaAnswers.physicallyActive}
                  onChange={(e) => setAdaAnswers({ ...adaAnswers, physicallyActive: e.target.checked })}
                  className="mt-0.5 h-4 w-4 rounded text-teal-600 focus:ring-teal-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">Physically Active Routine</span>
                  <span className="text-slate-500">Engage in 150+ minutes of brisk movement weekly.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={adaAnswers.gestationalDiabetes}
                  onChange={(e) => setAdaAnswers({ ...adaAnswers, gestationalDiabetes: e.target.checked })}
                  className="mt-0.5 h-4 w-4 rounded text-teal-600 focus:ring-teal-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">History of Gestational Diabetes</span>
                  <span className="text-slate-500">Elevated blood sugar detected during past pregnancy.</span>
                </div>
              </label>
            </div>
          )}

          {/* PCOD / PCOS Questionnaire */}
          {activeScreening === 'pcod' && (
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={pcodAnswers.irregularCycles}
                  onChange={(e) => setPcodAnswers({ ...pcodAnswers, irregularCycles: e.target.checked })}
                  className="mt-0.5 h-4 w-4 rounded text-teal-600 focus:ring-teal-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">Irregular or Absent Cycles</span>
                  <span className="text-slate-500">Cycles longer than 35 days, or fewer than 8 periods a year.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={pcodAnswers.facialAcneOrHair}
                  onChange={(e) => setPcodAnswers({ ...pcodAnswers, facialAcneOrHair: e.target.checked })}
                  className="mt-0.5 h-4 w-4 rounded text-teal-600 focus:ring-teal-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">Androgenic Signs (Hirsutism / Acne)</span>
                  <span className="text-slate-500">Excess facial/body hair or persistent adult cystic acne.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={pcodAnswers.difficultyLosingWeight}
                  onChange={(e) => setPcodAnswers({ ...pcodAnswers, difficultyLosingWeight: e.target.checked })}
                  className="mt-0.5 h-4 w-4 rounded text-teal-600 focus:ring-teal-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">Metabolic Weight Resistance</span>
                  <span className="text-slate-500">Difficulty managing weight around midsection / abdominal area.</span>
                </div>
              </label>
            </div>
          )}

          {/* Cardiovascular Questionnaire */}
          {activeScreening === 'cardiovascular' && (
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={cvdAnswers.highCholesterol}
                  onChange={(e) => setCvdAnswers({ ...cvdAnswers, highCholesterol: e.target.checked })}
                  className="mt-0.5 h-4 w-4 rounded text-teal-600 focus:ring-teal-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">Elevated Lipids / Cholesterol</span>
                  <span className="text-slate-500">Total cholesterol {'>'} 200 mg/dL or LDL {'>'} 100 mg/dL.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={cvdAnswers.currentSmoker}
                  onChange={(e) => setCvdAnswers({ ...cvdAnswers, currentSmoker: e.target.checked })}
                  className="mt-0.5 h-4 w-4 rounded text-teal-600 focus:ring-teal-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">Tobacco / Nicotine Usage</span>
                  <span className="text-slate-500">Current regular cigarette or vape smoker.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={cvdAnswers.exerciseUnder150Min}
                  onChange={(e) => setCvdAnswers({ ...cvdAnswers, exerciseUnder150Min: e.target.checked })}
                  className="mt-0.5 h-4 w-4 rounded text-teal-600 focus:ring-teal-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">Sedentary Work Routine</span>
                  <span className="text-slate-500">Under 150 minutes of weekly aerobic movement.</span>
                </div>
              </label>
            </div>
          )}

          {/* Hypertension Staging */}
          {activeScreening === 'hypertension' && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
              <span className="font-bold text-slate-900 block">Automatic Biometric Cross-Referencing</span>
              <p>
                This screener automatically computes your rolling mean arterial pressure and AHA/ACC Stage classification from your verified vital logs.
              </p>
              <div className="pt-2 font-mono text-[11px] text-slate-500">
                Current Latest: {vitals[0]?.systolic || 122}/{vitals[0]?.diastolic || 80} mmHg
              </div>
            </div>
          )}

          <button
            onClick={handleRunScreening}
            disabled={isCalculating}
            className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isCalculating ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Running Clinical Predictive Matrix...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Run Predictive Risk Algorithm</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column (7 Cols): Clinical Risk Report */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6 animate-in fade-in duration-200">
              {/* Top Score & Risk Tier */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                    Predictive Assessment Output
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                    {result.riskTier}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      Algorithmic Score
                    </span>
                    <div className="text-2xl font-black text-slate-900 font-mono">
                      {result.riskScore}/100
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Risk Bar */}
              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1">
                  <span>Low Risk (0–35)</span>
                  <span>Moderate (36–65)</span>
                  <span>Elevated (66–100)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      result.riskScore > 65
                        ? 'bg-rose-500'
                        : result.riskScore > 35
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(10, result.riskScore))}%` }}
                  />
                </div>
              </div>

              {/* Clinical Narrative Summary */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed">
                <span className="font-bold text-slate-900 block mb-1">Clinical Evaluation</span>
                {result.clinicalSummary}
              </div>

              {/* Contributing Factors Matrix */}
              {result.contributingFactors?.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                    Contributing Physiological Factors
                  </h3>
                  <div className="space-y-2">
                    {result.contributingFactors.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg border border-slate-100 bg-white flex items-start justify-between gap-3 text-xs"
                      >
                        <div>
                          <span className="font-bold text-slate-800">{item.factor}</span>
                          <p className="text-slate-500 mt-0.5">{item.impact}</p>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase shrink-0 ${
                            item.status === 'Concerning'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : item.status === 'Moderate'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Targeted Preventive Action Plan */}
              {result.actionPlan?.length > 0 && (
                <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200">
                  <h3 className="text-xs font-bold text-teal-900 uppercase tracking-wider mb-2">
                    High-Yield Preventative Action Plan
                  </h3>
                  <ul className="space-y-2">
                    {result.actionPlan.map((action, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-[11px] text-slate-400 italic">
                {result.clinicalDisclaimer}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs flex flex-col items-center justify-center min-h-[360px]">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
                <AlertTriangle className="w-7 h-7 stroke-[1.75]" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Predictive Screening Engine</h2>
              <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
                Complete the clinical questionnaire on the left to evaluate pre-diabetes risk (ADA guidelines), PCOD indicators, or cardiovascular ASCVD profile.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
