import React, { useState } from 'react';
import { MedicalReport } from '../../types';
import {
  FileText,
  Upload,
  Camera,
  Search,
  Filter,
  Plus,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  LineChart,
  ArrowRight,
  Layers,
  FileCheck,
} from 'lucide-react';

interface ReportsViewProps {
  reports: MedicalReport[];
  onOpenReportDetail: (report: MedicalReport) => void;
  onOpenUploadModal: () => void;
  onOpenCompareModal: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  reports,
  onOpenReportDetail,
  onOpenUploadModal,
  onOpenCompareModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'abnormal' | 'normal'>('all');

  const filteredReports = reports.filter((rep) => {
    const matchesSearch =
      rep.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rep.labName && rep.labName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (rep.doctorName && rep.doctorName.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterType === 'abnormal') return rep.isAbnormal;
    if (filterType === 'normal') return !rep.isAbnormal;
    return true;
  });

  return (
    <div className="space-y-5 pb-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900">Medical Reports & OCR</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
              {reports.length} Reports Saved
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            AI extracted lab tests, reference ranges & simplified Arabic summaries
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCompareModal}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-bold text-xs rounded-xl transition-colors"
          >
            <LineChart className="w-4 h-4" />
            <span>Compare Reports</span>
          </button>

          <button
            onClick={onOpenUploadModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Scan / Upload</span>
          </button>
        </div>
      </div>

      {/* Quick Upload CTA Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase rounded-full tracking-wider">
            Gemini 3.6 Vision OCR Engine
          </span>
          <h3 className="text-lg font-black">Scan Medical Test with Camera</h3>
          <p className="text-xs text-blue-100 max-w-md">
            Snap a photo or upload a PDF lab report. Our AI engine extracts every test result, compares reference ranges, and translates findings to simplified Arabic!
          </p>
        </div>

        <button
          onClick={onOpenUploadModal}
          className="px-5 py-3 bg-white text-blue-900 hover:bg-blue-50 font-black text-xs rounded-2xl shadow-md shrink-0 flex items-center gap-2 transition-transform active:scale-95"
        >
          <Camera className="w-4 h-4 text-blue-600" />
          <span>Upload New Report</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search report name, lab, or physician..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              filterType === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Reports ({reports.length})
          </button>
          <button
            onClick={() => setFilterType('abnormal')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              filterType === 'abnormal'
                ? 'bg-rose-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Needs Attention ({reports.filter((r) => r.isAbnormal).length})
          </button>
          <button
            onClick={() => setFilterType('normal')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              filterType === 'normal'
                ? 'bg-emerald-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Normal
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        {filteredReports.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">No matching medical reports found</p>
            <p className="text-xs text-slate-500 mt-1">Try adjusting search query or upload a new report.</p>
          </div>
        ) : (
          filteredReports.map((report) => {
            const abnormalCount = report.results.filter(
              (r) => r.status === 'High' || r.status === 'Low'
            ).length;

            return (
              <div
                key={report.id}
                onClick={() => onOpenReportDetail(report)}
                className="bg-white hover:bg-blue-50/30 p-5 rounded-3xl border border-slate-200/80 hover:border-blue-300 transition-all cursor-pointer shadow-xs space-y-3 group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 font-bold ${
                        report.isAbnormal
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      <FileCheck className="w-5 h-5" />
                    </div>

                    <div>
                      <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                        {report.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {report.labName} • {report.date} • {report.results.length} Tests Analyzed
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {abnormalCount > 0 ? (
                      <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-extrabold border border-rose-200">
                        {abnormalCount} Abnormal Flags
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold border border-emerald-200">
                        Normal
                      </span>
                    )}
                  </div>
                </div>

                {/* Overall Summary */}
                <p className="text-xs text-slate-600 leading-relaxed font-normal bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  {report.overallSummary}
                </p>

                {/* Simplified Arabic Teaser */}
                {report.arabicSummary && (
                  <div className="p-3 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-xs text-emerald-900 dir-rtl font-sans font-medium">
                    <span className="font-bold text-emerald-800 ml-1">التفسير المبسط بالعربية:</span>
                    {report.arabicSummary}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-blue-600 font-bold pt-1">
                  <span>Click to inspect test results & recommendations</span>
                  <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
