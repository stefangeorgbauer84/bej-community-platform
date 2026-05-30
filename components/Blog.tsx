
import React, { useState } from 'react';
import { UserProfile, BlogPost, UserRole } from '../types';
import { geminiService } from '../services/geminiService';
// Fix: Added missing ShieldCheck icon import
import { PenLine, Send, CheckCircle, RefreshCw, AlertCircle, FileText, ShieldCheck } from 'lucide-react';

interface BlogProps {
  user: UserProfile | null;
}

const Blog: React.FC<BlogProps> = ({ user }) => {
  const [posts, setPosts] = useState<BlogPost[]>([
    { id: '1', title: 'Meine Vision für Europa', content: 'In diesem Beitrag beschreibe ich, wie wir die Jugendbeteiligung stärken können...', authorId: 'user1', authorName: 'Max Mustermann', status: 'published', date: '2024-09-12' }
  ]);
  const [isCreating, setIsCreating] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewResult, setReviewResult] = useState<any>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const handleReview = async () => {
    if (!newPost.content) return;
    setIsReviewing(true);
    setReviewResult(null);
    setReviewError(null);
    try {
      const result = await geminiService.reviewBlogPost(newPost.content);
      setReviewResult(result);
    } catch (error: any) {
      console.error("Review Error", error);
      setReviewError(error?.message || "Fehler beim Review. Bitte versuche es erneut.");
    } finally {
      setIsReviewing(false);
    }
  };

  const handleSubmit = () => {
    if (!reviewResult?.approved) return;
    
    const post: BlogPost = {
      id: Math.random().toString(),
      title: newPost.title,
      content: newPost.content,
      authorId: user?.id || 'guest',
      authorName: user?.firstName || 'Gast',
      status: 'submitted',
      date: new Date().toISOString().split('T')[0]
    };

    setPosts([post, ...posts]);
    setIsCreating(false);
    setNewPost({ title: '', content: '' });
    setReviewResult(null);
  };

  if (!user || !user.isVerified) {
    return (
      <div className="p-10 max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-3xl font-extrabold">Europa-Blog</h2>
        <div className="bg-slate-100 p-12 rounded-3xl border-2 border-dashed border-slate-200">
           <FileText size={48} className="mx-auto text-slate-300 mb-4" />
           <h3 className="text-xl font-bold text-slate-700">Gast-Lesemodus</h3>
           <p className="text-slate-500 max-w-md mx-auto mt-2">Du kannst die öffentlichen Beiträge lesen, aber nur verifizierte Mitglieder dürfen eigene Beiträge schreiben und den Peer-Review-Prozess nutzen.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Europa-Blog</h2>
          <p className="text-slate-500 mt-1">Peer-reviewed Beiträge von der Community.</p>
        </div>
        {!isCreating && (
          <button 
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-900/10"
          >
            <PenLine size={18} /> Neuen Beitrag
          </button>
        )}
      </div>

      {isCreating ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="p-8 space-y-6">
            <input 
              type="text" 
              placeholder="Titel deines Beitrags..." 
              className="text-2xl font-bold w-full focus:outline-none"
              value={newPost.title}
              onChange={e => setNewPost({...newPost, title: e.target.value})}
            />
            <textarea 
              placeholder="Schreibe über deine Vision für Europa..." 
              className="w-full min-h-[300px] text-slate-700 focus:outline-none resize-none"
              value={newPost.content}
              onChange={e => setNewPost({...newPost, content: e.target.value})}
            />
            
            {reviewError && (
              <div className="p-5 rounded-2xl border bg-red-50 border-red-200 text-red-800">
                 <div className="flex items-center gap-2 mb-2 font-bold">
                   <AlertCircle size={20} />
                   Fehler beim Review
                 </div>
                 <p className="text-sm">{reviewError}</p>
              </div>
            )}
            {reviewResult && (
              <div className={`p-5 rounded-2xl border ${reviewResult.approved ? 'bg-green-50 border-green-200 text-green-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                 <div className="flex items-center gap-2 mb-2 font-bold">
                   {reviewResult.approved ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                   {reviewResult.approved ? 'Review erfolgreich!' : 'Verbesserungsvorschläge'}
                 </div>
                 <p className="text-sm italic">"{reviewResult.feedback}"</p>
                 {reviewResult.suggestedTitle && <p className="mt-2 text-sm">Empfohlener Titel: <strong>{reviewResult.suggestedTitle}</strong></p>}
              </div>
            )}
          </div>
          
          <div className="bg-slate-50 p-6 flex justify-between items-center">
            <button onClick={() => setIsCreating(false)} className="text-slate-500 font-bold hover:text-slate-700">Verwerfen</button>
            <div className="flex gap-4">
              <button 
                onClick={handleReview}
                disabled={isReviewing || !newPost.content}
                className="flex items-center gap-2 px-6 py-2 bg-white border border-slate-200 rounded-xl font-bold hover:bg-white disabled:opacity-50"
              >
                {isReviewing ? <RefreshCw className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
                KI-Check anfordern
              </button>
              <button 
                onClick={handleSubmit}
                disabled={!reviewResult?.approved}
                className="flex items-center gap-2 px-8 py-2 bg-blue-600 text-white rounded-xl font-bold disabled:opacity-50 hover:bg-blue-700"
              >
                <Send size={18} /> Einreichen
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-8">
          {posts.map(post => (
            <article key={post.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {post.status}
                </span>
                <span className="text-slate-400 text-sm font-medium">{post.date}</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">{post.title}</h3>
              <p className="text-slate-600 line-clamp-3 leading-relaxed mb-6">{post.content}</p>
              <div className="flex items-center gap-3 pt-6 border-t border-slate-50">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                  {post.authorName[0]}
                </div>
                <span className="text-slate-900 font-bold text-sm">{post.authorName}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;
