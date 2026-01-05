import React, { useState, useEffect } from 'react';
import { SessionParams } from '../types';
import { Loader2, Zap, CalendarDays, Users, Trophy, Dumbbell, Activity, User, Hash, CheckCircle2 } from 'lucide-react';

interface InputFormProps {
  onSubmit: (params: SessionParams) => void;
  isLoading: boolean;
}

// --- DONNÉES STATIQUES ---
const CATEGORIES = ["U9", "U10", "U11", "U12", "U13", "U14", "U15", "U16", "U17", "U19", "Senior"];
const GENDERS = ["M", "F"];
const LEVELS = ["Élite", "D1", "D2", "D3"]; 
const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

type DayType = 'rest' | 'training' | 'match';

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  
  // Par défaut : Mardi/Jeudi entrainement, Samedi Match
  const [schedule, setSchedule] = useState<DayType[]>([
    'rest', 'training', 'rest', 'training', 'rest', 'match', 'rest'
  ]);
  
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(1); // Mardi par défaut

  const [params, setParams] = useState<SessionParams>({
    category: 'Senior',
    gender: 'M',
    level: 'D1',
    focusMode: 'dominance',
    dominance: '',
    problemDescription: '',
    cycleMoment: '',
    playerCount: 18,
    references: '',
    sessionsPerWeek: 2,
    sessionNumber: 1
  });

  // --- LOGIQUE DE CALCUL DU THÈME (PFC) ---
  const calculateTheme = (dayIndex: number) => {
    const matchIndex = schedule.indexOf('match');
    if (matchIndex === -1) return { code: 'TEAMS', theme: 'Technique / Dév.' };

    let gap = matchIndex - dayIndex;
    
    // Logique PDF PFC
    if (gap === 1) return { code: "J-1", theme: "Vivacité / Réveil" };
    if (gap === 2) return { code: "J-2", theme: "Vitesse Spécifique" };
    if (gap === 3) return { code: "J-3", theme: "Puissance (PMA)" };
    if (gap === 4) return { code: "J+3", theme: "Force Spécifique" };
    if (gap >= 5) return { code: "J+2", theme: "Aérobie / Capacité" };
    if (gap < 0) return { code: "J+2", theme: "Aérobie / Capacité" }; // Post match

    return { code: "J+?", theme: "Adaptation" };
  };

  useEffect(() => {
    if (selectedDayIndex === null || schedule[selectedDayIndex] !== 'training') return;
    
    const info = calculateTheme(selectedDayIndex);

    setParams(p => ({
      ...p,
      cycleMoment: info.code,
      dominance: info.theme,
      focusMode: 'dominance'
    }));

  }, [schedule, selectedDayIndex]);

  // --- ACTIONS ---
  const toggleDay = (index: number) => {
    const current = schedule[index];
    const next = current === 'rest' ? 'training' : current === 'training' ? 'match' : 'rest';
    
    const newSchedule = [...schedule];
    if (next === 'match') {
       newSchedule.forEach((d, i) => { if (d === 'match') newSchedule[i] = 'rest'; });
    }
    newSchedule[index] = next;
    setSchedule(newSchedule);
    
    // Si on supprime la séance sélectionnée, on désélectionne
    if (index === selectedDayIndex && next !== 'training') {
        setSelectedDayIndex(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setParams(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDayIndex !== null) onSubmit(params);
  };

  return (
    <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
      
      <div className="bg-slate-900 px-6 py-4 border-b border-[#FFD700] flex justify-between items-center">
        <h2 className="text-white font-bold text-lg flex items-center gap-2">
          <CalendarDays className="text-[#FFD700] w-5 h-5" /> 
          Paramètres Séance
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        
        {/* 1. ÉQUIPE */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><Users className="w-3 h-3" /> Catégorie</label>
                <select name="category" value={params.category} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-slate-800 bg-white">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><User className="w-3 h-3" /> Genre</label>
                <select name="gender" value={params.gender} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-slate-800 bg-white">
                    {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
            </div>
            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><Activity className="w-3 h-3" /> Niveau</label>
                <select name="level" value={params.level} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-slate-800 bg-white">
                    {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
            </div>
            <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><Hash className="w-3 h-3" /> Effectif</label>
                <input type="number" name="playerCount" value={params.playerCount} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-slate-800 bg-white" min="1" />
            </div>
        </div>

        <hr className="border-slate-100" />

        {/* 2. CONFIGURATION SEMAINE (Grille) */}
        <div className="space-y-2">
            <div className="flex justify-between items-end">
                <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-[#FFD700]" /> Configuration Semaine
                </label>
                <span className="text-[10px] text-slate-400">Cliquez pour modifier (Repos / Séance / Match)</span>
            </div>
            
            <div className="grid grid-cols-7 gap-1 h-16">
                {schedule.map((type, index) => (
                    <div 
                        key={index}
                        onClick={() => toggleDay(index)}
                        className={`
                            rounded cursor-pointer border flex flex-col items-center justify-center transition-all
                            ${type === 'rest' ? 'border-dashed border-slate-200 bg-slate-50 opacity-60' : ''}
                            ${type === 'training' ? 'border-blue-200 bg-blue-50 text-blue-700 font-bold' : ''}
                            ${type === 'match' ? 'border-red-200 bg-red-50 text-red-700 font-bold' : ''}
                        `}
                    >
                        <span className="text-[10px] uppercase mb-0.5">{DAYS[index].substring(0, 3)}</span>
                        {type === 'training' && <Dumbbell className="w-4 h-4" />}
                        {type === 'match' && <Trophy className="w-4 h-4" />}
                    </div>
                ))}
            </div>
        </div>

        {/* 3. SÉLECTION CLAIRE DE LA SÉANCE */}
        <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#FFD700]" /> Quelle séance préparer ?
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {schedule.map((type, index) => {
                    if (type !== 'training') return null;
                    const info = calculateTheme(index);
                    const isSelected = selectedDayIndex === index;
                    
                    return (
                        <button
                            key={index}
                            type="button"
                            onClick={() => setSelectedDayIndex(index)}
                            className={`p-3 rounded-lg border-2 text-left transition-all relative
                                ${isSelected 
                                    ? 'border-blue-600 bg-white shadow-md ring-1 ring-blue-600' 
                                    : 'border-slate-200 bg-white hover:border-blue-300'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`font-bold ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>
                                    {DAYS[index]}
                                </span>
                                {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                            </div>
                            <div className="text-xs font-black text-slate-900 bg-yellow-100 inline-block px-1.5 py-0.5 rounded">
                                {info.code}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-1 truncate">
                                {info.theme}
                            </div>
                        </button>
                    );
                })}
            </div>
            {schedule.filter(t => t === 'training').length === 0 && (
                <p className="text-xs text-slate-400 italic text-center">Ajoutez des séances dans le calendrier ci-dessus.</p>
            )}
        </div>

        {/* 4. BOUTON FINAL */}
        {selectedDayIndex !== null && (
             <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#FFD700] hover:bg-[#EAC100] text-slate-900 p-4 rounded-xl font-black shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-3"
                >
                    {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <Zap className="w-5 h-5" />}
                    <span>GÉNÉRER LA SÉANCE DU {DAYS[selectedDayIndex].toUpperCase()}</span>
                </button>
                <p className="text-center text-xs text-slate-400 mt-2">
                    Thème automatique : <strong>{params.dominance}</strong>
                </p>
             </div>
        )}

        <div className="text-center pt-2">
            <button 
                type="button"
                onClick={() => setParams(p => ({ ...p, focusMode: p.focusMode === 'problem' ? 'dominance' : 'problem' }))}
                className="text-xs text-slate-400 underline hover:text-slate-600"
            >
                {params.focusMode === 'problem' ? "Mode Automatique (Activé)" : "Non, je veux corriger un problème spécifique"}
            </button>
            {params.focusMode === 'problem' && (
                <textarea
                    name="problemDescription"
                    value={params.problemDescription}
                    onChange={(e) => setParams(p => ({...p, problemDescription: e.target.value}))}
                    placeholder="Décrivez le problème..."
                    className="w-full mt-2 p-3 border rounded text-sm bg-red-50 focus:outline-none focus:border-red-300"
                />
            )}
        </div>

      </form>
    </div>
  );
};

export default InputForm;
