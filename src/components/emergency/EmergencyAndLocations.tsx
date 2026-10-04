import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HealthcareFacility } from '../../types/health';
import {
  ShieldAlert,
  PhoneCall,
  MapPin,
  Ambulance,
  AlertOctagon,
  Clock,
  Heart,
  User,
  Share2,
  Navigation,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';

export const EmergencyAndLocations: React.FC = () => {
  const { profile, facilities, sosState, triggerSOS, cancelSOS } = useApp();

  const [facilityFilter, setFacilityFilter] = useState<'all' | 'emergency_room' | 'clinic' | 'pharmacy'>('all');
  const [copiedSms, setCopiedSms] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<HealthcareFacility>(facilities[0]);

  // Filter facilities
  const filteredFacilities = facilities.filter((f) => {
    if (facilityFilter === 'all') return true;
    return f.type === facilityFilter;
  });

  // Emergency SMS text builder
  const emergencyMessage = `EMERGENCY ALERT from ${profile.name}: I need medical help. My GPS coordinates are Lat: 37.7749, Lng: -122.4194 (Metro Area). My Blood Type is ${profile.bloodType}. Known Severe Allergies: ${profile.knownAllergies.map(a => `${a.allergen} (${a.reaction})`).join(', ')}. Conditions: ${profile.diagnosedConditions.map(c => c.condition).join(', ')}. Primary ICE Contact: ${profile.emergencyContacts[0]?.name} (${profile.emergencyContacts[0]?.phone}).`;

  const handleCopyEmergencySMS = () => {
    navigator.clipboard.writeText(emergencyMessage);
    setCopiedSms(true);
    setTimeout(() => setCopiedSms(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700">
            <ShieldAlert className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              SOS Emergency Response & Location-Based Care
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              Instant 911 dispatch, critical ICE Medical ID card, and nearby 24/7 trauma centers & pharmacies.
            </p>
          </div>
        </div>
      </div>

      {/* Hero SOS Trigger / Live Dispatch Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm overflow-hidden relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-rose-600">
                Direct Emergency Command
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {sosState.dispatched
                ? 'Ambulance Unit Dispatched & En Route'
                : sosState.active
                ? `Initiating Dispatch in ${sosState.countdown} seconds...`
                : 'Need Immediate Emergency Assistance?'}
            </h2>
            <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
              {sosState.dispatched
                ? `Dispatch ${sosState.dispatchId} is in transit to your current GPS coordinates. Local ER triage has been notified with your blood type and allergy profile.`
                : 'Pressing the SOS button alerts emergency services and transmits your critical Medical ID to emergency contacts.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {sosState.active ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={cancelSOS}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-colors shadow-sm"
                >
                  Cancel False Alarm
                </button>
              </div>
            ) : (
              <button
                onClick={triggerSOS}
                className="px-8 py-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm shadow-md transition-all active:scale-95 flex items-center gap-2.5 tracking-wide animate-pulse"
              >
                <AlertOctagon className="w-5 h-5 stroke-[2.5]" />
                <span>TRIGGER SOS 911</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Dispatch Tracker Banner */}
        {sosState.dispatched && (
          <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200">
              <span className="text-[11px] font-bold text-rose-900 uppercase">Estimated Arrival</span>
              <div className="text-xl font-black text-rose-700 font-mono mt-0.5">
                {sosState.etaMinutes} Minutes
              </div>
              <span className="text-[10px] text-slate-500">Unit: Mobile Intensive Care 14</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-700 uppercase">Dispatch Reference</span>
              <div className="text-sm font-bold text-slate-900 font-mono mt-1">
                {sosState.dispatchId}
              </div>
              <span className="text-[10px] text-slate-500">Transmitted to Metro Dispatch</span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <span className="text-[11px] font-bold text-emerald-900 uppercase">Trauma Hospital</span>
              <div className="text-sm font-bold text-slate-900 mt-1">
                Metropolitan Trauma Center
              </div>
              <span className="text-[10px] text-emerald-700 font-medium">ER Bed Held & Triage Alerted</span>
            </div>
          </div>
        )}
      </div>

      {/* Two Column Grid: Critical Medical ID Card vs Nearby Facility Finder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (5 Cols): Critical Emergency Medical ID Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl border border-rose-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-rose-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
                  ICE
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                    Emergency Medical ID
                  </h2>
                  <span className="text-[10px] text-slate-500">In Case of Emergency Card</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Blood Group</span>
                <div className="text-xl font-black text-rose-600 font-mono">
                  {profile.bloodType}
                </div>
              </div>
            </div>

            {/* Patient Core */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Full Legal Name:</span>
                <span className="font-bold text-slate-900">{profile.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Age & Sex:</span>
                <span className="font-medium text-slate-800">{profile.age} yrs · {profile.biologicalSex}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Organ Donor:</span>
                <span className="font-bold text-emerald-700">{profile.organDonor ? 'Registered Organ Donor' : 'No'}</span>
              </div>
            </div>

            {/* Severe Allergies Highlight */}
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 space-y-1.5">
              <span className="text-[11px] font-bold text-rose-900 uppercase tracking-wider block">
                Critical Drug & Food Allergies
              </span>
              {profile.knownAllergies.map((alg, i) => (
                <div key={i} className="text-xs text-rose-800 flex items-center justify-between">
                  <span className="font-bold">{alg.allergen}</span>
                  <span className="text-[11px] italic">({alg.reaction} · {alg.severity})</span>
                </div>
              ))}
            </div>

            {/* Chronic Conditions */}
            <div className="text-xs space-y-1">
              <span className="text-slate-500 font-semibold block">Diagnosed Chronic Conditions:</span>
              <div className="flex flex-wrap gap-1.5">
                {profile.diagnosedConditions.map((c, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                    {c.condition}
                  </span>
                ))}
              </div>
            </div>

            {/* Emergency ICE Contacts */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-xs font-bold text-slate-900 block">
                Primary ICE Contacts (1-Tap Dial)
              </span>
              {profile.emergencyContacts.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{c.name}</span>
                    <span className="text-slate-500 ml-1.5 font-medium">({c.relationship})</span>
                  </div>
                  <a
                    href={`tel:${c.phone}`}
                    className="flex items-center gap-1 px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-md text-[11px] transition-colors"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>Call</span>
                  </a>
                </div>
              ))}
            </div>

            {/* Quick Share SMS */}
            <div className="pt-2">
              <button
                onClick={handleCopyEmergencySMS}
                className="w-full py-2 px-3 text-xs font-bold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors"
              >
                {copiedSms ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Emergency SMS Copied to Clipboard</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-slate-500" />
                    <span>Copy GPS & Medical ID Text for 911 / Family</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (7 Cols): Location-Based Care Finder & Map */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Nearby Care Facilities & Pharmacies</h2>
                <p className="text-xs text-slate-500 mt-0.5">Real-time distance, emergency status, and bed telemetry</p>
              </div>

              {/* Filter */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                <button
                  onClick={() => setFacilityFilter('all')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    facilityFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFacilityFilter('emergency_room')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    facilityFilter === 'emergency_room' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ER Trauma
                </button>
                <button
                  onClick={() => setFacilityFilter('pharmacy')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    facilityFilter === 'pharmacy' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Pharmacies
                </button>
              </div>
            </div>

            {/* Interactive Vector Map Preview */}
            <div className="relative h-56 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
              {/* Map background grid and roads */}
              <svg viewBox="0 0 600 240" className="w-full h-full object-cover">
                <rect width="600" height="240" fill="#f8fafc" />
                {/* Water body */}
                <path d="M 460 0 Q 420 80, 480 160 T 430 240 L 600 240 L 600 0 Z" fill="#e0f2fe" />
                
                {/* Roads */}
                <line x1="0" y1="120" x2="600" y2="120" stroke="#e2e8f0" stroke-width="8" />
                <line x1="200" y1="0" x2="200" y2="240" stroke="#e2e8f0" stroke-width="8" />
                <line x1="380" y1="0" x2="380" y2="240" stroke="#e2e8f0" stroke-width="6" />
                <line x1="0" y1="60" x2="600" y2="60" stroke="#f1f5f9" stroke-width="4" />
                <line x1="0" y1="180" x2="600" y2="180" stroke="#f1f5f9" stroke-width="4" />

                {/* Patient location pin */}
                <circle cx="280" cy="130" r="14" fill="#0d9488" fill-opacity="0.2" className="animate-ping" />
                <circle cx="280" cy="130" r="6" fill="#0d9488" stroke="#ffffff" stroke-width="2" />
                <text x="280" y="155" text-anchor="middle" font-size="10" font-weight="700" fill="#0f172a">You (Current GPS)</text>

                {/* Facility Pins */}
                {facilities.map((fac, idx) => {
                  const coords = [
                    { x: 180, y: 70 },
                    { x: 340, y: 90 },
                    { x: 230, y: 170 },
                    { x: 420, y: 130 },
                  ][idx] || { x: 200, y: 100 };

                  const isSel = selectedFacility.id === fac.id;

                  return (
                    <g
                      key={fac.id}
                      className="cursor-pointer"
                      onClick={() => setSelectedFacility(fac)}
                    >
                      <circle
                        cx={coords.x}
                        cy={coords.y}
                        r={isSel ? "12" : "9"}
                        fill={fac.type === 'emergency_room' ? '#e11d48' : '#0284c7'}
                        stroke="#ffffff"
                        stroke-width="2"
                      />
                      <text
                        x={coords.x}
                        y={coords.y - 12}
                        text-anchor="middle"
                        font-size="9"
                        font-weight="700"
                        fill="#1e293b"
                      >
                        {fac.name.split(' ')[0]}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Map Floating Info Badge */}
              <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] font-semibold text-slate-700 border border-slate-200 shadow-xs">
                Metro Health Geographic Network · 4 Live Facilities
              </div>
            </div>

            {/* Facilities List Cards */}
            <div className="space-y-3">
              {filteredFacilities.map((fac) => {
                const isSelected = selectedFacility.id === fac.id;
                return (
                  <div
                    key={fac.id}
                    onClick={() => setSelectedFacility(fac)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-teal-50/50 border-teal-600'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{fac.name}</span>
                          <span className="text-[10px] font-semibold text-slate-500">
                            {fac.distanceKm} km away
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{fac.address}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${fac.phone}`}
                          className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Call</span>
                        </a>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                      <span className="text-emerald-700 font-semibold">{fac.currentStatus}</span>
                      {fac.availableBeds && (
                        <span className="text-slate-500">
                          {fac.availableBeds} ER Beds Available
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
