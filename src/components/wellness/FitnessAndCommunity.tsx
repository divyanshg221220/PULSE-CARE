import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Dumbbell,
  Radio,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Users,
  Clock,
  MapPin,
  PhoneCall,
  Shield,
  Heart,
  ChevronDown,
} from 'lucide-react';

export const FitnessAndCommunity: React.FC = () => {
  const { fitnessPlans, localAlerts, healthDrives, toggleDriveRSVP, speakText } = useApp();

  const [activeTab, setActiveTab] = useState<'fitness' | 'alerts' | 'drives'>('fitness');
  const [selectedPlanId, setSelectedPlanId] = useState<string>(fitnessPlans[0].id);

  const activePlan = fitnessPlans.find((p) => p.id === selectedPlanId) || fitnessPlans[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700">
            <Dumbbell className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Prescribed Fitness & Community Health Hub
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              Doctor-aligned exercise therapy, local outbreak radar, and community wellness initiatives.
            </p>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('fitness')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'fitness'
              ? 'bg-teal-600 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Prescribed Fitness Regimens
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'alerts'
              ? 'bg-teal-600 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Outbreak Radar & Advisories
        </button>
        <button
          onClick={() => setActiveTab('drives')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'drives'
              ? 'bg-teal-600 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Community Health Drives ({healthDrives.length})
        </button>
      </div>

      {/* 1. Prescribed Fitness View */}
      {activeTab === 'fitness' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Plan Selector List (4 Cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h2 className="text-sm font-bold text-slate-900">Prescribed Exercise Programs</h2>
            {fitnessPlans.map((plan) => {
              const isSelected = plan.id === activePlan.id;
              return (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-teal-50 border-teal-600'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-900 block">{plan.title}</span>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                    <span className="capitalize">{plan.intensity.replace('_', ' ')}</span>
                    <span>·</span>
                    <span>{plan.durationMin} Mins</span>
                  </div>
                  <span className="text-[10px] text-teal-700 font-semibold block mt-1">
                    Target: {plan.targetCondition}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Plan Details & Exercises (8 Cols) */}
          <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                  Target: {activePlan.targetCondition}
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                  {activePlan.title}
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>{activePlan.durationMin} Minutes</span>
              </div>
            </div>

            {/* Medical Clearance Note */}
            <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200 text-xs text-teal-900 flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Physician Clearance Note:</strong>
                <p className="mt-0.5 text-slate-700">{activePlan.medicalClearanceNote}</p>
              </div>
            </div>

            {/* Exercises List */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Prescribed Exercise Sequence
              </h3>
              <div className="space-y-3">
                {activePlan.exercises.map((ex, idx) => (
                  <div
                    key={ex.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900">{ex.name}</h4>
                      </div>
                      <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded">
                        {ex.durationOrReps}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 pl-7 leading-relaxed">
                      {ex.instruction}
                    </p>

                    <div className="pl-7 pt-1 text-[11px] text-slate-500 flex items-center gap-1.5">
                      <strong className="text-slate-700">Safety Tip:</strong>
                      <span>{ex.safetyPrecaution}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contraindications */}
            {activePlan.contraindications?.length > 0 && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                <strong className="font-bold text-slate-900 block">Precautions & Contraindications:</strong>
                <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                  {activePlan.contraindications.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Outbreak Radar & Local Health Feed */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Active Regional Health Advisories</h2>
            <span className="text-xs text-slate-400">Direct from Regional Disease Surveillance Center</span>
          </div>

          <div className="space-y-4">
            {localAlerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded border uppercase tracking-wider ${
                        alert.severity === 'high'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {alert.severity} Priority
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{alert.title}</h3>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    {alert.region} · {alert.publishedDate}
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {alert.summary}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                    <strong className="font-bold text-slate-900 block">Symptoms to Monitor:</strong>
                    <ul className="space-y-1 text-slate-600">
                      {alert.symptomsToWatch.map((sym, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                          <span>{sym}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-lg bg-teal-50/50 border border-teal-200 space-y-1.5 text-xs">
                    <strong className="font-bold text-teal-900 block">Required Protective Actions:</strong>
                    <ul className="space-y-1 text-slate-700">
                      {alert.actionSteps.map((act, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Community Health Drives & Camps */}
      {activeTab === 'drives' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Upcoming Wellness & Blood Drives</h2>
            <span className="text-xs text-slate-400">Community Health Outreaches</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {healthDrives.map((drive) => (
              <div
                key={drive.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-teal-700 capitalize">
                      {drive.type.replace('_', ' ')}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">{drive.rsvpCount} RSVPs</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">{drive.title}</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">{drive.organizer}</p>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{drive.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{drive.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="line-clamp-1">{drive.venue}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Included Services:
                    </span>
                    <ul className="text-[11px] text-slate-600 space-y-0.5">
                      {drive.servicesProvided.map((s, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-teal-600" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => toggleDriveRSVP(drive.id)}
                    className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
                      drive.isUserRegistered
                        ? 'bg-emerald-600 text-white'
                        : 'bg-teal-600 hover:bg-teal-700 text-white'
                    }`}
                  >
                    {drive.isUserRegistered ? '✓ Registered / Seat Reserved' : 'RSVP & Save Seat'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
