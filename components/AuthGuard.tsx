import React, { useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, User } from 'firebase/auth';
import { Lock, Mail, ShieldCheck, Loader2 } from 'lucide-react';

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError("Identifiants incorrects ou accès non autorisé.");
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (user) return <>{children}</>;

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="bg-slate-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="text-[#FFD700] w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Connexion Coach</h2>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-100" required />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
            <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-100" required />
          </div>
          {error && <p className="text-red-500 text-xs italic">{error}</p>}
          <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all">
            SE CONNECTER
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthGuard;
