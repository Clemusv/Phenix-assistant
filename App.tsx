import React, { useState } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import SessionView from './components/SessionView';
import { SessionParams, GeneratedSession } from './types';
import { generateSessionContent } from './services/geminiService';
import { Info, AlertTriangle, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<GeneratedSession | null>(null);

  const handleGenerate = async (params: SessionParams) => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateSessionContent(params);
      setSession({
        data,
        params,
        createdAt: Date.now(),
      });
    } catch (err: any) {
      console.error(err);
      setError("Erreur de génération. Vérifiez la clé API et réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          
          {/* COLONNE GAUCHE : PARAMÈTRES */}
          <div className="lg:col-span-4 space-y-6 no-print">
            <InputForm onSubmit={handleGenerate} isLoading={loading} />
            
            {/* Message de Bienvenue (Couleur Jaune) */}
            {!session && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3 text-yellow-900 text-sm shadow-sm">
                <Info className="w-5 h-5 flex-shrink-0 text-yellow-600" />
                <p>
                  Bienvenue sur <strong>Phenix</strong>. Configurez les paramètres ci-dessus pour générer une séance spécifique à votre méthodologie club.
                </p>
              </div>
            )}

            {/* Zone d'Erreur */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3 text-red-700 text-sm animate-pulse">
                <AlertTriangle className="w-5 h-5" />
                <div>
                  <strong>Erreur système :</strong> {error}
                </div>
              </div>
            )}
            
            <div className="text-center text-xs text-slate-300">
               Phenix v3.0 • Powered by Gemini Flash
            </div>
          </div>

          {/* COLONNE DROITE : RÉSULTAT */}
          <div className="lg:col-span-8 min-h-[500px]">
            {session ? (
              <SessionView session={session} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-white border border-dashed border-slate-300 rounded-xl p-12 text-center text-slate-400">
                <div className="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center mb-6">
                  <ShieldCheck className="w-12 h-12 text-yellow-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Espace de Travail</h3>
                <p className="max-w-md text-slate-500">En attente de paramètres...</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;
