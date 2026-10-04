import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Activity,
  Scan,
  FileText,
  AlertTriangle,
  Stethoscope,
  MapPin,
  LifeBuoy,
  Calendar,
  Dumbbell,
  User,
  VolumeX,
  ShieldAlert,
  Eye,
  Users,
  Syringe,
  Flame,
  QrCode,
  Building,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    profile,
    sosState,
    triggerSOS,
    cancelSOS,
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    isSpeaking,
    stopSpeaking,
    setIsProfileModalOpen,
  } = useApp();

  // Strict female check: Cycle & Hormonal section visible ONLY to females
  const isFemale = profile.biologicalSex === 'female';

  const navItems = [
    { id: 'dashboard', label: 'Vitals & Logs', icon: Activity },
    { id: 'symptoms', label: 'Symptom AI', icon: Flame },
    { id: 'vaccinations', label: 'Vaccines & Boosters', icon: Syringe },
    { id: 'scanner', label: 'AI Monitor Scanner', icon: Scan },
    { id: 'lab_reports', label: 'Lab Simplifier', icon: FileText },
    { id: 'risk_detection', label: 'Early Risk Screening', icon: AlertTriangle },
    { id: 'consultations', label: 'Doctor Telehealth', icon: Stethoscope },
    { id: 'provider_portal', label: 'Hospital/Doctor Portal', icon: Building },
    { id: 'qr_pass', label: 'Medical QR Pass', icon: QrCode },
    { id: 'emergency', label: 'SOS & Locations', icon: MapPin },
    { id: 'first_aid', label: 'First Aid Center', icon: LifeBuoy },
    ...(isFemale ? [{ id: 'menstrual', label: 'Cycle & Hormonal', icon: Calendar }] : []),
    { id: 'community', label: 'Fitness & Drives', icon: Dumbbell },
    { id: 'profile', label: 'Medical ID', icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Banner with Brand and Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm">
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">
                  PulseCare<span className="text-teal-600 font-semibold ml-1">AI</span>
                </span>
                <span className="text-xs text-slate-400 font-medium">· Clinical Intelligence</span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Patient Medical Vault & Diagnostic Guidance
              </p>
            </div>
          </div>

          {/* Accessibility, Profile Switcher & Emergency SOS Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Text To Speech Control */}
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold animate-pulse"
                title="Stop reading aloud"
              >
                <VolumeX className="w-4 h-4 text-teal-700" />
                <span>Stop Audio</span>
              </button>
            )}

            {/* Font Size Selector */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5 border border-slate-200" title="Text Size">
              <button
                onClick={() => setFontSize('base')}
                className={`px-2 py-1 text-xs font-semibold rounded ${
                  fontSize === 'base' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-2 py-1 text-xs font-semibold rounded ${
                  fontSize === 'lg' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('xl')}
                className={`px-2 py-1 text-xs font-semibold rounded ${
                  fontSize === 'xl' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                A++
              </button>
            </div>

            {/* High Contrast Toggle */}
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`p-2 rounded-lg border text-xs font-medium transition-colors ${
                highContrast
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
              title="Toggle High Contrast"
            >
              <Eye className="w-4 h-4" />
            </button>

            {/* Profile Switcher Button (Right next to SOS) */}
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold shadow-xs transition-colors"
              title="Switch Patient Profile"
            >
              <div className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center text-xs font-extrabold">
                {profile.name.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <span className="block leading-tight text-slate-900 font-bold">{profile.name}</span>
                <span className="text-[10px] text-slate-500 font-semibold capitalize">
                  {profile.biologicalSex} · {profile.age}y
                </span>
              </div>
              <Users className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>

            {/* Emergency SOS Trigger */}
            {sosState.active ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-600 animate-pulse">
                  {sosState.dispatched ? `Ambulance Dispatched (ETA ${sosState.etaMinutes}m)` : `SOS in ${sosState.countdown}s`}
                </span>
                <button
                  onClick={cancelSOS}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={triggerSOS}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
              >
                <ShieldAlert className="w-4 h-4 stroke-[2.5]" />
                <span className="tracking-wide">SOS 911</span>
              </button>
            )}
          </div>
        </div>

        {/* Primary Horizontal Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-2 border-t border-slate-100">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-teal-50 text-teal-800 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600 stroke-[2.5]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
