/**
 * Gemini AI Service for ChaskiX
 * Connects to Google's Generative AI API (Gemini 3.8 Flash / 3.5 Flash Lite / Flash Latest)
 */

const STORAGE_KEY = "chaskix_gemini_api_key";
const SELECTED_MODEL_KEY = "chaskix_gemini_model";

export const AVAILABLE_MODELS = [
  { id: "gemini-3.8-flash", name: "Gemini 3.8 Flash (Latest & Best)" },
  { id: "gemini-flash-latest", name: "Gemini Flash Latest" },
  { id: "gemini-3.5-flash-lite", name: "Gemini 3.5 Flash Lite (Lightweight)" },
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash (Standard)" },
];

/**
 * Get active API key (from localStorage override, or from import.meta.env)
 */
export function getApiKey() {
  const localKey = localStorage.getItem(STORAGE_KEY);
  if (localKey && localKey.trim()) {
    return localKey.trim();
  }
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey && envKey.trim()) {
    return envKey.trim();
  }
  return "";
}

/**
 * Save user API key to localStorage
 */
export function setApiKey(key) {
  if (key && key.trim()) {
    localStorage.setItem(STORAGE_KEY, key.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * Clear stored API key
 */
export function clearApiKey() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Get preferred Gemini model
 */
export function getSelectedModel() {
  return localStorage.getItem(SELECTED_MODEL_KEY) || "gemini-3.8-flash";
}

/**
 * Save preferred Gemini model
 */
export function setSelectedModel(modelId) {
  localStorage.setItem(SELECTED_MODEL_KEY, modelId);
}

const SYSTEM_INSTRUCTION = `You are ChaskiX AI Assistant, an expert, enthusiastic, and helpful AI assistant embedded in the ChaskiX platform.
ChaskiX is a premier marketplace connecting clients seeking talent with service providers, freelancers, and businesses seeking growth.
Your mission is to:
1. Guide clients on posting jobs, specifying project requirements, and finding skilled talent.
2. Guide freelancers and providers on bidding strategies, creating compelling service listings, and setting competitive prices.
3. Help users with general knowledge, code, writing, business ideas, and any task they need assistance with.
4. Always respond with clear formatting (Markdown, bullet points, headers, bold text, code blocks when suitable).
5. Be polite, professional, and helpful. You can understand and respond in English, Bengali, or any language the user speaks.`;

/**
 * Send a chat message with full conversation history to Google Gemini API
 * @param {Array<{role: 'user'|'model', content: string}>} history
 * @param {string} userMessage
 * @param {string} [customModel]
 * @returns {Promise<string>}
 */
export async function sendChatMessage(history = [], userMessage, customModel = null) {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error(
      "Gemini API Key missing! Please enter your Gemini API key in the top settings banner or add VITE_GEMINI_API_KEY to your .env file."
    );
  }

  const model = customModel || getSelectedModel();

  // Format conversation history for Gemini API
  const contents = [
    ...history.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    })),
    {
      role: "user",
      parts: [{ text: userMessage }],
    },
  ];

  const payload = {
    contents,
    systemInstruction: {
      parts: [{ text: SYSTEM_INSTRUCTION }],
    },
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    },
  };

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  let response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify(payload),
    });
  } catch (networkErr) {
    throw new Error(`Network error connecting to Gemini API: ${networkErr.message}. Please check your internet connection.`);
  }

  const data = await response.json();

  if (!response.ok) {
    const errorMsg = data?.error?.message || `HTTP ${response.status}: ${response.statusText}`;

    // Automatic fallback if current model is busy or unavailable
    if (response.status === 503 || response.status === 404 || errorMsg.includes("high demand") || errorMsg.includes("not found")) {
      if (model === "gemini-3.8-flash") {
        console.warn("Falling back to gemini-flash-latest...");
        return sendChatMessage(history, userMessage, "gemini-flash-latest");
      } else if (model === "gemini-flash-latest") {
        console.warn("Falling back to gemini-3.5-flash-lite...");
        return sendChatMessage(history, userMessage, "gemini-3.5-flash-lite");
      }
    }

    if (response.status === 400 && errorMsg.toLowerCase().includes("api key not valid")) {
      throw new Error("Invalid Gemini API key. Please check your key from Google AI Studio (https://aistudio.google.com/app/apikey).");
    }

    throw new Error(`Gemini API Error: ${errorMsg}`);
  }

  // Extract response text
  const candidate = data.candidates?.[0];
  const parts = candidate?.content?.parts || [];
  const responseText = parts
    .map((p) => p.text)
    .filter(Boolean)
    .join("\n\n");

  if (!responseText) {
    if (candidate?.finishReason && candidate.finishReason !== "STOP") {
      return `[Response ended with status: ${candidate.finishReason}]`;
    }
    throw new Error("Received an empty response from Gemini.");
  }

  return responseText;
}
