import React, { useState } from 'react';
import { MedicalReport, ReportCategory } from '../../types';
import {
  FolderHeart,
  Search,
  FileText,
  FileSpreadsheet,
  Stethoscope,
  Calendar,
  Share2,
  Download,
  CheckCircle2,
  Building2,
  Sparkles,
} from 'lucide-react';

interface EmrViewProps {
  reports: MedicalReport[];
  onOpenReportDetail: (report: MedicalReport) => void;
  onOpenUploadModal: () => void;
}

export const EmrView: React.FC<EmrViewProps> = ({
  reports,
  onOpenReportDetail,
  onOpenUploadModal,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'Lab Reports', 'Prescriptions', 'Imaging / Scans', 'Doctor Notes'];

  const filteredReports = reports.filter((rep) => {
    const matchesSearch =
      rep.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rep.labName && rep.labName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (rep.doctorName && rep.doctorName.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeCategory === 'Lab Reports') return rep.category === 'Lab Report';
    if (activeCategory === 'Prescriptions') return rep.category === 'Prescription';
    if (activeCategory === 'Imaging / Scans') return rep.category === 'Imaging / Scan';
    if (activeCategory === 'Doctor Notes') return rep.category === 'Doctor Note';
    return true;
  });

  return (
    <div className="space-y-5 pb-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900">Electronic Medical Record (EMR)</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold">
              Secure Cloud Storage
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Central repository for lab tests, prescriptions, radiology scans, & physician summaries
          </p>
        </div>

        <button
          onClick={onOpenUploadModal}
          className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
        >
          + Add New Record
        </button>
      </div>

      {/* Search & Category Filter Pills */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter EMR by document name, clinic, or physician..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline EMR Document Cards */}
      <div className="space-y-3">
        {filteredReports.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6">
            <FolderHeart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">No records found in EMR repository</p>
            <p className="text-xs text-slate-500 mt-1">Upload lab results or prescriptions to store them in your secure EMR.</p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <div
              key={report.id}
              onClick={() => onOpenReportDetail(report)}
              className="p-5 bg-white hover:bg-blue-50/20 rounded-3xl border border-slate-200/80 hover:border-blue-300 transition-all cursor-pointer shadow-xs space-y-3 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                      {report.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {report.labName}
                      </span>
                      <span>• {report.date}</span>
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-extrabold rounded-full uppercase">
                  {report.category}
                </span>
              </div>

              {report.arabicSummary && (
                <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-xs text-emerald-900 dir-rtl font-sans font-medium line-clamp-2">
                  <span className="font-bold text-emerald-800 ml-1">تفسير التقرير:</span>
                  {report.arabicSummary}
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100 font-medium">
                <span className="flex items-center gap-1 text-slate-700 font-bold">
                  <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                  Physician: {report.doctorName || 'Dr. Youssef Hassan'}
                </span>
                <span className="text-blue-600 font-bold group-hover:underline">View Full EMR Record →</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
