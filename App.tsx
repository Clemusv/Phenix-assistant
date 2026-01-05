import React, { useState } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import SessionView from './components/SessionView';
import { SessionParams, GeneratedSession } from './types';
import { generateSessionContent } from './services/geminiService';
import { Info, AlertTriangle, ShieldCheck, Lock } from 'lucide-react';

const App: React.FC = () => {
  // --- NOUVEAU : Gestion Auth Locale (Autonome) ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<GeneratedSession | null>(null);

  const handleGenerate = async (params: SessionParams) => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateSessionContent(params);
      setSession({ data, params, createdAt: Date.now() });
    } catch (err: any) {
      console.error(err);
      setError("Erreur : " + (err.message || "Vérifiez votre clé API Gemini."));
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mot de passe simple pour l'autonomie (à changer selon vos besoins)
    if (password === "club1234" || password === "admin") { 
      setIsAuthenticated(true);
    } else {
      alert("Mot de passe incorrect");
    }
  };

  // --- VUE DE CONNEXION (Si pas connecté) ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full space-y-4">
          <div className="text-center mb-6">
             <div className="bg-yellow-400 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                <Lock className="text-slate-900" />
             </div>
             <h2 className="text-xl font-bold text-slate-900">Accès Coach</h2>
          </div>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-3 rounded-lg"
            placeholder="Mot de passe..."
          />
          <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold">
            ENTRER
          </button>
        </form>
      </div>
    );
  }

  // --- VUE APPLICATION (Si connecté) ---
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          {/* COLONNE GAUCHE */}
          <div className="lg:col-span-4 space-y-6">
            <InputForm onSubmit={handleGenerate} isLoading={loading} />
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3 text-red-700 text-sm">
                <AlertTriangle className="w-5 h-5" />
                <div><strong>Erreur :</strong> {error}</div>
              </div>
            )}
          </div>
          {/* COLONNE DROITE */}
          <div className="lg:col-span-8 min-h-[500px]">
            {session ? (
              <SessionView session={session} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-white border border-dashed border-slate-300 rounded-xl p-12 text-center text-slate-400">
                <ShieldCheck className="w-12 h-12 text-yellow-500 mb-4" />
                <h3 className="text-xl font-bold text-slate-800">Prêt à générer</h3>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
