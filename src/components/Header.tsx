import React from 'react';
import { UserProfile, AppNotification } from '../types';
import {
  Bell,
  Activity,
  Smartphone,
  Maximize2,
  ShieldAlert,
  UserCheck,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  user: UserProfile;
  notifications: AppNotification[];
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  onOpenNotifications: () => void;
  onOpenAuth: () => void;
  onOpenAssessment: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  notifications,
  isMobileFrame,
  onToggleMobileFrame,
  onOpenNotifications,
  onOpenAuth,
  onOpenAssessment,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (score >= 60) return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-rose-100 text-rose-800 border-rose-300';
  };

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-xs px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-bold text-lg">
            <Activity className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-slate-900">
                Nutri<span className="text-blue-600">Lines</span>
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 uppercase tracking-wider">
                AI Health
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              AI Medical Report Assistant & EMR
            </p>
          </div>
        </div>

        {/* Action Controls & User Info */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Device Frame View Toggle Button */}
          <button
            onClick={onToggleMobileFrame}
            title={isMobileFrame ? 'Switch to Full Screen Desktop' : 'Switch to Android App View'}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors"
          >
            {isMobileFrame ? (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden md:inline">Full Desktop</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden md:inline">Mobile Frame</span>
              </>
            )}
          </button>

          {/* Health Score Badge Button */}
          <button
            onClick={onOpenAssessment}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-transform active:scale-95 ${getScoreColor(
              user.healthScore
            )}`}
            title="Click to retake Health Assessment"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Score {user.healthScore}/100</span>
          </button>

          {/* Push Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Profile Avatar / Auth Login */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-all border border-slate-200/80"
            title="Account & Login"
          >
            <img
              src={
                user.avatarUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'
              }
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30"
            />
            <span className="text-xs font-bold text-slate-800 pr-1 hidden lg:inline">
              {user.name.split(' ')[0]}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
