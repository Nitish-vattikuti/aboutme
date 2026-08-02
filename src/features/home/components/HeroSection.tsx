import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BadgeTag from "@/components/ui/badge-tag";
import { HudFrame } from "@/components/ui/HudFrame";
import {
  FRAME_COUNT,
  HERO_TEXT_FADE_END,
  framePath,
} from "@/features/home/lib/heroFrames";

/* ── Scroll-triggered content cards ──────────────────── */
type ScrollCard = {
  id: string;
  show: number;   // scroll progress to appear (0–1)
  hide: number;   // scroll progress to disappear (0–1)
  label: string;
  stat: string;
  description: string;
};

const SCROLL_CARDS: ScrollCard[] = [
  {
    id: "c1",
    show: 0.12,
    hide: 0.32,
    label: "PROJECTS SHIPPED",
    stat: "10+",
    description:
      "Full-stack applications across computer vision, healthcare portals, and infrastructure monitoring.",
  },
  {
    id: "c2",
    show: 0.36,
    hide: 0.56,
    label: "TECH STACK",
    stat: "React · Python · AI/ML",
    description:
      "Building with modern frameworks, cloud infrastructure, and machine learning pipelines.",
  },
  {
    id: "c3",
    show: 0.60,
    hide: 0.82,
    label: "CURRENT FOCUS",
    stat: "Intelligence Systems",
    description:
      "Computer vision, NLP, and predictive analytics — engineering software that thinks.",
  },
];

const HeroSection = () => {
  /* ── refs ───────────────────────────────────────────── */
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const heroTextRef = useRef<HTMLDivElement | null>(null);
  const desktopTextRef = useRef<HTMLDivElement | null>(null);
  const bigTextRef = useRef<HTMLDivElement | null>(null);
  const progressFillRef = useRef<HTMLDivElement | null>(null);

  const framesRef = useRef<HTMLImageElement[]>([]);
  const tickingRef = useRef(false);
  const loadedRef = useRef(false);
  const lastFrameRef = useRef(-1);
  const prevVisibleIdsRef = useRef("");

  /* ── state ──────────────────────────────────────────── */
  const [loadProgress, setLoadProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());

  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => [
      "software",
      "responsive web",
      "interactive",
      "predictive",
      "computer vision",
      "intelligent",
    ],
    []
  );

  /* ── rotating title ────────────────────────────────── */
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleNumber((prev) => (prev === titles.length - 1 ? 0 : prev + 1));
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  /* ── preload frames ────────────────────────────────── */
  useEffect(() => {
    let cancelled = false;
    let loadedCount = 0;
    const imgs: HTMLImageElement[] = [];

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = framePath(i);
      img.onload = () => {
        if (cancelled) return;
        loadedCount++;
        setLoadProgress(loadedCount / FRAME_COUNT);
        if (loadedCount === FRAME_COUNT) {
          loadedRef.current = true;
          setLoaded(true);
        }
      };
      img.onerror = () => {
        if (cancelled) return;
        loadedCount++;
        setLoadProgress(loadedCount / FRAME_COUNT);
        if (loadedCount === FRAME_COUNT) {
          loadedRef.current = true;
          setLoaded(true);
        }
      };
      imgs.push(img);
    }
    framesRef.current = imgs;
    return () => {
      cancelled = true;
    };
  }, []);

  /* ── draw a single frame to the canvas ─────────────── */
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img = framesRef.current[index];
    if (!canvas || !img || !img.complete || !img.naturalWidth) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = cw / ch;

    let drawW: number;
    let drawH: number;
    if (canvasRatio > imgRatio) {
      drawW = cw;
      drawH = cw / imgRatio;
    } else {
      drawH = ch;
      drawW = ch * imgRatio;
    }

    if (window.innerWidth <= 768) {
      drawW *= 1.5;
      drawH *= 1.5;
    }

    const drawX = (cw - drawW) / 2;
    const drawY =
      window.innerWidth <= 768
        ? (ch - drawH) / 2 - ch * 0.12
        : (ch - drawH) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  /* ── resize canvas to match viewport ────────────────── */
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    drawFrame(lastFrameRef.current >= 0 ? lastFrameRef.current : 0);
  }, [drawFrame]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  /* ── draw first frame once loaded ───────────────────── */
  useEffect(() => {
    if (!loaded) return;
    drawFrame(0);
    lastFrameRef.current = 0;
  }, [loaded, drawFrame]);

  /* ── scroll handler — maps scroll progress → frame ── */
  useEffect(() => {
    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        tickingRef.current = false;
        const section = sectionRef.current;
        if (!section || !loadedRef.current) return;

        const rect = section.getBoundingClientRect();
        const scrollable = section.offsetHeight - window.innerHeight;
        const progress =
          scrollable <= 0
            ? 0
            : Math.min(1, Math.max(0, -rect.top / scrollable));

        // Draw the correct frame
        const frameIndex = Math.min(
          FRAME_COUNT - 1,
          Math.floor(progress * FRAME_COUNT)
        );
        if (frameIndex !== lastFrameRef.current) {
          lastFrameRef.current = frameIndex;
          drawFrame(frameIndex);
        }

        // Fade hero text out as user starts scrolling
        const heroOpacity = Math.max(0, 1 - progress / HERO_TEXT_FADE_END);
        const heroTy = `translateY(${(1 - heroOpacity) * 16}px)`;
        if (heroTextRef.current) {
          heroTextRef.current.style.opacity = String(heroOpacity);
          heroTextRef.current.style.transform = heroTy;
        }
        if (desktopTextRef.current) {
          desktopTextRef.current.style.opacity = String(heroOpacity);
          desktopTextRef.current.style.transform = heroTy;
        }

        // Fade in big reveal text (appears after hero text fades out)
        if (bigTextRef.current) {
          const bigOp = Math.min(1, Math.max(0, (progress - 0.10) / 0.08));
          // Fade out the big text near the end
          const bigFadeOut = Math.min(1, Math.max(0, (0.88 - progress) / 0.08));
          const finalOp = bigOp * bigFadeOut;
          bigTextRef.current.style.opacity = String(finalOp);
          bigTextRef.current.style.transform = `translateY(${(1 - bigOp) * 14}px)`;
        }

        // Scroll-triggered cards visibility
        const newVisible = new Set<string>();
        for (const c of SCROLL_CARDS) {
          if (progress >= c.show && progress <= c.hide) newVisible.add(c.id);
        }
        const newIds = [...newVisible].sort().join(",");
        if (newIds !== prevVisibleIdsRef.current) {
          prevVisibleIdsRef.current = newIds;
          setVisibleCards(newVisible);
        }

        // Progress bar
        if (progressFillRef.current) {
          progressFillRef.current.style.transform = `scaleX(${progress})`;
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [drawFrame]);

  /* ── render ─────────────────────────────────────────── */
  return (
    <section ref={sectionRef} className="scroll-animation relative">
      {/* Sticky viewport — pinned while user scrolls through frames */}
      <div
        className="sticky top-0 min-h-[100dvh] w-full overflow-hidden"
        style={{
          height: "100dvh",
          willChange: "transform",
          transform: "translateZ(0)",
          background: "hsl(var(--background))",
        }}
      >
        {/* Canvas — frame sequence */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          style={{ willChange: "contents", transform: "translateZ(0)" }}
        />

        {/* Gradient overlays for text readability */}
        <div
          className="pointer-events-none absolute inset-0 hidden md:block"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 10%, transparent 30%, rgba(10,10,11,0.45) 70%, rgba(10,10,11,0.85) 100%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 md:hidden"
          style={{
            background:
              "linear-gradient(to top, rgba(10,10,11,0.92) 0%, rgba(10,10,11,0.7) 30%, rgba(10,10,11,0.1) 50%, transparent 65%)",
          }}
        />

        {/* ── L-shaped corner borders ─────────────────── */}
        <div className="pointer-events-none absolute left-4 top-16 text-primary sm:left-6 sm:top-20 md:left-10 md:top-28">
          <HudFrame corner="tl" size={20} className="md:hidden" />
          <HudFrame corner="tl" size={26} className="hidden md:block" />
        </div>
        <div className="pointer-events-none absolute right-4 top-16 text-primary sm:right-6 sm:top-20 md:right-10 md:top-28">
          <HudFrame corner="tr" size={20} className="md:hidden" />
          <HudFrame corner="tr" size={26} className="hidden md:block" />
        </div>
        <div className="pointer-events-none absolute bottom-10 left-4 text-primary sm:left-6 md:bottom-16 md:left-10">
          <HudFrame corner="bl" size={20} className="md:hidden" />
          <HudFrame corner="bl" size={26} className="hidden md:block" />
        </div>
        <div className="pointer-events-none absolute bottom-10 right-4 text-primary sm:right-6 md:bottom-16 md:right-10">
          <HudFrame corner="br" size={20} className="md:hidden" />
          <HudFrame corner="br" size={26} className="hidden md:block" />
        </div>

        {/* ── Big reveal text (fades in after hero text fades out) ── */}
        <div
          ref={bigTextRef}
          className="pointer-events-none absolute bottom-24 left-5 z-10 flex max-w-[85%] flex-col gap-3 sm:left-6 md:bottom-28 md:left-12 md:max-w-[58%] lg:gap-4"
          style={{ opacity: 0, transition: "opacity 80ms linear" }}
        >
          <span className="inline-flex items-center gap-2 font-mono text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-primary">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(20,184,104,0.85)]"
            />
            Engineering &mdash; Portfolio
          </span>
          <h2 className="font-sans text-[clamp(2rem,7vw,5rem)] md:text-[clamp(3rem,8vw,7rem)] font-semibold leading-[0.92] tracking-tighter text-white">
            Explore
            <br />
            my <span className="text-primary">work.</span>
          </h2>
          <p className="max-w-[30ch] font-mono text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-white/40">
            Software &amp; intelligence systems, built with precision.
          </p>
        </div>

        {/* ── Scroll-triggered info cards (DESKTOP — right side) ── */}
        {SCROLL_CARDS.map((card, i) => {
          const visible = visibleCards.has(card.id);
          const topPos =
            i === 0
              ? "top-[22%]"
              : i === 1
              ? "top-1/2 -translate-y-1/2"
              : "bottom-28";
          return (
            <div
              key={card.id}
              className={`pointer-events-none absolute ${topPos} right-10 z-20 hidden w-[380px] max-w-[40vw] lg:block`}
            >
              <div
                className={`pointer-events-auto rounded-2xl border border-white/[0.08] bg-[rgba(24,24,27,0.55)] p-6 backdrop-blur-xl transition-all duration-500 ease-out ${
                  visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-5 opacity-0"
                }`}
                style={{
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.04), 0 20px 40px -20px rgba(0,0,0,0.6)",
                }}
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-primary/80">
                  {card.label}
                </span>
                <div className="mt-2 text-2xl font-semibold tracking-tight text-white">
                  {card.stat}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-white/50">
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}

        {/* ── Scroll-triggered info cards (MOBILE — bottom area) ── */}
        <div className="pointer-events-none absolute inset-x-0 bottom-12 z-20 flex flex-col gap-2.5 px-5 sm:px-6 lg:hidden">
          {SCROLL_CARDS.map((card) => {
            const visible = visibleCards.has(card.id);
            return (
              <div
                key={card.id}
                className={`pointer-events-auto rounded-xl border border-white/[0.08] bg-[rgba(24,24,27,0.65)] px-4 py-3 backdrop-blur-xl transition-all duration-500 ease-out ${
                  visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0 pointer-events-none"
                }`}
                style={{
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.04), 0 12px 24px -10px rgba(0,0,0,0.5)",
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.22em] text-primary/80">
                    {card.label}
                  </span>
                  <span className="text-[15px] sm:text-base font-semibold tracking-tight text-white">
                    {card.stat}
                  </span>
                </div>
                <p className="mt-1 text-[11px] sm:text-xs leading-relaxed text-white/45">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* ── Hero text — MOBILE (< md) ──────────────── */}
        <div
          ref={heroTextRef}
          className="absolute inset-0 z-10 md:hidden flex flex-col justify-end px-5 sm:px-6"
          style={{
            transition: "opacity 80ms linear",
            paddingBottom: "clamp(70px, 14vh, 100px)",
          }}
        >
          <div className="font-mono text-[9px] sm:text-[10px] text-white/50 uppercase tracking-[0.2em] mb-2">
            Software • Web • Intelligence Systems
          </div>

          <motion.h1
            layout
            className="text-[26px] sm:text-[32px] font-bold tracking-[-0.04em] leading-[1.08] mb-2.5 text-white drop-shadow-lg flex flex-wrap items-center gap-x-[0.22em]"
          >
            <motion.span layout>I build</motion.span>
            <motion.span
              layout
              className="relative inline-flex flex-col h-[1.1em] overflow-hidden"
            >
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={titles[titleNumber]}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className="text-primary drop-shadow-[0_0_15px_rgba(20,184,104,0.3)] inline-block whitespace-nowrap font-editorial font-normal"
                >
                  {titles[titleNumber]}
                </motion.span>
              </AnimatePresence>
            </motion.span>
            <motion.span layout>AI Systems.</motion.span>
          </motion.h1>

          <p className="text-[12px] sm:text-[13px] text-white/70 leading-[1.5] mb-3 font-light max-w-[36ch]">
            CS Engineering student building software, web systems &amp; AI
            applications.
          </p>

          <div className="flex items-center gap-2.5">
            <a
              href="https://drive.google.com/file/d/1YWxkSYy0Uc1yHMIZVNFOItWxh7xBzqnR/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center font-mono text-[10px] sm:text-[11px] px-4 py-2 sm:px-4 sm:py-2.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-[0_0_16px_rgba(20,184,104,0.25)]"
            >
              view resume
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center font-mono text-[10px] sm:text-[11px] px-4 py-2 sm:px-4 sm:py-2.5 rounded-md border border-white/20 bg-white/5 text-white hover:bg-white/10 transition-all duration-300 backdrop-blur-md"
            >
              get in touch
            </a>
          </div>
        </div>

        {/* ── Hero text — DESKTOP (>= md) ─────────────── */}
        <div
          ref={desktopTextRef}
          className="absolute inset-x-0 bottom-0 z-10 hidden md:flex flex-col items-start gap-4 px-12 pb-28 lg:gap-5"
          style={{ transition: "opacity 80ms linear" }}
        >
          <div className="font-mono text-[12px] text-white/70 uppercase tracking-[0.25em] mb-2">
            Software • Web • Intelligence Systems
          </div>

          <motion.h1
            layout
            className="text-6xl lg:text-7xl font-bold tracking-[-0.04em] leading-[1.08] mb-4 text-white drop-shadow-lg flex flex-wrap items-center gap-x-[0.3em]"
          >
            <motion.span layout>I build</motion.span>
            <motion.span
              layout
              className="relative inline-flex flex-col h-[1.1em] overflow-hidden"
            >
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={titles[titleNumber]}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className="text-primary drop-shadow-[0_0_15px_rgba(20,184,104,0.3)] inline-block whitespace-nowrap font-editorial font-normal"
                >
                  {titles[titleNumber]}
                </motion.span>
              </AnimatePresence>
            </motion.span>
            <motion.span layout>AI Systems.</motion.span>
          </motion.h1>

          <p className="text-[17px] lg:text-[19px] text-white/90 leading-[1.6] mb-4 font-light max-w-2xl drop-shadow-md">
            Hey, I'm Nitish. I'm a Computer Science Engineering student
            passionate about software development, responsive web systems, and
            intelligent applications.
          </p>

          <BadgeTag />

          <div className="flex items-center gap-4 mt-2">
            <a
              href="https://drive.google.com/file/d/1YWxkSYy0Uc1yHMIZVNFOItWxh7xBzqnR/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center min-w-[160px] font-mono text-[13px] px-6 py-3.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-[0_0_20px_rgba(20,184,104,0.3)] hover:shadow-[0_0_30px_rgba(20,184,104,0.5)] transform hover:-translate-y-0.5"
            >
              view resume
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center min-w-[160px] font-mono text-[13px] px-6 py-3.5 rounded-md border border-white/20 bg-white/5 text-white hover:bg-white/10 transition-all duration-300 backdrop-blur-md transform hover:-translate-y-0.5"
            >
              get in touch
            </a>
          </div>
        </div>

        {/* ── Bottom progress bar & status ────────────── */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[9]">
          <div className="mx-5 mb-1.5 h-px bg-white/10 sm:mx-6 md:mx-10 md:mb-3">
            <div
              ref={progressFillRef}
              className="h-full origin-left bg-primary"
              style={{
                transform: "scaleX(0)",
                transition: "transform 80ms linear",
              }}
            />
          </div>
          <div className="mx-5 flex items-center justify-between pb-2 sm:mx-6 sm:pb-2.5 md:mx-10 md:pb-4 font-mono text-[7px] sm:text-[8px] md:text-[10px] uppercase tracking-[0.18em] md:tracking-[0.28em] text-white/20 md:text-white/30">
            <span>SEQ 001 / {FRAME_COUNT}</span>
            <span className="hidden md:inline">NITISH.V // PORTFOLIO</span>
            <span>Scroll &darr;</span>
          </div>
        </div>

        {/* ── Loading overlay ─────────────────────────── */}
        {!loaded && (
          <div
            className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 px-6"
            style={{ background: "hsl(var(--background))" }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 font-mono text-[9px] sm:text-[10px] font-medium uppercase tracking-[0.22em] text-primary backdrop-blur-md">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(20,184,104,0.85)]" />
              LOADING // PORTFOLIO
            </span>
            <div className="h-px w-48 sm:w-60 bg-white/10 md:w-80">
              <div
                className="h-full bg-primary transition-[width] duration-150 ease-out"
                style={{ width: `${Math.round(loadProgress * 100)}%` }}
              />
            </div>
            <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-white/30">
              Loading frames &nbsp;&middot;&nbsp;{" "}
              {Math.round(loadProgress * 100)}%
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
