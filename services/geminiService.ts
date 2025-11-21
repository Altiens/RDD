import { GoogleGenAI } from "@google/genai";
import { SimulationConfig } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize only if key exists to prevent immediate crash, handle in call
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const getRddExplanation = async (config: SimulationConfig): Promise<string> => {
  if (!ai) {
    return "API Key is missing. Please configure process.env.API_KEY to receive AI insights.";
  }

  try {
    const prompt = `
      You are a world-class econometrics professor akin to the style of 3blue1brown. 
      Explain the Regression Discontinuity Design (RDD) simulation currently shown to the user.
      
      Current Parameters:
      - Cutoff (Threshold): ${config.cutoff}
      - Treatment Effect (Jump): ${config.effectSize}
      - Noise Level (Variance): ${config.noiseLevel}
      - Underlying Function Slope: ${config.slope}
      - Curvature (Non-linearity): ${config.curvature}

      Your goal:
      1. Explain intuitively what the "Jump" at the cutoff ${config.cutoff} represents in causal terms.
      2. If the noise is high (${config.noiseLevel} > 5), warn about statistical power.
      3. If curvature is high, mention the risk of mistaking non-linearity for a discontinuity.
      4. Keep it concise (max 3 paragraphs), engaging, and use Markdown for bolding key terms.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No explanation generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while fetching the explanation. Please check your API limits or connection.";
  }
};