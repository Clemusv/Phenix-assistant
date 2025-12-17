import { GoogleGenerativeAI } from "@google/generative-ai";

// Récupération de la clé depuis le fichier .env
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Fonction de nettoyage de la clé (sécurité)
const getCleanKey = () => {
  if (!API_KEY) return "";
  return API_KEY.replace(/["';\s]/g, "");
};

// --- CONFIGURATION DU MODÈLE ---
// Basé sur votre liste "Index 4", c'est le modèle fiable pour votre compte.
const MODEL_NAME = "gemini-2.0-flash"; 

const genAI = new GoogleGenerativeAI(getCleanKey());

export const generateSessionContent = async (criteria: any) => {
  try {
    const cleanKey = getCleanKey();
    if (!cleanKey) throw new Error("Clé API manquante. Vérifiez votre fichier .env");

    // Initialisation du modèle spécifique
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // Construction du Prompt Expert (Préparateur Physique)
    const prompt = `
      Tu es un expert en préparation physique de football (Diplôme FFF).
      
      CONTEXTE :
      - Catégorie : ${criteria.category}
      - Genre : ${criteria.gender}
      - Niveau : ${criteria.level}
      - Effectif : ${criteria.playerCount} joueurs
      - Type de séance : ${criteria.focusMode === 'dominance' ? 'Développement Qualité' : 'Correction Problème'}
      - Objectif principal : "${criteria.focusMode === 'dominance' ? criteria.dominance : criteria.problemDescription}"

      MISSION :
      Génère une séance complète et structurée au format JSON strict.

      RÈGLES D'OR :
      1. Si U6-U13 : Ludique, gamification, ballon omniprésent.
      2. Si U14+ : Plus athlétique, rigueur, répétitions.
      3. Temps de récupération adaptés à la physiologie.

      FORMAT DE RÉPONSE ATTENDU (JSON pur, sans texte autour) :
      {
        "diagnosis": {
          "title": "Analyse de l'expert",
          "explanation": "Pourquoi on travaille ça aujourd'hui...",
          "advice": "Conseil clé pour le coach sur le terrain"
        },
        "exercises": [
          {
            "title": "Nom de l'atelier",
            "duration": "Durée (ex: 15 min)",
            "type": "Échauffement / Corps / Jeu",
            "instructions": "Consignes claires...",
            "material": "Matériel nécessaire",
            "intensity": "Faible / Moyenne / Haute"
          },
          {
            "title": "Exercice 2...",
            "duration": "...",
            "type": "...",
            "instructions": "...",
            "material": "...",
            "intensity": "..."
          },
          {
            "title": "Exercice 3...",
            "duration": "...",
            "type": "...",
            "instructions": "...",
            "material": "...",
            "intensity": "..."
          },
          {
            "title": "Jeu Final / Application",
            "duration": "...",
            "type": "Jeu",
            "instructions": "...",
            "material": "...",
            "intensity": "Haute"
          }
        ]
      }
    `;

    console.log(`📡 Envoi de la demande à ${MODEL_NAME}...`);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Nettoyage du JSON (au cas où l'IA ajoute des ```json ... ```)
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1) {
      text = text.substring(start, end + 1);
    }

    return JSON.parse(text);

  } catch (error: any) {
    console.error("❌ Erreur Gemini :", error);
    
    // Gestion des erreurs spécifiques
    if (error.message?.includes("429")) {
        throw new Error("Trop de demandes. Attendez une minute.");
    }
    if (error.message?.includes("503")) {
        throw new Error("Les serveurs Google surchauffent. Réessayez dans 30s.");
    }
    if (error.message?.includes("not found")) {
        throw new Error(`Le modèle ${MODEL_NAME} n'est pas activé sur votre clé API.`);
    }

    throw new Error("Erreur de génération. Vérifiez la console.");
  }
};

// Fonction pour l'image (désactivée pour éviter les erreurs de quota payant)
export const generateExerciseImage = async (description: string) => {
  return ""; 
};
