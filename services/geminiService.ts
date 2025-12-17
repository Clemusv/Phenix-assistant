import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const getCleanKey = () => {
  if (!API_KEY) return "";
  return API_KEY.replace(/["';\s]/g, "");
};

// On garde l'alias qui fonctionne chez vous
const MODEL_NAME = "gemini-flash-latest";

const genAI = new GoogleGenerativeAI(getCleanKey());

export const generateSessionContent = async (criteria: any) => {
  try {
    const cleanKey = getCleanKey();
    if (!cleanKey) throw new Error("Clé API manquante. Vérifiez votre fichier .env");

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `
      Tu es un expert en préparation physique de football (Diplôme FFF).
      
      CONTEXTE :
      - Catégorie : ${criteria.category} (${criteria.gender})
      - Niveau : ${criteria.level}
      - Effectif : ${criteria.playerCount} joueurs
      - Type : ${criteria.focusMode === 'dominance' ? 'Développement Qualité' : 'Correction Déficit'}
      - Objectif : "${criteria.focusMode === 'dominance' ? criteria.dominance : criteria.problemDescription}"

      Génère une séance au format JSON strict avec cette structure exacte :
      {
        "diagnosis": {
          "title": "Analyse",
          "explanation": "Explication courte",
          "advice": "Conseil coach"
        },
        "exercises": [
          {
            "title": "Nom de l'exercice",
            "duration": "15 min",
            "type": "Échauffement / Jeu / Athlétique",
            "instructions": "Détails...",
            "material": "Coupelles...",
            "intensity": "Moyenne"
          }
        ]
      }
    `;

    console.log(`📡 Envoi de la demande à ${MODEL_NAME}...`);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Nettoyage JSON
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1) {
      text = text.substring(start, end + 1);
    }

    const data = JSON.parse(text);

    // --- FILET DE SÉCURITÉ ANTI-CRASH ---
    // Si l'IA oublie les exercices, on met une liste vide pour ne pas faire planter le site
    if (!data.exercises || !Array.isArray(data.exercises)) {
        data.exercises = [];
    }
    if (!data.diagnosis) {
        data.diagnosis = { title: "Info", explanation: "Analyse non disponible", advice: "Adaptez la séance." };
    }

    return data;

  } catch (error: any) {
    console.error("❌ Erreur Gemini :", error);
    if (error.message?.includes("404")) throw new Error(`Modèle ${MODEL_NAME} introuvable.`);
    if (error.message?.includes("429")) throw new Error("Quota dépassé. Réessayez plus tard.");
    throw new Error("Erreur de génération. Vérifiez la console.");
  }
};

export const generateExerciseImage = async (description: string) => {
  return ""; 
};
