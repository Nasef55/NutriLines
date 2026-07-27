import React, { useState } from 'react';
import { HealthAssessment } from '../../types';
import {
  X,
  Activity,
  Heart,
  Scale,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

interface AssessmentModalProps {
  currentAssessment: HealthAssessment;
  isOpen: boolean;
  onClose: () => void;
  onSaveAssessment: (assessment: HealthAssessment) => void;
}

export const AssessmentModal: React.FC<AssessmentModalProps> = ({
  currentAssessment,
  isOpen,
  onClose,
  onSaveAssessment,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);

  const [heightCm, setHeightCm] = useState(currentAssessment.heightCm || 165);
  const [weightKg, setWeightKg] = useState(currentAssessment.weightKg || 62);
  const [systolicBP, setSystolicBP] = useState(currentAssessment.systolicBP || 118);
  const [diastolicBP, setDiastolicBP] = useState(currentAssessment.diastolicBP || 76);
  const [fastingGlucose, setFastingGlucose] = useState(currentAssessment.fastingGlucoseMgDl || 92);
  const [activityLevel, setActivityLevel] = useState<'Sedentary' | 'Moderate' | 'Active'>(
    currentAssessment.activityLevel || 'Moderate'
  );
  const [smoking, setSmoking] = useState(currentAssessment.smoking || false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(true);

  // BMI calculation
  const bmi = Number((weightKg / Math.pow(heightCm / 100, 2)).toFixed(1));

  const handleFinish = () => {
    if (!disclaimerAccepted) {
      alert('Please accept the medical disclaimer to finalize your assessment.');
      return;
    }

    // Calculate assessment risk score
    let score = 92;
    if (bmi > 25 || bmi < 18.5) score -= 5;
    if (smoking) score -= 10;
    if (systolicBP > 130) score -= 5;
    if (fastingGlucose > 100) score -= 5;

    const finalScore = Math.max(40, Math.min(98, score));

    const updated: HealthAssessment = {
      id: `ass_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      age: 32,
      gender: 'Female',
      heightCm,
      weightKg,
      bmi,
      systolicBP,
      diastolicBP,
      fastingGlucoseMgDl: fastingGlucose,
      activityLevel,
      smoking,
      chronicConditions: ['Mild Anemia'],
      score: finalScore,
      recommendations: [
        `BMI is ${bmi} (${bmi < 25 ? 'Healthy Weight' : 'Overweight'}).`,
        smoking ? 'Smoking cessation is strongly advised.' : 'Non-smoker lifestyle supported.',
        'Hydrate with 2.5L water daily and maintain regular exercise.',
      ],
    };

    onSaveAssessment(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100 my-8 space-y-5">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-2 font-bold">
            <Activity className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-slate-900">NutriLines Health Assessment</h2>
          <p className="text-xs text-slate-500 font-medium">Step {step} of 3 • Health Score Calculation</p>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Body Measurements</h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Height (cm)</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between text-xs font-bold text-blue-900">
              <span>Calculated Body Mass Index (BMI):</span>
              <span className="text-sm font-black px-2.5 py-0.5 bg-blue-600 text-white rounded-lg">{bmi}</span>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <span>Next: Vitals & Blood Sugar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Vitals & Lifestyle</h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Systolic BP (mmHg)</label>
                <input
                  type="number"
                  value={systolicBP}
                  onChange={(e) => setSystolicBP(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Diastolic BP (mmHg)</label>
                <input
                  type="number"
                  value={diastolicBP}
                  onChange={(e) => setDiastolicBP(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Fasting Blood Sugar (mg/dL)</label>
              <input
                type="number"
                value={fastingGlucose}
                onChange={(e) => setFastingGlucose(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span className="font-bold text-slate-700">Tobacco / Smoking</span>
              <button
                type="button"
                onClick={() => setSmoking(!smoking)}
                className={`px-3 py-1 rounded-lg font-bold text-xs ${
                  smoking ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                }`}
              >
                {smoking ? 'Yes (Smoker)' : 'No (Non-smoker)'}
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep(1)}
                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-1/2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Next: Disclaimer
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2 text-amber-900">
              <div className="flex items-center gap-2 text-xs font-black">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                Medical Disclaimer Agreement
              </div>
              <p className="text-[11px] leading-relaxed">
                NutriLines AI provides patient health analytics and educational support. This assessment is not a substitute for clinical medical evaluation or prescription.
              </p>
            </div>

            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={disclaimerAccepted}
                onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded-xs border-slate-300"
              />
              <span>I acknowledge and accept the medical terms.</span>
            </label>

            <div className="flex gap-2">
              <button
                onClick={() => setStep(2)}
                className="w-1/2 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
              >
                Back
              </button>
              <button
                onClick={handleFinish}
                className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Calculate Health Score</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
