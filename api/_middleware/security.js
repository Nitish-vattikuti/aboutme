// api/_middleware/security.js
import { logger } from '../_utils/logger.js';

const INJECTION_PATTERNS = [
    /ignore previous instructions/i,
    /jailbreak/i,
    /developer message/i,
    /reveal (system |hidden )?prompt/i,
    /act as (another|a)/i,
    /pretend to be/i,
    /show hidden instructions/i
];

export function securityCheck(messages) {
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return { passed: false, error: "Invalid payload: Messages must be a non-empty array." };
    }

    const latestMessage = messages[messages.length - 1];
    
    if (latestMessage.role !== 'user' || !latestMessage.content || typeof latestMessage.content !== 'string') {
        return { passed: false, error: "Invalid payload: Latest message must be a valid user string." };
    }

    const content = latestMessage.content.trim();

    if (content.length > 500) {
        logger.warn("Security blocked: Query too long", { length: content.length });
        return { passed: false, error: "Query exceeds maximum length." };
    }

    // Repeated character spam
    if (/(.)\1{15,}/.test(content)) {
        logger.warn("Security blocked: Spam detected");
        return { passed: false, error: "Invalid input detected." };
    }

    for (const pattern of INJECTION_PATTERNS) {
        if (pattern.test(content)) {
            logger.warn("Security blocked: Prompt injection attempt", { query: content, pattern: pattern.toString() });
            return { passed: false, refusal: "I cannot fulfill requests to bypass instructions, reveal system prompts, or act outside my designated scope as Nitish's portfolio AI system." };
        }
    }

    return { passed: true };
}
