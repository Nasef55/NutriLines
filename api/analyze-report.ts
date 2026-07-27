import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {

    const { imageBase64, rawText, sampleType } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: "Missing Gemini API Key",
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
    });


    const prompt = `
You are NutriLines AI medical assistant.

Analyze this medical report.

Rules:
- Extract only actual laboratory values.
- Explain results in Arabic.
- Classify each result as Normal, High, or Low.
- Do not invent data.

Report text:
${rawText || "Image attached. Extract data from the image."}

Sample type:
${sampleType || "Unknown"}
`;


const contents: any[] = [
  {
    text: prompt,
  },
];


if (imageBase64) {

  const base64Data = imageBase64.split(",")[1];

  contents.push({
    inlineData: {
      mimeType: "image/jpeg",
      data: base64Data,
    },
  });

}


const response = await ai.models.generateContent({
  model: "gemini-3.6-flash",
  contents,
  config: {
    responseMimeType: "application/json",
  },
});


    const result = JSON.parse(response.text || "{}");


    return res.status(200).json({
      success: true,
      source: "vercel-gemini",
      analysis: result,
    });


  } catch (error: any) {

    console.error(error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });

  }
}