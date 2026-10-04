export interface VaccinationRecord {
  id: string;
  vaccineName: string;
  targetDisease: string;
  dateAdministered: string;
  doseNumber: number;
  totalDosesRecommended: number;
  batchOrLotNumber?: string;
  administeredBy: string;
  clinicOrFacility: string;
  nextBoosterDueDate?: string;
  status: 'up_to_date' | 'booster_due' | 'overdue';
  category: 'routine_adult' | 'seasonal' | 'travel' | 'childhood' | 'specialized';
  notes?: string;
}

export interface SymptomAnalysis {
  possibleCauses: {
    condition: string;
    probability: 'likely' | 'moderate' | 'less_likely';
    explanation: string;
  }[];
  urgencyLevel: 'emergency_immediate' | 'urgent_care' | 'routine_consultation' | 'self_care';
  urgencyExplanation: string;
  redFlagWarnings: string[];
  recommendedActions: string[];
  homeCareTips: string[];
  questionsForDoctor: string[];
  disclaimer: string;
}

export interface SymptomEntry {
  id: string;
  symptoms: string[];
  bodyLocation: string;
  onsetDate: string;
  duration: string;
  severity: number; // 1 to 10
  severityCategory: 'mild' | 'moderate' | 'severe' | 'critical';
  triggers?: string;
  relievingFactors?: string;
  status: 'active' | 'improving' | 'resolved';
  notes?: string;
  aiAnalysis?: SymptomAnalysis;
  loggedAt: string;
}

export interface ClinicalProgressNote {
  id: string;
  patientId: string;
  doctorName: string;
  doctorSpecialty: string;
  timestamp: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export interface VitalLog {
  id: string;
  timestamp: string;
  systolic?: number;
  diastolic?: number;
  pulse?: number;
  glucose?: number;
  glucoseContext?: 'fasting' | 'post_prandial' | 'random';
  glucoseUnit?: 'mg/dL' | 'mmol/L';
  weight?: number; // kg
  height?: number; // cm
  bmi?: number;
  spo2?: number; // %
  temperature?: number; // °F
  notes?: string;
  source?: 'manual' | 'ai_scanner' | 'device_sync';
}

export interface CustomIndicator {
  id: string;
  name: string;
  value: number | string;
  unit: string;
  category: 'cardio' | 'metabolic' | 'lifestyle' | 'renal';
  timestamp: string;
  notes?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isPrimaryICE: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  dob: string;
  biologicalSex: 'female' | 'male' | 'other';
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  organDonor: boolean;
  heightCm: number;
  weightKg: number;
  knownAllergies: { allergen: string; severity: 'mild' | 'moderate' | 'severe'; reaction: string }[];
  diagnosedConditions: { condition: string; diagnosedYear: number; status: 'active' | 'managed' | 'resolved' }[];
  pastSurgeries: { procedure: string; year: number; hospital: string }[];
  familyHistory: string[];
  primaryDoctor: { name: string; specialty: string; hospital: string; phone: string };
  emergencyContacts: EmergencyContact[];
  insuranceProvider: string;
  insurancePolicyNumber: string;
}

export interface Medication {
  id: string;
  name: string;
  genericName?: string;
  dosage: string;
  frequency: string; // e.g. "Twice daily"
  scheduleTimes: string[]; // e.g. ["08:00 AM", "08:00 PM"]
  instructions: string; // e.g. "Take with food"
  remainingPills: number;
  totalPackPills: number;
  refillReminderThreshold: number;
  prescribedBy: string;
  history: Record<string, boolean>; // date string -> taken
}

export interface Biomarker {
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'elevated' | 'low' | 'critical';
  explanation: string;
  whatItMeans: string;
}

export interface LabReport {
  id: string;
  title: string;
  date: string;
  labName: string;
  category: 'blood' | 'lipid' | 'metabolic' | 'hormone' | 'urine' | 'imaging';
  summary: string;
  biomarkers: Biomarker[];
  lifestyleAndDietGuidance: string[];
  questionsForDoctor: string[];
  overallRisk: 'normal' | 'mild' | 'moderate' | 'urgent';
  verifiedByPhysician?: boolean;
}

export interface DigitalPrescription {
  rxNumber: string;
  date: string;
  doctorName: string;
  doctorLicenseNumber: string;
  hospitalOrClinic: string;
  diagnosis: string;
  medications: {
    name: string;
    dosage: string;
    duration: string;
    frequency: string;
    instructions: string;
  }[];
  notes: string;
  qrCodeToken: string;
  dispensedStatus: 'pending' | 'dispensed';
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  title: string;
  experienceYears: number;
  hospital: string;
  rating: number;
  reviewsCount: number;
  consultationFee: number;
  availableDays: string[];
  nextAvailableSlot: string;
  avatarUrl: string;
  languages: string[];
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  hospital: string;
  dateTime: string;
  mode: 'video' | 'in_clinic' | 'audio';
  symptomDescription: string;
  photoAttachments?: string[];
  shareVitalsConsent: boolean;
  shareLabsConsent: boolean;
  shareMedsConsent: boolean;
  status: 'upcoming' | 'completed' | 'cancelled';
  meetLink?: string;
  prescription?: DigitalPrescription;
}

export interface HealthcareFacility {
  id: string;
  name: string;
  type: 'hospital' | 'emergency_room' | 'clinic' | 'pharmacy' | 'diagnostic_lab';
  distanceKm: number;
  address: string;
  phone: string;
  rating: number;
  isOpen24x7: boolean;
  currentStatus: string;
  traumaLevel?: string;
  availableBeds?: number;
  specialties: string[];
  coords: { lat: number; lng: number };
}

export interface FirstAidGuide {
  id: string;
  title: string;
  category: 'cardiac' | 'airway' | 'trauma' | 'environmental' | 'allergic';
  urgency: 'immediate_call_911' | 'urgent' | 'standard';
  overview: string;
  steps: {
    stepNumber: number;
    title: string;
    detail: string;
    caution?: string;
  }[];
  doNots: string[];
  hasCprMetronome?: boolean;
  videoDuration: string;
}

export interface MenstrualCycleData {
  lastPeriodStartDate: string;
  averageCycleLength: number; // e.g. 28 days
  periodDurationDays: number; // e.g. 5 days
  dailyLogs: Record<string, {
    flow?: 'spotting' | 'light' | 'medium' | 'heavy';
    symptoms?: string[];
    mood?: string;
    notes?: string;
  }>;
}

export interface PrescribedFitnessPlan {
  id: string;
  title: string;
  targetCondition: string;
  medicalClearanceNote: string;
  intensity: 'gentle' | 'low_impact' | 'moderate';
  durationMin: number;
  exercises: {
    id: string;
    name: string;
    targetMuscle: string;
    durationOrReps: string;
    instruction: string;
    safetyPrecaution: string;
  }[];
  contraindications: string[];
}

export interface LocalHealthAlert {
  id: string;
  title: string;
  type: 'viral_outbreak' | 'air_quality' | 'heatwave' | 'seasonal_flu' | 'water_advisory';
  severity: 'high' | 'moderate' | 'info';
  region: string;
  publishedDate: string;
  summary: string;
  symptomsToWatch: string[];
  actionSteps: string[];
}

export interface HealthDrive {
  id: string;
  title: string;
  organizer: string;
  type: 'blood_donation' | 'free_checkup' | 'vaccination' | 'wellness_screening';
  date: string;
  time: string;
  venue: string;
  city: string;
  servicesProvided: string[];
  eligibilityNotes: string;
  rsvpCount: number;
  isUserRegistered?: boolean;
  helpline: string;
}
