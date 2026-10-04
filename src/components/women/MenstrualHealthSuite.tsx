import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar as CalendarIcon,
  Heart,
  Sparkles,
  BookOpen,
  Clock,
  CheckCircle,
  Plus,
  Info,
} from 'lucide-react';

export const MenstrualHealthSuite: React.FC = () => {
  const { menstrualData, updateMenstrualLog, updateCycleSettings } = useApp();

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [flow, setFlow] = useState<'spotting' | 'light' | 'medium' | 'heavy' | 'none'>('none');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [mood, setMood] = useState<string>('Calm');
  const [notes, setNotes] = useState<string>('');

  // Cycle phase calculation
  const lastPeriod = new Date(menstrualData.lastPeriodStartDate);
  const today = new Date();
  const diffDays = Math.max(0, Math.floor((today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24)));
  const currentCycleDay = (diffDays % menstrualData.averageCycleLength) + 1;

  // Next period date
  const nextPeriodDate = new Date(lastPeriod);
  nextPeriodDate.setDate(lastPeriod.getDate() + menstrualData.averageCycleLength);

  // Fertile window (roughly days 12-16 in a 28-day cycle)
  const fertileStart = new Date(lastPeriod);
  fertileStart.setDate(lastPeriod.getDate() + (menstrualData.averageCycleLength - 16));
  const fertileEnd = new Date(lastPeriod);
  fertileEnd.setDate(lastPeriod.getDate() + (menstrualData.averageCycleLength - 12));

  // Determine current phase
  let phaseName = 'Follicular Phase';
  let phaseDescription = 'Rising estrogen, increasing mental clarity and physical energy.';
  if (currentCycleDay <= menstrualData.periodDurationDays) {
    phaseName = 'Menstrual Phase';
    phaseDescription = 'Progesterone and estrogen reset; focus on warmth, iron-rich nutrition, and restorative movement.';
  } else if (currentCycleDay >= 12 && currentCycleDay <= 16) {
    phaseName = 'Ovulatory Window';
    phaseDescription = 'Peak luteinizing hormone (LH) and fertile window. Optimal stamina and metabolic efficiency.';
  } else if (currentCycleDay > 16) {
    phaseName = 'Luteal Phase';
    phaseDescription = 'Progesterone dominance; prioritize complex carbohydrates, magnesium, and stress regulation.';
  }

  const symptomsList = [
    'Lower Abdominal Cramping',
    'Bloating / Water Retention',
    'Headache / Migraine',
    'Breast Tenderness',
    'Fatigue / Brain Fog',
    'Acne Flare-up',
    'Sweet / Salty Food Cravings',
  ];

  const handleToggleSymptom = (s: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s]
    );
  };

  const handleSaveDailyLog = (e: React.FormEvent) => {
    e.preventDefault();
    updateMenstrualLog(selectedDate, {
      flow: flow === 'none' ? undefined : flow,
      symptoms: selectedSymptoms,
      mood,
      notes,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700">
            <CalendarIcon className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Menstrual & Hormonal Health Suite
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              Cycle tracking, phase-based physiology insights, symptom logs, and PCOS/PCOD education.
            </p>
          </div>
        </div>
      </div>

      {/* Cycle Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Cycle Day
          </span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              Day {currentCycleDay}
            </span>
            <span className="text-xs text-slate-500">of {menstrualData.averageCycleLength}</span>
          </div>
          <div className="mt-2 text-xs font-bold text-rose-700">{phaseName}</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Predicted Next Period
          </span>
          <div className="mt-3 text-2xl font-bold text-slate-900">
            {nextPeriodDate.toLocaleDateString([], { month: 'short', day: 'numeric' })}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            In ~{Math.max(0, menstrualData.averageCycleLength - currentCycleDay)} days
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Fertile Window
          </span>
          <div className="mt-3 text-lg font-bold text-slate-900">
            {fertileStart.toLocaleDateString([], { month: 'short', day: 'numeric' })} – {fertileEnd.toLocaleDateString([], { month: 'short', day: 'numeric' })}
          </div>
          <div className="mt-2 text-xs text-teal-700 font-semibold">
            {currentCycleDay >= 12 && currentCycleDay <= 16 ? 'High Probability Window' : 'Low Probability'}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Hormonal Phase Focus
          </span>
          <div className="mt-3 text-xs text-slate-700 leading-relaxed">
            {phaseDescription}
          </div>
        </div>
      </div>

      {/* Two Columns: Daily Log Input vs Educational Guides */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left (6 Cols): Daily Symptom & Flow Logger */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Log Daily Symptoms & Flow</h2>
              <p className="text-xs text-slate-500 mt-0.5">Track bio-markers for hormonal trend analysis</p>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-lg border border-slate-300 font-mono"
            />
          </div>

          <form onSubmit={handleSaveDailyLog} className="space-y-4">
            {/* Flow Intensity */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Flow Intensity
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {(['none', 'spotting', 'light', 'medium', 'heavy'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setFlow(lvl)}
                    className={`py-2 text-xs font-semibold rounded-lg border capitalize transition-all ${
                      flow === lvl
                        ? 'bg-rose-50 border-rose-600 text-rose-800'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Symptoms Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Physical & Emotional Symptoms
              </label>
              <div className="flex flex-wrap gap-2">
                {symptomsList.map((sym) => {
                  const isChecked = selectedSymptoms.includes(sym);
                  return (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => handleToggleSymptom(sym)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                        isChecked
                          ? 'bg-teal-50 border-teal-600 text-teal-900 font-bold'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {sym}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mood */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Dominant Mood
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['Calm', 'Energetic', 'Sensitive', 'Exhausted'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMood(m)}
                    className={`py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      mood === m
                        ? 'bg-slate-800 border-slate-800 text-white'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Personal Notes
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Took hot chamomile tea for cramps, felt better."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-colors"
              >
                Save Daily Log
              </button>
            </div>
          </form>
        </div>

        {/* Right (6 Cols): Educational Video & Guides Library */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">PCOS / PCOD & Hormonal Education</h2>
              <p className="text-xs text-slate-500 mt-0.5">Clinical lifestyle guides and evidence-based strategies</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">
                  Managing PCOS Naturally: Insulin Sensitivity & Inositol
                </span>
                <span className="text-[10px] text-teal-700 font-mono font-bold">5 min read</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                40:1 ratio Myo-Inositol to D-Chiro Inositol paired with low-glycemic Mediterranean nutrition reduces ovarian androgen synthesis and promotes ovulatory regularity.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">
                  Cycle-Synced Movement: When to Lift vs When to Rest
                </span>
                <span className="text-[10px] text-teal-700 font-mono font-bold">4 min read</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                In the Follicular phase, your body metabolizes carbohydrates efficiently for strength PRs. In the Late Luteal phase, higher basal body temperatures favor lower-impact pilates and yoga.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">
                  Nutritional Strategies for Dysmenorrhea (Severe Cramping)
                </span>
                <span className="text-[10px] text-teal-700 font-mono font-bold">3 min read</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Magnesium glycinate (300 mg) and concentrated Omega-3 fatty acids blunt uterine prostaglandin F2-alpha vasoconstriction, providing natural analgesic relief.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
