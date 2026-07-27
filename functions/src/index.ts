import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import * as dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

setGlobalOptions({ maxInstances: 10 });

export const analyzeReport = onRequest(
  {
    cors: true,
  },
  async (req, res) => {
    try {
      const { rawText, sampleType } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        res.status(500).json({
          success: false,
          error: "GEMINI_API_KEY missing",
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
      });

      const prompt = `
You are NutriLines AI medical assistant.

Analyze this medical report.

Return JSON only.

Report:
${rawText || "No text provided"}

Sample type:
${sampleType || "Unknown"}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const result = JSON.parse(response.text || "{}");

      res.json({
        success: true,
        source: "firebase-function",
        analysis: result,
      });

    } catch (error:any) {

      logger.error(error);

      res.status(500).json({
        success:false,
        error:error.message,
      });
    }
  }
);