import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BadgeTag from "@/components/ui/badge-tag";

const HeroSVGVisual = () => {
  return (
    <div className="relative w-full max-w-[450px] aspect-square flex items-center justify-center select-none">
      {/* Soft background glow matching primary color */}
      <div className="absolute w-[80%] h-[80%] rounded-full bg-primary/10 blur-[80px] opacity-60 animate-pulse pointer-events-none" />

      <svg viewBox="0 0 500 500" className="w-full h-auto overflow-visible">
        <defs>
          <filter id="svg-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Radial Gradients for 3D Spheres */}
          <radialGradient id="sphere-emerald" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#a7f3d0" />
            <stop offset="40%" stopColor="#10b981" />
            <stop offset="85%" stopColor="#047857" />
            <stop offset="100%" stopColor="#022c22" />
          </radialGradient>
          
          <radialGradient id="sphere-mint" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#e6fffa" />
            <stop offset="45%" stopColor="#34d399" />
            <stop offset="85%" stopColor="#059669" />
            <stop offset="100%" stopColor="#064e3b" />
          </radialGradient>

          <radialGradient id="sphere-dark" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#4b5563" />
            <stop offset="40%" stopColor="#1f2937" />
            <stop offset="85%" stopColor="#111827" />
            <stop offset="100%" stopColor="#030712" />
          </radialGradient>

          <radialGradient id="sphere-silver" cx="28%" cy="28%" r="72%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#e2e8f0" />
            <stop offset="70%" stopColor="#94a3b8" />
            <stop offset="95%" stopColor="#475569" />
            <stop offset="100%" stopColor="#334155" />
          </radialGradient>

          {/* Cube Face Gradients (Emerald) */}
          <linearGradient id="cube-large-top" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="cube-large-left" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#047857" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="cube-large-right" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#059669" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#022c22" stopOpacity="0.95" />
          </linearGradient>

          {/* Cube Face Gradients (Mint/Light) */}
          <linearGradient id="cube-light-top" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a7f3d0" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#6ee7b7" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="cube-light-left" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="cube-light-right" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#022c22" stopOpacity="0.95" />
          </linearGradient>

          {/* Cube Face Gradients (Dark) */}
          <linearGradient id="cube-dark-top" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#374151" />
            <stop offset="100%" stopColor="#1f2937" />
          </linearGradient>
          <linearGradient id="cube-dark-left" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1f2937" />
            <stop offset="100%" stopColor="#111827" />
          </linearGradient>
          <linearGradient id="cube-dark-right" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#111827" />
            <stop offset="100%" stopColor="#030712" />
          </linearGradient>

          {/* Flat Rings Gradients */}
          <linearGradient id="ring-grad-left" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#047857" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="ring-grad-right" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#047857" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#022c22" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        <style>
          {`
            @keyframes visual-float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-10px); }
            }
            .visual-float-group {
              animation: visual-float 6s ease-in-out infinite;
              transform-origin: 250px 250px;
            }
          `}
        </style>

        {/* Floating Animation Group */}
        <g className="visual-float-group">
          {/* 1. BACKDROP DISCS */}
          {/* Left flat circle */}
          <g transform="translate(140, 210) rotate(-35)">
            <ellipse cx="0" cy="0" rx="55" ry="25" fill="none" stroke="url(#ring-grad-left)" strokeWidth="12" />
          </g>
          {/* Right flat disc (large dark flat ellipse) */}
          <g transform="translate(340, 310) rotate(12)">
            <ellipse cx="0" cy="0" rx="90" ry="28" fill="url(#ring-grad-right)" />
          </g>

          {/* 2. BACK DARK CUBES */}
          {/* Back Cube Top-Right */}
          <g transform="translate(260, 135)">
            <path d="M 25,0 L 50,12.5 L 25,25 L 0,12.5 Z" fill="url(#cube-dark-top)" />
            <path d="M 0,12.5 L 25,25 L 25,55 L 0,42.5 Z" fill="url(#cube-dark-left)" />
            <path d="M 25,25 L 50,12.5 L 50,42.5 L 25,55 Z" fill="url(#cube-dark-right)" />
          </g>
          {/* Back Cube Right */}
          <g transform="translate(330, 220)">
            <path d="M 20,0 L 40,10 L 20,20 L 0,10 Z" fill="url(#cube-dark-top)" />
            <path d="M 0,10 L 20,20 L 20,45 L 0,35 Z" fill="url(#cube-dark-left)" />
            <path d="M 20,20 L 40,10 L 40,35 L 20,45 Z" fill="url(#cube-dark-right)" />
          </g>

          {/* 3. TORUSES / RINGS */}
          {/* Left Ring (tilted) */}
          <g transform="translate(180, 210) rotate(55)">
            <ellipse cx="0" cy="0" rx="42" ry="18" fill="none" stroke="#10b981" strokeWidth="10" filter="url(#svg-glow)" opacity="0.4" />
            <ellipse cx="0" cy="0" rx="42" ry="18" fill="none" stroke="#059669" strokeWidth="9" />
          </g>

          {/* 4. MAIN CENTRAL CUBE (Large, Emerald) */}
          <g transform="translate(145, 150)">
            {/* Top Face */}
            <path d="M 60,0 L 120,30 L 60,60 L 0,30 Z" fill="url(#cube-large-top)" />
            {/* Left Face */}
            <path d="M 0,30 L 60,60 L 60,135 L 0,105 Z" fill="url(#cube-large-left)" />
            {/* Right Face */}
            <path d="M 60,60 L 120,30 L 120,105 L 60,135 Z" fill="url(#cube-large-right)" />
            {/* Subtle highlights */}
            <path d="M 60,0 L 120,30 L 60,60 L 0,30 Z" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          </g>

          {/* 5. MEDIUM CUBE (Right, Mint) */}
          <g transform="translate(245, 200)">
            {/* Top Face */}
            <path d="M 45,0 L 90,22.5 L 45,45 L 0,22.5 Z" fill="url(#cube-light-top)" />
            {/* Left Face */}
            <path d="M 0,22.5 L 45,45 L 45,100 L 0,77.5 Z" fill="url(#cube-light-left)" />
            {/* Right Face */}
            <path d="M 45,45 L 90,22.5 L 90,77.5 L 45,100 Z" fill="url(#cube-light-right)" />
            <path d="M 45,0 L 90,22.5 L 45,45 L 0,22.5 Z" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          </g>

          {/* 6. RIGHT RING (tilted) */}
          <g transform="translate(325, 275) rotate(-25)">
            <ellipse cx="0" cy="0" rx="35" ry="16" fill="none" stroke="#cbd5e1" strokeWidth="8" />
          </g>

          {/* 7. LARGE SPHERE (Bottom-Right, Striped Green) */}
          <g transform="translate(320, 290)">
            <circle cx="0" cy="0" r="38" fill="url(#sphere-emerald)" />
            {/* Stripes (3D latitudinal arcs) */}
            <path d="M -32,-20 A 30,30 0 0,0 32,-20" fill="none" stroke="rgba(2, 44, 34, 0.45)" strokeWidth="2.5" />
            <path d="M -37,-10 A 36,36 0 0,0 37,-10" fill="none" stroke="rgba(2, 44, 34, 0.45)" strokeWidth="2.5" />
            <path d="M -38,0   A 38,38 0 0,0 38,0"   fill="none" stroke="rgba(2, 44, 34, 0.45)" strokeWidth="2.5" />
            <path d="M -37,10  A 36,36 0 0,0 37,10"  fill="none" stroke="rgba(2, 44, 34, 0.45)" strokeWidth="2.5" />
            <path d="M -32,20  A 30,30 0 0,0 32,20"  fill="none" stroke="rgba(2, 44, 34, 0.45)" strokeWidth="2.5" />
            {/* specular highlights */}
            <circle cx="-10" cy="-10" r="36" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1.5" />
          </g>

          {/* 8. MEDIUM SPHERE (Bottom-Left, Striped Silver) */}
          <g transform="translate(170, 320)">
            <circle cx="0" cy="0" r="28" fill="url(#sphere-silver)" />
            {/* Latitude Rings */}
            <ellipse cx="0" cy="-12" rx="22" ry="5" fill="none" stroke="rgba(51, 65, 85, 0.4)" strokeWidth="1.5" />
            <ellipse cx="0" cy="-4"  rx="27" ry="6" fill="none" stroke="rgba(51, 65, 85, 0.4)" strokeWidth="1.5" />
            <ellipse cx="0" cy="4"   rx="27" ry="6" fill="none" stroke="rgba(51, 65, 85, 0.4)" strokeWidth="1.5" />
            <ellipse cx="0" cy="12"  rx="22" ry="5" fill="none" stroke="rgba(51, 65, 85, 0.4)" strokeWidth="1.5" />
          </g>

          {/* 9. SMALL BOTTOM CUBE (Mint) */}
          <g transform="translate(200, 335)">
            {/* Top Face */}
            <path d="M 28,0 L 56,14 L 28,28 L 0,14 Z" fill="url(#cube-light-top)" />
            {/* Left Face */}
            <path d="M 0,14 L 28,28 L 28,62 L 0,48 Z" fill="url(#cube-light-left)" />
            {/* Right Face */}
            <path d="M 28,28 L 56,14 L 56,48 L 28,62 Z" fill="url(#cube-light-right)" />
            <path d="M 28,0 L 56,14 L 28,28 L 0,14 Z" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          </g>

          {/* 10. SMALL FLOATING SPHERES */}
          {/* Top Sphere (Dark) */}
          <circle cx="260" cy="130" r="10" fill="url(#sphere-dark)" />
          {/* Top-Right Small Sphere (Silver) */}
          <circle cx="345" cy="165" r="12" fill="url(#sphere-silver)" />
          {/* Left Sphere (Silver) */}
          <circle cx="120" cy="220" r="11" fill="url(#sphere-silver)" />
          {/* Bottom-Right Small Sphere (Dark) */}
          <circle cx="295" cy="365" r="18" fill="url(#sphere-dark)" />
        </g>
      </svg>
    </div>
  );
};

const HeroSection = () => {
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

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Video removed to use the global persistent shader background */}
      
      {/* Global persistent shader and tint are handled in App.tsx */}

      <div className="section-container relative z-10 w-full pt-28 pb-12 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          {/* Left Column - Content */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="font-mono text-[11px] sm:text-[12px] text-white/70 uppercase tracking-[0.25em] mb-6 animate-fade-in">
              Software • Web • Intelligence Systems
            </div>

            <motion.h1 layout className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.04em] leading-[1.08] mb-6 text-white animate-slide-up drop-shadow-lg flex flex-wrap items-center gap-x-[0.3em]">
              <motion.span layout>I build</motion.span>
              <motion.span layout className="relative inline-flex flex-col h-[1.1em] overflow-hidden">
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

            <div className="animate-slide-up" style={{ animationDelay: "0.16s" }}>
              <p className="text-[17px] sm:text-[19px] text-white/90 leading-[1.6] mb-8 font-light max-w-2xl drop-shadow-md">
                Hey, I’m Nitish. I'm a Computer Science Engineering student passionate about software development, responsive web systems, and intelligent applications.
              </p>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <BadgeTag />
            </div>

            <div
              className="flex flex-wrap items-center gap-4 mt-8 animate-slide-up"
              style={{ animationDelay: "0.24s" }}
            >
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

          {/* Right Column - 3D Visual Asset */}
          <motion.div
            className="lg:col-span-5 flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
          >
            <HeroSVGVisual />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
