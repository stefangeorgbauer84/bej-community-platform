
import React, { useState } from 'react';
import { UserProfile, ChatGroup } from '../types';
import { Send, Hash, MoreHorizontal, UserPlus, Info, Lock } from 'lucide-react';

interface ChatProps {
  user: UserProfile | null;
}

const MOCK_GROUPS: ChatGroup[] = [
  { id: '1', name: 'Bundeskongress Orga', description: 'Planungsgruppe für den kommenden Kongress in Berlin.', members: ['1', '2'], isAdmin: true, isPublic: false },
  { id: '2', name: 'Bildungsteam', description: 'Diskussionen über Unterrichtsmaterialien und Formate.', members: ['1'], isAdmin: false, isPublic: true },
  { id: '3', name: 'Local: Hessen', description: 'Regionaler Austausch BEJ Hessen.', members: ['2'], isAdmin: false, isPublic: true },
];

const Chat: React.FC<ChatProps> = ({ user }) => {
  const [selectedGroup, setSelectedGroup] = useState<ChatGroup>(MOCK_GROUPS[0]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', senderId: 'user-mock-1', sender: 'Max Mustermann', text: 'Hallo zusammen! Wie läuft die Planung?', time: '14:20' },
    { id: '2', senderId: 'user-mock-2', sender: 'Sara Schmidt', text: 'Wir sind fast fertig mit dem Programmablauf.', time: '14:25' },
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setMessages([...messages, {
      id: Date.now().toString(),
      senderId: user.id,
      sender: `${user.firstName} ${user.lastName}`,
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setMessage('');
  };

  if (!user || !user.isVerified) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-20 text-center space-y-4">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500">
          <Lock size={32} />
        </div>
        <h2 className="text-xl font-bold">Chat gesperrt</h2>
        <p className="text-slate-500 max-w-sm">Chatten ist eine Funktion für verifizierte Mitglieder. Bitte schließe deinen Verifizierungsprozess ab.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar Channels */}
      <div className="w-72 border-r border-slate-100 flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold">Meine Kanäle</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {MOCK_GROUPS.map(group => (
            <button 
              key={group.id}
              onClick={() => setSelectedGroup(group)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                selectedGroup.id === group.id ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Hash size={18} className={selectedGroup.id === group.id ? 'text-blue-500' : 'text-slate-300'} />
              <span className="truncate">{group.name}</span>
            </button>
          ))}
        </div>
        <div className="p-4 bg-slate-50">
          <button className="w-full py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">
            + Neue Gruppe vorschlagen
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center shadow-sm">
          <div>
            <h3 className="font-bold text-lg">#{selectedGroup.name}</h3>
            <p className="text-xs text-slate-400">{selectedGroup.description}</p>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button aria-label="Mitglied einladen" className="hover:text-blue-600 transition-colors"><UserPlus size={20} /></button>
            <button aria-label="Kanalinfo" className="hover:text-blue-600 transition-colors"><Info size={20} /></button>
            <button aria-label="Weitere Optionen" className="hover:text-blue-600 transition-colors"><MoreHorizontal size={20} /></button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="text-center">
            <span className="bg-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Heute</span>
          </div>
          {messages.map(msg => (
            <div key={msg.id} className={`flex flex-col ${msg.senderId === user.id ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-slate-400">{msg.sender}</span>
                <span className="text-[10px] text-slate-300">{msg.time}</span>
              </div>
              <div className={`max-w-lg px-5 py-3 rounded-2xl text-sm ${
                msg.senderId === user.id
                  ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-900/10'
                  : 'bg-slate-100 text-slate-800 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-8 pt-0">
          <form onSubmit={handleSend} className="relative">
            <input 
              type="text" 
              placeholder={`Nachricht an #${selectedGroup.name}`}
              className="w-full pl-6 pr-16 py-4 bg-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm transition-all"
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
            <button 
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-colors"
            >
              <Send size={18} />
            </button>
          </form>
          <p className="text-[10px] text-slate-400 mt-2 ml-1">Nachrichten sind nur für Mitglieder dieses Kanals sichtbar.</p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
