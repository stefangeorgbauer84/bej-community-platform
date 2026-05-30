
import React, { useState, useMemo, useEffect } from 'react';
import { UserRole, UserProfile, isUnder30 } from './types';
import { authService } from './services/authService';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Newsfeed from './components/Newsfeed';
import MemberSearch from './components/MemberSearch';
import Chat from './components/Chat';
import Files from './components/Files';
import Blog from './components/Blog';
import Quiz from './components/Quiz';
import AdminDashboard from './components/AdminDashboard';
import Registration from './components/Registration';
import { ToastProvider } from './components/Toast';
import { 
  Home, 
  Newspaper, 
  Users, 
  MessageSquare, 
  FileText, 
  BookOpen, 
  Gamepad2, 
  ShieldCheck,
  UserCircle
} from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showLogin, setShowLogin] = useState(false);

  // Mock initial setup for guest or switch manually for testing
  const isU30 = useMemo(
    () => currentUser?.birthDate ? isUnder30(currentUser.birthDate) : false,
    [currentUser]
  );

  useEffect(() => {
    authService.getCurrentUser().then(user => {
      if (user) setCurrentUser(user);
    });
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    setShowLogin(false);
  };

  const tabContent: Record<string, React.ReactNode> = {
    dashboard: <Dashboard user={currentUser} setActiveTab={setActiveTab} isU30={isU30} onLoginRequest={() => setShowLogin(true)} />,
    news: <Newsfeed user={currentUser} isU30={isU30} />,
    members: <MemberSearch user={currentUser} />,
    chat: <Chat user={currentUser} />,
    files: <Files user={currentUser} />,
    blog: <Blog user={currentUser} />,
    quiz: <Quiz user={currentUser} />,
    admin: currentUser?.role === UserRole.ADMIN
      ? <AdminDashboard user={currentUser} />
      : <Dashboard user={currentUser} setActiveTab={setActiveTab} isU30={isU30} onLoginRequest={() => setShowLogin(true)} />,
    profile: currentUser ? (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">Mein Profil</h2>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold">
              {currentUser.firstName?.[0]}{currentUser.lastName?.[0]}
            </div>
            <div>
              <h3 className="text-xl font-bold">{currentUser.firstName} {currentUser.lastName}</h3>
              <p className="text-slate-500">{currentUser.organization} • {currentUser.function}</p>
              {currentUser.isVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium mt-1">
                  <ShieldCheck size={12} /> Verifiziert
                </span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">E-Mail</label>
              <p>{currentUser.email}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Region</label>
              <p>{currentUser.region}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Geburtsdatum</label>
              <p>{currentUser.birthDate || 'Nicht angegeben'}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</label>
              <p>{currentUser.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="mt-8 text-red-600 hover:text-red-700 font-medium">Abmelden</button>
        </div>
      </div>
    ) : <Dashboard user={currentUser} setActiveTab={setActiveTab} isU30={isU30} onLoginRequest={() => setShowLogin(true)} />,
  };

  const renderContent = () =>
    tabContent[activeTab] ?? <Dashboard user={currentUser} setActiveTab={setActiveTab} isU30={isU30} onLoginRequest={() => setShowLogin(true)} />;

  return (
    <ToastProvider>
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar for Mobile & Desktop */}
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={currentUser} 
        onLoginRequest={() => setShowLogin(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
        {showLogin ? (
          <Registration onLogin={handleLogin} onCancel={() => setShowLogin(false)} />
        ) : (
          renderContent()
        )}
      </main>

      {/* Mobile Bottom Bar (Alternative View) */}
      <nav aria-label="Mobile Navigation" className="md:hidden sticky bottom-0 w-full bg-white border-t border-slate-200 flex justify-around py-2 px-4 z-50">
        <button aria-label="Dashboard" onClick={() => setActiveTab('dashboard')} className={`${activeTab === 'dashboard' ? 'text-blue-600' : 'text-slate-400'}`}>
          <Home size={20} />
        </button>
        <button aria-label="Newsfeed" onClick={() => setActiveTab('news')} className={`${activeTab === 'news' ? 'text-blue-600' : 'text-slate-400'}`}>
          <Newspaper size={20} />
        </button>
        {currentUser?.isVerified && (
          <button aria-label="Chat" onClick={() => setActiveTab('chat')} className={`${activeTab === 'chat' ? 'text-blue-600' : 'text-slate-400'}`}>
            <MessageSquare size={20} />
          </button>
        )}
        <button aria-label={currentUser ? 'Mein Profil' : 'Dashboard'} onClick={() => setActiveTab(currentUser ? 'profile' : 'dashboard')} className={`${activeTab === 'profile' ? 'text-blue-600' : 'text-slate-400'}`}>
          <UserCircle size={20} />
        </button>
      </nav>
    </div>
    </ToastProvider>
  );
};

export default App;
