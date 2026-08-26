// api/_services/generation.js
import { logger } from '../_utils/logger.js';

export async function generateResponse(messages, context, aiConfig) {
    const start = Date.now();
    
    // Message windowing: keep only the last 6 messages (3 turns)
    const windowedMessages = messages.slice(-6);

    const systemPrompt = `You are Nitish Vattikuti's official portfolio AI assistant. You speak directly in the first person ("I", "my", "me") as Nitish Vattikuti.
I am a Computer Science Engineering student at MVGR College of Engineering (graduating 2027), Software Developer, and Software Engineering Intern at Vantiris Technologies. I am also certified as a ServiceNow CSA and CAD.

Your goal is to answer any questions about me, my technical skills, engineering projects, architecture decisions, work experience, certifications, collaborations, and career goals accurately and professionally.

Guidelines:
- Tone: Professional, authentic, confident, technically sharp, and clear.
- Speak in the first person as Nitish ("I built...", "My experience at Vantiris...", "I'm proficient in...").
- Use the provided context below for factual grounding on my projects and achievements.
- If asked a friendly greeting (like "hi", "how are you"), reply warmly and offer to discuss my work or projects.
- If asked about something completely unrelated (e.g. general recipes, world politics), politely state that you represent Nitish's portfolio and invite them to ask about my engineering work or background instead.
- Output your direct answer immediately without any "thinking process", meta-commentary, or chain-of-thought preamble.

Context Knowledge:
<context>
${context}
</context>`;

    const endpoint = aiConfig.endpoint || "https://api.groq.com/openai/v1/chat/completions";
    const headers = aiConfig.headers || {
        Authorization: `Bearer ${aiConfig.apiKey || aiConfig}`,
        "Content-Type": "application/json",
    };
    const models = aiConfig.generationModels || (aiConfig.generationModel ? [aiConfig.generationModel] : ["llama-3.3-70b-versatile"]);

    let lastError = null;

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
                            content: systemPrompt
                        },
                        ...windowedMessages
                    ],
                    temperature: 0.3,
                    max_tokens: 350,
                    stream: false,
                }),
            });

            if (!response.ok) {
                const errText = await response.text();
                logger.warn(`Model ${model} failed (${response.status}): ${errText}. Trying next free model if available.`);
                lastError = new Error(`API error (${model}): ${response.status} ${errText}`);
                continue;
            }

            const data = await response.json();
            const content = data.choices?.[0]?.message?.content;
            
            if (content) {
                let cleanContent = content.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
                if (/^here['’]?s\s+(a\s+)?thinking\s+process/i.test(cleanContent)) {
                    const match = cleanContent.match(/(?:\*\*?(?:Final|Draft)?\s*Response(?:\s*\(mental\))?\*?:?|###\s*Response:?)\s*([\s\S]+)/i);
                    if (match && match[1]) {
                        cleanContent = match[1].trim();
                    }
                }

                logger.info("Generation completed", { 
                    provider: aiConfig.provider,
                    model,
                    latency: Date.now() - start,
                    prompt_tokens: data.usage?.prompt_tokens,
                    completion_tokens: data.usage?.completion_tokens
                });
                
                return cleanContent;
            }
        } catch (error) {
            logger.warn(`Error connecting to model ${model}:`, error);
            lastError = error;
        }
    }

    logger.error("All free models failed", lastError);
    throw lastError || new Error("All AI models are currently busy. Please try again in a few seconds.");
}
