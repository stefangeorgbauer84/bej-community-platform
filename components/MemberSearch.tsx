
import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { Search, Filter, ShieldCheck, Mail, MapPin, Building2 } from 'lucide-react';

interface SearchProps {
  user: UserProfile | null;
}

const MOCK_MEMBERS: UserProfile[] = [
  { id: '1', email: 'max@bej.de', role: UserRole.MEMBER, firstName: 'Max', lastName: 'Mustermann', organization: 'BEJ NRW', function: 'Vorsitzender', region: 'NRW', isVerified: true, interests: ['Bildung', 'Klima'] },
  { id: '2', email: 'sara@jef.de', role: UserRole.MEMBER, firstName: 'Sara', lastName: 'Schmidt', organization: 'JEF Hessen', function: 'Mitglied', region: 'Hessen', isVerified: true, interests: ['Außenpolitik'] },
  { id: '3', email: 'admin@bej.de', role: UserRole.ADMIN, firstName: 'Admin', lastName: 'BEJ', organization: 'BEJ Bund', function: 'Systemadmin', region: 'Berlin', isVerified: true },
];

const MemberSearch: React.FC<SearchProps> = ({ user }) => {
  const [query, setQuery] = useState('');
  
  if (!user || !user.isVerified) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
          <ShieldCheck size={32} />
        </div>
        <h2 className="text-xl font-bold">Zugriff eingeschränkt</h2>
        <p className="text-slate-500 max-w-sm">Die Mitgliederliste ist nur für verifizierte BEJ-Mitglieder einsehbar, um die Privatsphäre zu schützen.</p>
      </div>
    );
  }

  const results = MOCK_MEMBERS.filter(m => 
    `${m.firstName} ${m.lastName}`.toLowerCase().includes(query.toLowerCase()) ||
    m.organization?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold">Mitgliederverzeichnis</h2>
        <p className="text-slate-500 mt-1">Finde andere Engagierte im Verband.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Nach Namen oder Organisation suchen..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button className="px-6 py-3 bg-white border border-slate-200 rounded-xl flex items-center gap-2 font-bold hover:bg-slate-50">
          <Filter size={18} /> Filter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map(member => (
          <div key={member.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600">
                {member.firstName?.[0]}{member.lastName?.[0]}
              </div>
              {member.isVerified && <ShieldCheck className="text-blue-600" size={20} />}
            </div>
            <h3 className="text-lg font-bold">{member.firstName} {member.lastName}</h3>
            
            <div className="mt-4 space-y-2 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Building2 size={14} className="text-slate-400" />
                <span>{member.organization}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-slate-400" />
                <span>{member.region}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
                <Mail size={14} /> Nachricht
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberSearch;
