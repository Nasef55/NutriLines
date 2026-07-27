import React, { useState } from 'react';
import { Appointment } from '../../types';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  User,
  Plus,
  CheckCircle2,
  Bell,
  Stethoscope,
} from 'lucide-react';

interface AppointmentsModalProps {
  appointments: Appointment[];
  isOpen: boolean;
  onClose: () => void;
  onAddAppointment: (apt: Appointment) => void;
}

export const AppointmentsModal: React.FC<AppointmentsModalProps> = ({
  appointments,
  isOpen,
  onClose,
  onAddAppointment,
}) => {
  if (!isOpen) return null;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [doctorName, setDoctorName] = useState('');
  const [specialty, setSpecialty] = useState('Endocrinology & Internal Medicine');
  const [clinicName, setClinicName] = useState('MedCare Specialty Clinic');
  const [date, setDate] = useState('2026-08-10');
  const [time, setTime] = useState('11:00');
  const [location, setLocation] = useState('Riyadh Medical District');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorName) return;

    const newApt: Appointment = {
      id: `apt_${Date.now()}`,
      doctorName: doctorName.startsWith('Dr.') ? doctorName : `Dr. ${doctorName}`,
      specialty,
      clinicName,
      date,
      time,
      location,
      notes: notes || 'Follow-up consultation',
      status: 'Upcoming',
      reminderSet: true,
    };

    onAddAppointment(newApt);
    setIsFormOpen(false);
    setDoctorName('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-100 my-8 space-y-5">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-cyan-100 text-cyan-700 rounded-2xl flex items-center justify-center font-bold">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Doctor Appointments</h2>
            <p className="text-xs text-slate-500 font-medium">
              Scheduled clinical consultations & reminders
            </p>
          </div>
        </div>

        {!isFormOpen ? (
          <div className="space-y-4">
            <button
              onClick={() => setIsFormOpen(true)}
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Book New Doctor Appointment</span>
            </button>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {appointments.length === 0 ? (
                <p className="text-center text-xs text-slate-500 py-6">No appointments scheduled.</p>
              ) : (
                appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-black text-slate-900">{apt.doctorName}</h3>
                        <p className="text-xs font-bold text-cyan-600">{apt.specialty}</p>
                      </div>

                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-[10px] font-extrabold uppercase">
                        {apt.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 font-medium">{apt.clinicName}</p>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200/60 font-medium">
                      <span className="flex items-center gap-1 text-slate-800 font-bold">
                        <Clock className="w-3.5 h-3.5 text-cyan-600" />
                        {apt.date} at {apt.time}
                      </span>
                      <span className="flex items-center gap-1 text-emerald-600 font-bold">
                        <Bell className="w-3.5 h-3.5" /> Reminder Active
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Doctor Name</label>
              <input
                type="text"
                required
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                placeholder="e.g. Dr. Mona Al-Ghamdi"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Specialty</label>
                <input
                  type="text"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Clinic Name</label>
                <input
                  type="text"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Time</label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Consultation Purpose / Notes</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Reviewing CBC & Ferritin lab results"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Schedule & Save
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
