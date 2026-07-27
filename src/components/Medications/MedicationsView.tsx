import React, { useState } from 'react';
import { Medication } from '../../types';
import {
  Pill,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Sparkles,
  Award,
  RefreshCw,
  X,
} from 'lucide-react';

interface MedicationsViewProps {
  medications: Medication[];
  onToggleMedication: (id: string) => void;
  onAddMedication: (med: Medication) => void;
}

export const MedicationsView: React.FC<MedicationsViewProps> = ({
  medications,
  onToggleMedication,
  onAddMedication,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Once Daily');
  const [timeOfDay, setTimeOfDay] = useState('09:00');
  const [purpose, setPurpose] = useState('');
  const [instructions, setInstructions] = useState('Take after food');
  const [totalPills, setTotalPills] = useState(30);

  const takenCount = medications.filter((m) => m.takenToday).length;
  const adherenceRatio = medications.length > 0 ? Math.round((takenCount / medications.length) * 100) : 100;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dosage) return;

    const newMed: Medication = {
      id: `med_${Date.now()}`,
      name,
      dosage,
      frequency,
      timesOfDay: [timeOfDay],
      purpose: purpose || 'General Treatment',
      instructions: instructions || 'Take with water',
      totalPills: Number(totalPills) || 30,
      remainingPills: Number(totalPills) || 30,
      takenToday: false,
      logs: [],
    };

    onAddMedication(newMed);
    setIsAddModalOpen(false);

    // Reset form
    setName('');
    setDosage('');
    setPurpose('');
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900">Medications & Pill Reminders</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold">
              {medications.length} Prescriptions
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Dose scheduling, pill inventory, and adherence tracking
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-500/20 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Medication</span>
        </button>
      </div>

      {/* Adherence Streak Gauge Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white p-5 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center font-black text-2xl text-indigo-300 shrink-0">
            {adherenceRatio}%
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Weekly Adherence Score</span>
            </div>
            <p className="text-lg font-black text-white">
              {takenCount} of {medications.length} Doses Taken Today
            </p>
            <p className="text-xs text-slate-300 font-medium">
              Consistent medication intake maintains stable therapeutic blood levels.
            </p>
          </div>
        </div>

        <div className="w-full sm:w-auto">
          <div className="w-full sm:w-32 bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-400 h-full transition-all duration-500"
              style={{ width: `${adherenceRatio}%` }}
            />
          </div>
        </div>
      </div>

      {/* Medications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {medications.map((med) => (
          <div
            key={med.id}
            className={`p-5 rounded-3xl border transition-all space-y-3 bg-white ${
              med.takenToday
                ? 'border-emerald-200 shadow-xs'
                : 'border-slate-200/80 hover:border-indigo-300 shadow-xs'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shrink-0 ${
                    med.takenToday
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-indigo-100 text-indigo-700'
                  }`}
                >
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">{med.name}</h3>
                  <p className="text-xs text-indigo-600 font-bold">{med.dosage} • {med.frequency}</p>
                </div>
              </div>

              <button
                onClick={() => onToggleMedication(med.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  med.takenToday
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{med.takenToday ? 'Dose Taken' : 'Mark as Taken'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-600 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="font-bold text-slate-800">Purpose:</span> {med.purpose}
              <br />
              <span className="font-bold text-slate-800">Note:</span> {med.instructions}
            </p>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 text-slate-500 font-medium">
              <div className="flex items-center gap-1 text-slate-700 font-bold">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                <span>Alarm: {med.timesOfDay.join(', ')}</span>
              </div>

              <div className="flex items-center gap-1">
                <span>Remaining:</span>
                <span className="font-black text-slate-800">{med.remainingPills} / {med.totalPills} pills</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Medication Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100 space-y-4">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-2 font-bold">
                <Pill className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Add New Prescription</h3>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Medication Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ferrous Sulfate"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Dosage</label>
                  <input
                    type="text"
                    required
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="e.g. 200 mg"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Reminder Time</label>
                  <input
                    type="time"
                    required
                    value={timeOfDay}
                    onChange={(e) => setTimeOfDay(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Purpose / Condition</label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. Treatment of anemia"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Instructions</label>
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Take with orange juice after breakfast"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Save Prescription & Schedule Reminders
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
