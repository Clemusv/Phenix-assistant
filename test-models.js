import { GoogleGenerativeAI } from "@google/generative-ai";

async function listAvailableModels() {
  // 👇 COLLEZ VOTRE CLÉ CI-DESSOUS (entre les guillemets)
  const apiKey = "AIzaSyAcDJi2zRIAt3Nl-Ch1KB72UA2XL6j-w39w"; 

  if (!apiKey || apiKey.includes("...")) {
    console.error("❌ ERREUR: Vous devez coller votre clé API à la ligne 5 !");
    return;
  }

  console.log("🔑 Clé utilisée :", apiKey.substring(0, 10) + "...");
  console.log("📡 Test des modèles en cours...");

  const genAI = new GoogleGenerativeAI(apiKey);
  
  const modelsToTest = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-001",
    "gemini-1.5-flash-8b",
    "gemini-1.5-pro",
    "gemini-1.5-pro-001",
    "gemini-pro"
  ];

  for (const modelName of modelsToTest) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      await model.generateContent({
          contents: [{ role: "user", parts: [{ text: "Hi" }] }],
          generationConfig: { maxOutputTokens: 1 }
      });
      console.log(`✅ ${modelName} : DISPONIBLE (Fonctionne !)`);
    } catch (error) {
      if (error.message && error.message.includes("404")) {
         console.log(`❌ ${modelName} : Non trouvé (404)`);
      } else {
         console.log(`⚠️ ${modelName} : Erreur autre (${error.message.split(' ')[0]})`);
      }
    }
  }
}

listAvailableModels();
