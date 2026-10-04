import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Shield,
  Heart,
  AlertCircle,
  Plus,
  Trash2,
  CheckCircle2,
  FileText,
  Phone,
  Sparkles,
  Sliders,
} from 'lucide-react';

export const PersonalizedProfile: React.FC = () => {
  const { profile, updateProfile, speakText } = useApp();

  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(String(profile.age));
  const [biologicalSex, setBiologicalSex] = useState(profile.biologicalSex);
  const [bloodType, setBloodType] = useState(profile.bloodType);
  const [organDonor, setOrganDonor] = useState(profile.organDonor);
  const [heightCm, setHeightCm] = useState(String(profile.heightCm));
  const [weightKg, setWeightKg] = useState(String(profile.weightKg));
  const [newAllergen, setNewAllergen] = useState('');
  const [newAllergyReaction, setNewAllergyReaction] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim(),
      age: Number(age) || 30,
      biologicalSex: biologicalSex as any,
      bloodType: bloodType as any,
      organDonor,
      heightCm: Number(heightCm) || 170,
      weightKg: Number(weightKg) || 70,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    speakText('Profile demographics successfully updated.');
  };

  const handleAddAllergy = () => {
    if (!newAllergen.trim()) return;
    const updated = [
      ...profile.knownAllergies,
      {
        allergen: newAllergen.trim(),
        severity: 'severe' as const,
        reaction: newAllergyReaction.trim() || 'Hives / Anaphylaxis',
      },
    ];
    updateProfile({ knownAllergies: updated });
    setNewAllergen('');
    setNewAllergyReaction('');
  };

  const handleRemoveAllergy = (idx: number) => {
    const updated = profile.knownAllergies.filter((_, i) => i !== idx);
    updateProfile({ knownAllergies: updated });
  };

  const handleAddCondition = () => {
    if (!newCondition.trim()) return;
    const updated = [
      ...profile.diagnosedConditions,
      {
        condition: newCondition.trim(),
        diagnosedYear: new Date().getFullYear(),
        status: 'managed' as const,
      },
    ];
    updateProfile({ diagnosedConditions: updated });
    setNewCondition('');
  };

  const handleRemoveCondition = (idx: number) => {
    const updated = profile.diagnosedConditions.filter((_, i) => i !== idx);
    updateProfile({ diagnosedConditions: updated });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700">
            <User className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Personalized Profile & Clinical Demographics
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              Configuring demographic baselines, chronic condition flags, and critical emergency ICE details.
            </p>
          </div>
        </div>
      </div>

      {/* Main Settings Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left (7 Cols): Demographics Form */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900">Demographic Identifiers</h2>
            <span className="text-xs text-teal-700 font-semibold flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5" /> Dynamic Adjustment Active
            </span>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Age (Years)
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Biological Sex
                </label>
                <select
                  value={biologicalSex}
                  onChange={(e: any) => setBiologicalSex(e.target.value)}
                  className="w-full px-2 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Blood Group
                </label>
                <select
                  value={bloodType}
                  onChange={(e: any) => setBloodType(e.target.value)}
                  className="w-full px-2 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono font-bold"
                >
                  {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bt) => (
                    <option key={bt} value={bt}>{bt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Organ Donor
                </label>
                <select
                  value={organDonor ? 'yes' : 'no'}
                  onChange={(e) => setOrganDonor(e.target.value === 'yes')}
                  className="w-full px-2 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="yes">Yes (Registered)</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              {savedSuccess && (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Demographics successfully saved!</span>
                </span>
              )}
              <button
                type="submit"
                className="ml-auto px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-colors"
              >
                Update Core Profile
              </button>
            </div>
          </form>
        </div>

        {/* Right (5 Cols): Allergies & Chronic Conditions */}
        <div className="lg:col-span-5 space-y-6">
          {/* Allergies Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Known Drug & Food Allergies</h2>
            <div className="space-y-2">
              {profile.knownAllergies.map((alg, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-lg border border-rose-200 bg-rose-50/60 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-rose-900">{alg.allergen}</span>
                    <span className="text-rose-700 text-[11px] block">{alg.reaction}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveAllergy(i)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <input
                type="text"
                value={newAllergen}
                onChange={(e) => setNewAllergen(e.target.value)}
                placeholder="Add allergen (e.g. Sulfa drugs)"
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={handleAddAllergy}
                className="px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-bold hover:bg-teal-700"
              >
                Add
              </button>
            </div>
          </div>

          {/* Diagnosed Conditions Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Diagnosed Chronic Conditions</h2>
            <div className="space-y-2">
              {profile.diagnosedConditions.map((cond, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900">{cond.condition}</span>
                    <span className="text-slate-500 text-[11px] block">
                      Since {cond.diagnosedYear} · {cond.status}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveCondition(i)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <input
                type="text"
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                placeholder="Add condition (e.g. Asthma)"
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={handleAddCondition}
                className="px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-bold hover:bg-teal-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
