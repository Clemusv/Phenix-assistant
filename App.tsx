import React, { useState } from 'react';
import { SessionParams, SessionData } from './types';
import InputForm from './components/InputForm';
import SessionDisplay from './components/SessionDisplay';
import { generateSessionContent } from './services/geminiService';
import { Lock, Key } from 'lucide-react';

interface SessionRecord {
  params: SessionParams;
  data: SessionData;
  createdAt: number;
}

const App: React.FC = () => {
  // --- GESTION DU LOGIN ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [loginError, setLoginError] = useState(false);

  // 🔐 LE CODE SECRET
  const SECRET_CODE = "PHX2026"; 

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode === SECRET_CODE) {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  // --- ETAT APPLICATION ---
  const [session, setSession] = useState<SessionRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (params: SessionParams) => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateSessionContent(params);
      setSession({ params, data, createdAt: Date.now() });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- ECRAN DE CONNEXION ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm text-center animate-in fade-in zoom-in duration-300">
          <div className="bg-[#FFD700] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-yellow-500/50 overflow-hidden bg-white p-2">
             {/* LOGO SUR L'ÉCRAN DE LOGIN */}
             <img 
               src="https://i0.wp.com/phenixdesrivieres.com/wp-content/uploads/2024/11/logo-phenix-des-rivieres.png?fit=800%2C969&ssl=1" 
               alt="Logo Phenix" 
               className="w-full h-full object-contain"
             />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-1">PHENIX ACCESS</h1>
          <p className="text-xs text-slate-400 mb-8 uppercase tracking-widest">Assistant Prépa Physique</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Key className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
              <input 
                type="password" 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-[#FFD700] outline-none font-bold text-center tracking-[0.3em] text-lg text-slate-800 transition-all focus:bg-white"
                placeholder="•••••••"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
              />
            </div>
            
            {loginError && (
              <div className="text-red-500 text-xs font-bold bg-red-50 p-2 rounded border border-red-100 animate-pulse">
                CODE INCORRECT
              </div>
            )}
            
            <button type="submit" className="w-full py-3 bg-slate-900 text-[#FFD700] font-bold rounded-lg hover:bg-slate-800 transition shadow-lg transform active:scale-[0.98]">
              DÉVERROUILLER
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- APP PRINCIPALE ---
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50 border-b border-[#FFD700]/20">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             
             {/* 👇 VOTRE LOGO EST ICI 👇 */}
             <div className="bg-white p-1 rounded-lg shadow-lg shadow-yellow-500/20 w-10 h-10 flex items-center justify-center overflow-hidden">
               <img 
                 src="https://i0.wp.com/phenixdesrivieres.com/wp-content/uploads/2024/11/logo-phenix-des-rivieres.png?fit=800%2C969&ssl=1" 
                 alt="Logo Phenix" 
                 className="w-full h-full object-contain"
               />
             </div>
             {/* 👆 FIN DU LOGO 👆 */}

             <div>
               <h1 className="font-black text-xl tracking-tight leading-none">PHENIX</h1>
               <p className="text-[10px] text-slate-400 uppercase tracking-widest">Assistant Performance</p>
             </div>
          </div>
          <div className="flex gap-2">
            {session && (
                <button onClick={() => setSession(null)} className="text-xs font-bold border border-slate-600 px-3 py-1.5 rounded text-slate-300 hover:text-white hover:border-slate-400 transition-all">
                Nouveau Panel
                </button>
            )}
            <button onClick={() => setIsAuthenticated(false)} className="text-xs font-bold bg-white/10 px-3 py-1.5 rounded text-slate-300 hover:text-white hover:bg-white/20 transition-all">
                Sortir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700 shadow-sm">
            <strong className="block mb-1">Erreur de génération :</strong> {error}
          </div>
        )}

        {!session ? (
          <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
             <div className="text-center mb-8">
                <h2 className="text-2xl font-black text-slate-800 mb-2">Conception de Panel Physique</h2>
                <p className="text-slate-500 text-sm">
                  Définissez votre profil d'équipe et votre objectif athlétique.
                  <br/>L'IA générera 3 situations adaptées physiologiquement.
                </p>
             </div>
             <InputForm onSubmit={handleGenerate} isLoading={loading} />
          </div>
        ) : (
          <SessionDisplay session={session} />
        )}

      </main>
    </div>
  );
};

export default App;
