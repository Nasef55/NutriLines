import React from 'react';
import { UserProfile } from '../../types';
import {
  User,
  ShieldCheck,
  Heart,
  Droplet,
  Flame,
  Award,
  Database,
  Lock,
  PhoneCall,
  HelpCircle,
  FileText,
  LogOut,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

interface ProfileViewProps {
  user: UserProfile;
  onOpenAuth: () => void;
  onOpenOnboarding: () => void;
  onResetData: () => void;
  onLoadDemoData: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onOpenAuth,
  onOpenOnboarding,
  onResetData,
  onLoadDemoData,
}) => {
  return (
    <div className="space-y-5 pb-6">
      {/* Profile Header Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-5">
        <img
          src={
            user.avatarUrl ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'
          }
          alt={user.name}
          className="w-20 h-20 rounded-2xl object-cover ring-4 ring-blue-500/20 shadow-md shrink-0"
        />

        <div className="text-center sm:text-left space-y-1 flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-black text-slate-900">{user.name}</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold uppercase">
              Patient Account
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">{user.email}</p>
          <p className="text-xs text-slate-600 font-semibold">{user.phone}</p>
        </div>

        <button
          onClick={onOpenAuth}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors shrink-0 flex items-center gap-1.5"
        >
          <Lock className="w-3.5 h-3.5 text-blue-600" />
          <span>Firebase Auth</span>
        </button>
      </div>

      {/* Health Vitals Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold mb-1">
            <Droplet className="w-4 h-4 text-rose-500" /> Blood Group
          </div>
          <p className="text-xl font-black text-slate-900">{user.bloodType}</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold mb-1">
            <Award className="w-4 h-4 text-emerald-500" /> Health Score
          </div>
          <p className="text-xl font-black text-emerald-600">
            {user.healthScore === 0 ? 'Not Assessed' : `${user.healthScore}/100`}
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold mb-1">
            <Heart className="w-4 h-4 text-blue-500" /> Chronic Notes
          </div>
          <p className="text-xs font-bold text-slate-800 line-clamp-1">
            {user.chronicConditions.length > 0 ? user.chronicConditions.join(', ') : 'None specified'}
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold mb-1">
            <Database className="w-4 h-4 text-cyan-500" /> Database
          </div>
          <p className="text-xs font-bold text-cyan-700">Firestore Active</p>
        </div>
      </div>

      {/* Emergency Contact & Assistance Card */}
      <div className="p-5 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-3xl shadow-md flex items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[10px] uppercase font-bold tracking-wider text-rose-200">
            Emergency Medical Hotline
          </p>
          <h3 className="text-lg font-black">Saudi Red Crescent: 997</h3>
          <p className="text-xs text-rose-100 font-medium">
            Tap for immediate medical emergency dispatch
          </p>
        </div>

        <a
          href="tel:997"
          className="w-12 h-12 rounded-2xl bg-white text-rose-600 flex items-center justify-center font-bold shadow-md shrink-0 hover:scale-105 transition-transform"
        >
          <PhoneCall className="w-6 h-6" />
        </a>
      </div>

      {/* Settings & Testing Options */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-2">
        <h3 className="text-sm font-black text-slate-900 mb-3">Settings & Testing Tools</h3>

        <button
          onClick={onOpenOnboarding}
          className="w-full p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200/80 rounded-2xl text-left font-bold text-xs text-slate-800 flex items-center justify-between transition-colors"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" /> Re-open First-Time Onboarding
          </span>
          <span>→</span>
        </button>

        <button
          onClick={onLoadDemoData}
          className="w-full p-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-2xl text-left font-bold text-xs text-indigo-900 flex items-center justify-between transition-colors"
        >
          <span className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-indigo-600" /> Load Sample Demo Medical Data (For Testing)
          </span>
          <span>Load</span>
        </button>

        <button
          onClick={onResetData}
          className="w-full p-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-2xl text-left font-bold text-xs text-rose-700 flex items-center justify-between transition-colors"
        >
          <span className="flex items-center gap-2">
            <LogOut className="w-4 h-4 text-rose-600" /> Reset & Clear All Account Data
          </span>
          <span>Clear</span>
        </button>
      </div>
    </div>
  );
};
