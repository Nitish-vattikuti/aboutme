// api/_utils/aiClient.js

export function getAIConfig() {
    const key = process.env.OPENROUTER_API_KEY || process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;
    
    if (!key) {
        return null;
    }

    // OpenRouter
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
            generationModel: "meta-llama/llama-3.3-70b-instruct",
            classifierModel: "meta-llama/llama-3.1-8b-instruct"
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
            generationModel: "gemini-2.0-flash",
            classifierModel: "gemini-2.0-flash"
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
            generationModel: "gpt-4o-mini",
            classifierModel: "gpt-4o-mini"
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
        generationModel: "llama-3.3-70b-versatile",
        classifierModel: "llama-3.1-8b-instant"
    };
}
