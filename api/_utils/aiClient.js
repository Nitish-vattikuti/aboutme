// api/_utils/aiClient.js

export function getAIConfig() {
    const rawKey = process.env.OPENROUTER_API_KEY || process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;
    
    if (!rawKey || !rawKey.trim()) {
        return null;
    }

    const key = rawKey.trim();

    // OpenRouter (Configured strictly with top FREE models + automatic free fallback)
    if (process.env.OPENROUTER_API_KEY || key.startsWith("sk-or-")) {
        return {
            provider: "openrouter",
            apiKey: key,
            endpoint: "https://openrouter.ai/api/v1/chat/completions",
            headers: {
                "Authorization": `Bearer ${key}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://aboutme.vercel.app",
                "X-Title": "Nitish Portfolio AI"
            },
            generationModels: [
                "poolside/laguna-xs-2.1:free",
                "cohere/north-mini-code:free",
                "nvidia/nemotron-3.5-lightning:free",
                "poolside/laguna-s-2.1:free",
                "nvidia/nemotron-3-super-120b-a12b:free",
                "nvidia/nemotron-3-ultra-550b-a55b:free"
            ],
            classifierModels: [
                "poolside/laguna-xs-2.1:free",
                "nvidia/nemotron-3.5-lightning:free",
                "nvidia/nemotron-3-super-120b-a12b:free"
            ]
        };
    }

    // Google Gemini
    if (process.env.GEMINI_API_KEY || key.startsWith("AIzaSy")) {
        return {
            provider: "gemini",
            apiKey: key,
            endpoint: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
            headers: {
                "Authorization": `Bearer ${key}`,
                "Content-Type": "application/json"
            },
            generationModels: ["gemini-2.0-flash", "gemini-1.5-flash"],
            classifierModels: ["gemini-2.0-flash"]
        };
    }

    // OpenAI
    if (process.env.OPENAI_API_KEY || (key.startsWith("sk-") && !key.startsWith("sk-or-"))) {
        return {
            provider: "openai",
            apiKey: key,
            endpoint: "https://api.openai.com/v1/chat/completions",
            headers: {
                "Authorization": `Bearer ${key}`,
                "Content-Type": "application/json"
            },
            generationModels: ["gpt-4o-mini"],
            classifierModels: ["gpt-4o-mini"]
        };
    }

    // Groq default
    return {
        provider: "groq",
        apiKey: key,
        endpoint: "https://api.groq.com/openai/v1/chat/completions",
        headers: {
            "Authorization": `Bearer ${key}`,
            "Content-Type": "application/json"
        },
        generationModels: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"],
        classifierModels: ["llama-3.1-8b-instant"]
    };
}
