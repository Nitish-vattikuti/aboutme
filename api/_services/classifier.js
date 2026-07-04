// api/_services/classifier.js
import { logger } from '../_utils/logger.js';

export async function classifyIntent(query, groqApiKey) {
    const start = Date.now();
    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${groqApiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "llama3-8b-8192", // Fast, small model for classification
                messages: [
                    {
                        role: "system",
                        content: `You are a semantic intent classifier for an AI portfolio system.
Determine whether the user query is related to any of the following valid domains:
- Nitish Vattikuti (the engineer)
- the portfolio itself
- projects (Autonomous UAV SIL Simulation, SpectraFuse, etc.)
- engineering work, philosophy, or background
- AI systems, retrieval pipelines, workflows, evaluations
- collaborations, hiring, or contact info

If the query is related to these domains, respond with ALLOW.
If the query is unrelated (e.g., jokes, recipes, generic chat, unrelated coding tasks, politics), respond with REFUSE.

You must output valid JSON ONLY with no additional text, in this exact format:
{
  "status": "ALLOW" | "REFUSE",
  "topics": ["list", "of", "topics", "mentioned"]
}

Examples:
Query: "How did you build retrieval in TenderMatch?" -> {"status": "ALLOW", "topics": ["tendermatch", "retrieval"]}
Query: "Write me a pasta recipe" -> {"status": "REFUSE", "topics": ["recipe"]}
Query: "What is your favorite anime?" -> {"status": "REFUSE", "topics": ["personal", "anime"]}
Query: "Tell me about your AI background" -> {"status": "ALLOW", "topics": ["background", "ai"]}`
                    },
                    {
                        role: "user",
                        content: `Query: "${query}"`
                    }
                ],
                response_format: { type: "json_object" },
                temperature: 0.1,
                max_tokens: 50
            }),
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Classifier API error: ${response.status} ${errText}`);
        }

        const data = await response.json();
        const resultText = data.choices[0].message.content;
        const result = JSON.parse(resultText);
        
        logger.info("Classification completed", { latency: Date.now() - start, result });
        return result;

    } catch (error) {
        logger.error("Classifier failed", error);
        // Fail open or closed? Better to fail closed, but for portfolio UX, maybe default to ALLOW with generic topics.
        // We'll fail safe to ALLOW but with no topics, letting the main model handle it.
        return { status: "ALLOW", topics: [] }; 
    }
}
