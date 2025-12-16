import React, { useState, useEffect } from 'react';
import { SessionParams } from '../types';
import { Loader2, Zap, BookOpen, Clock, Activity, Users, Settings, Lock, Unlock, User, Flame, CalendarDays, Info, BrainCircuit, Target, Dumbbell } from 'lucide-react';

interface InputFormProps {
  onSubmit: (params: SessionParams) => void;
  isLoading: boolean;
}

// Options
const CATEGORIES = ["U9", "U10", "U11", "U12", "U13", "U14", "U15", "U16", "U17", "Senior"];
const GENDERS = ["M", "F"];
const LEVELS = ["Élite", "D1", "D2", "D3"];
const CYCLES = ["Avant-saison", "Saison", "Régénération"];

const DOMINANCE_DEFINITIONS: Record<string, string> = {
  "Vitesse": "Fréquence gestuelle (jeunes) ou Vitesse Max/Explosivité (adultes).",
  "Endurance Puissance": "Puissance Aérobie (VMA), Répétition des efforts intenses.",
  "Endurance Aérobie": "Capacité aérobie fondamentale, endurance de base.",
  "Force": "Renforcement musculaire (Poids de corps ou Charge selon âge).",
  "Coordination": "Psychocinétique, échelle de rythme, agilité, maitrise corporelle.",
  "Vivacité": "Appuis brefs, changements de direction, réaction.",
  "Souplesse": "Mobilité articulaire et étirements actifs.",
  "Prévention": "Proprioception, renforcement prophylactique."
};

// Logique de Priorité basée sur le graphique "Périodes Sensibles"
const getPriorities = (category: string) => {
  const cat = category.replace("U", "");
  const age = cat === "Senior" ? 20 : parseInt(cat);

  // 9-13 ANS : Âge d'Or de la Motricité & Vitesse
  if (age <= 13) {
    return {
      priority: ["Coordination", "Vitesse", "Vivacité", "Souplesse"],
      secondary: ["Endurance Aérobie"],
      other: ["Force", "Endurance Puissance", "Prévention"]
    };
  }
  
  // 13-16 ANS : Pic de Croissance (Aérobie & Fragilité)
  if (age > 13 && age <= 16) {
    return {
      priority: ["Endurance Aérobie", "Souplesse", "Prévention"], // Aérobie monte, Souplesse critique (os > muscle)
      secondary: ["Vitesse", "Coordination", "Vivacité"], // Maintenance car perte de repères corporels
      other: ["Force", "Endurance Puissance"] // Attention danger charges lourdes
    };
  }

  // 16-20+ ANS : Adulte (Force & Puissance)
  return {
    priority: ["Force", "Endurance Puissance", "Vitesse"],
    secondary: ["Vivacité", "Prévention", "Endurance Aérobie"],
    other: ["Coordination", "Souplesse"]
  };
};

const LOADING_MESSAGES = [
  "Analyse de l'âge biologique et des fenêtres de développement...",
  "Sélection des ateliers physiques adaptés...",
  "Calibrage des temps de repos et d'effort...",
  "Vérification des contraintes physiologiques...",
  "Génération des schémas d'entraînement..."
];

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [params, setParams] = useState<SessionParams>({
    category: 'Senior',
    gender: 'M',
    level: 'D1',
    focusMode: 'dominance',
    dominance: 'Endurance Puissance', // Sera mis à jour dynamiquement
    problemDescription: '',
    cycleMoment: 'Saison',
    playerCount: 18,
    references: 'Une saison de préparation physique en football, De l\'entraînement à la performance, FIFA 11+',
    sessionsPerWeek: 2,
    sessionNumber: 1
  });

  const [priorities, setPriorities] = useState(getPriorities('Senior'));
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  // Mise à jour des priorités quand la catégorie change
  useEffect(() => {
    const newPriorities = getPriorities(params.category);
    setPriorities(newPriorities);
    
    // Auto-sélectionner la première priorité pour guider l'utilisateur
    if (params.focusMode === 'dominance') {
       const currentIsPriority = newPriorities.priority.includes(params.dominance);
       const currentIsSecondary = newPriorities.secondary.includes(params.dominance);
       
       if (!currentIsPriority && !currentIsSecondary) {
         setParams(prev => ({ ...prev, dominance: newPriorities.priority[0] }));
       }
    }
  }, [params.category, params.focusMode]);

  useEffect(() => {
    if (params.sessionNumber > params.sessionsPerWeek) {
      setParams(prev => ({ ...prev, sessionNumber: prev.sessionsPerWeek }));
    }
  }, [params.sessionsPerWeek, params.sessionNumber]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isLoading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: parseInt(value) || 1 }));
  };

  const handlePlayerCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams(prev => ({ ...prev, playerCount: parseInt(e.target.value) }));
  };

  const handleModeChange = (mode: 'dominance' | 'problem') => {
    setParams(prev => ({ ...prev, focusMode: mode }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(params);
  };

  const toggleAdminMode = () => {
    if (isAdminMode) {
      setIsAdminMode(false);
      setIsAuthenticated(false);
      setPasswordInput("");
    } else {
      setIsAdminMode(true);
    }
  };

  const handleLogin = () => {
    if (passwordInput === "club1234") {
      setIsAuthenticated(true);
    } else {
      alert("Mot de passe incorrect");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      
      {/* En-tête (Noir Phenix avec icône Jaune) */}
      <div className="bg-slate-900 px-6 py-4 border-b border-[#FFD700] flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Settings className="text-[#FFD700] w-5 h-5" />
          <h2 className="text-white font-semibold text-lg">Paramètres Phenix</h2>
        </div>
        <button 
          onClick={toggleAdminMode}
          className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${isAdminMode ? 'bg-[#FFD700] text-slate-900 font-bold' : 'text-slate-400 hover:text-white'}`}
        >
          {isAdminMode ? <Settings className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
          {isAdminMode ? 'Admin' : 'Admin'}
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        
        {/* SECTION 1 : PUBLIC */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-800 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#FFD700]" /> Catégorie
            </label>
            <div className="flex gap-2">
              <select
                name="category"
                value={params.category}
                onChange={handleChange}
                className="w-2/3 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-slate-800 bg-white"
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <select
                name="gender"
                value={params.gender}
                onChange={handleChange}
                className="w-1/3 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-slate-800 bg-white"
              >
                {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-800 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#FFD700]" /> Niveau
            </label>
            <select
              name="level"
              value={params.level}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-slate-800 bg-white"
            >
               {LEVELS.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
            </select>
            <p className="text-[10px] text-slate-400 italic text-right px-1">
              {params.level === "Élite" ? "Compétition" : "Loisir / Dév."}
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
           <label className="text-sm font-medium text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-2"><User className="w-4 h-4 text-[#FFD700]" /> Joueurs disponibles</span>
              <span className="bg-yellow-100 text-yellow-800 font-bold px-2 py-0.5 rounded border border-yellow-200">{params.playerCount}</span>
            </label>
            <input 
              type="range" 
              min="6" 
              max="30" 
              step="1"
              value={params.playerCount} 
              onChange={handlePlayerCountChange}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#FFD700]"
            />
        </div>

        {/* SECTION 2 : OBJET DE LA SÉANCE */}
        <div className="space-y-3 pt-2">
            <div className="flex bg-slate-100 p-1 rounded-lg">
                <button
                    type="button"
                    onClick={() => handleModeChange('dominance')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${params.focusMode === 'dominance' ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Dumbbell className="w-4 h-4" /> Ateliers Qualité Physique
                </button>
                <button
                    type="button"
                    onClick={() => handleModeChange('problem')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${params.focusMode === 'problem' ? 'bg-white text-yellow-700 shadow-sm ring-1 ring-yellow-200' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Target className="w-4 h-4" /> Corriger un Déficit
                </button>
            </div>

            {params.focusMode === 'dominance' ? (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="text-sm font-medium text-slate-800 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-[#FFD700]" /> Qualité à Travailler ({params.category})
                    </label>
                    
                    {/* MENU DÉROULANT CATÉGORISÉ */}
                    <select
                        name="dominance"
                        value={params.dominance}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-slate-800 bg-white"
                    >
                        <optgroup label="★ PRIORITAIRE (Âge d'Or)">
                            {priorities.priority.map(dom => (
                                <option key={dom} value={dom}>★ {dom}</option>
                            ))}
                        </optgroup>
                        
                        {priorities.secondary.length > 0 && (
                            <optgroup label="⚠ SECONDAIRE (Maintenance/Transition)">
                                {priorities.secondary.map(dom => (
                                    <option key={dom} value={dom}>{dom}</option>
                                ))}
                            </optgroup>
                        )}

                        {priorities.other.length > 0 && (
                            <optgroup label="⬇ AUTRES (Moins adapté)">
                                {priorities.other.map(dom => (
                                    <option key={dom} value={dom}>{dom}</option>
                                ))}
                            </optgroup>
                        )}
                    </select>

                    {/* Bulle d'info dynamique (Bleutée pour contraste ou Jaune pâle) */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex gap-2 items-start transition-all mt-2">
                        <Info className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <span className="block text-xs font-bold text-yellow-800 uppercase mb-0.5">{params.dominance}</span>
                            <p className="text-xs text-slate-600 leading-snug">
                            {DOMINANCE_DEFINITIONS[params.dominance] || "Développement spécifique."}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="text-sm font-medium text-slate-800 flex items-center gap-2">
                        <Target className="w-4 h-4 text-[#FFD700]" /> Décrivez le besoin physique
                    </label>
                    <textarea
                        name="problemDescription"
                        value={params.problemDescription}
                        onChange={handleChange}
                        placeholder="Ex: Mes joueurs manquent de tonicité..."
                        rows={4}
                        className="w-full px-3 py-2 border border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-slate-800 bg-white text-sm"
                    />
                </div>
            )}
        </div>

        {/* SECTION 3 : PLANIFICATION */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Cycle
                </label>
                <select
                  name="cycleMoment"
                  value={params.cycleMoment}
                  onChange={handleChange}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm bg-white focus:ring-yellow-400 focus:border-yellow-400"
                >
                  {CYCLES.map(cyc => <option key={cyc} value={cyc}>{cyc}</option>)}
                </select>
              </div>
               <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500 flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" /> Semaine
                  </label>
                  <div className="flex items-center gap-2 bg-white border border-slate-300 rounded px-2 py-1.5">
                     <span className="text-xs text-slate-400">Séance</span>
                     <input
                        type="number"
                        name="sessionNumber"
                        min="1"
                        max={params.sessionsPerWeek}
                        value={params.sessionNumber}
                        onChange={handleNumberChange}
                        className="w-8 text-center font-bold text-yellow-600 outline-none text-sm p-0 border-none focus:ring-0"
                      />
                      <span className="text-xs text-slate-400">/</span>
                      <input
                        type="number"
                        name="sessionsPerWeek"
                        min="1"
                        max="7"
                        value={params.sessionsPerWeek}
                        onChange={handleNumberChange}
                        className="w-8 text-center font-bold text-slate-800 outline-none text-sm p-0 border-none focus:ring-0"
                      />
                  </div>
              </div>
          </div>
        </div>

        {/* SECTION ADMIN */}
        {isAdminMode && (
          <div className="mt-4 p-4 bg-slate-100 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 mb-3 text-slate-800 font-semibold border-b border-slate-200 pb-2">
              <Settings className="w-4 h-4" /> Zone Admin
            </div>
            {!isAuthenticated ? (
              <div className="space-y-3">
                <p className="text-sm text-slate-600">Mot de passe requis.</p>
                <div className="flex gap-2">
                  <input 
                    type="password" 
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:ring-yellow-400 focus:border-yellow-400"
                    placeholder="......"
                  />
                  <button type="button" onClick={handleLogin} className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800"><Unlock className="w-4 h-4" /></button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 animate-in fade-in duration-300">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2"><BookOpen className="w-4 h-4 text-[#FFD700]" /> Auteurs / Références</label>
                  <textarea name="references" value={params.references} onChange={handleChange} rows={4} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 text-sm font-mono focus:ring-yellow-400 focus:border-yellow-400" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* BOUTON FINAL (JAUNE PHENIX) */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 px-4 rounded-lg font-bold text-slate-900 shadow-md transition-all flex flex-col justify-center items-center gap-2 relative overflow-hidden
            ${isLoading ? 'bg-slate-200 cursor-not-allowed' : 'bg-[#FFD700] hover:bg-[#EAC100] hover:shadow-lg active:scale-[0.98] border-b-4 border-[#C5A000]'}`}
        >
          {isLoading ? (
            <div className="flex flex-col items-center animate-in fade-in duration-300">
              <div className="flex items-center gap-2">
                 <Loader2 className="animate-spin w-5 h-5 text-slate-500" /> 
                 <span className="uppercase tracking-widest text-sm text-slate-500">IA en cours de réflexion</span>
              </div>
              <span className="text-xs text-slate-400 mt-1 font-normal opacity-90 transition-all duration-500 min-h-[1.5em]">{LOADING_MESSAGES[loadingStep]}</span>
              <div className="absolute bottom-0 left-0 h-1 bg-yellow-600 transition-all duration-500 ease-linear" style={{ width: `${((loadingStep + 1) / LOADING_MESSAGES.length) * 100}%` }} />
            </div>
          ) : (
            <span className="flex items-center gap-2">CRÉER LA SÉANCE</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default InputForm;
