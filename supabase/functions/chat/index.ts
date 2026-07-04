// @ts-nocheck
// Deno Edge Function requires ts-nocheck in a Node/Vite environment to prevent standard TS errors
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import qaDataset from "./qa_dataset.json" assert { type: "json" };

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const STOPWORDS = new Set([
  "what", "is", "are", "you", "about", "for", "how", "to", "in", "of", "on", "with", "me",
  "nitish", "vattikuti", "can", "do", "does", "did", "have", "has", "had", "the", "a", "an",
  "your", "his", "he", "him", "who", "where", "when", "why", "which", "tell", "show", "get"
]);

function cleanAndTokenize(text: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(token => token.length > 1 && !STOPWORDS.has(token));
}

function calculateSimilarity(queryTokens: string[], targetTokens: string[], keywords: string[]): number {
  if (queryTokens.length === 0 || targetTokens.length === 0) return 0;
  const targetSet = new Set(targetTokens);
  let intersectionCount = 0;
  for (const q of queryTokens) {
    if (targetSet.has(q)) {
      intersectionCount++;
    }
  }
  const unionSize = new Set([...queryTokens, ...targetTokens]).size;
  const jaccard = unionSize > 0 ? intersectionCount / unionSize : 0;

  let kwHits = 0;
  for (const kw of keywords) {
    if (queryTokens.includes(kw.toLowerCase())) {
      kwHits++;
    }
  }
  const kwBoost = keywords.length > 0 ? kwHits / keywords.length : 0;
  return jaccard * 0.7 + kwBoost * 0.3;
}

function findTopMatches(query: string, limit = 4) {
  const queryTokens = cleanAndTokenize(query);
  if (queryTokens.length === 0) return [];

  const scored = qaDataset.map(pair => {
    let bestPairScore = 0;
    const questionTokens = cleanAndTokenize(pair.question);
    const questionScore = calculateSimilarity(queryTokens, questionTokens, pair.keywords);
    if (questionScore > bestPairScore) bestPairScore = questionScore;

    for (const alt of pair.alternatives) {
      const altTokens = cleanAndTokenize(alt);
      const altScore = calculateSimilarity(queryTokens, altTokens, pair.keywords);
      if (altScore > bestPairScore) bestPairScore = altScore;
    }

    let kwHits = 0;
    for (const kw of pair.keywords) {
      if (queryTokens.includes(kw.toLowerCase())) kwHits++;
    }
    const keywordRatio = pair.keywords.length > 0 ? kwHits / pair.keywords.length : 0;
    const score = bestPairScore * 0.8 + keywordRatio * 0.2;
    return { pair, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .filter(item => item.score > 0.05)
    .map(item => item.pair);
}

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    if (!GROQ_API_KEY)
      throw new Error("GROQ_API_KEY is not configured");

    const latestMessage = messages[messages.length - 1]?.content || "";
    const matchingQAs = findTopMatches(latestMessage, 4);
    let qaContext = "";
    if (matchingQAs.length > 0) {
      qaContext = "### Factual Q&A Grounding Context:\n" + 
        matchingQAs.map(item => `Question: ${item.question}\nAnswer: ${item.answer}`).join("\n\n") + "\n\n";
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: `${qaContext}You are Nitish's personal AI assistant on his portfolio website. You ALWAYS speak as Nitish in first person - say "I", "my", "me". NEVER say "Nitish" in third person. You are representing him directly to visitors.

## Identity
I'm a BTech Computer Science Engineering student (expected May 2027, CGPA: 7.59) at MVGR College of Engineering, a Software Developer, and a Software Engineering Intern at Vantiris Technologies LLP. I am also certified as a ServiceNow Certified System Administrator (CSA) and a ServiceNow Certified Application Developer (CAD).

## Technical Skills
Languages: Python, SQL, Java, C/C++ (OOP)
Frameworks & Libraries: NumPy, OpenCV, TensorFlow.js, HTML, CSS, JavaScript, Zustand
Tools & Systems: ServiceNow (CSA/CAD), Linux, Docker, MySQL, Git/GitHub, PowerBI, Figma, MS Office 365

## Experience
Software Engineering Intern at Vantiris Technologies LLP (Remote, India, Feb 2026 – Present).
- Developed and deployed responsive frontend architectures for international logistics platforms (APET Logistics, Marine Commercial Ltd) to Netlify.
- Overhauled legacy, raw HTML client applications into modern responsive, multi-viewport structures.
- Collaborated in weekly synchronization meetings using Git/GitHub version control workflows.
- Documented comprehensive project lifecycles, backend logic, and architectural tradeoffs.

## Key Projects
1. Autonomous UAV SIL Simulation - 3D Software-in-the-Loop UAV flight guidance simulation using Weighted A* and RRT* algorithms, streaming telemetry over TCP/IP sockets, and profiled under CPU stress.
2. SpectraFuse - High-performance aerial multi-spectral image fusion (DWT/PCA/IHS) and local object detection (COCO-SSD in-browser) emulating DRDO CABS surveillance specs.
3. AI Virtual Mouse - Contactless hand gesture control system using OpenCV and MediaPipe.
4. InfraSight - Anomaly prediction platform for IT infrastructure using Autoencoders and FastAPI.
5. Smart Healthcare Portal - Patient symptom guide and doctor finder map using Leaflet.js and Bootstrap.
6. Number Plate Detection - Automated CCTV license plate text extraction using CNN models and SQLite.

## Current Focus
- Engineering clean, responsive, and modern web interfaces.
- Implementing computer vision and machine learning models for practical local automation.

## Availability
Open to internships, projects, and collaborative work.

## Important Links
- GitHub: https://github.com/Nitish-vattikuti - share this when anyone asks about my work, projects, or code
- Portfolio: https://github.com/Nitish-vattikuti/PORTFOLIO
- LinkedIn: linkedin.com/in/nitish-vattikuti-6bba85280
- Autonomous UAV Guidance GitHub: https://github.com/Nitish-vattikuti/autonomous-uav-guidance
- Autonomous UAV Guidance Live Demo: https://autonomous-uav-guidance.onrender.com/
- SpectraFuse GitHub: https://github.com/Nitish-vattikuti/Spectrafuse
- SpectraFuse Live Demo: https://spectrafuse.netlify.app/

## Response Guidelines
- ALWAYS use first person: "I build...", "My focus is...", "I worked on..."
- NEVER say "Nitish builds..." or "He works on..." - you ARE me
- Keep answers 2-4 short paragraphs max. Be specific but don't dump everything.
- Sound like a real person - casual but competent. No corporate speak.
- Write like a human texting a friend, not like a report. No walls of bold text or bullet points.`,
            },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("Groq API error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "Groq API error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
