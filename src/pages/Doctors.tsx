import React from "react";
import { Search, Star, Calendar, Video, MapPin, Clock } from "lucide-react";

const doctors = [
  {
    name: "Dr. Ahmed Hassan",
    specialty: "Internal Medicine",
    experience: "10+ years experience",
    rating: "4.9",
    reviews: 124,
    nextAvailable: "Today, 6:00 PM",
    type: "Online Consultation",
  },
  {
    name: "Dr. Sara Mohamed",
    specialty: "Nutrition & Dietetics",
    experience: "8+ years experience",
    rating: "4.8",
    reviews: 98,
    nextAvailable: "Today, 7:30 PM",
    type: "Online Consultation",
  },
  {
    name: "Dr. Omar Khaled",
    specialty: "Cardiology",
    experience: "12+ years experience",
    rating: "4.9",
    reviews: 156,
    nextAvailable: "Tomorrow, 5:00 PM",
    type: "Online Consultation",
  },
];

const specialties = [
  "All",
  "Internal Medicine",
  "Cardiology",
  "Nutrition & Dietetics",
  "Diabetes",
];

function Doctors() {
      const [selectedDoctor, setSelectedDoctor] = React.useState<any>(null);
      const [bookingConfirmed, setBookingConfirmed] = React.useState(false);
  return (
    <div className="space-y-6 pb-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900">
          Find the Right Doctor
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Connect with healthcare professionals and book your consultation.
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

          <input
            type="text"
            placeholder="Search by doctor name or specialty..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
          />
        </div>
      </div>

      {/* Specialties */}
      <div>
        <h2 className="text-lg font-black text-slate-900 mb-3">
          Specialties
        </h2>

        <div className="flex flex-wrap gap-2">
          {specialties.map((specialty, index) => (
            <button
              key={specialty}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                index === 0
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {specialty}
            </button>
          ))}
        </div>
      </div>

      {/* Doctors */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              Available Doctors
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Choose a specialist that fits your needs.
            </p>
          </div>

          <span className="text-xs font-bold text-blue-600">
            {doctors.length} Doctors
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {doctors.map((doctor) => (
            <div
              key={doctor.name}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
            >

              {/* Doctor Image */}
              <div className="flex items-start justify-between">

                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-emerald-100 flex items-center justify-center text-3xl">
                  👨‍⚕️
                </div>

                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-bold">
                  ✓ Verified
                </span>

              </div>

              {/* Doctor Info */}
              <div className="mt-4">

                <h3 className="text-base font-black text-slate-900">
                  {doctor.name}
                </h3>

                <p className="text-xs font-semibold text-blue-600 mt-1">
                  {doctor.specialty}
                </p>

                <p className="text-xs text-slate-500 mt-2">
                  {doctor.experience}
                </p>

              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-4">

                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />

                  <span className="text-xs font-black text-slate-800">
                    {doctor.rating}
                  </span>
                </div>

                <span className="text-xs text-slate-400">
                  ({doctor.reviews} reviews)
                </span>

              </div>

              {/* Availability */}
              <div className="mt-4 space-y-2">

                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Clock className="w-4 h-4 text-blue-500" />
                  {doctor.nextAvailable}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Video className="w-4 h-4 text-emerald-500" />
                  {doctor.type}
                </div>

              </div>

              {/* Button */}
              <button
                onClick={() => setSelectedDoctor(doctor)}
                className="w-full mt-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition-colors flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Book Consultation
              </button>

            </div>
          ))}

        </div>
      </div>

      {/* Medical Notice */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
        <p className="text-xs font-bold text-amber-900">
          Medical Consultation Notice
        </p>

        <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
          NutriLines helps you connect with healthcare professionals.
          Medical diagnosis and prescriptions are provided only by qualified
          healthcare professionals.
        </p>
      </div>

      {selectedDoctor && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6">

            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Book Consultation
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  {selectedDoctor.name} • {selectedDoctor.specialty}
                </p>
              </div>

              <button
                onClick={() => setSelectedDoctor(null)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">

              <div>
                <label className="text-xs font-bold text-slate-700">
                  Consultation Type
                </label>

                <select className="w-full mt-2 p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none">
                  <option>Online Consultation</option>
                  <option>Clinic Visit</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">
                  Select Date
                </label>

                <input
                  type="date"
                  className="w-full mt-2 p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">
                  Select Time
                </label>

                <select className="w-full mt-2 p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none">
                  <option>06:00 PM</option>
                  <option>07:00 PM</option>
                  <option>08:00 PM</option>
                </select>
              </div>

              <button
                onClick={() => {
                setBookingConfirmed(true);
                }}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm transition-colors"
              >
                Confirm Appointment
              </button>

            </div>

          </div>
        </div>
      )}

{bookingConfirmed && (
  <div className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-7 text-center">

      <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-3xl">
        ✓
      </div>

      <h2 className="text-2xl font-black text-slate-900 mt-5">
        Appointment Confirmed
      </h2>

      <p className="text-sm text-slate-500 mt-2 leading-relaxed">
        Your consultation request has been submitted successfully.
        You will receive the appointment details shortly.
      </p>

      <button
        onClick={() => {
          setBookingConfirmed(false);
          setSelectedDoctor(null);
        }}
        className="w-full mt-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm"
      >
        Done
      </button>

    </div>
  </div>
)}

    </div>
  );
}

export default Doctors;