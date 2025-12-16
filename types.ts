export interface SessionParams {
  category: string;
  gender: string;
  level: string;
  focusMode: 'dominance' | 'problem'; // Nouveau : Choix entre dominance physique ou problème tactique
  dominance: string; // Utilisé si focusMode === 'dominance'
  problemDescription?: string; // Utilisé si focusMode === 'problem'
  cycleMoment: string;
  playerCount: number;
  references: string;
  sessionsPerWeek: number;
  sessionNumber: number;
}

export interface Exercise {
  title: string;
  duration: string;
  steps: string[]; 
  coachingPoints: string[];
  physiologicalGoal: string;
  setup: string;
  visualPrompt?: string; // Description optimisée pour la génération d'image
}

export interface SessionStructure {
  warmup: Exercise;
  mainPart: Exercise[];
  conclusion: Exercise;
}

export interface GeneratedSession {
  data: SessionStructure;
  params: SessionParams;
  createdAt: number;
}