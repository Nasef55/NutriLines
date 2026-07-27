export type ResultStatus = 'Normal' | 'High' | 'Low';

export interface TestResult {
  id: string;
  testName: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: ResultStatus;
  arabicExplanation: string;
  clinicalNote?: string;
}

export type ReportCategory = 'Lab Report' | 'Prescription' | 'Imaging / Scan' | 'Doctor Note';

export interface MedicalReport {
  id: string;
  title: string;
  category: ReportCategory;
  labName?: string;
  date: string;
  doctorName?: string;
  overallSummary: string;
  arabicSummary: string;
  results: TestResult[];
  actionableAdvice: string[];
  originalImageUrl?: string;
  isAbnormal: boolean;
  createdAt: string;
}

export interface MedicationLog {
  date: string;
  time: string;
  taken: boolean;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string; // e.g. "Twice Daily", "Once Daily"
  timesOfDay: string[]; // e.g. ["08:00", "20:00"]
  purpose: string;
  instructions: string; // e.g. "Take after meal"
  totalPills: number;
  remainingPills: number;
  takenToday: boolean;
  logs: MedicationLog[];
}

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  clinicName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  location: string;
  notes?: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  reminderSet: boolean;
}

export interface HealthAssessment {
  id: string;
  date: string;
  age: number;
  gender: 'Male' | 'Female';
  heightCm: number;
  weightKg: number;
  bmi: number;
  systolicBP: number;
  diastolicBP: number;
  fastingGlucoseMgDl: number;
  activityLevel: 'Sedentary' | 'Moderate' | 'Active';
  smoking: boolean;
  chronicConditions: string[];
  score: number; // 0 - 100
  recommendations: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  age: number;
  gender: 'Female' | 'Male';
  bloodType: string;
  chronicConditions: string[];
  healthScore: number;
  onboardingCompleted: boolean;
  firebaseConfigured?: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'medication' | 'appointment' | 'report' | 'score' | 'system';
  read: boolean;
}

export type ActiveTab = 'home' | 'reports' | 'medications' | 'history' | 'profile';
