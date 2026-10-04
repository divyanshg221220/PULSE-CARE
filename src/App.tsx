/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { ProfileSwitcherModal } from './components/layout/ProfileSwitcherModal';
import { VitalsDashboard } from './components/dashboard/VitalsDashboard';
import { SymptomTracker } from './components/symptoms/SymptomTracker';
import { VaccinationManager } from './components/vaccination/VaccinationManager';
import { MonitorScanner } from './components/ai/MonitorScanner';
import { LabReportParser } from './components/ai/LabReportParser';
import { EarlyRiskDetection } from './components/screening/EarlyRiskDetection';
import { DoctorConsultations } from './components/clinical/DoctorConsultations';
import { ProviderPortal } from './components/provider/ProviderPortal';
import { MedicalProfileQR } from './components/qr/MedicalProfileQR';
import { EmergencyAndLocations } from './components/emergency/EmergencyAndLocations';
import { FirstAidCenter } from './components/education/FirstAidCenter';
import { MenstrualHealthSuite } from './components/women/MenstrualHealthSuite';
import { FitnessAndCommunity } from './components/wellness/FitnessAndCommunity';
import { PersonalizedProfile } from './components/profile/PersonalizedProfile';

const MainContent: React.FC = () => {
  const { activeTab, fontSize, highContrast, profile } = useApp();

  const fontSizeClass =
    fontSize === 'xl' ? 'text-lg' : fontSize === 'lg' ? 'text-base' : 'text-sm';

  const contrastClass = highContrast
    ? 'contrast-125 saturate-150 [filter:contrast(1.15)] bg-white text-black'
    : 'bg-slate-50/60 text-slate-900';

  // Strict female visibility protection
  const isFemale = profile.biologicalSex === 'female';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-all duration-200 ${contrastClass} ${fontSizeClass}`}>
      <Header />
      <ProfileSwitcherModal />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <VitalsDashboard />}
        {activeTab === 'symptoms' && <SymptomTracker />}
        {activeTab === 'vaccinations' && <VaccinationManager />}
        {activeTab === 'scanner' && <MonitorScanner />}
        {activeTab === 'lab_reports' && <LabReportParser />}
        {activeTab === 'risk_detection' && <EarlyRiskDetection />}
        {activeTab === 'consultations' && <DoctorConsultations />}
        {activeTab === 'provider_portal' && <ProviderPortal />}
        {activeTab === 'qr_pass' && <MedicalProfileQR />}
        {activeTab === 'emergency' && <EmergencyAndLocations />}
        {activeTab === 'first_aid' && <FirstAidCenter />}
        {activeTab === 'menstrual' && isFemale && <MenstrualHealthSuite />}
        {activeTab === 'community' && <FitnessAndCommunity />}
        {activeTab === 'profile' && <PersonalizedProfile />}
      </main>

      {/* Quiet, Professional Medical Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">PulseCare AI</span>
            <span>·</span>
            <span>Clinical Intelligence & Medical Vault</span>
            <span>·</span>
            <span className="capitalize">{profile.name} ({profile.biologicalSex}, {profile.age}y)</span>
          </div>

          <p className="text-center sm:text-right text-[11px] text-slate-400 max-w-md">
            Emergency note: If you are experiencing chest pain, severe dyspnea, or sudden numbness, press the red SOS 911 button or call your local emergency service immediately.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
