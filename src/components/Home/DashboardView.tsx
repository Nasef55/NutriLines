import React from 'react';
import {
  UserProfile,
  MedicalReport,
  Medication,
  Appointment,
  ActiveTab,
} from '../../types';
import {
  Sparkles,
  Camera,
  Plus,
  Calendar,
  LineChart,
  FileText,
  Pill,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ShieldAlert,
  Clock,
  ChevronRight,
  Info,
  Activity,
  Database,
  ArrowRight,
} from 'lucide-react';

interface DashboardViewProps {
  user: UserProfile;
  reports: MedicalReport[];
  medications: Medication[];
  appointments: Appointment[];
  onSelectTab: (tab: ActiveTab) => void;
  onOpenReportDetail: (report: MedicalReport) => void;
  onToggleMedication: (id: string) => void;
  onOpenUpload: () => void;
  onOpenCompare: () => void;
  onOpenAppointmentModal: () => void;
  onOpenAssessmentModal: () => void;
  onLoadDemoData: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  reports,
  medications,
  appointments,
  onSelectTab,
  onOpenReportDetail,
  onToggleMedication,
  onOpenUpload,
  onOpenCompare,
  onOpenAppointmentModal,
  onOpenAssessmentModal,
  onLoadDemoData,
}) => {
  const score = user.healthScore;

  // Determine score status color & message
  const getScoreStatus = (val: number) => {
    if (val === 0) {
      return {
        label: 'Not Assessed Yet',
        color: 'text-slate-600 bg-slate-100 border-slate-200',
        stroke: '#94A3B8',
        advice: 'Upload a medical report or complete the health assessment to generate your score.',
      };
    }
    if (val >= 80) {
      return {
        label: 'Good Health Score',
        color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
        stroke: '#10B981',
        advice: 'Your biomarkers & medication adherence are in solid control.',
      };
    }
    if (val >= 60) {
      return {
        label: 'Requires Attention',
        color: 'text-amber-600 bg-amber-50 border-amber-200',
        stroke: '#F59E0B',
        advice: 'Some lab results require dietary adjustments & adherence.',
      };
    }
    return {
      label: 'Needs Medical Follow-up',
      color: 'text-rose-600 bg-rose-50 border-rose-200',
      stroke: '#EF4444',
      advice: 'Multiple abnormal lab indicators detected. Consult physician.',
    };
  };

  const scoreStatus = getScoreStatus(score);
  const strokeDashoffset = score === 0 ? 283 : 283 - (283 * score) / 100;

  const todayMeds = medications;
  const upcomingApts = appointments.filter((a) => a.status === 'Upcoming');

  return (
    <div className="space-y-6 pb-6">
      {/* Welcome & Health Score Card */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Greeting & Patient Profile Summary */}
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal Health Account Ready</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome, {user.name}!
            </h2>
            <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
              {reports.length > 0
                ? `NutriLines AI analyzed ${reports.length} medical report(s) & tracks ${medications.length} active prescription(s).`
                : 'Your medical records dashboard is clear. Upload your first lab report or take an assessment to calculate your AI health score.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-white/10 text-slate-200 font-semibold">
                Blood Type: {user.bloodType}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 text-slate-200 font-semibold">
                Age: {user.age} yrs
              </span>
              <button
                onClick={onOpenAssessmentModal}
                className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 font-bold border border-emerald-400/30 transition-colors flex items-center gap-1"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>{score === 0 ? 'Take Initial Health Assessment' : 'Retake Assessment'}</span>
              </button>
            </div>
          </div>

          {/* Health Score Gauge Ring */}
          <div className="flex flex-col items-center bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  className="text-slate-800"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  strokeWidth="8"
                  stroke={scoreStatus.stroke}
                  strokeDasharray="283"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black tracking-tight text-white">
                  {score === 0 ? '--' : score}
                </span>
                <span className="text-[10px] text-slate-300 uppercase font-bold tracking-wider">Out of 100</span>
              </div>
            </div>

            <span className={`mt-2 text-xs font-bold px-3 py-0.5 rounded-full border ${scoreStatus.color}`}>
              {scoreStatus.label}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={onOpenUpload}
          className="p-4 bg-white hover:bg-blue-50/50 border border-slate-200/80 rounded-2xl text-left transition-all hover:shadow-md group flex flex-col justify-between h-28"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform font-bold">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-900 group-hover:text-blue-600 transition-colors">
              Scan Medical Report
            </p>
            <p className="text-[10px] text-slate-500 font-medium">Camera / Gallery OCR</p>
          </div>
        </button>

        <button
          onClick={onOpenCompare}
          className="p-4 bg-white hover:bg-emerald-50/50 border border-slate-200/80 rounded-2xl text-left transition-all hover:shadow-md group flex flex-col justify-between h-28"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform font-bold">
            <LineChart className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
              Compare Old & New
            </p>
            <p className="text-[10px] text-slate-500 font-medium">Interactive Trend Charts</p>
          </div>
        </button>

        <button
          onClick={() => onSelectTab('medications')}
          className="p-4 bg-white hover:bg-indigo-50/50 border border-slate-200/80 rounded-2xl text-left transition-all hover:shadow-md group flex flex-col justify-between h-28"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform font-bold">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
              Medication Schedule
            </p>
            <p className="text-[10px] text-slate-500 font-medium">Pills & Reminders</p>
          </div>
        </button>

        <button
          onClick={onOpenAppointmentModal}
          className="p-4 bg-white hover:bg-cyan-50/50 border border-slate-200/80 rounded-2xl text-left transition-all hover:shadow-md group flex flex-col justify-between h-28"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform font-bold">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-900 group-hover:text-cyan-600 transition-colors">
              Doctor Appointments
            </p>
            <p className="text-[10px] text-slate-500 font-medium">Schedule & Reminders</p>
          </div>
        </button>
      </div>

      {/* Today's Medications Section */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              <Pill className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">Today's Medication Doses</h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {todayMeds.length > 0
                  ? `${todayMeds.filter((m) => m.takenToday).length} of ${todayMeds.length} taken today`
                  : 'No active prescriptions added yet'}
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectTab('medications')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            Manage <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {todayMeds.length === 0 ? (
          <div className="p-6 bg-indigo-50/40 rounded-2xl border border-indigo-100 text-center space-y-2">
            <Pill className="w-8 h-8 text-indigo-400 mx-auto" />
            <p className="text-xs font-bold text-slate-800">No active prescriptions in schedule</p>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              Add your daily medications, vitamin supplements, or treatment doses to receive timely push alarm reminders.
            </p>
            <button
              onClick={() => onSelectTab('medications')}
              className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add First Prescription</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {todayMeds.slice(0, 3).map((med) => (
              <div
                key={med.id}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  med.takenToday
                    ? 'bg-slate-50 border-slate-200 opacity-75'
                    : 'bg-indigo-50/30 border-indigo-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onToggleMedication(med.id)}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                      med.takenToday
                        ? 'bg-emerald-500 text-white'
                        : 'border-2 border-indigo-300 bg-white hover:border-indigo-500'
                    }`}
                  >
                    {med.takenToday && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                  <div>
                    <p className={`text-xs font-bold ${med.takenToday ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      {med.name} <span className="text-slate-500 text-[11px] font-normal">({med.dosage})</span>
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-indigo-500" />
                        {med.timesOfDay.join(', ')}
                      </span>
                      <span>• {med.instructions}</span>
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-700">
                  {med.remainingPills} left
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Medical Reports Section */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">Recent Medical Lab Reports</h3>
              <p className="text-[11px] text-slate-500 font-medium">
                AI extracted test indicators & clinical interpretation
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectTab('reports')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View All ({reports.length}) <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {reports.length === 0 ? (
          <div className="p-6 bg-blue-50/40 rounded-2xl border border-blue-100 text-center space-y-3">
            <FileText className="w-8 h-8 text-blue-500 mx-auto" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-900">No medical reports uploaded yet</p>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto leading-relaxed">
                Snap or select a photo of your laboratory test paper (CBC, Lipid, Diabetes, Vitamin D, etc.). NutriLines AI will extract all test values and generate simplified Arabic explanations.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <button
                onClick={onOpenUpload}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Upload First Medical Report</span>
              </button>

              <button
                onClick={onLoadDemoData}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                <Database className="w-3.5 h-3.5 text-indigo-600" />
                <span>Load Sample Demo Data</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {reports.slice(0, 2).map((report) => {
              const abnormalCount = report.results.filter(
                (r) => r.status === 'High' || r.status === 'Low'
              ).length;

              return (
                <div
                  key={report.id}
                  onClick={() => onOpenReportDetail(report)}
                  className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/40 border border-slate-200/80 hover:border-blue-300 transition-all cursor-pointer space-y-2 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                          {report.title}
                        </span>
                        {abnormalCount > 0 ? (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold border border-rose-200">
                            {abnormalCount} Abnormal
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                            All Normal
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {report.labName} • {report.date}
                      </p>
                    </div>

                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>

                  {/* Simplified Arabic Teaser */}
                  {report.arabicSummary && (
                    <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-[11px] text-emerald-900 dir-rtl font-sans font-medium line-clamp-2">
                      <span className="font-bold text-emerald-700 ml-1">التفسير الطبي:</span>
                      {report.arabicSummary}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Upcoming Doctor Appointment Widget */}
      {upcomingApts.length > 0 && (
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-3xl p-5 shadow-md flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-white shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-cyan-200">
                Upcoming Appointment
              </p>
              <p className="text-sm font-black">{upcomingApts[0].doctorName}</p>
              <p className="text-xs text-cyan-100 font-medium">
                {upcomingApts[0].specialty} • {upcomingApts[0].date} at {upcomingApts[0].time}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenAppointmentModal}
            className="px-3 py-2 bg-white text-cyan-900 hover:bg-cyan-50 font-bold text-xs rounded-xl shadow-xs shrink-0 transition-colors"
          >
            Details
          </button>
        </div>
      )}

      {/* Medical Disclaimer Notice */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed space-y-1">
          <p className="font-bold">Medical Disclaimer & AI Guidance Notice</p>
          <p className="text-amber-800/90 text-[11px]">
            NutriLines AI provides informational report extraction and patient educational support. It does not replace professional diagnosis or physician prescriptions.
          </p>
        </div>
      </div>
    </div>
  );
};
