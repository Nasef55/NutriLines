import React, { useState, useRef } from 'react';
import { MedicalReport } from '../../types';
import { analyzeReportWithAI } from '../../services/aiService';
import {
  X,
  Camera,
  Upload,
  Sparkles,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface UploadReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReportAdded: (report: MedicalReport) => void;
}

export const UploadReportModal: React.FC<UploadReportModalProps> = ({
  isOpen,
  onClose,
  onReportAdded,
}) => {
  if (!isOpen) return null;

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [manualText, setManualText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const samplePresets = [
    {
      id: 'cbc',
      name: 'Complete Blood Count (CBC)',
      arabicName: 'صورة دم كاملة',
      desc: 'Hemoglobin, WBC, Platelets, Ferritin',
    },
    {
      id: 'lipid',
      name: 'Lipid Panel & Cholesterol',
      arabicName: 'فحص الدهون والكوليسترول',
      desc: 'Total Cholesterol, LDL, HDL, Triglycerides',
    },
    {
      id: 'diabetes',
      name: 'Diabetes & Glucose Panel',
      arabicName: 'فحص السكر الصائم والتراكمي',
      desc: 'Fasting Glucose, HbA1c, Insulin',
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcessReport = async (presetType?: string) => {
    setIsProcessing(true);
    setErrorMsg('');

    setProcessingStep('Initializing Gemini 3.6 Vision OCR Engine...');
    await new Promise((r) => setTimeout(r, 600));

    setProcessingStep('Extracting medical test names, values & reference ranges...');
    await new Promise((r) => setTimeout(r, 700));

    setProcessingStep('Classifying clinical results (Normal, High, Low)...');
    await new Promise((r) => setTimeout(r, 600));

    setProcessingStep('Generating simplified Arabic patient explanations (شرح تبسيطي بالعربية)...');

    try {
      const res = await analyzeReportWithAI({
        imageBase64: selectedImage || undefined,
        rawText: manualText || undefined,
        sampleType: presetType,
      });

      if (res.success && res.analysis) {
        const analysis = res.analysis;

        const isAbnormal = analysis.results.some(
          (r) => r.status === 'High' || r.status === 'Low'
        );

        const newReport: MedicalReport = {
          id: `rep_${Date.now()}`,
          title: analysis.reportTitle || 'Medical Laboratory Report',
          category: 'Lab Report',
          labName: analysis.laboratoryName || 'Diagnostic Reference Laboratory',
          date: analysis.reportDate || new Date().toISOString().split('T')[0],
          doctorName: 'Dr. Youssef Hassan',
          overallSummary: analysis.overallSummary,
          arabicSummary: analysis.arabicSummary,
          results: analysis.results.map((r, idx) => ({
            id: `res_${Date.now()}_${idx}`,
            testName: r.testName,
            value: r.value,
            unit: r.unit,
            referenceRange: r.referenceRange,
            status: r.status,
            arabicExplanation: r.arabicExplanation,
            clinicalNote: r.clinicalNote,
          })),
          actionableAdvice: analysis.actionableAdvice || [
            'Maintain balanced hydration and nutrient intake',
            'Schedule routine follow-up with your general practitioner',
          ],
          isAbnormal,
          createdAt: new Date().toISOString(),
          originalImageUrl: selectedImage || undefined,
        };

        onReportAdded(newReport);
        setIsProcessing(false);
        onClose();
      } else {
        throw new Error(res.error || 'Report parsing failed');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Failed to analyze report.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-100 my-8 space-y-5">
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-2 font-bold shadow-xs">
            <Camera className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Scan & Upload Medical Report</h2>
          <p className="text-xs text-slate-500 font-medium">
            AI Optical Character Recognition & Arabic Clinical Interpretation
          </p>
        </div>

        {/* Processing Loading Overlay */}
        {isProcessing ? (
          <div className="py-12 px-4 text-center space-y-4 bg-slate-50 rounded-2xl border border-slate-200">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
            <div className="space-y-1">
              <p className="text-sm font-black text-slate-900">{processingStep}</p>
              <p className="text-xs text-slate-500 font-medium">
                NutriLines AI is extracting biomarkers and crafting Arabic explanations...
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Image Upload Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-6 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl bg-slate-50 hover:bg-blue-50/30 transition-all cursor-pointer text-center space-y-2 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              {selectedImage ? (
                <div className="space-y-2">
                  <img
                    src={selectedImage}
                    alt="Selected report preview"
                    className="max-h-40 mx-auto rounded-xl shadow-md border object-contain"
                  />
                  <p className="text-xs font-bold text-emerald-600 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Image attached! Click "Analyze Report"
                  </p>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-600 mx-auto transition-colors" />
                  <p className="text-xs font-bold text-slate-800">
                    Click to capture with Camera or select from Gallery
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Supports JPG, PNG, or PDF lab report sheets
                  </p>
                </>
              )}
            </div>

            {/* 1-Click Preset Samples */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Or Try 1-Click Sample Lab Reports
              </p>
              <div className="grid grid-cols-1 gap-2">
                {samplePresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleProcessReport(preset.name)}
                    className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-300 rounded-2xl text-left transition-all flex items-center justify-between group"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                        {preset.name} <span className="text-emerald-700 font-normal">({preset.arabicName})</span>
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium">{preset.desc}</p>
                    </div>
                    <Sparkles className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                  </button>
                ))}
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Process Button */}
            {selectedImage && (
              <button
                onClick={() => handleProcessReport()}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Analyze Uploaded Report with Gemini AI</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
