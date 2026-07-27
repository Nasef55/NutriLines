import {
  UserProfile,
  MedicalReport,
  Medication,
  Appointment,
  HealthAssessment,
  AppNotification,
} from '../types';
import {
  initialProfile,
  initialReports,
  initialMedications,
  initialAppointments,
  initialAssessment,
  initialNotifications,
  sampleDemoProfile,
  sampleDemoReports,
  sampleDemoMedications,
  sampleDemoAppointments,
  sampleDemoAssessment,
} from '../data/initialData';

const KEYS = {
  PROFILE: 'nutrilines_profile_v1',
  REPORTS: 'nutrilines_reports_v1',
  MEDICATIONS: 'nutrilines_medications_v1',
  APPOINTMENTS: 'nutrilines_appointments_v1',
  ASSESSMENT: 'nutrilines_assessment_v1',
  NOTIFICATIONS: 'nutrilines_notifications_v1',
};

export const storageService = {
  // Profile
  getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(KEYS.PROFILE);
      return data ? JSON.parse(data) : initialProfile;
    } catch {
      return initialProfile;
    }
  },
  saveProfile(profile: UserProfile): void {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  },

  // Medical Reports
  getReports(): MedicalReport[] {
    try {
      const data = localStorage.getItem(KEYS.REPORTS);
      return data ? JSON.parse(data) : initialReports;
    } catch {
      return initialReports;
    }
  },
  saveReport(report: MedicalReport): MedicalReport[] {
    const current = this.getReports();
    const updated = [report, ...current];
    localStorage.setItem(KEYS.REPORTS, JSON.stringify(updated));
    this.recalculateHealthScore();
    return updated;
  },
  deleteReport(id: string): MedicalReport[] {
    const current = this.getReports();
    const updated = current.filter((r) => r.id !== id);
    localStorage.setItem(KEYS.REPORTS, JSON.stringify(updated));
    this.recalculateHealthScore();
    return updated;
  },

  // Medications
  getMedications(): Medication[] {
    try {
      const data = localStorage.getItem(KEYS.MEDICATIONS);
      return data ? JSON.parse(data) : initialMedications;
    } catch {
      return initialMedications;
    }
  },
  toggleMedicationTaken(id: string): Medication[] {
    const current = this.getMedications();
    const todayStr = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const updated = current.map((med) => {
      if (med.id === id) {
        const nextTaken = !med.takenToday;
        const remainingPills = nextTaken
          ? Math.max(0, med.remainingPills - 1)
          : med.remainingPills + 1;

        const updatedLogs = nextTaken
          ? [{ date: todayStr, time: nowTime, taken: true }, ...med.logs]
          : med.logs.filter((l) => l.date !== todayStr);

        return {
          ...med,
          takenToday: nextTaken,
          remainingPills,
          logs: updatedLogs,
        };
      }
      return med;
    });

    localStorage.setItem(KEYS.MEDICATIONS, JSON.stringify(updated));
    this.recalculateHealthScore();
    return updated;
  },
  addMedication(med: Medication): Medication[] {
    const current = this.getMedications();
    const updated = [med, ...current];
    localStorage.setItem(KEYS.MEDICATIONS, JSON.stringify(updated));
    return updated;
  },

  // Appointments
  getAppointments(): Appointment[] {
    try {
      const data = localStorage.getItem(KEYS.APPOINTMENTS);
      return data ? JSON.parse(data) : initialAppointments;
    } catch {
      return initialAppointments;
    }
  },
  addAppointment(apt: Appointment): Appointment[] {
    const current = this.getAppointments();
    const updated = [apt, ...current];
    localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(updated));
    return updated;
  },

  // Health Assessment
  getAssessment(): HealthAssessment {
    try {
      const data = localStorage.getItem(KEYS.ASSESSMENT);
      return data ? JSON.parse(data) : initialAssessment;
    } catch {
      return initialAssessment;
    }
  },
  saveAssessment(assessment: HealthAssessment): void {
    localStorage.setItem(KEYS.ASSESSMENT, JSON.stringify(assessment));
    this.recalculateHealthScore();
  },

  // Notifications
  getNotifications(): AppNotification[] {
    try {
      const data = localStorage.getItem(KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : initialNotifications;
    } catch {
      return initialNotifications;
    }
  },
  addNotification(notif: AppNotification): AppNotification[] {
    const current = this.getNotifications();
    const updated = [notif, ...current];
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(updated));
    return updated;
  },
  markNotificationRead(id: string): AppNotification[] {
    const current = this.getNotifications();
    const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n));
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(updated));
    return updated;
  },

  // Dynamic Health Score Calculation
  recalculateHealthScore(): number {
    const reports = this.getReports();
    const meds = this.getMedications();
    const assessment = this.getAssessment();

    if (reports.length === 0 && (!assessment || assessment.score === 0)) {
      const profile = this.getProfile();
      profile.healthScore = 0;
      this.saveProfile(profile);
      return 0;
    }

    let score = 90;

    // Deduct for abnormal lab results
    let totalAbnormal = 0;
    reports.forEach((rep) => {
      rep.results.forEach((res) => {
        if (res.status === 'High' || res.status === 'Low') {
          totalAbnormal++;
        }
      });
    });
    score -= Math.min(25, totalAbnormal * 4);

    // Add/deduct based on medication adherence
    const takenMedsCount = meds.filter((m) => m.takenToday).length;
    if (meds.length > 0) {
      const adherenceRatio = takenMedsCount / meds.length;
      score += Math.round(adherenceRatio * 10);
    }

    // Health Assessment factors
    if (assessment && assessment.score > 0) {
      if (assessment.bmi > 25 || assessment.bmi < 18.5) score -= 3;
      if (assessment.smoking) score -= 8;
      if (assessment.systolicBP > 130) score -= 4;
    }

    const finalScore = Math.max(35, Math.min(98, score));

    const profile = this.getProfile();
    profile.healthScore = finalScore;
    this.saveProfile(profile);

    return finalScore;
  },

  loadDemoData(): void {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(sampleDemoProfile));
    localStorage.setItem(KEYS.REPORTS, JSON.stringify(sampleDemoReports));
    localStorage.setItem(KEYS.MEDICATIONS, JSON.stringify(sampleDemoMedications));
    localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(sampleDemoAppointments));
    localStorage.setItem(KEYS.ASSESSMENT, JSON.stringify(sampleDemoAssessment));
  },

  resetToDefault(): void {
    localStorage.clear();
  },
};
