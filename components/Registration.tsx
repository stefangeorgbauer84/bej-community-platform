
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Mail, Lock, User, MapPin, Building, Briefcase, Calendar, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';

interface RegistrationProps {
  onLogin: (user: UserProfile) => void;
  onCancel: () => void;
}

const Registration: React.FC<RegistrationProps> = ({ onLogin, onCancel }) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    organization: 'BEJ',
    region: 'Hessen',
    function: '',
    birthDate: '',
    wantsMembership: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const user = await authService.register(formData);
      onLogin(user);
    } catch (err: any) {
      setError(err?.message ?? 'Registrierung fehlgeschlagen. Bitte versuche es erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => setStep(s => s + 1);

  return (
    <div className="min-h-screen bg-white md:bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl md:shadow-2xl md:shadow-blue-900/10 overflow-hidden">
        <div className="bg-blue-600 p-8 text-white text-center">
          <h2 className="text-2xl font-bold">Community-Beitritt</h2>
          <p className="text-blue-100 text-sm mt-1">Werde Teil des BEJ-Netzwerks</p>
          
          <div className="flex justify-center mt-6 gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${step === i ? 'w-8 bg-white' : 'w-1.5 bg-blue-400'}`} />
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {step === 1 && (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="firstName" className="text-xs font-bold text-slate-500 uppercase">Vorname</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input id="firstName" required type="text" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Max" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label htmlFor="lastName" className="text-xs font-bold text-slate-500 uppercase">Nachname</label>
                  <input id="lastName" required type="text" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Mustermann" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1">
                <label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase">E-Mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input id="email" required type="email" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="max@beispiel.de" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1">
                <label htmlFor="password" className="text-xs font-bold text-slate-500 uppercase">Passwort</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input id="password" required type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
              </div>
              <button type="button" onClick={nextStep} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2">Weiter <ChevronRight size={18} /></button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
               <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Organisation</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <select className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 appearance-none focus:outline-none bg-white" value={formData.organization} onChange={e => setFormData({...formData, organization: e.target.value})}>
                    <option value="BEJ">BEJ Bund</option>
                    <option value="JEF">JEF Deutschland</option>
                    <option value="ISAC">ISAC Partner</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Bundesland / Region</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <select className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 appearance-none focus:outline-none bg-white" value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})}>
                    <option value="Baden-Württemberg">Baden-Württemberg</option>
                    <option value="Bayern">Bayern</option>
                    <option value="Berlin">Berlin</option>
                    <option value="Hessen">Hessen</option>
                    <option value="NRW">NRW</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Funktion (optional)</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input type="text" placeholder="z.B. Beisitzer" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none" value={formData.function} onChange={e => setFormData({...formData, function: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Geburtsdatum</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input required type="date" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none" value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} />
                </div>
              </div>
              <button type="button" onClick={nextStep} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2">Weiter <ChevronRight size={18} /></button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <h3 className="font-bold text-blue-900 mb-2">Mitgliedschaft & Trust</h3>
                <p className="text-sm text-blue-800 leading-relaxed">Der BEJ setzt auf Klarnamen und Verifizierung. Wenn du Mitglied bist, wird dein Profil nach der Prüfung freigeschaltet.</p>
                <label className="flex items-center gap-3 mt-6 cursor-pointer group">
                  <div className="relative">
                    <input type="checkbox" className="sr-only" checked={formData.wantsMembership} onChange={e => setFormData({...formData, wantsMembership: e.target.checked})} />
                    <div className={`w-6 h-6 rounded border transition-all ${formData.wantsMembership ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}`}>
                      {formData.wantsMembership && <CheckCircle size={22} className="text-white -ml-[3px] -mt-[3px]" />}
                    </div>
                  </div>
                  <span className="text-sm font-bold text-blue-900 group-hover:underline">Ich bin bereits Mitglied und möchte verifiziert werden.</span>
                </label>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                  <AlertCircle size={16} className="shrink-0" />
                  {error}
                </div>
              )}
              <div className="space-y-3">
                 <button type="submit" disabled={isLoading} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-blue-900/10 hover:bg-blue-700 transition-colors disabled:opacity-60">
                   {isLoading ? 'Wird registriert…' : 'Konto erstellen'}
                 </button>
                 <button type="button" onClick={onCancel} className="w-full py-2 text-slate-400 font-medium hover:text-slate-600">Abbrechen</button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Registration;
