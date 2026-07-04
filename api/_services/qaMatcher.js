// api/_services/qaMatcher.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the QA dataset
const qaDatasetPath = path.join(__dirname, '..', '_data', 'qa_dataset.json');
const qaDataset = JSON.parse(fs.readFileSync(qaDatasetPath, 'utf8'));

const STOPWORDS = new Set([
  "what", "is", "are", "you", "about", "for", "how", "to", "in", "of", "on", "with", "me",
  "nitish", "vattikuti", "can", "do", "does", "did", "have", "has", "had", "the", "a", "an",
  "your", "his", "he", "him", "who", "where", "when", "why", "which", "tell", "show", "get"
]);

function cleanAndTokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(token => token.length > 1 && !STOPWORDS.has(token));
}

function calculateSimilarity(queryTokens, targetTokens, keywords) {
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

export function findBestMatch(query) {
  const queryTokens = cleanAndTokenize(query);
  if (queryTokens.length === 0) {
    return { match: null, score: 0 };
  }

  let bestMatch = null;
  let highestScore = 0;

  for (const pair of qaDataset) {
    let bestPairScore = 0;

    // 1. Match against canonical question
    const questionTokens = cleanAndTokenize(pair.question);
    const questionScore = calculateSimilarity(queryTokens, questionTokens, pair.keywords);
    if (questionScore > bestPairScore) {
      bestPairScore = questionScore;
    }

    // 2. Match against alternative questions
    for (const alt of pair.alternatives) {
      const altTokens = cleanAndTokenize(alt);
      const altScore = calculateSimilarity(queryTokens, altTokens, pair.keywords);
      if (altScore > bestPairScore) {
        bestPairScore = altScore;
      }
    }

    // 3. Match against keywords
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

// Find top N matches for RAG pipeline context retrieval
export function findTopMatches(query, limit = 3) {
  const queryTokens = cleanAndTokenize(query);
  if (queryTokens.length === 0) {
    return [];
  }

  const scoredPairs = [];

  for (const pair of qaDataset) {
    let bestPairScore = 0;

    const questionTokens = cleanAndTokenize(pair.question);
    const questionScore = calculateSimilarity(queryTokens, questionTokens, pair.keywords);
    if (questionScore > bestPairScore) {
      bestPairScore = questionScore;
    }

    for (const alt of pair.alternatives) {
      const altTokens = cleanAndTokenize(alt);
      const altScore = calculateSimilarity(queryTokens, altTokens, pair.keywords);
      if (altScore > bestPairScore) {
        bestPairScore = altScore;
      }
    }

    let keywordMatches = 0;
    for (const kw of pair.keywords) {
      if (queryTokens.includes(kw.toLowerCase())) {
        keywordMatches++;
      }
    }
    const keywordRatio = pair.keywords.length > 0 ? keywordMatches / pair.keywords.length : 0;
    
    const finalScore = bestPairScore * 0.8 + keywordRatio * 0.2;
    scoredPairs.push({ pair, score: finalScore });
  }

  // Sort and take top N
  return scoredPairs
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .filter(item => item.score > 0.05) // Must have at least some minimum match
    .map(item => item.pair);
}
