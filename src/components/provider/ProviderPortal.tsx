import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserProfile, ClinicalProgressNote } from '../../types/health';
import {
  Stethoscope,
  Building,
  Users,
  Search,
  FileText,
  AlertTriangle,
  Heart,
  Pill,
  Shield,
  Plus,
  CheckCircle2,
  Syringe,
  Activity,
  Droplet,
  ClipboardList,
} from 'lucide-react';

export const ProviderPortal: React.FC = () => {
  const {
    profiles,
    vitals,
    medications,
    labReports,
    vaccinations,
    clinicalNotes,
    addClinicalNote,
    addMedication,
    bookAppointment,
  } = useApp();

  const [selectedPatientId, setSelectedPatientId] = useState<string>(profiles[0]?.id || 'user_01');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [portalMode, setPortalMode] = useState<'chart' | 'notes' | 'prescribe'>('chart');

  // Form for new SOAP Note
  const [subjective, setSubjective] = useState('');
  const [objective, setObjective] = useState('');
  const [assessment, setAssessment] = useState('');
  const [plan, setPlan] = useState('');

  // Form for new Prescription
  const [rxDrugName, setRxDrugName] = useState('');
  const [rxDosage, setRxDosage] = useState('');
  const [rxFrequency, setRxFrequency] = useState('Once daily');
  const [rxInstructions, setRxInstructions] = useState('');
  const [rxSuccessMsg, setRxSuccessMsg] = useState(false);

  // Selected patient
  const patient = profiles.find((p) => p.id === selectedPatientId) || profiles[0];

  const filteredPatients = profiles.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveSoapNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assessment.trim() || !plan.trim()) return;

    addClinicalNote({
      patientId: patient.id,
      doctorName: 'Dr. Aris Thorne, MD',
      doctorSpecialty: 'Internal Medicine',
      subjective: subjective.trim() || 'Patient presented for clinical evaluation.',
      objective: objective.trim() || `Vitals reviewed: BP ${vitals[0]?.systolic || 120}/${vitals[0]?.diastolic || 80} mmHg.`,
      assessment: assessment.trim(),
      plan: plan.trim(),
    });

    setSubjective('');
    setObjective('');
    setAssessment('');
    setPlan('');
    setPortalMode('chart');
  };

  const handleIssuePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rxDrugName.trim()) return;

    addMedication({
      name: rxDrugName.trim(),
      dosage: rxDosage.trim() || 'Standard Dose',
      frequency: rxFrequency,
      scheduleTimes: ['08:00 AM'],
      instructions: rxInstructions.trim() || 'Take as directed by physician.',
      remainingPills: 30,
      totalPackPills: 30,
      refillReminderThreshold: 5,
      prescribedBy: 'Dr. Aris Thorne, MD (Hospital Portal)',
    });

    setRxSuccessMsg(true);
    setTimeout(() => {
      setRxSuccessMsg(false);
      setPortalMode('chart');
      setRxDrugName('');
      setRxDosage('');
      setRxInstructions('');
    }, 2000);
  };

  const patientNotes = clinicalNotes.filter((n) => n.patientId === patient.id);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-900 text-white">
              <Building className="w-6 h-6 stroke-[2.25]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Doctor & Hospital Clinical Portal
                </h1>
                <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded border border-slate-200">
                  EMR Access
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-0.5">
                Authorized provider workstation · Metropolitan Health Network & Emergency Inpatient Triage.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Physician: <strong>Dr. Aris Thorne, MD (FACP)</strong></span>
          </div>
        </div>
      </div>

      {/* Main Grid: Patient Selector vs Clinical Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (4 Cols): Patient Directory & Search */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Assigned Patient Records</h2>
              <span className="text-xs text-slate-400 font-mono">{profiles.length} Active Charts</span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search patient name or ID..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            {/* Patient List */}
            <div className="space-y-2">
              {filteredPatients.map((p) => {
                const isSelected = p.id === patient.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPatientId(p.id);
                      setPortalMode('chart');
                    }}
                    className={`w-full p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{p.name}</span>
                      <span className={`text-[10px] font-mono ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                        {p.id}
                      </span>
                    </div>

                    <div className={`mt-1 text-[11px] flex items-center gap-2 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      <span className="capitalize">{p.biologicalSex}</span>
                      <span>·</span>
                      <span>{p.age} yrs</span>
                      <span>·</span>
                      <span className="font-bold">Blood {p.bloodType}</span>
                    </div>

                    {p.knownAllergies.length > 0 && (
                      <div className={`mt-1.5 text-[10px] font-bold ${isSelected ? 'text-rose-300' : 'text-rose-700'}`}>
                        ⚠ Allergy: {p.knownAllergies.map((a) => a.allergen).join(', ')}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (8 Cols): Patient Clinical Chart & Actions */}
        <div className="lg:col-span-8 space-y-6">
          {/* Patient Banner */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                    MRN #{patient.id}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs text-teal-700 font-bold">Policy: {patient.insurancePolicyNumber}</span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">{patient.name}</h2>
                <div className="flex items-center gap-3 text-xs text-slate-600 mt-1">
                  <span>DOB: {patient.dob} ({patient.age} yrs)</span>
                  <span>·</span>
                  <span className="capitalize">Sex: {patient.biologicalSex}</span>
                  <span>·</span>
                  <span className="font-bold text-rose-600 font-mono">Blood: {patient.bloodType}</span>
                  <span>·</span>
                  <span>Height: {patient.heightCm} cm</span>
                </div>
              </div>

              {/* Provider Actions Switcher */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPortalMode('chart')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    portalMode === 'chart'
                      ? 'bg-slate-900 text-white'
                      : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Medical Chart
                </button>
                <button
                  onClick={() => setPortalMode('notes')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    portalMode === 'notes'
                      ? 'bg-slate-900 text-white'
                      : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Write SOAP Note
                </button>
                <button
                  onClick={() => setPortalMode('prescribe')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    portalMode === 'prescribe'
                      ? 'bg-teal-600 text-white'
                      : 'border border-slate-200 text-teal-700 hover:bg-teal-50'
                  }`}
                >
                  Issue Digital Rx
                </button>
              </div>
            </div>

            {/* Critical Allergy Alert Banner */}
            {patient.knownAllergies.length > 0 && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold block uppercase tracking-wider text-[11px]">
                    Clinical Allergy Alert:
                  </strong>
                  <div className="space-y-0.5 mt-0.5">
                    {patient.knownAllergies.map((a, i) => (
                      <span key={i} className="inline-block mr-3">
                        • <strong>{a.allergen}</strong> ({a.reaction} - {a.severity})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mode 1: Comprehensive Medical Chart */}
          {portalMode === 'chart' && (
            <div className="space-y-6">
              {/* Vitals Summary Grid */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Latest Biometrics & Baseline Vitals
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">Blood Pressure</span>
                    <span className="text-lg font-mono font-black text-slate-900 mt-1 block">
                      {vitals[0]?.systolic || 122}/{vitals[0]?.diastolic || 80}
                    </span>
                    <span className="text-[10px] text-teal-700 font-semibold">mmHg</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">Heart Pulse</span>
                    <span className="text-lg font-mono font-black text-slate-900 mt-1 block">
                      {vitals[0]?.pulse || 72}
                    </span>
                    <span className="text-[10px] text-slate-400">bpm (Regular)</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">Fasting Glucose</span>
                    <span className="text-lg font-mono font-black text-slate-900 mt-1 block">
                      {vitals[0]?.glucose || 96}
                    </span>
                    <span className="text-[10px] text-slate-400">mg/dL</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">SpO2 / Temp</span>
                    <span className="text-lg font-mono font-black text-slate-900 mt-1 block">
                      {vitals[0]?.spo2 || 98}%
                    </span>
                    <span className="text-[10px] text-slate-400">· {vitals[0]?.temperature || 98.4}°F</span>
                  </div>
                </div>
              </div>

              {/* Active Conditions & Current Medications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Diagnosed Chronic Conditions
                  </h3>
                  <div className="space-y-2 text-xs">
                    {patient.diagnosedConditions.length > 0 ? (
                      patient.diagnosedConditions.map((c, i) => (
                        <div key={i} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                          <span className="font-bold text-slate-800">{c.condition}</span>
                          <span className="text-[10px] text-teal-700 capitalize font-semibold">{c.status}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 text-xs italic">No chronic diagnoses on record.</p>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Active Outpatient Medications
                  </h3>
                  <div className="space-y-2 text-xs">
                    {medications.map((m) => (
                      <div key={m.id} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-800 block">{m.name}</span>
                          <span className="text-[11px] text-slate-500">{m.dosage} · {m.frequency}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">{m.remainingPills} left</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Clinical Progress Notes History */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Attending Physician SOAP Progress Notes
                </h3>
                <div className="space-y-3">
                  {patientNotes.length > 0 ? (
                    patientNotes.map((n) => (
                      <div key={n.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2 text-xs">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                          <span className="font-bold text-slate-900">{n.doctorName} ({n.doctorSpecialty})</span>
                          <span className="text-slate-400 font-mono text-[11px]">
                            {new Date(n.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <p><strong>Subjective:</strong> {n.subjective}</p>
                        <p><strong>Objective:</strong> {n.objective}</p>
                        <p><strong>Assessment:</strong> <span className="text-slate-900 font-semibold">{n.assessment}</span></p>
                        <p><strong>Plan:</strong> <span className="text-teal-800 font-semibold">{n.plan}</span></p>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-xs italic">No clinical progress notes on file for this patient.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Mode 2: Write Clinical Progress Note (SOAP format) */}
          {portalMode === 'notes' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  New Clinical Progress Note (SOAP) for {patient.name}
                </h3>
                <p className="text-xs text-slate-500">Official medical record documentation</p>
              </div>

              <form onSubmit={handleSaveSoapNote} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subjective (History of Present Illness & Patient Statements)
                  </label>
                  <textarea
                    rows={2}
                    value={subjective}
                    onChange={(e) => setSubjective(e.target.value)}
                    placeholder="Patient reports adherence to medications; complains of episodic tension..."
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Objective (Physical Exam Findings & Telemetry)
                  </label>
                  <textarea
                    rows={2}
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    placeholder={`BP: ${vitals[0]?.systolic || 120}/${vitals[0]?.diastolic || 80} mmHg, HR: 72 bpm regular.`}
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assessment (Clinical Diagnosis & Differential)
                  </label>
                  <input
                    type="text"
                    value={assessment}
                    onChange={(e) => setAssessment(e.target.value)}
                    placeholder="e.g. 1. Essential Hypertension, controlled. 2. Impaired fasting glucose."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Plan (Therapeutics, Follow-up, Lab Orders)
                  </label>
                  <textarea
                    rows={2}
                    value={plan}
                    onChange={(e) => setPlan(e.target.value)}
                    placeholder="Continue current medical regimen. Repeat metabolic profile in 6 months."
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setPortalMode('chart')}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors"
                  >
                    Sign & Save Progress Note
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Mode 3: Issue Digital Prescription */}
          {portalMode === 'prescribe' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Generate Verified Digital Prescription for {patient.name}
                </h3>
                <p className="text-xs text-slate-500">Direct transmission to patient vault and community pharmacy</p>
              </div>

              {rxSuccessMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Prescription issued and dispatched to patient vault!</span>
                </div>
              )}

              <form onSubmit={handleIssuePrescription} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Medication / Molecule Name
                    </label>
                    <input
                      type="text"
                      value={rxDrugName}
                      onChange={(e) => setRxDrugName(e.target.value)}
                      placeholder="e.g. Amlodipine Besylate, Lisinopril"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Dosage & Formulation
                    </label>
                    <input
                      type="text"
                      value={rxDosage}
                      onChange={(e) => setRxDosage(e.target.value)}
                      placeholder="e.g. 5 mg Oral Tablet"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Dosing Frequency
                    </label>
                    <select
                      value={rxFrequency}
                      onChange={(e) => setRxFrequency(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="Once Daily (Morning)">Once Daily (Morning)</option>
                      <option value="Twice Daily (Morning & Evening)">Twice Daily</option>
                      <option value="Once Daily at Bedtime">Once Daily at Bedtime</option>
                      <option value="As Needed for Acute Symptoms (PRN)">As Needed (PRN)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Special Intake Instructions
                    </label>
                    <input
                      type="text"
                      value={rxInstructions}
                      onChange={(e) => setRxInstructions(e.target.value)}
                      placeholder="Take with full glass of water. Avoid grapefruit."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setPortalMode('chart')}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
                  >
                    Sign & Transmit Digital Rx
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
