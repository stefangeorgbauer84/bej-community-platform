
import React from 'react';
import { UserProfile, UserRole } from '../types';
// Fix: Added missing Gamepad2 icon import
import { ShieldAlert, Zap, Calendar, Info, Gamepad2 } from 'lucide-react';

interface DashboardProps {
  user: UserProfile | null;
  setActiveTab: (tab: string) => void;
  isU30: boolean;
  onLoginRequest?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, setActiveTab, isU30, onLoginRequest }) => {
  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900">
          Hallo, {user?.firstName || 'Gast'}! 👋
        </h1>
        <p className="text-slate-500 mt-2">Willkommen im digitalen Zuhause des Bund Europäischer Jugend.</p>
      </header>

      {!user && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-3">Werde Teil der Gemeinschaft!</h2>
            <p className="text-blue-100 mb-6">Registriere dich, um am Chat teilzunehmen, Materialien herunterzuladen und Beiträge für unseren Europa-Blog zu verfassen.</p>
            <div className="flex gap-4">
              <button onClick={onLoginRequest} className="px-6 py-2.5 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors">Jetzt Registrieren</button>
              <button onClick={() => setActiveTab('news')} className="px-6 py-2.5 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 transition-colors">Mehr Infos</button>
            </div>
          </div>
          <div className="hidden lg:block w-48 h-48 bg-blue-400/20 rounded-full blur-2xl animate-pulse"></div>
        </div>
      )}

      {user && !user.isVerified && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-4 text-amber-800">
          <ShieldAlert className="shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold">Verifizierung ausstehend</h3>
            <p className="text-sm mt-1">Dein Mitgliedsstatus wird derzeit von unseren Administratoren geprüft. Sobald du verifiziert bist, erhältst du Zugriff auf den Chat und interne Dokumente.</p>
          </div>
        </div>
      )}

      {user?.isVerified && isU30 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex items-start gap-4 text-emerald-800">
          <Zap className="shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold">U30 Safe Space</h3>
            <p className="text-sm mt-1">Du hast vollen Zugriff auf den geschützten Bereich für junge Europäer unter 30 Jahren.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
            <Calendar />
          </div>
          <h3 className="font-bold text-lg mb-2">Nächste Events</h3>
          <p className="text-slate-500 text-sm mb-4">Schau dir an, welche Veranstaltungen demnächst anstehen.</p>
          <button onClick={() => setActiveTab('news')} className="text-blue-600 font-semibold text-sm hover:underline">Events ansehen →</button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
            <Info />
          </div>
          <h3 className="font-bold text-lg mb-2">Vereins-News</h3>
          <p className="text-slate-500 text-sm mb-4">Bleibe informiert über alles, was im BEJ passiert.</p>
          <button onClick={() => setActiveTab('news')} className="text-blue-600 font-semibold text-sm hover:underline">Zum Feed →</button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
            <Gamepad2 />
          </div>
          <h3 className="font-bold text-lg mb-2">Wissens-Check</h3>
          <p className="text-slate-500 text-sm mb-4">Teste dein Wissen über die EU in unserem Quiz.</p>
          <button onClick={() => setActiveTab('quiz')} className="text-blue-600 font-semibold text-sm hover:underline">Spiel starten →</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
