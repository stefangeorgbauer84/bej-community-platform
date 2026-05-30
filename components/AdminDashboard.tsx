
import React, { useState } from 'react';
import { UserProfile, UserRole, getAgeFromBirthDate } from '../types';
import { ShieldCheck, UserCheck, Mail } from 'lucide-react';
import { useToast } from './Toast';

interface AdminProps {
  user: UserProfile | null;
}

const AdminDashboard: React.FC<AdminProps> = ({ user }) => {
  const { showToast } = useToast();
  const [pendingMembers, setPendingMembers] = useState<UserProfile[]>([
    { id: '101', email: 'neu@example.de', role: UserRole.REGISTERED, firstName: 'Julia', lastName: 'Jung', organization: 'BEJ Bayern', function: 'Mitglied', region: 'Bayern', isVerified: false, birthDate: '2005-05-15' },
    { id: '102', email: 'test@example.de', role: UserRole.REGISTERED, firstName: 'Klaus', lastName: 'Kleber', organization: 'JEF Berlin', function: 'Vorsitzender', region: 'Berlin', isVerified: false, birthDate: '1998-03-20' },
  ]);

  const verifyUser = (id: string) => {
    setPendingMembers(members => members.filter(m => m.id !== id));
    showToast('Mitglied wurde erfolgreich verifiziert.', 'success');
  };

  const rejectUser = (id: string) => {
    setPendingMembers(members => members.filter(m => m.id !== id));
    showToast('Antrag wurde abgelehnt.', 'error');
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-10">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 uppercase tracking-tight">Administrations-Panel</h2>
          <p className="text-slate-500 mt-1">Mitgliederverwaltung & Verifizierungsprozesse.</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-blue-50 px-4 py-2 rounded-xl text-blue-700 font-bold border border-blue-100 flex items-center gap-2">
             <ShieldCheck size={20} /> Admin-Modus Aktiv
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
           <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Ausstehende Anträge</h4>
           <p className="text-3xl font-bold">{pendingMembers.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 text-blue-600">
           <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Verifizierte Mitglieder</h4>
           <p className="text-3xl font-bold">482</p>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold flex items-center gap-2"><UserCheck /> Neue Mitgliedsanträge</h3>
        
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400">Name</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400">Organisation / Region</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400">Alter</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400 text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pendingMembers.map(member => {
                const age = member.birthDate ? getAgeFromBirthDate(member.birthDate) : 'N/A';
                return (
                  <tr key={member.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{member.firstName} {member.lastName}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-1"><Mail size={12} /> {member.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium">{member.organization}</div>
                      <div className="text-xs text-slate-400">{member.region}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{age}</span>
                        {Number(age) < 30 && <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded font-bold">U30</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => verifyUser(member.id)} className="px-4 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700">Verifizieren</button>
                        <button onClick={() => rejectUser(member.id)} className="px-4 py-1.5 bg-white border border-slate-200 text-red-600 text-xs font-bold rounded-lg hover:bg-red-50">Ablehnen</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {pendingMembers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">Keine ausstehenden Anträge gefunden.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
