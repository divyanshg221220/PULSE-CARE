import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  VitalLog,
  Medication,
  LabReport,
  Doctor,
  Appointment,
  HealthcareFacility,
  FirstAidGuide,
  MenstrualCycleData,
  PrescribedFitnessPlan,
  LocalHealthAlert,
  HealthDrive,
  VaccinationRecord,
  SymptomEntry,
  ClinicalProgressNote,
} from '../types/health';
import {
  INITIAL_USER_PROFILE,
  ALL_SEED_PROFILES,
  INITIAL_VITALS,
  INITIAL_MEDICATIONS,
  INITIAL_LAB_REPORTS,
  INITIAL_DOCTORS,
  INITIAL_APPOINTMENTS,
  HEALTHCARE_FACILITIES,
  FIRST_AID_GUIDES,
  INITIAL_MENSTRUAL_DATA,
  PRESCRIBED_FITNESS_PLANS,
  LOCAL_HEALTH_ALERTS,
  HEALTH_DRIVES,
  INITIAL_VACCINATIONS,
  INITIAL_SYMPTOMS,
  INITIAL_CLINICAL_PROGRESS_NOTES,
} from '../data/seedData';

type FontSizeScale = 'base' | 'lg' | 'xl';

interface AppContextType {
  // Navigation / Views
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Multi-Profile & Demographics
  profiles: UserProfile[];
  activeProfileId: string;
  profile: UserProfile; // active profile alias
  switchProfile: (profileId: string) => void;
  addProfile: (newProfile: UserProfile) => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;

  // Vitals
  vitals: VitalLog[];
  addVitalLog: (log: Omit<VitalLog, 'id' | 'timestamp'> & { timestamp?: string }) => void;
  deleteVitalLog: (id: string) => void;

  // Medications
  medications: Medication[];
  toggleMedicationTaken: (medId: string, dateStr: string) => void;
  addMedication: (med: Omit<Medication, 'id' | 'history'>) => void;
  deleteMedication: (id: string) => void;

  // Lab Reports
  labReports: LabReport[];
  addLabReport: (report: LabReport) => void;

  // Vaccinations Record Manager
  vaccinations: VaccinationRecord[];
  addVaccination: (vac: Omit<VaccinationRecord, 'id'>) => void;
  updateVaccination: (id: string, updated: Partial<VaccinationRecord>) => void;
  deleteVaccination: (id: string) => void;

  // Symptom Tracker & AI Analysis
  symptomLogs: SymptomEntry[];
  addSymptomLog: (entry: Omit<SymptomEntry, 'id' | 'loggedAt'>) => void;
  updateSymptomStatus: (id: string, status: 'active' | 'improving' | 'resolved') => void;
  deleteSymptomLog: (id: string) => void;

  // Doctor & Hospital Portal
  clinicalNotes: ClinicalProgressNote[];
  addClinicalNote: (note: Omit<ClinicalProgressNote, 'id' | 'timestamp'>) => void;

  // Consultations & Appointments
  doctors: Doctor[];
  appointments: Appointment[];
  bookAppointment: (apt: Omit<Appointment, 'id' | 'status'>) => void;
  cancelAppointment: (id: string) => void;

  // Facilities & First Aid
  facilities: HealthcareFacility[];
  firstAidGuides: FirstAidGuide[];

  // Menstrual (Visible only to females)
  menstrualData: MenstrualCycleData;
  updateMenstrualLog: (date: string, log: { flow?: 'spotting'|'light'|'medium'|'heavy'; symptoms?: string[]; mood?: string; notes?: string }) => void;
  updateCycleSettings: (cycleLength: number, duration: number, lastDate: string) => void;

  // Fitness & Outbreak & Drives
  fitnessPlans: PrescribedFitnessPlan[];
  localAlerts: LocalHealthAlert[];
  healthDrives: HealthDrive[];
  toggleDriveRSVP: (driveId: string) => void;

  // Emergency SOS state
  sosState: {
    active: boolean;
    countdown: number;
    dispatched: boolean;
    dispatchId: string | null;
    etaMinutes: number | null;
  };
  triggerSOS: () => void;
  cancelSOS: () => void;

  // Accessibility Controls
  fontSize: FontSizeScale;
  setFontSize: (size: FontSizeScale) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;

  // Text to Speech
  isSpeaking: boolean;
  speakText: (text: string) => void;
  stopSpeaking: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Multi-Profile Persistence
  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('pulse_all_profiles');
    return saved ? JSON.parse(saved) : ALL_SEED_PROFILES;
  });

  const [activeProfileId, setActiveProfileId] = useState<string>(() => {
    return localStorage.getItem('pulse_active_profile_id') || ALL_SEED_PROFILES[0].id;
  });

  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // Active profile instance
  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0] || INITIAL_USER_PROFILE;

  // Vitals
  const [vitals, setVitals] = useState<VitalLog[]>(() => {
    const saved = localStorage.getItem('pulse_vitals');
    return saved ? JSON.parse(saved) : INITIAL_VITALS;
  });

  // Medications
  const [medications, setMedications] = useState<Medication[]>(() => {
    const saved = localStorage.getItem('pulse_medications');
    return saved ? JSON.parse(saved) : INITIAL_MEDICATIONS;
  });

  // Lab Reports
  const [labReports, setLabReports] = useState<LabReport[]>(() => {
    const saved = localStorage.getItem('pulse_lab_reports');
    return saved ? JSON.parse(saved) : INITIAL_LAB_REPORTS;
  });

  // Vaccinations
  const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>(() => {
    const saved = localStorage.getItem('pulse_vaccinations');
    return saved ? JSON.parse(saved) : INITIAL_VACCINATIONS;
  });

  // Symptom Logs
  const [symptomLogs, setSymptomLogs] = useState<SymptomEntry[]>(() => {
    const saved = localStorage.getItem('pulse_symptoms');
    return saved ? JSON.parse(saved) : INITIAL_SYMPTOMS;
  });

  // Clinical Progress Notes
  const [clinicalNotes, setClinicalNotes] = useState<ClinicalProgressNote[]>(() => {
    const saved = localStorage.getItem('pulse_clinical_notes');
    return saved ? JSON.parse(saved) : INITIAL_CLINICAL_PROGRESS_NOTES;
  });

  // Appointments
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('pulse_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  // Menstrual Data
  const [menstrualData, setMenstrualData] = useState<MenstrualCycleData>(() => {
    const saved = localStorage.getItem('pulse_menstrual');
    return saved ? JSON.parse(saved) : INITIAL_MENSTRUAL_DATA;
  });

  // Community Drives
  const [healthDrives, setHealthDrives] = useState<HealthDrive[]>(() => {
    const saved = localStorage.getItem('pulse_drives');
    return saved ? JSON.parse(saved) : HEALTH_DRIVES;
  });

  // Emergency SOS state
  const [sosState, setSosState] = useState<{
    active: boolean;
    countdown: number;
    dispatched: boolean;
    dispatchId: string | null;
    etaMinutes: number | null;
  }>({
    active: false,
    countdown: 3,
    dispatched: false,
    dispatchId: null,
    etaMinutes: null,
  });

  // Accessibility state
  const [fontSize, setFontSize] = useState<FontSizeScale>('base');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('pulse_all_profiles', JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem('pulse_active_profile_id', activeProfileId);
  }, [activeProfileId]);

  useEffect(() => {
    localStorage.setItem('pulse_vitals', JSON.stringify(vitals));
  }, [vitals]);

  useEffect(() => {
    localStorage.setItem('pulse_medications', JSON.stringify(medications));
  }, [medications]);

  useEffect(() => {
    localStorage.setItem('pulse_lab_reports', JSON.stringify(labReports));
  }, [labReports]);

  useEffect(() => {
    localStorage.setItem('pulse_vaccinations', JSON.stringify(vaccinations));
  }, [vaccinations]);

  useEffect(() => {
    localStorage.setItem('pulse_symptoms', JSON.stringify(symptomLogs));
  }, [symptomLogs]);

  useEffect(() => {
    localStorage.setItem('pulse_clinical_notes', JSON.stringify(clinicalNotes));
  }, [clinicalNotes]);

  useEffect(() => {
    localStorage.setItem('pulse_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('pulse_menstrual', JSON.stringify(menstrualData));
  }, [menstrualData]);

  useEffect(() => {
    localStorage.setItem('pulse_drives', JSON.stringify(healthDrives));
  }, [healthDrives]);

  // Profile Switching Handler
  const switchProfile = (profileId: string) => {
    const target = profiles.find((p) => p.id === profileId);
    if (!target) return;
    setActiveProfileId(profileId);

    // If target profile is NOT female and current tab is menstrual, redirect to dashboard
    if (target.biologicalSex !== 'female' && activeTab === 'menstrual') {
      setActiveTab('dashboard');
    }

    speakText(`Switched active profile to ${target.name}.`);
  };

  const addProfile = (newProf: UserProfile) => {
    setProfiles((prev) => [...prev, newProf]);
    setActiveProfileId(newProf.id);
    speakText(`Added and switched to new profile for ${newProf.name}.`);
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === activeProfileId ? { ...p, ...updated } : p))
    );
  };

  // Speech synthesis handlers
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (!text.trim()) return;

    const cleanText = text.replace(/[*#_`]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // SOS Countdown & Dispatch Logic
  useEffect(() => {
    let timer: any;
    if (sosState.active && sosState.countdown > 0) {
      timer = setTimeout(() => {
        setSosState((prev) => ({ ...prev, countdown: prev.countdown - 1 }));
      }, 1000);
    } else if (sosState.active && sosState.countdown === 0 && !sosState.dispatched) {
      const dispatchId = `AMB-911-${Math.floor(100000 + Math.random() * 900000)}`;
      setSosState({
        active: true,
        countdown: 0,
        dispatched: true,
        dispatchId,
        etaMinutes: 7,
      });
      speakText('Emergency SOS initiated. Ambulance dispatched. Estimated arrival in 7 minutes.');
    }
    return () => clearTimeout(timer);
  }, [sosState.active, sosState.countdown, sosState.dispatched]);

  const triggerSOS = () => {
    setSosState({
      active: true,
      countdown: 3,
      dispatched: false,
      dispatchId: null,
      etaMinutes: null,
    });
  };

  const cancelSOS = () => {
    setSosState({
      active: false,
      countdown: 3,
      dispatched: false,
      dispatchId: null,
      etaMinutes: null,
    });
    stopSpeaking();
  };

  // Vitals operations
  const addVitalLog = (logData: Omit<VitalLog, 'id' | 'timestamp'> & { timestamp?: string }) => {
    const newLog: VitalLog = {
      ...logData,
      id: `v_${Date.now()}`,
      timestamp: logData.timestamp || new Date().toISOString(),
    };
    setVitals((prev) => [newLog, ...prev]);
  };

  const deleteVitalLog = (id: string) => {
    setVitals((prev) => prev.filter((v) => v.id !== id));
  };

  // Medication operations
  const toggleMedicationTaken = (medId: string, dateStr: string) => {
    setMedications((prev) =>
      prev.map((med) => {
        if (med.id !== medId) return med;
        const currentTaken = !!med.history[dateStr];
        const nextTaken = !currentTaken;
        const updatedHistory = { ...med.history, [dateStr]: nextTaken };
        const remaining = nextTaken ? Math.max(0, med.remainingPills - 1) : med.remainingPills + 1;
        return {
          ...med,
          remainingPills: remaining,
          history: updatedHistory,
        };
      })
    );
  };

  const addMedication = (med: Omit<Medication, 'id' | 'history'>) => {
    const newMed: Medication = {
      ...med,
      id: `med_${Date.now()}`,
      history: {},
    };
    setMedications((prev) => [...prev, newMed]);
  };

  const deleteMedication = (id: string) => {
    setMedications((prev) => prev.filter((m) => m.id !== id));
  };

  // Lab Report operations
  const addLabReport = (report: LabReport) => {
    setLabReports((prev) => [report, ...prev]);
  };

  // Vaccination operations
  const addVaccination = (vac: Omit<VaccinationRecord, 'id'>) => {
    const newVac: VaccinationRecord = {
      ...vac,
      id: `vac_${Date.now()}`,
    };
    setVaccinations((prev) => [newVac, ...prev]);
  };

  const updateVaccination = (id: string, updated: Partial<VaccinationRecord>) => {
    setVaccinations((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updated } : v))
    );
  };

  const deleteVaccination = (id: string) => {
    setVaccinations((prev) => prev.filter((v) => v.id !== id));
  };

  // Symptom operations
  const addSymptomLog = (entry: Omit<SymptomEntry, 'id' | 'loggedAt'>) => {
    const newLog: SymptomEntry = {
      ...entry,
      id: `sym_${Date.now()}`,
      loggedAt: new Date().toISOString(),
    };
    setSymptomLogs((prev) => [newLog, ...prev]);
  };

  const updateSymptomStatus = (id: string, status: 'active' | 'improving' | 'resolved') => {
    setSymptomLogs((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  };

  const deleteSymptomLog = (id: string) => {
    setSymptomLogs((prev) => prev.filter((s) => s.id !== id));
  };

  // Clinical Notes operations
  const addClinicalNote = (note: Omit<ClinicalProgressNote, 'id' | 'timestamp'>) => {
    const newNote: ClinicalProgressNote = {
      ...note,
      id: `note_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setClinicalNotes((prev) => [newNote, ...prev]);
  };

  // Appointment operations
  const bookAppointment = (aptData: Omit<Appointment, 'id' | 'status'>) => {
    const newApt: Appointment = {
      ...aptData,
      id: `apt_${Date.now()}`,
      status: 'upcoming',
      meetLink: aptData.mode === 'video' ? `https://meet.healthpulse.telemed/apt-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
    };
    setAppointments((prev) => [newApt, ...prev]);
  };

  const cancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: 'cancelled' } : apt))
    );
  };

  // Menstrual operations
  const updateMenstrualLog = (date: string, log: { flow?: 'spotting'|'light'|'medium'|'heavy'; symptoms?: string[]; mood?: string; notes?: string }) => {
    setMenstrualData((prev) => ({
      ...prev,
      dailyLogs: {
        ...prev.dailyLogs,
        [date]: log,
      },
    }));
  };

  const updateCycleSettings = (cycleLength: number, duration: number, lastDate: string) => {
    setMenstrualData((prev) => ({
      ...prev,
      averageCycleLength: cycleLength,
      periodDurationDays: duration,
      lastPeriodStartDate: lastDate,
    }));
  };

  // Health drive operations
  const toggleDriveRSVP = (driveId: string) => {
    setHealthDrives((prev) =>
      prev.map((drive) => {
        if (drive.id !== driveId) return drive;
        const nextState = !drive.isUserRegistered;
        return {
          ...drive,
          isUserRegistered: nextState,
          rsvpCount: nextState ? drive.rsvpCount + 1 : Math.max(0, drive.rsvpCount - 1),
        };
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        profiles,
        activeProfileId,
        profile: activeProfile,
        switchProfile,
        addProfile,
        updateProfile,
        isProfileModalOpen,
        setIsProfileModalOpen,
        vitals,
        addVitalLog,
        deleteVitalLog,
        medications,
        toggleMedicationTaken,
        addMedication,
        deleteMedication,
        labReports,
        addLabReport,
        vaccinations,
        addVaccination,
        updateVaccination,
        deleteVaccination,
        symptomLogs,
        addSymptomLog,
        updateSymptomStatus,
        deleteSymptomLog,
        clinicalNotes,
        addClinicalNote,
        doctors: INITIAL_DOCTORS,
        appointments,
        bookAppointment,
        cancelAppointment,
        facilities: HEALTHCARE_FACILITIES,
        firstAidGuides: FIRST_AID_GUIDES,
        menstrualData,
        updateMenstrualLog,
        updateCycleSettings,
        fitnessPlans: PRESCRIBED_FITNESS_PLANS,
        localAlerts: LOCAL_HEALTH_ALERTS,
        healthDrives,
        toggleDriveRSVP,
        sosState,
        triggerSOS,
        cancelSOS,
        fontSize,
        setFontSize,
        highContrast,
        setHighContrast,
        isSpeaking,
        speakText,
        stopSpeaking,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
