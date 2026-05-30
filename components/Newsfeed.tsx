
import React from 'react';
import { UserProfile, NewsPost, UserRole } from '../types';
import { Calendar, Globe, Users, ShieldCheck, Zap } from 'lucide-react';

interface NewsProps {
  user: UserProfile | null;
  isU30: boolean;
}

const MOCK_NEWS: NewsPost[] = [
  { id: '1', title: 'BEJ Bundeskongress 2024', content: 'Wir laden herzlich zum Bundeskongress in Berlin ein! Es erwarten euch spannende Debatten über die Zukunft Europas.', visibility: UserRole.GUEST, author: 'Vorstand', date: '2024-10-01' },
  { id: '2', title: 'Intern: Neue Budgetplanung', content: 'Die Unterlagen für die Budgetplanung 2025 sind jetzt im Downloadbereich verfügbar. Bitte prüft die Fristen.', visibility: UserRole.MEMBER, author: 'Geschäftsführung', date: '2024-10-15' },
  { id: '3', title: 'Safe Space: U30 Austauschabend', content: 'Ein vertraulicher Abend nur für unsere jungen Mitglieder. Hier können wir offen über Herausforderungen sprechen.', visibility: 'U30', author: 'U30 Koordination', date: '2024-10-20' },
];

const Newsfeed: React.FC<NewsProps> = ({ user, isU30 }) => {
  const filteredNews = MOCK_NEWS.filter(post => {
    if (user?.role === UserRole.ADMIN) return true;
    if (post.visibility === UserRole.GUEST) return true;
    if (!user) return false;
    if (post.visibility === UserRole.REGISTERED) return true;
    if (post.visibility === UserRole.MEMBER) return user.isVerified;
    if (post.visibility === 'U30') return user.isVerified && isU30;
    return false;
  });

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-10">
      <div>
        <h2 className="text-3xl font-extrabold">Aktuelles & Termine</h2>
        <p className="text-slate-500 mt-1">Neuigkeiten aus dem Bund und anstehende Veranstaltungen.</p>
      </div>

      <div className="grid gap-6">
        {filteredNews.length > 0 ? filteredNews.map(post => (
          <article key={post.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              {post.visibility === UserRole.GUEST && <span className="bg-blue-50 text-blue-600 p-1.5 rounded-lg"><Globe size={16} /></span>}
              {post.visibility === UserRole.MEMBER && <span className="bg-purple-50 text-purple-600 p-1.5 rounded-lg"><ShieldCheck size={16} /></span>}
              {post.visibility === 'U30' && <span className="bg-emerald-50 text-emerald-600 p-1.5 rounded-lg"><Zap size={16} /></span>}
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {post.visibility === UserRole.GUEST ? 'Öffentlich' : post.visibility === 'U30' ? 'U30 Safe Space' : 'Nur Mitglieder'}
              </span>
              <span className="mx-2 text-slate-300">•</span>
              <span className="text-xs text-slate-400 flex items-center gap-1 font-medium"><Calendar size={14} /> {post.date}</span>
            </div>
            <h3 className="text-xl font-bold mb-3">{post.title}</h3>
            <p className="text-slate-600 leading-relaxed mb-6">{post.content}</p>
            <div className="pt-4 border-t border-slate-50 flex justify-between items-center text-sm text-slate-400">
              <span className="font-medium">Autor: {post.author}</span>
              <button className="text-blue-600 font-bold hover:underline">Mehr lesen</button>
            </div>
          </article>
        )) : (
          <div className="text-center p-12 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
            Keine Beiträge in deiner Sichtbarkeit gefunden.
          </div>
        )}
      </div>
    </div>
  );
};

export default Newsfeed;
