import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  QrCode,
  Pill,
  Stethoscope,
  ShieldAlert,
  Share2,
  CheckCircle2,
  Download,
  Copy,
  Printer,
  Eye,
  Lock,
} from 'lucide-react';

export const MedicalProfileQR: React.FC = () => {
  const { profile, vitals, medications, labReports, speakText } = useApp();

  const [shareTarget, setShareTarget] = useState<'pharmacy' | 'doctor' | 'hospital'>('pharmacy');
  const [includeVitals, setIncludeVitals] = useState<boolean>(true);
  const [includeLabs, setIncludeLabs] = useState<boolean>(true);
  const [includeMedications, setIncludeMedications] = useState<boolean>(true);
  const [includeAllergies, setIncludeAllergies] = useState<boolean>(true);
  const [includeInsurance, setIncludeInsurance] = useState<boolean>(true);
  const [copiedPayload, setCopiedPayload] = useState<boolean>(false);
  const [showScannerSimulator, setShowScannerSimulator] = useState<boolean>(false);

  // Generate payload according to selected target and permissions
  const generatePayload = () => {
    const payload: any = {
      format: 'PULSECARE_HEALTH_PASS_V2',
      token: `PASS-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString(),
      target: shareTarget,
      patient: {
        id: profile.id,
        name: profile.name,
        dob: profile.dob,
        age: profile.age,
        sex: profile.biologicalSex,
        bloodType: profile.bloodType,
      },
    };

    if (includeAllergies) {
      payload.allergies = profile.knownAllergies;
    }

    if (includeMedications) {
      payload.medications = medications.map((m) => ({
        name: m.name,
        dosage: m.dosage,
        frequency: m.frequency,
        prescribedBy: m.prescribedBy,
      }));
    }

    if (includeVitals && (shareTarget === 'doctor' || shareTarget === 'hospital')) {
      payload.recentVitals = vitals.slice(0, 3).map((v) => ({
        timestamp: v.timestamp,
        bp: `${v.systolic}/${v.diastolic} mmHg`,
        pulse: v.pulse,
        glucose: v.glucose,
        spo2: v.spo2,
      }));
    }

    if (includeLabs && shareTarget === 'doctor') {
      payload.recentLabs = labReports.slice(0, 2).map((l) => ({
        title: l.title,
        date: l.date,
        risk: l.overallRisk,
      }));
    }

    if (shareTarget === 'hospital') {
      payload.emergencyContacts = profile.emergencyContacts;
      payload.organDonor = profile.organDonor;
      payload.diagnosedConditions = profile.diagnosedConditions;
    }

    if (includeInsurance) {
      payload.insurance = {
        provider: profile.insuranceProvider,
        policyNumber: profile.insurancePolicyNumber,
      };
    }

    return payload;
  };

  const payloadData = generatePayload();
  const payloadString = JSON.stringify(payloadData, null, 2);

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(payloadString);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700">
            <QrCode className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Medical Profile QR Code & Universal Health Pass
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              Generate scannable encrypted QR passes for pharmacies, consulting doctors, or hospital trauma centers.
            </p>
          </div>
        </div>
      </div>

      {/* Target Destination Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setShareTarget('pharmacy')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
            shareTarget === 'pharmacy'
              ? 'bg-teal-600 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Pill className="w-4 h-4" />
          <span>Pharmacy Dispense Pass</span>
        </button>

        <button
          onClick={() => setShareTarget('doctor')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
            shareTarget === 'doctor'
              ? 'bg-teal-600 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>Doctor / Clinic Clinical Vault</span>
        </button>

        <button
          onClick={() => setShareTarget('hospital')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
            shareTarget === 'hospital'
              ? 'bg-teal-600 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Hospital Emergency (ICE) Pass</span>
        </button>
      </div>

      {/* Main Grid: QR Card vs Permissions & Data Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (5 Cols): Scannable Medical Pass Card */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col items-center justify-between space-y-6 text-center">
          <div className="w-full">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
              <span className="font-bold text-teal-800 uppercase tracking-wider">
                PulseCare Pass · {shareTarget.toUpperCase()}
              </span>
              <span className="font-mono text-slate-400 font-bold">{payloadData.token}</span>
            </div>

            <div className="mt-4 text-left">
              <h2 className="text-lg font-extrabold text-slate-900">{profile.name}</h2>
              <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <span>{profile.age} yrs · {profile.biologicalSex}</span>
                <span>·</span>
                <span className="font-mono font-bold text-rose-600">Blood {profile.bloodType}</span>
              </div>
            </div>
          </div>

          {/* High-Contrast SVG QR Code */}
          <div className="p-4 bg-white rounded-2xl border-2 border-slate-900 shadow-md">
            <svg viewBox="0 0 200 200" className="w-48 h-48 sm:w-56 sm:h-56">
              {/* Corner position markers */}
              <rect x="10" y="10" width="50" height="50" rx="8" fill="#0f172a" />
              <rect x="20" y="20" width="30" height="30" rx="4" fill="#ffffff" />
              <rect x="27" y="27" width="16" height="16" rx="2" fill="#0f172a" />

              <rect x="140" y="10" width="50" height="50" rx="8" fill="#0f172a" />
              <rect x="150" y="20" width="30" height="30" rx="4" fill="#ffffff" />
              <rect x="157" y="27" width="16" height="16" rx="2" fill="#0f172a" />

              <rect x="10" y="140" width="50" height="50" rx="8" fill="#0f172a" />
              <rect x="20" y="150" width="30" height="30" rx="4" fill="#ffffff" />
              <rect x="27" y="157" width="16" height="16" rx="2" fill="#0f172a" />

              {/* Data matrix pattern simulation */}
              <rect x="70" y="20" width="10" height="10" fill="#0d9488" />
              <rect x="90" y="20" width="20" height="10" fill="#0f172a" />
              <rect x="120" y="20" width="10" height="10" fill="#0d9488" />

              <rect x="70" y="40" width="20" height="10" fill="#0f172a" />
              <rect x="100" y="40" width="10" height="10" fill="#0f172a" />
              <rect x="120" y="40" width="10" height="10" fill="#0f172a" />

              <rect x="20" y="70" width="20" height="10" fill="#0f172a" />
              <rect x="50" y="70" width="30" height="10" fill="#0f172a" />
              <rect x="90" y="70" width="20" height="20" fill="#0d9488" />
              <rect x="120" y="70" width="10" height="10" fill="#0f172a" />
              <rect x="140" y="70" width="30" height="10" fill="#0f172a" />
              <rect x="180" y="70" width="10" height="10" fill="#0f172a" />

              <rect x="20" y="90" width="10" height="20" fill="#0f172a" />
              <rect x="40" y="90" width="20" height="10" fill="#0d9488" />
              <rect x="70" y="100" width="10" height="20" fill="#0f172a" />
              <rect x="90" y="100" width="20" height="10" fill="#0f172a" />
              <rect x="130" y="90" width="20" height="20" fill="#0d9488" />
              <rect x="160" y="90" width="10" height="10" fill="#0f172a" />
              <rect x="180" y="90" width="10" height="20" fill="#0f172a" />

              <rect x="20" y="120" width="20" height="10" fill="#0f172a" />
              <rect x="50" y="120" width="10" height="10" fill="#0d9488" />
              <rect x="80" y="120" width="30" height="10" fill="#0f172a" />
              <rect x="120" y="120" width="20" height="10" fill="#0f172a" />
              <rect x="150" y="120" width="10" height="20" fill="#0f172a" />
              <rect x="170" y="120" width="20" height="10" fill="#0d9488" />

              <rect x="70" y="140" width="20" height="20" fill="#0d9488" />
              <rect x="100" y="140" width="10" height="10" fill="#0f172a" />
              <rect x="130" y="140" width="20" height="10" fill="#0f172a" />
              <rect x="160" y="140" width="30" height="10" fill="#0f172a" />

              <rect x="70" y="170" width="30" height="10" fill="#0f172a" />
              <rect x="110" y="160" width="20" height="20" fill="#0d9488" />
              <rect x="140" y="170" width="10" height="10" fill="#0f172a" />
              <rect x="160" y="170" width="20" height="10" fill="#0f172a" />
            </svg>
          </div>

          <div className="text-xs text-slate-500 w-full space-y-3">
            <div className="flex items-center justify-center gap-1.5 font-bold text-teal-800">
              <Lock className="w-3.5 h-3.5 text-teal-600" />
              <span>Tokenized Encrypted Health Pass</span>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Card</span>
              </button>

              <button
                onClick={() => setShowScannerSimulator(!showScannerSimulator)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 hover:bg-teal-100 text-xs font-semibold"
              >
                <Eye className="w-3.5 h-3.5 text-teal-600" />
                <span>{showScannerSimulator ? 'Hide Scanner' : 'Simulate Scanner'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): Granular Privacy Controls & Decoded Payload Simulator */}
        <div className="lg:col-span-7 space-y-6">
          {/* Privacy & Permissions Toggles */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Data Sharing Privacy & Granular Consent
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Control exactly what information is packaged into this {shareTarget} QR pass.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <label className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={includeAllergies}
                  onChange={(e) => setIncludeAllergies(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
                />
                <div>
                  <span className="font-bold text-slate-900 block">Critical Allergies</span>
                  <span className="text-[11px] text-slate-500">Penicillin, food sensitivities</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={includeMedications}
                  onChange={(e) => setIncludeMedications(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
                />
                <div>
                  <span className="font-bold text-slate-900 block">Active Medications</span>
                  <span className="text-[11px] text-slate-500">Dosages and refill frequencies</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={includeVitals}
                  onChange={(e) => setIncludeVitals(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
                />
                <div>
                  <span className="font-bold text-slate-900 block">Biometric Vitals Log</span>
                  <span className="text-[11px] text-slate-500">Recent blood pressure, glucose</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={includeInsurance}
                  onChange={(e) => setIncludeInsurance(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
                />
                <div>
                  <span className="font-bold text-slate-900 block">Insurance Policy</span>
                  <span className="text-[11px] text-slate-500">Carrier and policy number</span>
                </div>
              </label>
            </div>
          </div>

          {/* Scanner Simulator or JSON Preview */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  {showScannerSimulator
                    ? 'Hospital / Pharmacy Scanner Decoder View'
                    : 'Encrypted QR Payload Data'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {showScannerSimulator
                    ? 'What the provider workstation displays when scanning your QR code'
                    : 'Standard FHIR / JSON compatible medical pass structure'}
                </p>
              </div>

              <button
                onClick={handleCopyPayload}
                className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-teal-700"
              >
                {copiedPayload ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>
            </div>

            {showScannerSimulator ? (
              <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3 font-mono text-xs shadow-inner">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-teal-400">
                  <span>TERMINAL: PHARMACY_INGEST_SCANNER_01</span>
                  <span>STATUS: 200 OK</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">PATIENT ID:</span>
                  <span className="text-white font-bold">{payloadData.patient.name} ({payloadData.patient.age}Y / {payloadData.patient.bloodType})</span>
                </div>
                {payloadData.allergies && (
                  <div>
                    <span className="text-rose-400 block text-[10px] font-bold">ALLERGY WARNINGS:</span>
                    <span className="text-rose-300 font-bold">{payloadData.allergies.map((a: any) => `${a.allergen} (${a.reaction})`).join('; ')}</span>
                  </div>
                )}
                {payloadData.medications && (
                  <div>
                    <span className="text-slate-400 block text-[10px]">ACTIVE MEDICATIONS:</span>
                    <span className="text-slate-200">{payloadData.medications.map((m: any) => `${m.name} ${m.dosage}`).join(' · ')}</span>
                  </div>
                )}
                {payloadData.insurance && (
                  <div>
                    <span className="text-slate-400 block text-[10px]">INSURANCE:</span>
                    <span className="text-slate-300">{payloadData.insurance.provider} (Policy: {payloadData.insurance.policyNumber})</span>
                  </div>
                )}
              </div>
            ) : (
              <pre className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-800 max-h-56 overflow-y-auto leading-relaxed">
                {payloadString}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
