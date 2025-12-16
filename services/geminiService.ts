import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { SessionParams, SessionStructure } from "../types";

// ⚠️ Assurez-vous que votre NOUVELLE CLÉ est bien ici
const API_KEY_HARDCODED = "AIzaSyAcDJi2zRIAt3Nl-Ch1KB72U2XL6j-w39w"; 

const getApiKey = () => {
  if (API_KEY_HARDCODED && API_KEY_HARDCODED !== "COLLEZ_VOTRE_NOUVELLE_CLE_ICI") {
    return API_KEY_HARDCODED;
  }
  const key = import.meta.env.VITE_GEMINI_API_KEY || "";
  if (!key) throw new Error("Clé API manquante.");
  return key;
};

// --- SCHÉMAS ---
const sessionSchema = {
  type: SchemaType.OBJECT,
  properties: {
    warmup: {
      type: SchemaType.OBJECT,
      properties: {
        title: { type: SchemaType.STRING },
        duration: { type: SchemaType.STRING },
        steps: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        setup: { type: SchemaType.STRING },
        physiologicalGoal: { type: SchemaType.STRING },
        coachingPoints: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        visualPrompt: { type: SchemaType.STRING, description: "Description géométrique simple." }
      }
    },
    mainPart: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: { type: SchemaType.STRING },
          duration: { type: SchemaType.STRING },
          steps: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
          setup: { type: SchemaType.STRING },
          physiologicalGoal: { type: SchemaType.STRING },
          coachingPoints: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
          visualPrompt: { type: SchemaType.STRING, description: "Description géométrique simple." }
        }
      }
    },
    conclusion: {
      type: SchemaType.OBJECT,
      properties: {
        title: { type: SchemaType.STRING },
        duration: { type: SchemaType.STRING },
        steps: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        setup: { type: SchemaType.STRING },
        physiologicalGoal: { type: SchemaType.STRING },
        coachingPoints: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        visualPrompt: { type: SchemaType.STRING, description: "Description géométrique simple." }
      }
    },
  },
  required: ["warmup", "mainPart", "conclusion"]
};

const SYSTEM_INSTRUCTION = `Expert Foot Phynix.
Format: 1 Echauffement + 2 Ateliers + 1 Conclusion.
RÈGLE IMPÉRATIVE : SOIS PRÉCIS SUR LES CHIFFRES.`;

// --- FONCTION TEXTE (Génération de la séance) ---
export const generateSessionContent = async (params: SessionParams): Promise<SessionStructure> => {
  try {
    const apiKey = getApiKey();
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // On utilise le modèle stable que vous possédez
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    let focusInstruction = params.focusMode === 'problem' && params.problemDescription
        ? `Corriger le problème : "${params.problemDescription}"`
        : `Dominance à travailler : ${params.dominance}`;

    const userPrompt = `
      Séance pour Phénix ${params.category} (${params.playerCount} joueurs).
      ${focusInstruction}
      Génère 2 Ateliers Principaux.
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: sessionSchema,
        temperature: 0.5,
      },
    });

    const responseText = result.response.text();
    if (!responseText) throw new Error("Réponse vide de l'IA");
    
    return JSON.parse(responseText) as SessionStructure;

  } catch (error) {
    console.error("Gemini Text Error:", error);
    throw error;
  }
};

// --- FONCTION IMAGE (Désactivée pour éviter l'erreur de paiement) ---
export const generateExerciseImage = async (visualPrompt: string, setup: string): Promise<string> => {
  // On retourne vide pour ne pas bloquer l'application
  return ""; 
};
