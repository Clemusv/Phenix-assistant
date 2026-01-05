import React from 'react';
import { SessionData, Exercise } from '../types';
import { Clock, Target, ChevronRight, MapPin, AlertTriangle, Zap, Activity, Layers } from 'lucide-react';

interface SessionDisplayProps {
  session: SessionData;
}

// Badge d'intensité redesigné
const IntensityBadge = ({ level }: { level: string }) => {
  const styles = {
    'Basse': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Moyenne': 'bg-blue-100 text-blue-800 border-blue-200',
    'Haute': 'bg-orange-100 text-orange-800 border-orange-200',
    'Max': 'bg-red-100 text-red-800 border-red-200',
  };
  const style = styles[level as keyof typeof styles] || styles['Moyenne'];

  return (
    <div className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg border ${style} min-w-[80px]`}>
      <span className="text-[9px] font-bold uppercase tracking-wider opacity-70">Intensité</span>
      <span className="text-sm font-black flex items-center gap-1">
        <Zap className="w-3 h-3" /> {level}
      </span>
    </div>
  );
};

// Composant intelligent pour afficher le texte structuré
const SmartInstructions = ({ text }: { text: string }) => {
  if (!text) return <p className="text-slate-400 italic">Pas de consignes.</p>;

  // On découpe le texte par ligne
  const lines = text.split('\n');

  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        const cleanLine = line.trim();
        if (!cleanLine) return <div key={i} className="h-2"></div>; // Espace vide

        // Cas 1 : C'est un titre de section (ex: "Mise en place :")
        if (cleanLine.endsWith(':') || cleanLine.toUpperCase() === cleanLine && cleanLine.length > 4 && !cleanLine.startsWith('-')) {
          return (
            <h6 key={i} className="text-xs font-black text-slate-800 uppercase mt-3 mb-1 flex items-center gap-2">
              <span className="w-1 h-3 bg-[#FFD700] rounded-full"></span>
              {cleanLine}
            </h6>
          );
        }

        // Cas 2 : C'est une puce (commence par -)
        if (cleanLine.startsWith('-') || cleanLine.startsWith('•')) {
          return (
            <div key={i} className="flex items-start gap-3 pl-2">
              <div className="min-w-[6px] h-[6px] rounded-full bg-slate-300 mt-1.5"></div>
              <p className="text-sm text-slate-600 leading-relaxed">{cleanLine.substring(1).trim()}</p>
            </div>
          );
        }

        // Cas 3 : Paragraphe normal
        return <p key={i} className="text-sm text-slate-600 leading-relaxed mb-1">{cleanLine}</p>;
      })}
    </div>
  );
};

const ExerciseCard = ({ exercise, index }: { exercise: Exercise, index: number }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8 hover:shadow-md transition-shadow">
    
    {/* HEADER DE LA CARTE */}
    <div className="bg-slate-50 border-b border-slate-100 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900 text-[#FFD700] font-black text-lg shadow-lg shadow-slate-900/20">
          {index + 1}
        </div>
        <div>
          <h4 className="font-bold text-lg text-slate-800 leading-tight">{exercise.title}</h4>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{exercise.type}</span>
        </div>
      </div>
      
      {/* Badges Info Rapide */}
      <div className="flex gap-3 w-full md:w-auto">
        <div className="flex-1 md:flex-none flex flex-col items-center justify-center px-4 py-2 rounded-lg bg-white border border-slate-200">
           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Durée</span>
           <span className="text-sm font-bold text-slate-700 flex items-center gap-1">
             <Clock className="w-3 h-3" /> {exercise.duration}
           </span>
        </div>
        <IntensityBadge level={exercise.intensity} />
      </div>
    </div>

    {/* CORPS DE LA CARTE */}
    <div className="p-0 grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-100">
      
      {/* COLONNE GAUCHE : CONSIGNES (70%) */}
      <div className="md:col-span-8 p-6">
         <h5 className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
           <Activity className="w-4 h-4 text-[#FFD700]" /> Déroulement & Consignes
         </h5>
         <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100/50">
            <SmartInstructions text={exercise.instructions} />
         </div>
      </div>

      {/* COLONNE DROITE : INFO PRATIQUES (30%) */}
      <div className="md:col-span-4 p-6 bg-slate-50/30 space-y-6">
         
         <div>
            <h5 className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
               <MapPin className="w-3 h-3" /> Matériel & Espace
            </h5>
            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
               <p className="text-sm text-slate-700 font-medium leading-relaxed">
                 {exercise.material || "Non spécifié"}
               </p>
            </div>
         </div>

         <div>
            <h5 className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
               <Layers className="w-3 h-3" /> Type de travail
            </h5>
            <div className="flex flex-wrap gap-2">
               <span className="px-2 py-1 bg-slate-200 text-slate-600 rounded text-xs font-bold">
                 {exercise.type}
               </span>
               <span className="px-2 py-1 bg-[#FFD700]/20 text-yellow-800 rounded text-xs font-bold">
                 Physique
               </span>
            </div>
         </div>

      </div>
    </div>
  </div>
);

const SessionDisplay: React.FC<SessionDisplayProps> = ({ session }) => {
  if (!session || !session.data) {
    return (
        <div className="p-8 text-center text-red-500 bg-red-50 rounded-lg">
            <AlertTriangle className="w-10 h-10 mx-auto mb-2" />
            <p>Erreur : Données de séance manquantes.</p>
        </div>
    );
  }

  const { data, params } = session;
  const diagnosis = data.diagnosis || { title: "...", explanation: "...", advice: "..." };
  const exercises = Array.isArray(data.exercises) ? data.exercises : [];

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      
      {/* HEADER ANALYSE */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden border-t-4 border-[#FFD700]">
        <div className="relative z-10 grid md:grid-cols-3 gap-8">
           <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                 <span className="bg-[#FFD700] text-slate-900 text-xs font-black px-2 py-1 rounded">
                    {params.cycleMoment}
                 </span>
                 <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                    {params.category} • {params.level}
                 </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white uppercase leading-none mb-4">
                {diagnosis.title}
              </h2>
              <p className="text-slate-300 leading-relaxed text-sm md:text-base border-l-2 border-[#FFD700] pl-4">
                {diagnosis.explanation}
              </p>
           </div>
           
           <div className="bg-white/5 rounded-xl p-5 border border-white/10 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3 text-[#FFD700]">
                 <Target className="w-5 h-5" />
                 <h3 className="font-bold text-sm uppercase">Conseil du Préparateur</h3>
              </div>
              <p className="text-sm italic text-slate-200">"{diagnosis.advice}"</p>
           </div>
        </div>
      </div>

      {/* LISTE DES EXERCICES */}
      <div>
        <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight flex items-center gap-2">
               <span className="bg-slate-200 w-6 h-6 rounded flex items-center justify-center text-xs">3</span>
               Options Disponibles
            </h3>
            <div className="h-px bg-slate-200 flex-1 ml-4"></div>
        </div>
        
        {exercises.length > 0 ? (
            exercises.map((exo, index) => (
            <ExerciseCard key={index} exercise={exo} index={index} />
            ))
        ) : (
            <p className="text-center text-slate-400 italic py-10">Aucun exercice généré.</p>
        )}
      </div>
      
    </div>
  );
};

export default SessionDisplay;
