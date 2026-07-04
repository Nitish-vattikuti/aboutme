import qaDataset from "../../../data/qa_dataset.json";

export interface QAPair {
  id: number;
  category: string;
  question: string;
  keywords: string[];
  alternatives: string[];
  answer: string;
}

const STOPWORDS = new Set([
  "what", "is", "are", "you", "about", "for", "how", "to", "in", "of", "on", "with", "me",
  "nitish", "vattikuti", "can", "do", "does", "did", "have", "has", "had", "the", "a", "an",
  "your", "his", "he", "him", "who", "where", "when", "why", "which", "tell", "show", "get"
]);

function cleanAndTokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(token => token.length > 1 && !STOPWORDS.has(token));
}

function normalizePhrase(text: string): string {
  return text.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ").trim();
}

export function findBestMatch(query: string): { match: QAPair | null; score: number } {
  const normQuery = normalizePhrase(query);
  if (!normQuery) {
    return { match: null, score: 0 };
  }

  // 1. Direct phrase matching (exact match on normalized question or alternatives)
  for (const pair of qaDataset as QAPair[]) {
    if (normalizePhrase(pair.question) === normQuery) {
      return { match: pair, score: 1.0 };
    }
    for (const alt of pair.alternatives) {
      if (normalizePhrase(alt) === normQuery) {
        return { match: pair, score: 1.0 };
      }
    }
  }

  // 2. Token-based similarity matching
  const queryTokens = cleanAndTokenize(query);
  if (queryTokens.length === 0) {
    // Fallback: If all tokens are stopwords, check for partial phrase matches
    let bestMatch: QAPair | null = null;
    let maxMatchLen = 0;
    for (const pair of qaDataset as QAPair[]) {
      const normQuestion = normalizePhrase(pair.question);
      if (normQuestion.includes(normQuery) && normQuestion.length > maxMatchLen) {
        bestMatch = pair;
        maxMatchLen = normQuestion.length;
      }
    }
    if (bestMatch) {
      return { match: bestMatch, score: 0.6 };
    }
    return { match: null, score: 0 };
  }

  let bestMatch: QAPair | null = null;
  let highestScore = 0;

  for (const pair of qaDataset as QAPair[]) {
    let bestPairScore = 0;

    // Match against canonical question
    const questionTokens = cleanAndTokenize(pair.question);
    const questionScore = calculateSimilarity(queryTokens, questionTokens, pair.keywords);
    if (questionScore > bestPairScore) {
      bestPairScore = questionScore;
    }

    // Match against alternative questions
    for (const alt of pair.alternatives) {
      const altTokens = cleanAndTokenize(alt);
      const altScore = calculateSimilarity(queryTokens, altTokens, pair.keywords);
      if (altScore > bestPairScore) {
        bestPairScore = altScore;
      }
    }

    // Match against keywords (as a fallback or boost)
    let keywordMatches = 0;
    for (const kw of pair.keywords) {
      if (queryTokens.includes(kw.toLowerCase())) {
        keywordMatches++;
      }
    }
    const keywordRatio = pair.keywords.length > 0 ? keywordMatches / pair.keywords.length : 0;
    
    // Combine scores
    const finalScore = bestPairScore * 0.8 + keywordRatio * 0.2;

    if (finalScore > highestScore) {
      highestScore = finalScore;
      bestMatch = pair;
    }
  }

  return { match: bestMatch, score: highestScore };
}

function calculateSimilarity(queryTokens: string[], targetTokens: string[], keywords: string[]): number {
  if (queryTokens.length === 0 || targetTokens.length === 0) return 0;

  // Jaccard similarity: intersection / union
  const targetSet = new Set(targetTokens);
  let intersectionCount = 0;
  for (const q of queryTokens) {
    if (targetSet.has(q)) {
      intersectionCount++;
    }
  }

  const unionSize = new Set([...queryTokens, ...targetTokens]).size;
  const jaccard = unionSize > 0 ? intersectionCount / unionSize : 0;

  // Keywords direct hits count
  let kwHits = 0;
  for (const kw of keywords) {
    if (queryTokens.includes(kw.toLowerCase())) {
      kwHits++;
    }
  }
  const kwBoost = keywords.length > 0 ? kwHits / keywords.length : 0;

  return jaccard * 0.7 + kwBoost * 0.3;
}
