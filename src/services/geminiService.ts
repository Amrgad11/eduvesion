/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface RecommendationResult {
  courseName: string;
  reason: string;
  level: string;
}

export const GeminiService = {
  getRecommendations: async (score: number, engagement: string, completionRate: number): Promise<RecommendationResult[]> => {
    try {
      const prompt = `As an educational AI assistant, analyze this student's performance:
      - Score: ${score}%
      - Engagement Level: ${engagement}
      - Course Completion: ${completionRate}%
      
      Recommend 3 topics or course categories they should focus on.
      If score < 50, prefer beginner/remediation content.
      If performance is high, recommend advanced mastery content.
      If engagement is low, suggest high-interaction or applied labs.`;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                courseName: { type: Type.STRING },
                reason: { type: Type.STRING },
                level: { type: Type.STRING }
              },
              required: ["courseName", "reason", "level"]
            }
          }
        }
      });

      if (result.text) {
        return JSON.parse(result.text);
      }
      return [];
    } catch (error) {
      console.error("AI Recommendation Error:", error);
      return [
        { courseName: "Introduction to Data Science", reason: "Standard beginner track", level: "Beginner" },
        { courseName: "Advanced Algorithms", reason: "Suggested for top performers", level: "Advanced" }
      ];
    }
  }
};
