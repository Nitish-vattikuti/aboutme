// api/chat.js
import { logger } from './_utils/logger.js';
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
        const { messages } = req.body;
        const GROQ_API_KEY = process.env.GROQ_API_KEY;
        
        if (!GROQ_API_KEY) {
            logger.error("System error", new Error("GROQ_API_KEY not configured"));
            return res.status(500).json({ error: "AI service configuration error" });
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
        logger.info("Processing query", { queryLength: latestMessage.length });

        // STEP 2: Semantic Intent Classification
        const classification = await classifyIntent(latestMessage, GROQ_API_KEY);
        
        if (classification.status === "REFUSE") {
            logger.info("Query refused by classifier", { topics: classification.topics });
            const refusalMessage = "I am a scoped AI system representing Nitish's engineering portfolio. I can only discuss my projects, technical background, architecture decisions, and collaborations. How can I help you with those topics?";
            return res.status(200).json({
                choices: [{ message: { role: "assistant", content: refusalMessage } }]
            });
        }

        // STEP 3 & 4: Context Retrieval
        const context = retrieveContext(classification.topics, latestMessage);

        // STEP 5: Main Generation
        const responseContent = await generateResponse(messages, context, GROQ_API_KEY);

        // STEP 6: Return formatted response
        return res.status(200).json({
            choices: [{
                message: { role: "assistant", content: responseContent }
            }]
        });

    } catch (error) {
        logger.error("Chat pipeline error", error);
        return res.status(500).json({ error: "An operational error occurred in the AI system." });
    }
}
