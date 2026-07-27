import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Languages,
  Pill,
  LineChart,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: FileText,
      color: 'bg-blue-600 text-white',
      badge: 'AI Report OCR Scanner',
      title: 'Scan & Extract Medical Reports',
      arabicTitle: 'مسح واستخراج نتائج الفحوصات الطبية',
      description:
        'Upload lab reports from gallery or camera. NutriLines AI automatically extracts test names, measured values, units, and standard reference ranges.',
      image:
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=600',
    },
    {
      icon: Languages,
      color: 'bg-emerald-600 text-white',
      badge: 'Arabic Interpretation',
      title: 'Simplified Arabic Explanations',
      arabicTitle: 'شرح تبسيطي بالعربية لكل نتيجة طبية',
      description:
        'No more confusion over complex medical jargon! Get a clear, friendly Arabic explanation for every result classified as Normal, High, or Low.',
      image:
        'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=600',
    },
    {
      icon: Pill,
      color: 'bg-indigo-600 text-white',
      badge: 'Medication Tracker',
      title: 'Pill Reminders & Adherence',
      arabicTitle: 'متابعة المواعيد والجرعات اليومية للأدوية',
      description:
        'Never miss a dose again. Organize your prescriptions, set custom alarm times, track remaining pills, and build an adherence streak.',
      image:
        'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600',
    },
    {
      icon: LineChart,
      color: 'bg-cyan-600 text-white',
      badge: 'Health Score & EMR',
      title: 'Compare Trends & Health Score',
      arabicTitle: 'سجل طبي شامل ومقارنة التطورات بالرسوم البيانية',
      description:
        'Compare old and new lab reports side-by-side using interactive trend charts. Monitor your composite NutriLines Health Score over time.',
      image:
        'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=600',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const step = steps[currentStep];
  const StepIcon = step.icon;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Step Header Image Banner */}
        <div className="relative h-48 sm:h-56 overflow-hidden bg-slate-100">
          <img
            src={step.image}
            alt={step.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

          {/* Badge & Skip button */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              {step.badge}
            </span>
            <button
              onClick={onComplete}
              className="text-xs font-semibold text-white/90 bg-black/40 hover:bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full transition-colors"
            >
              Skip
            </button>
          </div>

          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-2 mb-1">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${step.color} shadow-md`}
              >
                <StepIcon className="w-4 h-4" />
              </div>
              <p className="text-xs text-blue-300 font-bold tracking-wider uppercase">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {step.title}
            </h2>
            <p className="text-xs font-medium text-emerald-300 dir-rtl font-sans mt-0.5">
              {step.arabicTitle}
            </p>
          </div>
        </div>

        {/* Body Text */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed font-normal">
            {step.description}
          </p>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/70 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              Medical Disclaimer & Privacy
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              NutriLines AI provides educational health organization and lab explanations. All report data is stored confidentially on your device.
            </p>
          </div>
        </div>

        {/* Step Indicators & Action Button Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <span
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentStep
                    ? 'w-6 bg-blue-600'
                    : 'w-2 bg-slate-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
          >
            <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Continue'}</span>
            {currentStep === steps.length - 1 ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
