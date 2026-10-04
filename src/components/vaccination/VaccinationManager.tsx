import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VaccinationRecord } from '../../types/health';
import {
  Shield,
  Calendar,
  AlertCircle,
  Plus,
  CheckCircle2,
  Clock,
  Trash2,
  Syringe,
  FileCheck,
  Building,
  BellRing,
  Download,
} from 'lucide-react';

export const VaccinationManager: React.FC = () => {
  const { vaccinations, addVaccination, updateVaccination, deleteVaccination, profile } = useApp();

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Form states
  const [vaccineName, setVaccineName] = useState('');
  const [targetDisease, setTargetDisease] = useState('');
  const [dateAdministered, setDateAdministered] = useState(new Date().toISOString().split('T')[0]);
  const [doseNumber, setDoseNumber] = useState('1');
  const [totalDoses, setTotalDoses] = useState('1');
  const [batchNumber, setBatchNumber] = useState('');
  const [administeredBy, setAdministeredBy] = useState('Dr. Aris Thorne, MD');
  const [facility, setFacility] = useState('Metropolitan General Hospital');
  const [boosterDate, setBoosterDate] = useState('');
  const [category, setCategory] = useState<'routine_adult' | 'seasonal' | 'travel' | 'childhood' | 'specialized'>('routine_adult');
  const [notes, setNotes] = useState('');

  // Identify boosters due
  const boostersDue = vaccinations.filter(
    (v) => v.status === 'booster_due' || v.status === 'overdue'
  );

  const filteredVaccinations = vaccinations.filter((v) => {
    if (filterCategory === 'all') return true;
    return v.category === filterCategory;
  });

  const handleCreateVaccination = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vaccineName.trim()) return;

    addVaccination({
      vaccineName: vaccineName.trim(),
      targetDisease: targetDisease.trim() || 'Immunization Protection',
      dateAdministered,
      doseNumber: Number(doseNumber) || 1,
      totalDosesRecommended: Number(totalDoses) || 1,
      batchOrLotNumber: batchNumber.trim() || undefined,
      administeredBy: administeredBy.trim() || 'Licensed Healthcare Provider',
      clinicOrFacility: facility.trim() || 'Health Center',
      nextBoosterDueDate: boosterDate || undefined,
      status: 'up_to_date',
      category,
      notes: notes.trim() || undefined,
    });

    setShowAddModal(false);
    // Reset form
    setVaccineName('');
    setTargetDisease('');
    setBatchNumber('');
    setBoosterDate('');
    setNotes('');
  };

  const handleMarkBoosterAdministered = (v: VaccinationRecord) => {
    const today = new Date().toISOString().split('T')[0];
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const nextYearStr = nextYear.toISOString().split('T')[0];

    updateVaccination(v.id, {
      dateAdministered: today,
      status: 'up_to_date',
      doseNumber: v.doseNumber + 1,
      nextBoosterDueDate: nextYearStr,
      notes: `${v.notes || ''} [Booster updated on ${today}]`.trim(),
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700">
              <Shield className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Vaccination Record Manager & Booster Registry
              </h1>
              <p className="text-sm text-slate-600 mt-0.5">
                Official immunization pass, batch tracking, and intelligent booster reminders for {profile.name}.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Record Vaccination</span>
          </button>
        </div>
      </div>

      {/* Smart Booster Reminder Banner (If any boosters due) */}
      {boostersDue.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 space-y-3">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-900">
            <BellRing className="w-4 h-4 text-amber-700 animate-bounce" />
            <span>Action Required: Upcoming Immunization Boosters</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {boostersDue.map((b) => (
              <div
                key={b.id}
                className="p-3.5 rounded-xl bg-white/90 border border-amber-200 flex flex-col justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{b.vaccineName}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 uppercase">
                      Booster Due
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1">{b.notes || `Recommended for protection against ${b.targetDisease}.`}</p>
                  <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Target Due Date: {b.nextBoosterDueDate || 'Autumn 2026'}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleMarkBoosterAdministered(b)}
                  className="w-full py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Booster Received Today</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Overview Cards */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Verified Immunization History</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {vaccinations.length} active records on file for patient ID: <span className="font-mono text-slate-700">{profile.id}</span>
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar p-1 bg-slate-100 rounded-lg text-xs">
            {[
              { id: 'all', label: 'All Vaccines' },
              { id: 'routine_adult', label: 'Routine Adult' },
              { id: 'seasonal', label: 'Seasonal Flu/COVID' },
              { id: 'specialized', label: 'Specialized/HPV' },
              { id: 'childhood', label: 'Childhood Milestones' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-3 py-1.5 rounded-md font-semibold whitespace-nowrap transition-colors ${
                  filterCategory === cat.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Vaccination Table / Cards */}
        <div className="space-y-3">
          {filteredVaccinations.map((vac) => {
            const isUpToDate = vac.status === 'up_to_date';
            const isDue = vac.status === 'booster_due';

            return (
              <div
                key={vac.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-900">{vac.vaccineName}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                        isUpToDate
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : isDue
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {vac.status.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                      Dose {vac.doseNumber} of {vac.totalDosesRecommended}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    Target: <strong className="text-slate-800">{vac.targetDisease}</strong>
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-500 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Administered: {vac.dateAdministered}</span>
                    </span>
                    {vac.batchOrLotNumber && (
                      <span className="font-mono">Lot: {vac.batchOrLotNumber}</span>
                    )}
                    <span className="flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>{vac.clinicOrFacility}</span>
                    </span>
                  </div>

                  {vac.notes && (
                    <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg mt-1">
                      "{vac.notes}"
                    </p>
                  )}
                </div>

                {/* Right Action & Booster schedule */}
                <div className="flex md:flex-col items-end justify-between gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-right text-xs">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Next Booster
                    </span>
                    <span className="font-bold text-slate-800 font-mono">
                      {vac.nextBoosterDueDate || 'Lifelong Protection'}
                    </span>
                  </div>

                  <button
                    onClick={() => deleteVaccination(vac.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Record Vaccination Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Record New Vaccination</h3>
                <p className="text-xs text-slate-500 mt-0.5">Add verified dose to health immunization vault</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateVaccination} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Vaccine Brand / Name
                  </label>
                  <input
                    type="text"
                    value={vaccineName}
                    onChange={(e) => setVaccineName(e.target.value)}
                    placeholder="e.g. Shingrix, Tdap, MMR"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Disease / Pathogen
                  </label>
                  <input
                    type="text"
                    value={targetDisease}
                    onChange={(e) => setTargetDisease(e.target.value)}
                    placeholder="e.g. Shingles, Tetanus"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date Administered
                  </label>
                  <input
                    type="date"
                    value={dateAdministered}
                    onChange={(e) => setDateAdministered(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Dose Number
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={doseNumber}
                    onChange={(e) => setDoseNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Total Doses
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={totalDoses}
                    onChange={(e) => setTotalDoses(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Batch / Lot Number
                  </label>
                  <input
                    type="text"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    placeholder="e.g. LOT-88192-A"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Next Booster Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={boosterDate}
                    onChange={(e) => setBoosterDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Clinic / Pharmacy Facility
                  </label>
                  <input
                    type="text"
                    value={facility}
                    onChange={(e) => setFacility(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full px-2 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="routine_adult">Routine Adult</option>
                    <option value="seasonal">Seasonal (Flu/COVID)</option>
                    <option value="travel">Travel</option>
                    <option value="specialized">Specialized</option>
                    <option value="childhood">Childhood Milestone</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Provider Notes / Adverse Reactions
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Mild tenderness at injection site for 12 hours"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
                >
                  Save Immunization
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
