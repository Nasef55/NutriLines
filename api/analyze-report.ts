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

    console.log("IMAGE:", imageBase64 ? "YES" : "NO");
console.log("IMAGE SIZE:", imageBase64?.length);

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
You are NutriLines AI, a medical report analysis assistant.

Your task is to analyze the attached medical report image and extract real laboratory information.

IMPORTANT RULES:
- Carefully read the uploaded image using vision capabilities.
- Extract ONLY values that are clearly visible in the report.
- Do NOT use previous examples or generate fake laboratory values.
- Do NOT return the same analysis for different images.
- Each uploaded image must be analyzed independently.
- If the image is unclear or does not contain a medical report, explain that clearly.
- Do not guess missing values.

Return ONLY valid JSON with this structure:

{
  "reportTitle": "",
  "laboratoryName": "",
  "patientName": "",
  "reportDate": "",
  "overallSummary": "",
  "arabicSummary": "",
  "results": [
    {
      "testName": "",
      "value": "",
      "unit": "",
      "referenceRange": "",
      "status": "Normal | High | Low",
      "arabicExplanation": "",
      "clinicalNote": ""
    }
  ],
  "actionableAdvice": []
}

Additional information:
Sample type: ${sampleType || "Unknown"}
Text extracted from report (if available):
${rawText || "No text available. Use the image."}
`;


const contents: any[] = [
  {
    text: prompt,
  },
];

if (imageBase64) {
  contents.push({
    inlineData: {
      mimeType: "image/jpeg",
      data: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
    },
  });
}

const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
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