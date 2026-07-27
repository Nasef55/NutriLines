import {
  UserProfile,
  MedicalReport,
  Medication,
  Appointment,
  HealthAssessment,
  AppNotification,
} from '../types';

export const initialProfile: UserProfile = {
  id: 'user_new',
  name: 'New Patient',
  email: 'patient@example.com',
  phone: '+966 50 000 0000',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
  age: 30,
  gender: 'Female',
  bloodType: 'Not Specified',
  chronicConditions: [],
  healthScore: 0,
  onboardingCompleted: false,
};

export const initialReports: MedicalReport[] = [];

export const initialMedications: Medication[] = [];

export const initialAppointments: Appointment[] = [];

export const initialAssessment: HealthAssessment = {
  id: 'ass_empty',
  date: new Date().toISOString().split('T')[0],
  age: 30,
  gender: 'Female',
  heightCm: 165,
  weightKg: 65,
  bmi: 23.9,
  systolicBP: 120,
  diastolicBP: 80,
  fastingGlucoseMgDl: 90,
  activityLevel: 'Moderate',
  smoking: false,
  chronicConditions: [],
  score: 0,
  recommendations: ['Take your first health assessment or upload a lab report to generate tailored insights.'],
};

export const initialNotifications: AppNotification[] = [
  {
    id: 'notif_welcome',
    title: 'Welcome to NutriLines AI!',
    message: 'Your personal health account is ready. Upload a medical report or schedule your first medication reminder.',
    time: 'Just now',
    type: 'system',
    read: false,
  },
];

// Demo sample dataset for testing if chosen by user
export const sampleDemoProfile: UserProfile = {
  id: 'user_demo',
  name: 'Sarah Al-Ahmad',
  email: 'sarah.alahmad@example.com',
  phone: '+966 50 123 4567',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
  age: 32,
  gender: 'Female',
  bloodType: 'A+',
  chronicConditions: ['Mild Anemia', 'Vitamin D Deficiency'],
  healthScore: 84,
  onboardingCompleted: true,
};

export const sampleDemoReports: MedicalReport[] = [
  {
    id: 'rep_1',
    title: 'Complete Blood Count (CBC) - صورة دم كاملة',
    category: 'Lab Report',
    labName: 'Al-Borg Reference Laboratory',
    date: '2026-07-10',
    doctorName: 'Dr. Youssef Hassan (Hematologist)',
    overallSummary: 'Hemoglobin is low (10.2 g/dL), indicating mild iron-deficiency anemia. White blood cells and platelets are within normal reference ranges.',
    arabicSummary: 'فحص صورة الدم تظهر انخفاضاً في الهيموجلوبين (10.2) مما يدل على أنيميا نقص الحديد. كريات الدم البيضاء والصفائح ممتازة وطبيعية.',
    isAbnormal: true,
    createdAt: '2026-07-10T10:30:00Z',
    actionableAdvice: [
      'Take prescribed iron supplement with Orange Juice / Vitamin C for maximum absorption',
      'Avoid drinking tea or coffee within 1 hour after meals',
      'Incorporate dark leafy greens (spinach, kale) and lean red meat into your daily meals',
    ],
    results: [
      {
        id: 'res_1',
        testName: 'Hemoglobin (Hb)',
        value: '10.2',
        unit: 'g/dL',
        referenceRange: '12.0 - 15.5',
        status: 'Low',
        arabicExplanation: 'انخفاض الهيموجلوبين (أنيميا نقص الحديد). يتسبب في الشعور بالإرهاق الخفيف وتعب عند المجهود.',
        clinicalNote: 'Microcytic hypochromic pattern suggested.',
      },
      {
        id: 'res_2',
        testName: 'White Blood Cell (WBC)',
        value: '6.4',
        unit: 'x10^3 / uL',
        referenceRange: '4.5 - 11.0',
        status: 'Normal',
        arabicExplanation: 'مستوى كريات الدم البيضاء طبيعي وممتاز ويؤكد سلامة الجهاز المناعي بدون التهابات.',
        clinicalNote: 'Normal physiological leukogram.',
      },
      {
        id: 'res_3',
        testName: 'Platelets (PLT)',
        value: '240',
        unit: 'x10^3 / uL',
        referenceRange: '150 - 450',
        status: 'Normal',
        arabicExplanation: 'مستوى الصفائح الدموية طبيعي تماماً ومسؤول عن عملية التجلط الطبيعي عند الجروح.',
        clinicalNote: 'Adequate thrombocyte count.',
      },
      {
        id: 'res_4',
        testName: 'Serum Ferritin (مخزون الحديد)',
        value: '14',
        unit: 'ng/mL',
        referenceRange: '20 - 200',
        status: 'Low',
        arabicExplanation: 'انخفاض في مخزون الحديد بالجسم. يستدعي الاستمرار على المكمل الغذائي لمدة 8 أسابيع.',
        clinicalNote: 'Low iron storage depleted.',
      },
    ],
  },
  {
    id: 'rep_2',
    title: 'Lipid Profile & Glucose - فحص الدهون والسكر',
    category: 'Lab Report',
    labName: 'King Faisal Medical City Lab',
    date: '2026-05-18',
    doctorName: 'Dr. Mona Al-Ghamdi (Internal Medicine)',
    overallSummary: 'Fasting blood glucose is normal (92 mg/dL). Total Cholesterol is slightly elevated at 212 mg/dL with LDL at 134 mg/dL.',
    arabicSummary: 'مستوى سكر الدم الصائم ممتاز وطبيعي (92). يوجد ارتفاع بسيط في الكوليسترول الكلي والضار، ينصح بتنظيم الوجبات.',
    isAbnormal: true,
    createdAt: '2026-05-18T09:15:00Z',
    actionableAdvice: [
      'Reduce intake of hydrogenated oils, fried foods, and saturated animal fats',
      'Walk 30 minutes daily to raise HDL (Good Cholesterol)',
      'Include daily soluble fibers such as oats, chia seeds, and fresh apples',
    ],
    results: [
      {
        id: 'res_21',
        testName: 'Fasting Blood Glucose',
        value: '92',
        unit: 'mg/dL',
        referenceRange: '70 - 99',
        status: 'Normal',
        arabicExplanation: 'مستوى سكر الدم الصائم ممتازة وفي المدى الطبيعي الآمن.',
        clinicalNote: 'Normoglycemic fasting state.',
      },
      {
        id: 'res_22',
        testName: 'Total Cholesterol',
        value: '212',
        unit: 'mg/dL',
        referenceRange: '< 200',
        status: 'High',
        arabicExplanation: 'ارتفاع خفيف في الكوليسترول الكلي. يفضل استبدال السمن والزيوت بالزيتون النقي.',
        clinicalNote: 'Borderline high hypercholesterolemia.',
      },
      {
        id: 'res_23',
        testName: 'LDL (Bad Cholesterol)',
        value: '134',
        unit: 'mg/dL',
        referenceRange: '< 100',
        status: 'High',
        arabicExplanation: 'ارتفاع في الكوليسترول الضار. يتطلب زيادة الحركة والألياف في النظام الغذائي.',
        clinicalNote: 'Elevated LDL target.',
      },
      {
        id: 'res_24',
        testName: 'HDL (Good Cholesterol)',
        value: '58',
        unit: 'mg/dL',
        referenceRange: '> 40',
        status: 'Normal',
        arabicExplanation: 'مستوى الكوليسترول النافع جيد جداً ويساعد على حماية شرايين القلب.',
        clinicalNote: 'Optimal protective HDL.',
      },
    ],
  },
];

export const sampleDemoMedications: Medication[] = [
  {
    id: 'med_1',
    name: 'Ferrous Sulfate (Ferro-F-500)',
    dosage: '200 mg',
    frequency: 'Once Daily',
    timesOfDay: ['09:00'],
    purpose: 'Treat Iron Deficiency Anemia',
    instructions: 'Take in the morning with a glass of orange juice. Do not take with dairy or tea.',
    totalPills: 30,
    remainingPills: 22,
    takenToday: false,
    logs: [
      { date: '2026-07-21', time: '09:05', taken: true },
      { date: '2026-07-20', time: '09:00', taken: true },
    ],
  },
];

export const sampleDemoAppointments: Appointment[] = [
  {
    id: 'apt_1',
    doctorName: 'Dr. Youssef Hassan',
    specialty: 'Hematology & Internal Medicine',
    clinicName: 'MedCare Medical Center - Floor 3',
    date: '2026-07-28',
    time: '11:00',
    location: 'King Fahd Road, Riyadh',
    notes: 'Follow-up CBC and ferritin check after 3 weeks of iron therapy.',
    status: 'Upcoming',
    reminderSet: true,
  },
];

export const sampleDemoAssessment: HealthAssessment = {
  id: 'ass_demo',
  date: '2026-07-01',
  age: 32,
  gender: 'Female',
  heightCm: 165,
  weightKg: 62,
  bmi: 22.8,
  systolicBP: 118,
  diastolicBP: 76,
  fastingGlucoseMgDl: 92,
  activityLevel: 'Moderate',
  smoking: false,
  chronicConditions: ['Mild Anemia'],
  score: 84,
  recommendations: [
    'Maintain healthy BMI (22.8 kg/m²)',
    'Continue iron supplement protocol',
    'Drink 2.5L water daily and maintain 7-8 hours sleep',
  ],
};
