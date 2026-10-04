import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Doctor, Appointment, DigitalPrescription } from '../../types/health';
import {
  Stethoscope,
  Video,
  MapPin,
  Calendar,
  Clock,
  Shield,
  FileCheck,
  Star,
  Plus,
  CheckCircle2,
  Lock,
  QrCode,
  Pill,
  Upload,
} from 'lucide-react';

export const DoctorConsultations: React.FC = () => {
  const { doctors, appointments, bookAppointment, profile } = useApp();

  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [viewingPrescription, setViewingPrescription] = useState<DigitalPrescription | null>(null);

  // Booking form states
  const [consultMode, setConsultMode] = useState<'video' | 'in_clinic' | 'audio'>('video');
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-12');
  const [selectedTime, setSelectedTime] = useState<string>('10:30 AM');
  const [symptomNotes, setSymptomNotes] = useState<string>('');
  const [shareVitals, setShareVitals] = useState<boolean>(true);
  const [shareLabs, setShareLabs] = useState<boolean>(true);
  const [shareMeds, setShareMeds] = useState<boolean>(true);
  const [shareAllergies, setShareAllergies] = useState<boolean>(true);

  // Filtered doctors
  const specialties = ['all', 'Internal Medicine', 'Cardiology', 'Endocrinology', 'Obstetrics & Gynecology (OB-GYN)'];
  const filteredDoctors = doctors.filter((doc) => {
    if (selectedSpecialty === 'all') return true;
    return doc.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase());
  });

  const handleOpenBooking = (doc: Doctor) => {
    setSelectedDoctor(doc);
    setShowBookingModal(true);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor) return;

    bookAppointment({
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      specialty: selectedDoctor.specialty,
      hospital: selectedDoctor.hospital,
      dateTime: `${selectedDate}T${selectedTime === '10:30 AM' ? '10:30:00' : '15:00:00'}.000Z`,
      mode: consultMode,
      symptomDescription: symptomNotes.trim() || 'Routine preventative checkup and vitals review.',
      shareVitalsConsent: shareVitals,
      shareLabsConsent: shareLabs,
      shareMedsConsent: shareMeds,
    });

    setShowBookingModal(false);
    setSymptomNotes('');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700">
            <Stethoscope className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Connected Telehealth & Consultations
            </h1>
            <p className="text-sm text-slate-600 mt-0.5">
              Secure video visits, physician medical history sharing, and verifiable digital prescriptions.
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming / Past Appointments Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Your Consultations & Telehealth Sessions</h2>
            <p className="text-xs text-slate-500 mt-0.5">Verified appointments and generated digital prescriptions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900">{apt.doctorName}</span>
                  <p className="text-[11px] text-slate-500">{apt.specialty} · {apt.hospital}</p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                    apt.status === 'upcoming'
                      ? 'bg-teal-50 text-teal-700 border-teal-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {apt.status}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {new Date(apt.dateTime).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {new Date(apt.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="flex items-center gap-1.5 capitalize font-medium text-teal-700">
                  <Video className="w-3.5 h-3.5" />
                  {apt.mode} Visit
                </span>
              </div>

              <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded-lg">
                "{apt.symptomDescription}"
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  <span>Vitals & Labs Shared with Consent</span>
                </div>

                {apt.prescription ? (
                  <button
                    onClick={() => setViewingPrescription(apt.prescription!)}
                    className="flex items-center gap-1 font-bold text-teal-600 hover:text-teal-700"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>View Digital Rx</span>
                  </button>
                ) : apt.status === 'upcoming' && apt.meetLink ? (
                  <a
                    href={apt.meetLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-xs transition-colors"
                  >
                    Join Video Room
                  </a>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Doctor Directory Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Authorized Specialist Network</h2>
            <p className="text-xs text-slate-500">Board-certified physicians available for video consults and clinic visits</p>
          </div>

          {/* Specialty Filter */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar p-1 bg-slate-100 rounded-lg">
            {specialties.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
                  selectedSpecialty === spec
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {spec === 'all' ? 'All Specialties' : spec}
              </button>
            ))}
          </div>
        </div>

        {/* Doctor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all space-y-4"
            >
              <div>
                <div className="flex items-center gap-3">
                  <img
                    src={doc.avatarUrl}
                    alt={doc.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{doc.name}</h3>
                    <p className="text-[11px] text-teal-700 font-semibold">{doc.specialty}</p>
                    <div className="flex items-center gap-1 mt-0.5 text-[10px] text-slate-500">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-slate-700">{doc.rating}</span>
                      <span>({doc.reviewsCount} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Experience:</span>
                    <span className="font-medium text-slate-700">{doc.experienceYears} Years</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Next Slot:</span>
                    <span className="font-semibold text-emerald-700">{doc.nextAvailableSlot}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Consultation Fee:</span>
                    <span className="font-bold text-slate-900">${doc.consultationFee}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleOpenBooking(doc)}
                className="w-full py-2 px-3 text-xs font-bold rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition-colors"
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Book Consult with {selectedDoctor.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedDoctor.specialty} · ${selectedDoctor.consultationFee}</p>
              </div>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-4">
              {/* Consultation Mode */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Consultation Format
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setConsultMode('video')}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 ${
                      consultMode === 'video'
                        ? 'bg-teal-50 border-teal-600 text-teal-800'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Video Telehealth</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConsultMode('in_clinic')}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 ${
                      consultMode === 'in_clinic'
                        ? 'bg-teal-50 border-teal-600 text-teal-800'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>In-Clinic</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConsultMode('audio')}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 ${
                      consultMode === 'audio'
                        ? 'bg-teal-50 border-teal-600 text-teal-800'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Audio Call</span>
                  </button>
                </div>
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Slot Time
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:15 PM">04:15 PM</option>
                  </select>
                </div>
              </div>

              {/* Symptom Notes & Photo Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason for Visit / Symptoms Description
                </label>
                <textarea
                  rows={2}
                  value={symptomNotes}
                  onChange={(e) => setSymptomNotes(e.target.value)}
                  placeholder="Describe your current symptoms, blood pressure trends, or questions..."
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Granular Medical History Sharing Toggles */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-teal-600" />
                  <span>Secure Medical Vault Sharing Consent</span>
                </span>
                <p className="text-[11px] text-slate-500">
                  Select which records will be encrypted and transmitted to {selectedDoctor.name}.
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1 text-xs text-slate-700">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shareVitals}
                      onChange={(e) => setShareVitals(e.target.checked)}
                      className="rounded text-teal-600"
                    />
                    <span>Recent Vitals Logs</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shareLabs}
                      onChange={(e) => setShareLabs(e.target.checked)}
                      className="rounded text-teal-600"
                    />
                    <span>Diagnostic Lab Reports</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shareMeds}
                      onChange={(e) => setShareMeds(e.target.checked)}
                      className="rounded text-teal-600"
                    />
                    <span>Current Active Meds</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shareAllergies}
                      onChange={(e) => setShareAllergies(e.target.checked)}
                      className="rounded text-teal-600"
                    />
                    <span>Known Drug Allergies</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-lg bg-teal-600 text-white hover:bg-teal-700 shadow-sm transition-colors"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Digital Prescription Viewer Modal */}
      {viewingPrescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] text-teal-700 font-bold uppercase tracking-wider">
                  Verifiable Digital Rx
                </span>
                <h3 className="text-base font-extrabold text-slate-900 font-mono">
                  {viewingPrescription.rxNumber}
                </h3>
              </div>
              <button
                onClick={() => setViewingPrescription(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Prescribing Doctor Information */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="font-bold text-slate-900">{viewingPrescription.doctorName}</div>
              <div className="text-slate-500 font-mono text-[11px]">License: {viewingPrescription.doctorLicenseNumber}</div>
              <div className="text-slate-500">{viewingPrescription.hospitalOrClinic}</div>
            </div>

            {/* Patient & Diagnosis */}
            <div className="text-xs space-y-1">
              <div className="text-slate-500">Patient: <strong className="text-slate-900">{profile.name} (Age {profile.age})</strong></div>
              <div className="text-slate-500">Diagnosis: <strong className="text-slate-900">{viewingPrescription.diagnosis}</strong></div>
            </div>

            {/* Prescribed Medications */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Prescribed Therapeutics
              </span>
              {viewingPrescription.medications.map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-white space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{item.name}</span>
                    <span className="font-mono text-teal-700">{item.dosage}</span>
                  </div>
                  <div className="text-slate-600 font-medium">Frequency: {item.frequency} · {item.duration}</div>
                  <p className="text-[11px] text-slate-500 italic">{item.instructions}</p>
                </div>
              ))}
            </div>

            {/* Security Verification & QR Token */}
            <div className="p-3 rounded-lg bg-teal-50/60 border border-teal-200 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-teal-900 block flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>Digitally Signed & Validated</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                  Auth Token: {viewingPrescription.qrCodeToken}
                </span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-teal-200">
                <QrCode className="w-6 h-6 text-teal-800" />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button
                onClick={() => setViewingPrescription(null)}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-slate-800 hover:bg-slate-900 text-white transition-colors"
              >
                Close Prescription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
