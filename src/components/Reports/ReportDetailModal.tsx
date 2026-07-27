import React from 'react';
import { MedicalReport } from '../../types';
import {
  X,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Share2,
  Printer,
  Sparkles,
  Info,
  Calendar,
  User,
  ShieldCheck,
  Building2,
} from 'lucide-react';

interface ReportDetailModalProps {
  report: MedicalReport | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  report,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !report) return null;

  const abnormalResults = report.results.filter(
    (r) => r.status === 'High' || r.status === 'Low'
  );

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: report.title,
        text: `NutriLines Analysis for ${report.title}: ${report.overallSummary}`,
      }).catch(() => {});
    } else {
      alert('Report summary copied to clipboard!');
      navigator.clipboard.writeText(`${report.title}\n\nSummary: ${report.overallSummary}\n\nArabic: ${report.arabicSummary}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl relative border border-slate-100 my-8 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Close & Share Action Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-blue-600 uppercase font-extrabold tracking-wider">
                E-Medical Report Record
              </p>
              <h2 className="text-lg font-black text-slate-900">{report.title}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              title="Share Report"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              title="Print EMR Record"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Metadata Info Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <Building2 className="w-4 h-4 text-blue-500 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold">Laboratory</p>
              <p className="font-bold text-slate-800">{report.labName || 'Diagnostic Lab'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="w-4 h-4 text-emerald-500 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold">Date</p>
              <p className="font-bold text-slate-800">{report.date}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-600 col-span-2 sm:col-span-1">
            <User className="w-4 h-4 text-indigo-500 shrink-0" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold">Physician</p>
              <p className="font-bold text-slate-800">{report.doctorName || 'Dr. Youssef Hassan'}</p>
            </div>
          </div>
        </div>

        {/* Simplified Arabic Overall Summary Card */}
        {report.arabicSummary && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-950 space-y-2">
            <div className="flex items-center justify-between dir-rtl">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-xs font-black flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                الملخص الطبي المبسط (بالعربية)
              </span>
            </div>
            <p className="text-sm leading-relaxed dir-rtl font-sans font-bold text-emerald-900">
              {report.arabicSummary}
            </p>
          </div>
        )}

        {/* Clinical English Summary */}
        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-blue-950 space-y-1">
          <p className="text-xs font-bold text-blue-800 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-blue-600" />
            Clinical Interpretation Summary
          </p>
          <p className="text-xs text-blue-900 leading-relaxed font-medium">
            {report.overallSummary}
          </p>
        </div>

        {/* Test Results Table / Cards */}
        <div className="space-y-3">
          <h3 className="text-sm font-black text-slate-900 flex items-center justify-between">
            <span>Extracted Test Indicators ({report.results.length})</span>
            {abnormalResults.length > 0 ? (
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                {abnormalResults.length} Abnormal Flags
              </span>
            ) : (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                All Tests Normal
              </span>
            )}
          </h3>

          <div className="space-y-2">
            {report.results.map((res) => {
              const isHigh = res.status === 'High';
              const isLow = res.status === 'Low';
              const isNormal = res.status === 'Normal';

              return (
                <div
                  key={res.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isHigh
                      ? 'bg-rose-50/40 border-rose-200'
                      : isLow
                      ? 'bg-amber-50/40 border-amber-200'
                      : 'bg-slate-50/80 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-black text-slate-900">{res.testName}</p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Ref Range: <span className="text-slate-800 font-bold">{res.referenceRange} {res.unit}</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-black text-slate-900">
                        {res.value} <span className="text-xs font-medium text-slate-500">{res.unit}</span>
                      </p>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          isHigh
                            ? 'bg-rose-600 text-white'
                            : isLow
                            ? 'bg-amber-600 text-white'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {res.status}
                      </span>
                    </div>
                  </div>

                  {/* Arabic Item Explanation */}
                  {res.arabicExplanation && (
                    <div className="mt-2.5 p-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 dir-rtl font-sans">
                      <span className="font-bold text-blue-700 ml-1">الشرح الطبي:</span>
                      {res.arabicExplanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Actionable Health Recommendations */}
        {report.actionableAdvice && report.actionableAdvice.length > 0 && (
          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
            <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Recommended Follow-Up Steps
            </p>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {report.actionableAdvice.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer Disclaimer */}
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[10px] text-amber-800 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Medical Disclaimer: AI interpretation is for educational patient guidance. Consult a qualified physician for clinical prescriptions.
          </span>
        </div>
      </div>
    </div>
  );
};
