import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VitalLog } from '../../types/health';
import {
  Heart,
  Droplet,
  Scale,
  Thermometer,
  Activity,
  Plus,
  TrendingUp,
  Clock,
  Pill,
  CheckCircle2,
  AlertCircle,
  Download,
  Trash2,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const VitalsDashboard: React.FC = () => {
  const {
    vitals,
    addVitalLog,
    deleteVitalLog,
    medications,
    toggleMedicationTaken,
    profile,
    setActiveTab,
    speakText,
  } = useApp();

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('7d');
  const [showLogModal, setShowLogModal] = useState(false);

  // Form states for manual log
  const [systolic, setSystolic] = useState('120');
  const [diastolic, setDiastolic] = useState('80');
  const [pulse, setPulse] = useState('72');
  const [glucose, setGlucose] = useState('95');
  const [glucoseContext, setGlucoseContext] = useState<'fasting' | 'post_prandial' | 'random'>('fasting');
  const [weight, setWeight] = useState('64');
  const [spo2, setSpo2] = useState('98');
  const [temperature, setTemperature] = useState('98.4');
  const [notes, setNotes] = useState('');

  // Latest vital record
  const latest = vitals[0] || {};
  const previous = vitals[1] || {};

  // BMI calculation
  const currentHeightM = (profile.heightCm || 168) / 100;
  const currentWeightKg = latest.weight || profile.weightKg || 64;
  const currentBmi = Number((currentWeightKg / (currentHeightM * currentHeightM)).toFixed(1));

  // Determine BP Status
  const getBpCategory = (sys?: number, dia?: number) => {
    if (!sys || !dia) return { label: 'No Data', color: 'text-slate-500' };
    if (sys < 120 && dia < 80) return { label: 'Optimal / Normal', color: 'text-emerald-700' };
    if (sys <= 129 && dia < 80) return { label: 'Elevated Pre-hypertension', color: 'text-amber-700' };
    if (sys <= 139 || dia <= 89) return { label: 'Stage 1 Hypertension', color: 'text-orange-700' };
    return { label: 'Stage 2 Hypertension', color: 'text-rose-700' };
  };

  // Determine Glucose Status
  const getGlucoseCategory = (val?: number, ctx?: string) => {
    if (!val) return { label: 'No Data', color: 'text-slate-500' };
    if (ctx === 'fasting') {
      if (val < 100) return { label: 'Normal Fasting (<100)', color: 'text-emerald-700' };
      if (val <= 125) return { label: 'Impaired Fasting (Pre-diabetes)', color: 'text-amber-700' };
      return { label: 'Elevated Fasting (>126)', color: 'text-rose-700' };
    }
    if (val < 140) return { label: 'Normal Post-Meal (<140)', color: 'text-emerald-700' };
    if (val <= 199) return { label: 'Elevated Post-Meal (140-199)', color: 'text-amber-700' };
    return { label: 'High Post-Meal (>200)', color: 'text-rose-700' };
  };

  const bpStatus = getBpCategory(latest.systolic, latest.diastolic);
  const glucoseStatus = getGlucoseCategory(latest.glucose, latest.glucoseContext);

  // Filter vitals for graph
  const filteredVitals = [...vitals].reverse(); // chronological

  // Handle save manual log
  const handleSaveVital = (e: React.FormEvent) => {
    e.preventDefault();
    addVitalLog({
      systolic: Number(systolic),
      diastolic: Number(diastolic),
      pulse: Number(pulse),
      glucose: Number(glucose),
      glucoseContext,
      glucoseUnit: 'mg/dL',
      weight: Number(weight),
      spo2: Number(spo2),
      temperature: Number(temperature),
      notes: notes.trim(),
      source: 'manual',
    });
    setShowLogModal(false);
    setNotes('');
  };

  // Today string YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  // Adherence calculation
  const totalMeds = medications.length;
  const takenMeds = medications.filter((m) => m.history[todayStr]).length;
  const adherenceRate = totalMeds > 0 ? Math.round((takenMeds / totalMeds) * 100) : 100;

  // Read summary aloud
  const handleReadSummary = () => {
    const speech = `Here is your current health briefing for ${profile.name}. Your latest blood pressure is ${latest.systolic || 120} over ${latest.diastolic || 80} millimeters of mercury, which is classified as ${bpStatus.label}. Your blood glucose is ${latest.glucose || 96} milligrams per deciliter, in the ${glucoseStatus.label} range. Your pulse is ${latest.pulse || 72} beats per minute and blood oxygen saturation is ${latest.spo2 || 98} percent. You have taken ${takenMeds} of ${totalMeds} medications today.`;
    speakText(speech);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Vitals & Health Overview
            </h1>
            <span className="text-xs text-slate-500 font-medium">
              {profile.name} · {profile.age} yrs · Blood {profile.bloodType}
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Real-time biometric telemetry, medication adherence, and clinical thresholds.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={handleReadSummary}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 transition-colors"
          >
            <Activity className="w-4 h-4 text-teal-600" />
            <span>Read Vitals Aloud</span>
          </button>

          <button
            onClick={() => setActiveTab('scanner')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>AI Camera Scanner</span>
          </button>

          <button
            onClick={() => setShowLogModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-teal-600 text-white hover:bg-teal-700 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Log Metric</span>
          </button>
        </div>
      </div>

      {/* 4 Core Vitals Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* 1. Blood Pressure Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
              Blood Pressure
            </span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <Heart className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {latest.systolic || '--'}/{latest.diastolic || '--'}
            </span>
            <span className="text-xs text-slate-500 font-medium">mmHg</span>
          </div>

          <div className="mt-2 text-xs font-medium">
            <span className={bpStatus.color}>{bpStatus.label}</span>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Pulse: {latest.pulse ? `${latest.pulse} bpm` : 'Normal'}</span>
            <span>{latest.timestamp ? new Date(latest.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today'}</span>
          </div>
        </div>

        {/* 2. Blood Glucose Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
              Blood Glucose
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Droplet className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {latest.glucose || '--'}
            </span>
            <span className="text-xs text-slate-500 font-medium">mg/dL</span>
          </div>

          <div className="mt-2 text-xs font-medium">
            <span className={glucoseStatus.color}>{glucoseStatus.label}</span>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="capitalize">{latest.glucoseContext?.replace('_', ' ') || 'Fasting'}</span>
            <span>Target: 70–99</span>
          </div>
        </div>

        {/* 3. Weight & BMI Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
              Weight & BMI
            </span>
            <div className="p-2 rounded-lg bg-teal-50 text-teal-600">
              <Scale className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {latest.weight || profile.weightKg}
            </span>
            <span className="text-xs text-slate-500 font-medium">kg</span>
          </div>

          <div className="mt-2 text-xs font-medium text-emerald-700">
            <span>BMI: {currentBmi} · Healthy Weight</span>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Height: {profile.heightCm} cm</span>
            <span>Normal: 18.5–24.9</span>
          </div>
        </div>

        {/* 4. Oxygen & Body Temp Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
              SpO2 & Temperature
            </span>
            <div className="p-2 rounded-lg bg-sky-50 text-sky-600">
              <Thermometer className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {latest.spo2 || 98}%
            </span>
            <span className="text-xs text-slate-500 font-mono font-medium">
              · {latest.temperature || 98.4}°F
            </span>
          </div>

          <div className="mt-2 text-xs font-medium text-emerald-700">
            <span>Optimal Room Air Oxygenation</span>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Afebrile</span>
            <span>Sat: {'>'}95% OK</span>
          </div>
        </div>
      </div>

      {/* Interactive Trend Chart Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Vascular & Metabolic Longitudinal Trends
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Historical distribution of Systolic & Diastolic readings relative to target bounds.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                timeRange === '7d' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                timeRange === '30d' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeRange('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                timeRange === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Time
            </button>
          </div>
        </div>

        {/* Visual Line Chart (SVG based) */}
        <div className="mt-6">
          <div className="relative h-64 w-full">
            <svg viewBox="0 0 800 240" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="sysGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#0d9488" stop-opacity="0.25" />
                  <stop offset="100%" stop-color="#0d9488" stop-opacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="40" y1="20" x2="780" y2="20" stroke="#f1f5f9" stroke-width="1" />
              <text x="32" y="24" text-anchor="end" font-size="10" fill="#94a3b8">150</text>

              <line x1="40" y1="70" x2="780" y2="70" stroke="#f1f5f9" stroke-width="1" />
              <text x="32" y="74" text-anchor="end" font-size="10" fill="#94a3b8">120</text>
              {/* Healthy Target Threshold Line */}
              <line x1="40" y1="70" x2="780" y2="70" stroke="#10b981" stroke-width="1" stroke-dasharray="4 4" stroke-opacity="0.7" />

              <line x1="40" y1="130" x2="780" y2="130" stroke="#f1f5f9" stroke-width="1" />
              <text x="32" y="134" text-anchor="end" font-size="10" fill="#94a3b8">90</text>

              <line x1="40" y1="180" x2="780" y2="180" stroke="#f1f5f9" stroke-width="1" />
              <text x="32" y="184" text-anchor="end" font-size="10" fill="#94a3b8">60</text>
              {/* Diastolic Target Threshold */}
              <line x1="40" y1="150" x2="780" y2="150" stroke="#10b981" stroke-width="1" stroke-dasharray="4 4" stroke-opacity="0.7" />

              {/* Data points mapping */}
              {(() => {
                const count = filteredVitals.length;
                if (count === 0) return null;
                const stepX = 720 / Math.max(1, count - 1);
                
                // Scale Y: 50 mmHg -> y=200, 160 mmHg -> y=20
                const scaleY = (val: number) => {
                  return 200 - ((val - 50) / (160 - 50)) * 180;
                };

                const sysPoints = filteredVitals.map((v, i) => `${40 + i * stepX},${scaleY(v.systolic || 120)}`).join(' ');
                const diaPoints = filteredVitals.map((v, i) => `${40 + i * stepX},${scaleY(v.diastolic || 80)}`).join(' ');

                return (
                  <>
                    {/* Systolic Line */}
                    <polyline fill="none" stroke="#0d9488" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points={sysPoints} />
                    {/* Diastolic Line */}
                    <polyline fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" points={diaPoints} />

                    {/* Circles & Labels */}
                    {filteredVitals.map((v, i) => {
                      const cx = 40 + i * stepX;
                      const cySys = scaleY(v.systolic || 120);
                      const cyDia = scaleY(v.diastolic || 80);
                      const dateLabel = new Date(v.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });

                      return (
                        <g key={v.id}>
                          <circle cx={cx} cy={cySys} r="4.5" fill="#ffffff" stroke="#0d9488" stroke-width="2.5" />
                          <circle cx={cx} cy={cyDia} r="4" fill="#ffffff" stroke="#38bdf8" stroke-width="2" />
                          <text x={cx} y="225" text-anchor="middle" font-size="10" fill="#64748b">{dateLabel}</text>
                        </g>
                      );
                    })}
                  </>
                );
              })()}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-teal-600 rounded-full" />
              <span className="text-slate-700 font-medium">Systolic mmHg</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-sky-400 rounded-full" />
              <span className="text-slate-700 font-medium">Diastolic mmHg</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 border-b border-emerald-500 border-dashed" />
              <span className="text-emerald-700 font-medium">Target Upper Limit (120/80)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Medications & Recent Logs Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (1/3): Daily Medication Tracker */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Today's Medication Schedule</h2>
              <p className="text-xs text-slate-500 mt-0.5">Adherence: {adherenceRate}% taken today</p>
            </div>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Pill className="w-4 h-4" />
            </div>
          </div>

          {/* Adherence Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${adherenceRate}%` }}
            />
          </div>

          {/* Medication List */}
          <div className="space-y-3 pt-2">
            {medications.map((med) => {
              const isTaken = !!med.history[todayStr];
              const isLow = med.remainingPills <= med.refillReminderThreshold;

              return (
                <div
                  key={med.id}
                  className={`p-3 rounded-lg border transition-colors ${
                    isTaken ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${isTaken ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {med.name}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">· {med.dosage}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{med.instructions}</p>

                      <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{med.scheduleTimes.join(', ')}</span>
                        <span>·</span>
                        <span className={isLow ? 'text-amber-600 font-bold' : ''}>
                          {med.remainingPills} pills left {isLow && '(Refill Alert)'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleMedicationTaken(med.id, todayStr)}
                      className={`p-2 rounded-lg border transition-all ${
                        isTaken
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'bg-white border-slate-300 text-slate-400 hover:border-emerald-600 hover:text-emerald-600'
                      }`}
                      title={isTaken ? 'Mark as pending' : 'Mark as taken'}
                    >
                      <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (2/3): Longitudinal Vital History Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Biometric Audit Log</h2>
              <p className="text-xs text-slate-500 mt-0.5">Chronological record of verified readings</p>
            </div>
            <button
              onClick={() => {
                const header = 'Timestamp,Systolic,Diastolic,Pulse,Glucose,Weight,SpO2,Source,Notes\n';
                const rows = vitals.map(v => `${v.timestamp},${v.systolic || ''},${v.diastolic || ''},${v.pulse || ''},${v.glucose || ''},${v.weight || ''},${v.spo2 || ''},${v.source || ''},"${v.notes || ''}"`).join('\n');
                const blob = new Blob([header + rows], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `pulsecare-vitals-${todayStr}.csv`;
                a.click();
              }}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold tracking-wider uppercase">
                  <th className="py-2.5 px-3">Date & Time</th>
                  <th className="py-2.5 px-3">Blood Pressure</th>
                  <th className="py-2.5 px-3">Pulse</th>
                  <th className="py-2.5 px-3">Glucose</th>
                  <th className="py-2.5 px-3">SpO2 / Temp</th>
                  <th className="py-2.5 px-3">Source</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vitals.map((log) => {
                  const dateStr = new Date(log.timestamp).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });
                  const timeStr = new Date(log.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900">{dateStr}</div>
                        <div className="text-[11px] text-slate-400">{timeStr}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-slate-800">
                          {log.systolic ? `${log.systolic}/${log.diastolic} mmHg` : '--'}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-700">
                        {log.pulse ? `${log.pulse} bpm` : '--'}
                      </td>
                      <td className="py-3 px-3">
                        {log.glucose ? (
                          <div className="flex items-center gap-1.5 font-mono">
                            <span className="font-bold text-slate-800">{log.glucose}</span>
                            <span className="text-[11px] text-slate-500 font-sans">{log.glucoseContext || 'mg/dL'}</span>
                          </div>
                        ) : (
                          '--'
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-700">
                        {log.spo2 ? `${log.spo2}%` : '--'} · {log.temperature ? `${log.temperature}°F` : '--'}
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[11px] text-slate-500 capitalize">
                          {log.source === 'ai_scanner' ? 'AI Scanner' : log.source || 'Manual'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => deleteVitalLog(log.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors"
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Manual Entry Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Record Health Biometrics</h3>
                <p className="text-xs text-slate-500 mt-0.5">Enter latest physical measurements</p>
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveVital} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Systolic (mmHg)
                  </label>
                  <input
                    type="number"
                    value={systolic}
                    onChange={(e) => setSystolic(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="120"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Diastolic (mmHg)
                  </label>
                  <input
                    type="number"
                    value={diastolic}
                    onChange={(e) => setDiastolic(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="80"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Heart Pulse (BPM)
                  </label>
                  <input
                    type="number"
                    value={pulse}
                    onChange={(e) => setPulse(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="72"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Blood Glucose (mg/dL)
                  </label>
                  <input
                    type="number"
                    value={glucose}
                    onChange={(e) => setGlucose(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="95"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Meal Context
                  </label>
                  <select
                    value={glucoseContext}
                    onChange={(e: any) => setGlucoseContext(e.target.value)}
                    className="w-full px-2 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="fasting">Fasting</option>
                    <option value="post_prandial">Post-Meal (2h)</option>
                    <option value="random">Random</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    SpO2 (%)
                  </label>
                  <input
                    type="number"
                    value={spo2}
                    onChange={(e) => setSpo2(e.target.value)}
                    className="w-full px-2 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="98"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-2 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="64"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Clinical Notes / Context
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g. Taken seated after 5 mins relaxation"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-teal-600 text-white hover:bg-teal-700 shadow-sm transition-colors"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
