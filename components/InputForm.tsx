import React, { useState } from 'react';
import { SessionParams } from '../types';
import { Settings, Zap, Calendar, Trophy, Activity, Users, Timer } from 'lucide-react';

interface InputFormProps {
  onSubmit: (params: SessionParams) => void;
  isLoading: boolean;
}

type DayType = 'REST' | 'TRAINING' | 'MATCH';

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  // --- 1. PARAMÈTRES D'ÉQUIPE ---
  const [category, setCategory] = useState("Seniors");
  const [gender, setGender] = useState("M");
  const [level, setLevel] = useState("D1"); // Valeur par défaut corrigée
  const [playerCount, setPlayerCount] = useState(18);

  // --- 2. PLANNING HEBDOMADAIRE ---
  const [schedule, setSchedule] = useState<Record<string, DayType>>({
    "Lundi": "REST", "Mardi": "TRAINING", "Mercredi": "TRAINING",
    "Jeudi": "REST", "Vendredi": "TRAINING", "Samedi": "MATCH", "Dimanche": "REST"
  });
  const [selectedDay, setSelectedDay] = useState<string>("Mardi");
  
  // --- 3. COMMANDE ATHLÉTIQUE ---
  const [problemDescription, setProblemDescription] = useState("");

  const toggleDay = (day: string) => {
    const types: DayType[] = ['REST', 'TRAINING', 'MATCH'];
    const current = schedule[day];
    const next = types[(types.indexOf(current) + 1) % types.length];
    setSchedule({ ...schedule, [day]: next });
  };

  const trainingCount = Object.values(schedule).filter(t => t === 'TRAINING').length;

  const getCycleMoment = (day: string) => {
    const days = Object.keys(schedule);
    const dayIdx = days.indexOf(day);
    const matchIdx = days.indexOf("Samedi");
    const diff = matchIdx - dayIdx;
    
    if (diff === 1) return "J-1";
    if (diff === 2) return "J-2";
    if (diff === 3) return "J-3";
    if (diff > 3 || diff < 0) return "J+2"; 
    return "J+2";
  };

  const handleSubmit = () => {
    onSubmit({
      category,
      gender,
      level,        
      playerCount,
      cycleMoment: getCycleMoment(selectedDay),
      dominance: 'Auto', 
      problemDescription,
      focusMode: 'dominance',
      weeklyFrequency: trainingCount
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-8">
      
      {/* SECTION 1 : PROFIL ATHLÉTIQUE */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
        <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4" /> Profil Athlétique Groupe
        </label>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* CATÉGORIE */}
            <div>
                <span className="text-[10px] font-bold text-slate-400 block mb-1">CATÉGORIE</span>
                <select 
                    value={category} onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-sm text-slate-700 focus:border-[#FFD700] outline-none"
                >
                    {["U9", "U10", "U11", "U12", "U13", "U14", "U15", "U16", "U17", "U18", "U19", "Seniors"].map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>

            {/* GENRE */}
            <div>
                <span className="text-[10px] font-bold text-slate-400 block mb-1">GENRE</span>
                <div className="flex bg-white rounded-lg border border-slate-200 p-1">
                    <button onClick={() => setGender("M")} className={`flex-1 py-1 rounded text-xs font-bold ${gender === "M" ? "bg-blue-100 text-blue-700" : "text-slate-400"}`}>H</button>
                    <button onClick={() => setGender("F")} className={`flex-1 py-1 rounded text-xs font-bold ${gender === "F" ? "bg-pink-100 text-pink-700" : "text-slate-400"}`}>F</button>
                </div>
            </div>

            {/* NIVEAU (MODIFIÉ SELON VOTRE DEMANDE) */}
            <div>
                <span className="text-[10px] font-bold text-slate-400 block mb-1">NIVEAU</span>
                <select 
                    value={level} onChange={(e) => setLevel(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold text-sm text-slate-700 focus:border-[#FFD700] outline-none"
                >
                    {["Élite", "D1", "D2", "D3"].map(l => (
                        <option key={l} value={l}>{l}</option>
                    ))}
                </select>
            </div>

            {/* EFFECTIF */}
            <div>
                <span className="text-[10px] font-bold text-slate-400 block mb-1">EFFECTIF ({playerCount})</span>
                <input 
                    type="range" min="8" max="30" 
                    value={playerCount} onChange={(e) => setPlayerCount(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#FFD700]" 
                />
            </div>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* SECTION 2 : PLANNING */}
      <div>
        <div className="flex justify-between items-end mb-4">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Charge Hebdomadaire
            </label>
            <span className={`text-xs font-bold px-2 py-1 rounded ${trainingCount <= 2 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                {trainingCount} Séances / sem.
            </span>
        </div>
        
        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
            {Object.entries(schedule).map(([day, type]) => (
                <div key={day} className="flex flex-col gap-2">
                    <button
                        onClick={() => toggleDay(day)}
                        className={`
                            h-12 md:h-14 rounded-lg flex flex-col items-center justify-center text-[9px] md:text-[10px] font-bold transition-all border-2
                            ${type === 'REST' ? 'bg-slate-50 border-slate-200 text-slate-400' : ''}
                            ${type === 'TRAINING' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : ''}
                            ${type === 'MATCH' ? 'bg-[#FFD700] border-yellow-500 text-slate-900' : ''}
                        `}
                    >
                        <span>{day.substring(0, 3)}</span>
                        {type === 'MATCH' && <Trophy className="w-3 h-3 mt-1" />}
                        {type === 'TRAINING' && <Zap className="w-3 h-3 mt-1" />}
                    </button>
                    {type === 'TRAINING' && (
                        <button
                            onClick={() => setSelectedDay(day)}
                            className={`w-full py-1 rounded-full text-[8px] font-black uppercase transition-all ${
                                selectedDay === day ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                            }`}
                        >
                            {selectedDay === day ? 'CIBLE' : 'CHOISIR'}
                        </button>
                    )}
                </div>
            ))}
        </div>
      </div>

      {/* SECTION 3 : COMMANDE PHYSIQUE */}
      <div className="space-y-4">
        <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2">
                <Timer className="w-4 h-4" /> Objectif Athlétique
            </label>
            <textarea 
                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#FFD700] focus:bg-white outline-none text-sm transition-all"
                rows={2}
                placeholder="Ex: Mes joueurs manquent d'explosivité sur les 5 premiers mètres..."
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
            />
        </div>

        <button 
            onClick={handleSubmit}
            disabled={isLoading || !selectedDay}
            className="w-full py-4 bg-[#FFD700] hover:bg-[#ffc800] text-slate-900 font-black rounded-xl shadow-lg hover:shadow-xl transition-all transform active:scale-[0.98] flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isLoading ? (
                <span className="animate-pulse">Calcul de la charge...</span>
            ) : (
                <>
                    <Zap className="w-5 h-5" /> GÉNÉRER LE PANEL PHYSIQUE ({selectedDay})
                </>
            )}
        </button>
      </div>
    </div>
  );
};

export default InputForm;
