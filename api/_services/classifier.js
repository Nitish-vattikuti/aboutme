// api/_services/classifier.js
import { logger } from '../_utils/logger.js';

export async function classifyIntent(query, aiConfig) {
    const start = Date.now();
    const endpoint = aiConfig.endpoint || "https://api.groq.com/openai/v1/chat/completions";
    const headers = aiConfig.headers || {
        Authorization: `Bearer ${aiConfig.apiKey || aiConfig}`,
        "Content-Type": "application/json",
    };
    const models = aiConfig.classifierModels || [
        "poolside/laguna-xs-2.1:free",
        "nvidia/nemotron-3.5-lightning:free",
        "poolside/laguna-s-2.1:free",
        "nvidia/nemotron-3-super-120b-a12b:free",
        "cohere/north-mini-code:free"
    ];

    for (const model of models) {
        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    model,
                    messages: [
                        {
                            role: "system",
                            content: `You are a semantic intent classifier for an AI portfolio system representing Nitish Vattikuti.
Determine whether the user query is related to any of the following valid domains:
- Greetings, introductions, polite conversational starters (e.g. "hi", "hello", "who are you", "how are you")
- Nitish Vattikuti (the engineer), his background, skills, education, certifications, experience
- The portfolio itself, contact info, hiring, resume, collaborations
- Projects (Autonomous UAV SIL Simulation, SpectraFuse, AI Virtual Mouse, InfraSight, Healthcare Portal, Number Plate Detection, etc.)
- Engineering work, software development, AI systems, architecture

If the query is related to these domains or is a friendly greeting/inquiry, respond with ALLOW.
If the query is completely unrelated (e.g., pasta recipes, politics, unrelated math homework, spam), respond with REFUSE.

Output valid JSON ONLY in this format:
{"status": "ALLOW" | "REFUSE", "topics": ["topic1", "topic2"]}`
                        },
                        {
                            role: "user",
                            content: `Query: "${query}"`
                        }
                    ],
                    temperature: 0.1,
                    max_tokens: 80
                }),
            });

            if (!response.ok) {
                const errText = await response.text();
                logger.warn(`Classifier model ${model} failed (${response.status}): ${errText}`);
                continue;
            }

            const data = await response.json();
            const resultText = data.choices?.[0]?.message?.content;
            if (resultText) {
                const jsonMatch = resultText.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const result = JSON.parse(jsonMatch[0]);
                    logger.info("Classification completed", { latency: Date.now() - start, model, result });
                    return result;
                }
                if (resultText.toUpperCase().includes("REFUSE")) {
                    return { status: "REFUSE", topics: [] };
                }
                return { status: "ALLOW", topics: [] };
            }

        } catch (error) {
            logger.warn(`Classifier error with model ${model}:`, error);
        }
    }

    // Fail safe to ALLOW
    return { status: "ALLOW", topics: [] }; 
}
