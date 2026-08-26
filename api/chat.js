// api/chat.js
import { logger } from './_utils/logger.js';
import { getAIConfig } from './_utils/aiClient.js';
import { securityCheck } from './_middleware/security.js';
import { classifyIntent } from './_services/classifier.js';
import { retrieveContext } from './_services/retrieval.js';
import { generateResponse } from './_services/generation.js';

export default async function handler(req, res) {
    // CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    if (req.method === "OPTIONS") return res.status(200).end();

    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const messages = body?.messages;
        const aiConfig = getAIConfig();
        
        if (!aiConfig) {
            logger.error("System error", new Error("No AI API key configured"));
            return res.status(500).json({ error: "AI API key is not configured in Vercel. Please set OPENROUTER_API_KEY, GROQ_API_KEY, GEMINI_API_KEY, or OPENAI_API_KEY in Vercel Environment Variables." });
        }

        // STEP 1: Security & Injection Check (Deterministic)
        const securityResult = securityCheck(messages);
        if (!securityResult.passed) {
            if (securityResult.refusal) {
                return res.status(200).json({
                    choices: [{ message: { role: "assistant", content: securityResult.refusal } }]
                });
            }
            return res.status(400).json({ error: securityResult.error });
        }

        const latestMessage = messages[messages.length - 1].content;
        logger.info("Processing query", { queryLength: latestMessage.length, provider: aiConfig.provider });

        // Fast Context Retrieval (Local instant fuzzy match & knowledge grounding)
        const context = retrieveContext([], latestMessage);

        // Single Fast Generation Call
        const responseContent = await generateResponse(messages, context, aiConfig);

        // STEP 6: Return formatted response
        return res.status(200).json({
            choices: [{
                message: { role: "assistant", content: responseContent }
            }]
        });

    } catch (error) {
        logger.error("Chat pipeline error", error);
        return res.status(500).json({ error: error.message || "An operational error occurred in the AI system." });
    }
}
