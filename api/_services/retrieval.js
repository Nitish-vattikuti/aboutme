// api/_services/retrieval.js
import { portfolioKnowledge } from '../_data/portfolio.js';
import { logger } from '../_utils/logger.js';
import { findTopMatches } from './qaMatcher.js';

export function retrieveContext(topics, query) {
    let contextParts = [];

    // 1. Retrieve specific matches from 235 Q&A training dataset
    if (query) {
        const matchingQAs = findTopMatches(query, 4); // Fetch top 4 closest Q&As
        if (matchingQAs.length > 0) {
            contextParts.push("### Factual Q&A Grounding Context:");
            for (const item of matchingQAs) {
                contextParts.push(`Question: ${item.question}\nAnswer: ${item.answer}`);
            }
        }
    }

    // 2. Retrieve high-level topic knowledge (always include profile background)
    let standardContext = [portfolioKnowledge["background"]];
    const lowerTopics = topics ? topics.map(t => t.toLowerCase()) : [];

    if (lowerTopics.some(t => t.includes("uav") || t.includes("drone") || t.includes("guidance") || t.includes("simulation"))) {
        standardContext.push(portfolioKnowledge["uavsimulation"]);
    }
    if (lowerTopics.some(t => t.includes("spectrafuse") || t.includes("fusion") || t.includes("spectral") || t.includes("image"))) {
        standardContext.push(portfolioKnowledge["spectrafuse"]);
    }
    if (lowerTopics.some(t => t.includes("mouse") || t.includes("gesture") || t.includes("vision"))) {
        standardContext.push(portfolioKnowledge["virtualmouse"]);
    }
    if (lowerTopics.some(t => t.includes("infrasight") || t.includes("anomaly") || t.includes("monitoring"))) {
        standardContext.push(portfolioKnowledge["infrasight"]);
    }
    if (lowerTopics.some(t => t.includes("healthcare") || t.includes("medical") || t.includes("portal"))) {
        standardContext.push(portfolioKnowledge["healthcareportal"]);
    }
    if (lowerTopics.some(t => t.includes("plate") || t.includes("license") || t.includes("cctv"))) {
        standardContext.push(portfolioKnowledge["numberplate"]);
    }
    if (lowerTopics.some(t => t.includes("hire") || t.includes("work") || t.includes("collaborate") || t.includes("contact"))) {
        standardContext.push(portfolioKnowledge["collaborations"]);
    }

    contextParts.push("### General Portfolio Knowledge:");
    contextParts.push(standardContext.join("\n"));

    logger.info("Context retrieved", { qaCount: query ? findTopMatches(query, 4).length : 0, topicsCount: standardContext.length });
    return contextParts.join("\n\n");
}
