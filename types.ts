export interface SessionParams {
  category: string;
  playerCount: number;
  gender: string;
  level: string;
  cycleMoment: string;
  dominance: string;
  problemDescription: string;
  focusMode: 'methodology' | 'dominance';
  weeklyFrequency: number; 
}

export interface Exercise {
  title: string;
  duration: string;
  type: string;
  instructions: string;
  material: string;
  intensity: 'Basse' | 'Moyenne' | 'Haute' | 'Max';
  // J'ai supprimé la ligne "diagram" ici
}

export interface SessionData {
  diagnosis: {
    title: string;
    explanation: string;
    advice: string;
  };
  exercises: Exercise[];
}
