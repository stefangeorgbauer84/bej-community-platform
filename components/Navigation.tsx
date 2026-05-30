
import React from 'react';
import { UserRole, UserProfile } from '../types';
import { 
  Home, 
  Newspaper, 
  Users, 
  MessageSquare, 
  FileText, 
  BookOpen, 
  Gamepad2, 
  ShieldCheck,
  UserCircle,
  LogIn
} from 'lucide-react';

interface NavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile | null;
  onLoginRequest: () => void;
}

const Navigation: React.FC<NavProps> = ({ activeTab, setActiveTab, user, onLoginRequest }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, roles: [UserRole.GUEST, UserRole.REGISTERED, UserRole.MEMBER, UserRole.ADMIN] },
    { id: 'news', label: 'Newsfeed', icon: Newspaper, roles: [UserRole.GUEST, UserRole.REGISTERED, UserRole.MEMBER, UserRole.ADMIN] },
    { id: 'members', label: 'Mitglieder', icon: Users, roles: [UserRole.MEMBER, UserRole.ADMIN] },
    { id: 'chat', label: 'Chat', icon: MessageSquare, roles: [UserRole.MEMBER, UserRole.ADMIN] },
    { id: 'files', label: 'Downloads', icon: FileText, roles: [UserRole.GUEST, UserRole.REGISTERED, UserRole.MEMBER, UserRole.ADMIN] },
    { id: 'blog', label: 'Europa-Blog', icon: BookOpen, roles: [UserRole.GUEST, UserRole.REGISTERED, UserRole.MEMBER, UserRole.ADMIN] },
    { id: 'quiz', label: 'EU-Quiz', icon: Gamepad2, roles: [UserRole.GUEST, UserRole.REGISTERED, UserRole.MEMBER, UserRole.ADMIN] },
    { id: 'admin', label: 'Verwaltung', icon: ShieldCheck, roles: [UserRole.ADMIN] },
  ];

  return (
    <nav aria-label="Hauptnavigation" className="hidden md:flex flex-col w-64 bg-slate-900 text-white min-h-screen p-4">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl">B</div>
        <h1 className="font-bold text-lg leading-tight">BEJ Community</h1>
      </div>

      <div className="flex-1 space-y-1">
        {navItems.map((item) => {
          if (item.roles.includes(user?.role || UserRole.GUEST)) {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                aria-current={activeTab === item.id ? 'page' : undefined}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          }
          return null;
        })}
      </div>

      <div className="mt-auto pt-6 border-t border-slate-800">
        {user ? (
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'profile' ? 'bg-slate-800' : 'hover:bg-slate-800'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-bold truncate">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-slate-500 truncate">{user.role}</p>
            </div>
          </button>
        ) : (
          <button
            onClick={onLoginRequest}
            className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors"
          >
            <LogIn size={20} />
            Anmelden
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
