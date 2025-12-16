import React, { useState } from 'react';
import { GeneratedSession, Exercise } from '../types';
import { Download, Calendar, Timer, ClipboardList, Info, Flame, Image as ImageIcon, Loader, Layers, ChevronLeft, ChevronRight, CheckCircle2, Flag, Clock, BrainCircuit } from 'lucide-react';
import { generateExerciseImage } from '../services/geminiService';

interface SessionViewProps {
  session: GeneratedSession;
}

const ExerciseCard: React.FC<{ 
  exercise: Exercise, 
  index: number, 
  total: number,
  type: 'warmup' | 'main' | 'conclusion',
  onNext: () => void,
  onPrev: () => void,
  hasPrev: boolean,
  hasNext: boolean
}> = ({ exercise, index, total, type, onNext, onPrev, hasPrev, hasNext }) => {
  
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);

  const handleGenerateImage = async () => {
    setLoadingImage(true);
    try {
      // Utilisation du visualPrompt s'il existe, sinon fallback sur steps + setup
      // Le visualPrompt est désormais spécifiquement conçu pour décrire la scène géométrique
      const promptToUse = exercise.visualPrompt || exercise.steps.join(' ');
      
      const url = await generateExerciseImage(promptToUse, exercise.setup);
      if (url) setImageUrl(url);
    } catch (e) {
      alert("Erreur de génération d'image");
    } finally {
      setLoadingImage(false);
    }
  };

  const getBadgeColor = () => {
    switch(type) {
      case 'warmup': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'conclusion': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getTypeName = () => {
     switch(type) {
      case 'warmup': return 'Échauffement';
      case 'conclusion': return 'Retour au calme';
      default: return `Exercice ${index}`; // Index relatif dans le main part, ajusté par le parent si besoin
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Navigation Top Bar - Mobile Friendly */}
      <div className="flex justify-between items-center mb-4 no-print">
         <button 
           onClick={onPrev} 
           disabled={!hasPrev}
           className={`p-2 rounded-full flex items-center gap-1 transition-all ${!hasPrev ? 'text-slate-300 cursor-not-allowed' : 'bg-white shadow text-blue-900 hover:bg-blue-50'}`}
         >
            <ChevronLeft className="w-6 h-6" />
            <span className="hidden sm:inline text-sm font-medium">Précédent</span>
         </button>
         
         <div className="text-center">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getBadgeColor()} uppercase tracking-wider`}>
              {getTypeName()}
            </span>
         </div>

         <button 
           onClick={onNext} 
           disabled={!hasNext}
           className={`p-2 rounded-full flex items-center gap-1 transition-all ${!hasNext ? 'text-slate-300 cursor-not-allowed' : 'bg-white shadow text-blue-900 hover:bg-blue-50'}`}
         >
            <span className="hidden sm:inline text-sm font-medium">Suivant</span>
            <ChevronRight className="w-6 h-6" />
         </button>
      </div>

      {/* Card Container */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden flex-1 flex flex-col">
        
        {/* Card Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex justify-between items-start gap-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 leading-tight">{exercise.title}</h3>
            <div className="flex items-center gap-2 mt-2 text-slate-500 text-sm">
              <Clock className="w-4 h-4 text-amber-500" />
              <span className="font-semibold">{exercise.duration}</span>
            </div>
          </div>
          <div className="hidden md:block">
             <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-900 font-bold shadow-sm border border-blue-100">
               {index + 1}<span className="text-[10px] text-blue-300">/{total}</span>
             </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            
            {/* Left Column: Content */}
            <div className="space-y-6">
              
              {/* Image Section (Mobile Order) */}
              <div className="lg:hidden block bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl min-h-[200px] flex items-center justify-center relative overflow-hidden">
                   {imageUrl ? (
                      <img src={imageUrl} alt="Schéma" className="w-full h-full object-contain" />
                    ) : (
                      <button onClick={handleGenerateImage} className="flex flex-col items-center text-slate-400">
                         {loadingImage ? <Loader className="w-8 h-8 animate-spin mb-2" /> : <ImageIcon className="w-8 h-8 mb-2" />}
                         <span className="text-xs font-medium">Générer le Schéma Tactique</span>
                      </button>
                    )}
              </div>

              {/* Description Steps */}
              <div>
                <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-3">
                  <Flag className="w-5 h-5 text-blue-600" /> Déroulement
                </h4>
                <div className="space-y-3">
                  {exercise.steps.map((step, i) => (
                    <div key={i} className="flex gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-slate-700 text-sm leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Setup */}
              <div>
                <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-2">
                  <ClipboardList className="w-5 h-5 text-amber-600" /> Organisation
                </h4>
                <p className="text-slate-600 text-sm bg-amber-50 p-3 rounded-lg border border-amber-100">
                  {exercise.setup}
                </p>
              </div>

            </div>

            {/* Right Column: Image & Coaching */}
            <div className="flex flex-col gap-6">
              
              {/* Desktop Image */}
              <div className="hidden lg:flex bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex-1 min-h-[300px] items-center justify-center relative overflow-hidden group">
                  {imageUrl ? (
                    <img src={imageUrl} alt="Schéma tactique" className="w-full h-full object-contain p-2" />
                  ) : (
                    <div className="text-center">
                      <div className="mb-4 mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                         <ImageIcon className="w-8 h-8 text-slate-300" />
                      </div>
                      <p className="text-slate-400 text-sm mb-4">Schéma tactique non généré</p>
                      <button 
                        onClick={handleGenerateImage}
                        disabled={loadingImage}
                        className="bg-white border border-slate-300 text-slate-700 text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 transition-all flex items-center gap-2 mx-auto"
                      >
                        {loadingImage ? <Loader className="w-4 h-4 animate-spin" /> : <Flame className="w-4 h-4" />}
                        Générer Schéma IA
                      </button>
                    </div>
                  )}
              </div>

              {/* Coaching Points */}
              <div className="bg-blue-900 text-white rounded-xl p-5 shadow-md">
                 <h4 className="font-bold text-amber-400 flex items-center gap-2 mb-3">
                    <Info className="w-5 h-5" /> Coaching Points
                 </h4>
                 <ul className="space-y-2">
                   {exercise.coachingPoints.map((pt, i) => (
                     <li key={i} className="flex gap-2 text-sm text-blue-100 items-start">
                       <CheckCircle2 className="w-4 h-4 mt-0.5 text-amber-500 flex-shrink-0" />
                       <span>{pt}</span>
                     </li>
                   ))}
                 </ul>
              </div>

              {/* Physio Goal Footer */}
              <div className="mt-auto pt-4 border-t border-slate-100">
                 <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Objectif Physique</p>
                 <p className="text-sm font-medium text-slate-800">{exercise.physiologicalGoal}</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SessionView: React.FC<SessionViewProps> = ({ session }) => {
  const { warmup, mainPart, conclusion } = session.data;

  // Flatten the session into a single array for the carousel
  const allExercises = [
    { ...warmup, _type: 'warmup' as const },
    ...mainPart.map(ex => ({ ...ex, _type: 'main' as const })),
    { ...conclusion, _type: 'conclusion' as const }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < allExercises.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const currentExercise = allExercises[currentIndex];

  // Détermine le texte à afficher dans le header (Dominance ou Problème tronqué)
  const sessionGoalText = session.params.focusMode === 'problem' && session.params.problemDescription
    ? `Problème : ${session.params.problemDescription.substring(0, 30)}${session.params.problemDescription.length > 30 ? '...' : ''}`
    : session.params.dominance;

  return (
    <div className="h-full flex flex-col">
      {/* Printable View (Hidden on screen, visible on print) */}
      <div className="hidden print-only">
         <div className="mb-8 border-b-2 border-blue-900 pb-4">
             <h1 className="text-2xl font-bold">Séance Complète - Phynix</h1>
             <p>{session.params.category} - {sessionGoalText}</p>
         </div>
         {allExercises.map((ex, idx) => (
            <div key={idx} className="mb-8 border-b pb-4 page-break-inside-avoid">
               <h3 className="font-bold text-lg">{idx === 0 ? 'Échauffement' : idx === allExercises.length - 1 ? 'Conclusion' : `Exercice ${idx}`}: {ex.title}</h3>
               <p className="text-sm italic">{ex.duration}</p>
               <div className="mt-2">
                 <strong>Déroulement:</strong>
                 <ul className="list-disc pl-5">
                   {ex.steps.map(s => <li key={s}>{s}</li>)}
                 </ul>
               </div>
               <div className="mt-2"><strong>Organisation:</strong> {ex.setup}</div>
            </div>
         ))}
      </div>

      {/* Screen View Header */}
      <div className="bg-blue-900 px-6 py-4 border-b border-amber-500 flex justify-between items-center rounded-t-xl no-print">
        <div className="flex items-center gap-2">
           {session.params.focusMode === 'problem' ? (
              <BrainCircuit className="text-amber-500 w-5 h-5" />
           ) : (
              <Flame className="text-amber-500 w-5 h-5" />
           )}
          <h2 className="text-white font-semibold text-lg">Séance du Jour</h2>
        </div>
        
        <div className="flex gap-2">
            <div className="text-white text-xs bg-blue-800 px-3 py-1.5 rounded-lg border border-blue-700 hidden md:block max-w-[200px] truncate">
               {session.params.category} • {sessionGoalText}
            </div>
            <button 
              onClick={handlePrint}
              className="text-blue-100 hover:text-white hover:bg-blue-800 p-2 rounded-lg transition-colors flex items-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" />
            </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-slate-200 h-1.5 w-full no-print">
         <div 
           className="bg-amber-500 h-full transition-all duration-300 ease-out"
           style={{ width: `${((currentIndex + 1) / allExercises.length) * 100}%` }}
         />
      </div>

      {/* Carousel Area */}
      <div className="bg-slate-50 flex-1 p-4 md:p-6 overflow-hidden relative">
         <ExerciseCard 
            key={currentIndex}
            exercise={currentExercise}
            index={currentIndex}
            total={allExercises.length}
            type={currentExercise._type}
            onNext={handleNext}
            onPrev={handlePrev}
            hasNext={currentIndex < allExercises.length - 1}
            hasPrev={currentIndex > 0}
         />
      </div>
      
      {/* Footer Info */}
      <div className="text-center py-2 text-[10px] text-slate-400 no-print">
         Étape {currentIndex + 1} sur {allExercises.length}
      </div>
    </div>
  );
};

export default SessionView;