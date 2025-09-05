import { GoogleGenAI } from "@google/genai";

// Ensure the API key is available, but do not hardcode it.
// It's expected to be set in the environment.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Extracts unique email addresses from a given website URL using the Gemini API with Google Search.
 * @param url The website URL as a string.
 * @returns A promise that resolves to an array of unique email strings.
 */
export const extractEmailsFromUrl = async (url: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find and list all unique email addresses that are publicly available on the website at the following URL: ${url}. 
                 This is for professional outreach, so please only extract publicly listed contact information and respect privacy.
                 List each unique email address on a new line. 
                 Do not include any other text, explanations, or formatting.`,
      config: {
        tools: [{googleSearch: {}}],
      },
    });

    const textResponse = response.text.trim();
    if (!textResponse) {
      // Return empty array if model returns nothing
      return [];
    }
    
    // A robust regex to find all valid email patterns within the text response.
    // This regex is more accurate as it enforces valid domain name rules (e.g., no leading/trailing hyphens).
    const emailRegex = /[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}/g;
    
    const emails = textResponse.match(emailRegex) || [];

    // Use a Set to ensure final uniqueness
    const uniqueEmails = [...new Set(emails)];
    return uniqueEmails;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // You could customize error messages based on the error type
    if (error instanceof Error && error.message.includes('API key')) {
      throw new Error("The API key is invalid or not configured correctly.");
    }
    throw new Error("Failed to extract emails. The AI model could not process the request.");
  }
};