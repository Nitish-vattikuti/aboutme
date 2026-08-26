// api/_services/classifier.js
import { logger } from '../_utils/logger.js';

export async function classifyIntent(query, aiConfig) {
    const start = Date.now();
    try {
        const endpoint = aiConfig.endpoint || "https://api.groq.com/openai/v1/chat/completions";
        const headers = aiConfig.headers || {
            Authorization: `Bearer ${aiConfig.apiKey || aiConfig}`,
            "Content-Type": "application/json",
        };
        const model = aiConfig.classifierModel || "llama-3.1-8b-instant";

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

You must output valid JSON ONLY with no additional text, in this exact format:
{
  "status": "ALLOW" | "REFUSE",
  "topics": ["list", "of", "topics", "mentioned"]
}

Examples:
Query: "Hi there!" -> {"status": "ALLOW", "topics": ["greeting"]}
Query: "Who is Nitish?" -> {"status": "ALLOW", "topics": ["background"]}
Query: "What projects have you worked on?" -> {"status": "ALLOW", "topics": ["projects", "uavsimulation", "spectrafuse"]}
Query: "How did you build SpectraFuse?" -> {"status": "ALLOW", "topics": ["spectrafuse"]}
Query: "Write me a pasta recipe" -> {"status": "REFUSE", "topics": ["recipe"]}
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
        logger.error("Classifier failed, failing open to ALLOW", error);
        return { status: "ALLOW", topics: [] }; 
    }
}
