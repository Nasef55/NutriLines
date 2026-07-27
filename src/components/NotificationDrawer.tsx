import React from 'react';
import { AppNotification } from '../types';
import { X, Bell, Pill, FileText, Calendar, Sparkles, Check } from 'lucide-react';

interface NotificationDrawerProps {
  notifications: AppNotification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAllRead: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'medication':
        return <Pill className="w-4 h-4 text-indigo-600" />;
      case 'report':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'appointment':
        return <Calendar className="w-4 h-4 text-cyan-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex justify-end">
      <div className="bg-white w-full max-w-md h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-black text-slate-900">Notifications Center</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Push Notification Alerts</span>
            <button onClick={onMarkAllRead} className="text-blue-600 hover:underline">
              Mark all as read
            </button>
          </div>

          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  notif.read ? 'bg-slate-50 border-slate-200' : 'bg-blue-50/60 border-blue-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-xs shrink-0">{getIcon(notif.type)}</div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{notif.title}</h3>
                    <p className="text-[11px] text-slate-600 leading-snug mt-0.5">{notif.message}</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-1">{notif.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
