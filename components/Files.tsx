
import React from 'react';
import { UserProfile, UserRole, FileAsset } from '../types';
import { Folder, File as FileIcon, Lock, Download, MoreVertical, Globe, Shield } from 'lucide-react';

interface FilesProps {
  user: UserProfile | null;
}

const MOCK_FILES: FileAsset[] = [
  { id: '1', name: 'BEJ-Satzung.pdf', type: 'pdf', visibility: 'PUBLIC', ownerId: 'admin' },
  { id: '2', name: 'Flyer_Europa_2024.jpg', type: 'image', visibility: 'REGISTERED', ownerId: 'admin' },
  { id: '3', name: 'Budgetplanung_Vertraulich.xlsx', type: 'doc', visibility: 'MEMBER', ownerId: 'admin' },
  { id: '4', name: 'Personalunterlagen', type: 'folder', visibility: 'FUNCTIONARY', ownerId: 'admin' },
];

const Files: React.FC<FilesProps> = ({ user }) => {
  const canAccess = (file: FileAsset): boolean => {
    if (file.visibility === 'PUBLIC') return true;
    if (!user) return false;
    if (file.visibility === 'REGISTERED') return true;
    if (file.visibility === 'MEMBER') return user.isVerified;
    if (file.visibility === 'FUNCTIONARY') return user.role === UserRole.ADMIN;
    return false;
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold">Downloadbereich</h2>
          <p className="text-slate-500 mt-1">Unterrichtsmaterialien, Satzungen und vereinsinterne Dokumente.</p>
        </div>
        {user?.role === UserRole.ADMIN && (
          <button className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-900/10">
            Datei hochladen
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Name</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Sichtbarkeit</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_FILES.map(file => {
              const accessible = canAccess(file);
              return (
                <tr key={file.id} className={`${!accessible ? 'bg-slate-50/50' : 'hover:bg-slate-50'} transition-colors`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${file.type === 'folder' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                        {file.type === 'folder' ? <Folder size={20} /> : <FileIcon size={20} />}
                      </div>
                      <span className={`font-medium ${!accessible ? 'text-slate-400' : 'text-slate-900'}`}>{file.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs font-bold">
                      {file.visibility === 'PUBLIC' && <><Globe size={14} className="text-blue-500" /> <span className="text-blue-600 uppercase">Öffentlich</span></>}
                      {file.visibility === 'MEMBER' && <><Shield size={14} className="text-purple-500" /> <span className="text-purple-600 uppercase">Mitglieder</span></>}
                      {file.visibility === 'FUNCTIONARY' && <><Lock size={14} className="text-red-500" /> <span className="text-red-600 uppercase">Intern</span></>}
                      {file.visibility === 'REGISTERED' && <><Globe size={14} className="text-slate-400" /> <span className="text-slate-500 uppercase">Registriert</span></>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {accessible ? (
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-bold">Verfügbar</span>
                    ) : (
                      <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full font-bold">Gesperrt</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        disabled={!accessible}
                        className={`p-2 rounded-lg transition-colors ${accessible ? 'text-slate-400 hover:text-blue-600 hover:bg-blue-50' : 'text-slate-200'}`}
                      >
                        <Download size={18} />
                      </button>
                      <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Files;
