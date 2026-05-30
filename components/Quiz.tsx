
import React, { useState, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { UserProfile } from '../types';
import { Trophy, ArrowRight, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

interface QuizProps {
  user: UserProfile | null;
}

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const Quiz: React.FC<QuizProps> = ({ user }) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestion = async () => {
    setLoading(true);
    setSelectedOption(null);
    setShowExplanation(false);
    setError(null);
    try {
      const q = await geminiService.generateQuizQuestion();
      setCurrentQuestion(q);
    } catch (error: any) {
      console.error("Quiz Error", error);
      setError(error?.message || "Fehler beim Laden der Quiz-Frage. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  const handleSelect = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    if (index === currentQuestion?.correctIndex) {
      setScore(s => s + 10);
    }
    setShowExplanation(true);
  };

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-2xl font-bold">EU-Quiz</h2>
          <p className="text-slate-500">Teste dein Europa-Wissen</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 text-blue-700">
          <Trophy size={20} />
          <span className="font-bold">{score} Punkte</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px] flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <RefreshCw className="animate-spin text-blue-600 mb-4" size={40} />
            <p className="text-slate-500">Gemini bereitet eine neue Frage für dich vor...</p>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <AlertCircle className="text-red-600 mb-4" size={40} />
            <p className="text-red-600 font-semibold mb-2">Fehler</p>
            <p className="text-slate-600 text-sm mb-4">{error}</p>
            <button onClick={fetchQuestion} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700">
              Erneut versuchen
            </button>
          </div>
        ) : currentQuestion ? (
          <div className="p-8 space-y-8">
            <h3 className="text-xl font-bold leading-relaxed">{currentQuestion.question}</h3>
            
            <div className="grid gap-3">
              {currentQuestion.options.map((option, idx) => {
                let statusClass = "border-slate-200 bg-white hover:border-blue-400";
                if (selectedOption !== null) {
                  if (idx === currentQuestion.correctIndex) statusClass = "border-green-500 bg-green-50";
                  else if (idx === selectedOption) statusClass = "border-red-500 bg-red-50";
                  else statusClass = "border-slate-100 bg-slate-50 opacity-50";
                }

                return (
                  <button
                    key={idx}
                    disabled={selectedOption !== null}
                    onClick={() => handleSelect(idx)}
                    className={`p-4 rounded-xl border text-left transition-all flex justify-between items-center ${statusClass}`}
                  >
                    <span>{option}</span>
                    {selectedOption !== null && idx === currentQuestion.correctIndex && <CheckCircle2 className="text-green-600" size={20} />}
                    {selectedOption !== null && idx === selectedOption && idx !== currentQuestion.correctIndex && <AlertCircle className="text-red-600" size={20} />}
                  </button>
                );
              })}
            </div>

            {showExplanation && (
              <div className="p-5 bg-blue-50 border border-blue-100 rounded-xl text-blue-900 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <p className="font-semibold mb-1">Gewusst?</p>
                <p className="text-sm">{currentQuestion.explanation}</p>
                <button 
                  onClick={fetchQuestion}
                  className="mt-4 flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors"
                >
                  Nächste Frage <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12">
            <button onClick={fetchQuestion} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold">Starten</button>
          </div>
        )}
      </div>

      <div className="mt-8 text-center text-slate-400 text-xs">
        Angetrieben durch Google Gemini • Nur für Lernzwecke
      </div>
    </div>
  );
};

export default Quiz;
