import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserProfile } from '../../types/health';
import {
  Users,
  UserCheck,
  Plus,
  Shield,
  Heart,
  Check,
  X,
  Sparkles,
} from 'lucide-react';

export const ProfileSwitcherModal: React.FC = () => {
  const {
    profiles,
    activeProfileId,
    switchProfile,
    addProfile,
    isProfileModalOpen,
    setIsProfileModalOpen,
  } = useApp();

  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('30');
  const [biologicalSex, setBiologicalSex] = useState<'female' | 'male' | 'other'>('female');
  const [bloodType, setBloodType] = useState<'O+' | 'O-' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-'>('O+');
  const [allergiesText, setAllergiesText] = useState('');

  if (!isProfileModalOpen) return null;

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedAllergies = allergiesText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((item) => ({
        allergen: item,
        severity: 'moderate' as const,
        reaction: 'Hypersensitivity / Rash',
      }));

    const newProf: UserProfile = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      age: Number(age) || 30,
      dob: '1995-01-01',
      biologicalSex,
      bloodType,
      organDonor: true,
      heightCm: 170,
      weightKg: 68,
      knownAllergies: parsedAllergies,
      diagnosedConditions: [],
      pastSurgeries: [],
      familyHistory: [],
      primaryDoctor: {
        name: 'Dr. Aris Thorne, MD',
        specialty: 'Internal Medicine',
        hospital: 'Metropolitan General Hospital',
        phone: '+1 (555) 349-8820',
      },
      emergencyContacts: [
        {
          id: `c_${Date.now()}`,
          name: 'Primary Emergency Contact',
          relationship: 'Family Member',
          phone: '+1 (555) 000-1122',
          isPrimaryICE: true,
        },
      ],
      insuranceProvider: 'Blue Cross Shield Plus',
      insurancePolicyNumber: `BCS-${Math.floor(1000000 + Math.random() * 9000000)}`,
    };

    addProfile(newProf);
    setShowAddForm(false);
    setName('');
    setAllergiesText('');
    setIsProfileModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
              <Users className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Switch Family Health Profile</h2>
              <p className="text-xs text-slate-500">Demographic views, biometrics, and features adapt per profile</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsProfileModalOpen(false);
              setShowAddForm(false);
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Profiles List */}
        {!showAddForm ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profiles.map((p) => {
                const isActive = p.id === activeProfileId;
                const isFemale = p.biologicalSex === 'female';
                const isChild = p.age < 18;
                const isSenior = p.age >= 65;

                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      switchProfile(p.id);
                      setIsProfileModalOpen(false);
                    }}
                    className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      isActive
                        ? 'bg-teal-50/70 border-teal-600 ring-2 ring-teal-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-slate-900">
                          {p.name}
                        </span>
                        {isActive && (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-teal-700 bg-teal-100/80 px-2 py-0.5 rounded-full">
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>Active</span>
                          </span>
                        )}
                      </div>

                      <div className="mt-1 text-xs text-slate-600 flex items-center gap-1.5 flex-wrap">
                        <span className="capitalize">{p.biologicalSex}</span>
                        <span>·</span>
                        <span>{p.age} yrs</span>
                        <span>·</span>
                        <span className="font-mono font-bold text-teal-800">Blood {p.bloodType}</span>
                      </div>

                      <div className="mt-2 flex items-center gap-1.5 flex-wrap text-[10px] text-slate-500">
                        {isFemale && (
                          <span className="bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded border border-rose-200">
                            Cycle & Hormonal Active
                          </span>
                        )}
                        {isChild && (
                          <span className="bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded border border-sky-200">
                            Pediatric Milestones
                          </span>
                        )}
                        {isSenior && (
                          <span className="bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200">
                            Senior Fall & Mobility
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                      {p.knownAllergies.length > 0
                        ? `Allergies: ${p.knownAllergies.map((a) => a.allergen).join(', ')}`
                        : 'No known drug allergies'}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Note: "Cycle & Hormonal" suite is only accessible for female profiles.
              </span>
              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Family Member</span>
              </button>
            </div>
          </div>
        ) : (
          /* Add Profile Form */
          <form onSubmit={handleCreateProfile} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Leo Vance"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Age (Years)
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Biological Sex
                </label>
                <select
                  value={biologicalSex}
                  onChange={(e: any) => setBiologicalSex(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="female">Female (Enables Menstrual Suite)</option>
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
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono font-bold"
                >
                  {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bt) => (
                    <option key={bt} value={bt}>{bt}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Known Drug / Food Allergies (Comma separated)
              </label>
              <input
                type="text"
                value={allergiesText}
                onChange={(e) => setAllergiesText(e.target.value)}
                placeholder="e.g. Penicillin, Peanuts, Sulfa"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Back to Profiles
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
              >
                Save & Switch to Profile
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
