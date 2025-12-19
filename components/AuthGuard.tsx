import React, { useState, useEffect } from 'react';
import { Lock, ShieldCheck, ArrowRight } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(false);

  // Le mot de passe de ton club (à changer ici)
  const CLUB_PASSWORD = "PHENIX_ELITE_2025"; 

  // Vérifier si déjà connecté précédemment (session navigateur)
  useEffect(() => {
    const authStatus = sessionStorage.getItem('isCoachAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CLUB_PASSWORD) {
      setIsAuthenticated(true);
      setError(false);
      sessionStorage.setItem('isCoachAuthenticated', 'true');
    } else {
      setError(true);
      setPassword('');
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-[#FFD700] p-8 text-center">
          <div className="bg-slate-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <ShieldCheck className="text-[#FFD700] w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Accès Coachs Phenix</h2>
          <p className="text-slate-700 text-sm mt-2 font-medium">Veuillez entrer le code secret du club</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Code d'accès</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition-all ${
                  error ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-[#FFD700] focus:ring-2 focus:ring-yellow-100'
                }`}
              />
              <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
            </div>
            {error && <p className="text-red-500 text-xs mt-2 font-medium italic">Code incorrect. Veuillez réessayer.</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-[0.98]"
          >
            DÉVERROUILLER L'ACCÈS <ArrowRight className="w-4 h-4" />
          </button>
          
          <p className="text-center text-slate-400 text-[10px] uppercase tracking-widest">
            Système de Sécurité Phénix v3.0
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthGuard;
