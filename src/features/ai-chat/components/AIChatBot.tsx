import { useState, useRef, useEffect } from "react";
import { Send, X, MessageCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { findBestMatch } from "../utils/qaMatcher";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = import.meta.env.VITE_CHAT_URL || "/api/chat";

const MAX_MESSAGES_PER_MINUTE = 5;
const COOLDOWN_MS = 3000; // 3 seconds between messages

const AIChatBot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messageTimestamps = useRef<number[]>([]);
  const cooldownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const checkRateLimit = (): boolean => {
    const now = Date.now();
    messageTimestamps.current = messageTimestamps.current.filter(
      (ts) => now - ts < 60000
    );
    if (messageTimestamps.current.length >= MAX_MESSAGES_PER_MINUTE) {
      setRateLimited(true);
      const oldestInWindow = messageTimestamps.current[0];
      const waitTime = 60000 - (now - oldestInWindow);
      cooldownTimer.current = setTimeout(() => setRateLimited(false), waitTime);
      return false;
    }
    messageTimestamps.current.push(now);
    return true;
  };

  useEffect(() => {
    return () => {
      if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || isLoading || rateLimited) return;
    if (!checkRateLimit()) return;
    setInput("");
    const userMsg: Msg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    let assistantSoFar = "";
    const allMessages = [...messages, userMsg];

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: allMessages }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.error || "Chat failed");
      }

      if (data.choices?.[0]?.message?.content) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.choices[0].message.content }]);
      }
    } catch (e: any) {
      console.error("AI Chatbot API Error:", e);
      const { match, score } = findBestMatch(text);
      let reply = "";
      if (match && score >= 0.25) {
        reply = match.answer;
      } else {
        const errorDetail = e.message || "Connection failed";
        reply = `⚠️ **AI Backend Error:** ${errorDetail}\n\n*Check that your API key is configured in Vercel Settings → Environment Variables and that the deployment is up to date.*`;
      }
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    }
    setIsLoading(false);
  };

  return (
    <>
      {/* Floating trigger */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-3 shadow-lg hover:opacity-90 transition-opacity font-mono text-sm"
          >
            <MessageCircle size={18} />
            Ask me anything
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] rounded-xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden"
            style={{ height: "min(520px, calc(100vh - 6rem))" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/50">
              <div className="flex items-center gap-2">
                <span className="status-dot" />
                <span className="font-mono text-xs text-foreground">nitish.ai</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground mb-3">👋 Ask anything about Nitish</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {["What do you build?", "Your tech stack?", "Open for projects?"].map((q) => (
                      <button
                        key={q}
                        onClick={() => { setInput(q); }}
                        className="text-xs font-mono px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[85%] rounded-lg px-3 py-2 text-[13px] leading-relaxed",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground"
                    )}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5 [&_a]:text-primary [&_a]:underline [&_code]:text-[11px] [&_code]:bg-background/50 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-start">
                  <div className="bg-secondary rounded-lg px-3 py-2">
                    <Loader2 size={14} className="animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-border p-3">
              {rateLimited && (
                <p className="text-[11px] text-destructive font-mono mb-2 text-center">
                  Slow down! Too many messages. Try again in a minute.
                </p>
              )}
              <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder={rateLimited ? "Rate limited..." : "Ask me anything..."}
                  disabled={rateLimited}
                  maxLength={300}
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-mono disabled:opacity-50"
                />
                <button
                  onClick={send}
                  disabled={!input.trim() || isLoading || rateLimited}
                  className="text-primary hover:opacity-70 disabled:opacity-30 transition-opacity"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatBot;
