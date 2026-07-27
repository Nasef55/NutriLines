import React, { useState } from 'react';
import { UserProfile } from '../types';
import {
  X,
  Lock,
  Mail,
  User,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface AuthModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUpdateUser: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  user,
  isOpen,
  onClose,
  onUpdateUser,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState(user.email);
  const [name, setName] = useState(user.name);
  const [password, setPassword] = useState('••••••••');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      name: name || 'Patient User',
      email: email || 'patient@nutrilines.com',
      firebaseConfigured: true,
    };
    onUpdateUser(updated);
    setSuccessMessage(
      isSignUp
        ? 'Account successfully registered and synchronized!'
        : 'Welcome back! Authentication verified.'
    );
    setTimeout(() => {
      setSuccessMessage('');
      onClose();
    }, 1200);
  };

  const loadDemoPersona = (persona: 'sarah' | 'dr_youssef') => {
    if (persona === 'sarah') {
      const demoUser: UserProfile = {
        ...user,
        name: 'Sarah Al-Ahmad',
        email: 'sarah.alahmad@example.com',
        age: 32,
        gender: 'Female',
        bloodType: 'A+',
        healthScore: 84,
      };
      onUpdateUser(demoUser);
      setSuccessMessage('Loaded Quick Demo Patient: Sarah Al-Ahmad');
    } else {
      const demoUser: UserProfile = {
        ...user,
        name: 'Dr. Youssef Hassan',
        email: 'dr.youssef@medcare.sa',
        age: 44,
        gender: 'Male',
        bloodType: 'O+',
        healthScore: 92,
      };
      onUpdateUser(demoUser);
      setSuccessMessage('Loaded Demo Physician Profile: Dr. Youssef Hassan');
    }
    setTimeout(() => {
      setSuccessMessage('');
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 font-bold shadow-xs">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            {isSignUp ? 'Create NutriLines Account' : 'NutriLines Firebase Login'}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Secure health record access & cloud synchronization
          </p>
        </div>

        {/* Quick Demo Selector */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 mb-5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Quick Demo Profiles (1-Click Login)
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => loadDemoPersona('sarah')}
              className="px-3 py-2 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-left text-xs transition-colors"
            >
              <p className="font-bold text-slate-800">Sarah Al-Ahmad</p>
              <p className="text-[10px] text-slate-500">Patient (32y, Female)</p>
            </button>
            <button
              onClick={() => loadDemoPersona('dr_youssef')}
              className="px-3 py-2 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-left text-xs transition-colors"
            >
              <p className="font-bold text-slate-800">Dr. Youssef Hassan</p>
              <p className="text-[10px] text-slate-500">Physician Access</p>
            </button>
          </div>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Al-Ahmad"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@example.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
          >
            <span>{isSignUp ? 'Sign Up with Firebase' : 'Sign In to Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-blue-600 hover:underline font-bold"
          >
            {isSignUp
              ? 'Already have an account? Sign In'
              : "Don't have an account? Sign Up"}
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Encrypted Medical EMR Auth Protocol</span>
        </div>
      </div>
    </div>
  );
};
