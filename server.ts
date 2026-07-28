import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: AI Stylist recommendation from Gemini
  app.post("/api/stylist", async (req, res) => {
    try {
      const { prompt, eventType, currentLook, availableProducts } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(200).json({
          advice: "Welcome to TREDNY AI Styling Advisor. To enable live AI styling suggestions, please configure your GEMINI_API_KEY in secrets.",
          recommendedProductIds: availableProducts?.slice(0, 3).map((p: any) => p.id) || [],
          styleConcept: "Classic Luxury Synergy"
        });
      }

      const ai = new GoogleGenAI({ apiKey });

      const productsSummary = availableProducts?.map((p: any) => 
        `ID: ${p.id} | Name: ${p.name} | Category: ${p.category} | Subcategory: ${p.subcategory} | Colors/Materials: ${p.materials.join(', ')} | Price: $${p.price} | Highlights: ${p.description}`
      ).join('\n') || '';

      const systemInstruction = `You are "TREDNY AI Curator", an elite high-fashion stylist and fine jewelry consultant for TREDNY boutique.
Your goal is to recommend perfect pairings of TREDNY high jewelry and modern apparel for any event or user prompt.
You must choose strictly from the provided list of products.

Respond strictly in valid JSON format with this structure:
{
  "advice": "A elegant 2-3 sentence personalized fashion commentary on why these items harmonize.",
  "styleConcept": "A short, evocative title for the look (e.g., 'Met Gala Midnight Velvet', 'Minimalist Riviera Gold')",
  "recommendedJewelryId": "exact string ID of selected jewelry product",
  "recommendedApparelId": "exact string ID of selected apparel product",
  "stylingTips": ["Tip 1 regarding hairstyle or posture", "Tip 2 regarding footwear or fragrance pairing"]
}`;

      const userMessage = `User Request: "${prompt || 'Suggest an exquisite ensemble'}"
Occasion/Theme: "${eventType || 'Special Gala / Evening Soiree'}"
Current Selected Items: ${JSON.stringify(currentLook || {})}

Available TREDNY Products:
${productsSummary}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: userMessage }] }
        ],
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.7,
        }
      });

      const responseText = response.text || '';
      let parsed;
      try {
        parsed = JSON.parse(responseText);
      } catch (e) {
        parsed = {
          advice: responseText || "TREDNY curates timeless elegance combining modern apparel with statement high jewelry.",
          styleConcept: "Couture Synergy",
          recommendedJewelryId: availableProducts?.find((p: any) => p.category === 'jewelry')?.id,
          recommendedApparelId: availableProducts?.find((p: any) => p.category === 'apparel')?.id,
          stylingTips: ["Pair with sleek updo to highlight drop earrings.", "Choose minimalist stiletto pumps."]
        };
      }

      return res.status(200).json(parsed);
    } catch (error: any) {
      console.error("Error in /api/stylist:", error);
      return res.status(500).json({
        error: "Failed to process styling advice",
        details: error?.message || "Unknown error"
      });
    }
  });

  // Vite middleware in dev mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TREDNY server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
