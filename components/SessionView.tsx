import React from 'react';
import { GeneratedSession } from '../types';
import { Clock, CheckCircle, Info, Dumbbell, PlayCircle } from 'lucide-react';

interface SessionViewProps {
  session: GeneratedSession;
}

const SessionView: React.FC<SessionViewProps> = ({ session }) => {
  // Sécurité absolue : Si les données sont incomplètes, on affiche un message calme au lieu de planter
  if (!session || !session.data) {
    return <div className="p-8 text-center text-slate-500">Données de séance indisponibles.</div>;
  }

  const { diagnosis, exercises } = session.data;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* 1. EN-TÊTE DIAGNOSTIC */}
      <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-[#FFD700]">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-2">
          <Info className="w-5 h-5 text-[#FFD700]" />
          {diagnosis?.title || "Analyse de la séance"}
        </h3>
        <p className="text-slate-600 mb-4 leading-relaxed">
          {diagnosis?.explanation || "Aucune explication fournie."}
        </p>
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm text-slate-700 italic">
          💡 <strong>Conseil Coach :</strong> {diagnosis?.advice || "Soyez attentif à l'intensité."}
        </div>
      </div>

      {/* 2. LISTE DES EXERCICES */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Dumbbell className="w-5 h-5 text-slate-400" />
          Déroulé de la séance
        </h3>

        {/* Si la liste est vide ou n'existe pas, on affiche un message */}
        {(!exercises || exercises.length === 0) ? (
            <div className="p-8 bg-white rounded-lg border border-dashed border-slate-300 text-center text-slate-500">
                Aucun exercice généré pour le moment.
            </div>
        ) : (
            // Sinon on affiche la liste (le .map qui plantait est maintenant protégé)
            exercises.map((exo: any, index: number) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                
                {/* Header de l'exercice */}
                <div className="bg-slate-900 px-4 py-3 flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                        <span className="bg-[#FFD700] text-slate-900 font-bold w-6 h-6 flex items-center justify-center rounded-full text-xs">
                        {index + 1}
                        </span>
                        <h4 className="font-bold text-lg">{exo.title}</h4>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-wider text-slate-300">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {exo.duration}</span>
                        <span className={`px-2 py-0.5 rounded text-slate-900 font-bold ${
                            exo.intensity === 'Haute' ? 'bg-red-400' : 
                            exo.intensity === 'Moyenne' ? 'bg-yellow-400' : 'bg-green-400'
                        }`}>
                        {exo.intensity}
                        </span>
                    </div>
                </div>

                {/* Contenu */}
                <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Consignes</p>
                            <p className="text-slate-700 whitespace-pre-line">{exo.instructions}</p>
                        </div>
                        {exo.variations && (
                            <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
                                <strong>Variantes :</strong> {Array.isArray(exo.variations) ? exo.variations.join(', ') : exo.variations}
                            </div>
                        )}
                    </div>

                    <div className="md:col-span-1 space-y-4 border-l border-slate-100 pl-4">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Matériel</p>
                            <p className="text-sm text-slate-600">{Array.isArray(exo.material) ? exo.material.join(', ') : exo.material}</p>
                        </div>
                        <div>
                             <p className="text-xs font-bold text-slate-400 uppercase mb-1">Type</p>
                             <span className="inline-block bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium">
                                {exo.type}
                             </span>
                        </div>
                    </div>
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
};

export default SessionView;
