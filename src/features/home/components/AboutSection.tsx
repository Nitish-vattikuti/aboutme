import { motion } from "framer-motion";
import { Camera, Eye, Flame, Sliders, Layers, Cpu, Activity, Monitor } from "lucide-react";

const Node = ({ x, y, icon: Icon, label, isCore = false }: any) => {
  const w = isCore ? 150 : 160;
  const h = isCore ? 42 : 38;
  return (
    <foreignObject x={x - w / 2} y={y - h / 2} width={w} height={h}>
      <div
        className={`w-full h-full flex items-center justify-center gap-2 rounded-md border shadow-lg font-medium tracking-wide px-3 text-center whitespace-nowrap ${
          isCore
            ? "border-primary/40 bg-primary/10 backdrop-blur-xl text-[11px] md:text-[12px] text-white shadow-[0_0_20px_rgba(52,211,153,0.15)]"
            : "border-white/15 bg-zinc-950/70 backdrop-blur-md text-[10px] md:text-[11px] text-white/90 hover:border-primary/30 hover:bg-zinc-900/80 transition-all duration-300"
        }`}
      >
        {Icon && <Icon className={`shrink-0 ${isCore ? "w-4 h-4 text-primary" : "w-3.5 h-3.5 text-primary/80"}`} />}
        <span>{label}</span>
      </div>
    </foreignObject>
  );
};

const TechOrbitDiagram = () => {
  // Center of the diagram
  const cx = 400;
  const cy = 250;
  // Orbit radii
  const r1 = 65;   // Core boundary
  const r2 = 175;  // Middle orbit (increased to give space from core)
  const r3 = 260;  // Outer orbit (increased to keep distance from middle)

  // Calculate node positions on orbits using angles (radians)
  // Middle orbit nodes (3 nodes)
  const midNodes = [
    { angle: 4 * Math.PI / 3, label: "Signal Fusion", icon: Layers },      // top-left (240 deg)
    { angle: 0,              label: "Computer Vision", icon: Camera },     // right (0 deg)
    { angle: 2 * Math.PI / 3, label: "Path Planning", icon: Sliders },      // bottom-left (120 deg)
  ].map(n => ({
    ...n,
    x: cx + r2 * Math.cos(n.angle),
    y: cy + r2 * Math.sin(n.angle),
  }));

  // Outer orbit nodes (3 nodes, staggered relative to middle orbit)
  const outNodes = [
    { angle: -Math.PI / 3,    label: "Interactive GCS", icon: Monitor },    // top-right (-60 / 300 deg)
    { angle: Math.PI,         label: "UAV Simulation", icon: Eye },          // left (180 deg)
    { angle: Math.PI / 3,     label: "ServiceNow Ops", icon: Activity },     // bottom-right (60 deg)
  ].map(n => ({
    ...n,
    x: cx + r3 * Math.cos(n.angle),
    y: cy + r3 * Math.sin(n.angle),
  }));

  return (
    <div className="w-full relative overflow-visible hover:opacity-100 transition-opacity duration-500">
      <svg viewBox="0 0 800 500" className="w-full h-auto font-mono overflow-visible" style={{ filter: "drop-shadow(0 0 40px rgba(52, 211, 153, 0.05))" }}>
        <defs>
          {/* Glow filter for nodes and core */}
          <filter id="glow-sm" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-lg" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Radar sweep gradient */}
          <radialGradient id="radar-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </radialGradient>

          {/* Core radial glow */}
          <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.12" />
            <stop offset="60%" stopColor="#34d399" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </radialGradient>

          {/* Orbit stroke gradients */}
          <linearGradient id="orbit-grad-mid" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.18" />
            <stop offset="50%" stopColor="#34d399" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0.18" />
          </linearGradient>
          <linearGradient id="orbit-grad-out" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#34d399" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        <style>
          {`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            .radar-sweep {
              animation: spin 14s linear infinite;
              transform-origin: ${cx}px ${cy}px;
            }
            .pulse-core {
              animation: pulse-ring 2.5s ease-in-out infinite alternate;
            }
            @keyframes pulse-ring {
              from { opacity: 0.18; r: ${r1 - 2}; }
              to { opacity: 0.4; r: ${r1 + 2}; }
            }
            .core-ping {
              animation: core-ping-anim 3s ease-out infinite;
              transform-origin: ${cx}px ${cy}px;
            }
            @keyframes core-ping-anim {
              0% { opacity: 0.3; r: ${r1}; }
              70% { opacity: 0; r: ${r1 + 30}; }
              100% { opacity: 0; r: ${r1 + 30}; }
            }
          `}
        </style>

        {/* 1. Subtle Grid Crosshairs */}
        <g stroke="rgba(255,255,255,0.04)" strokeWidth="0.75">
          <line x1="50" y1={cy} x2="750" y2={cy} />
          <line x1={cx} y1="20" x2={cx} y2="480" />
          <line x1={cx - 240} y1={cy - 190} x2={cx + 240} y2={cy + 190} strokeDasharray="3 6" />
          <line x1={cx - 240} y1={cy + 190} x2={cx + 240} y2={cy - 190} strokeDasharray="3 6" />
        </g>

        {/* 2. Core ambient glow */}
        <circle cx={cx} cy={cy} r={r1 + 40} fill="url(#core-glow)" />

        {/* 3. Concentric Orbit Paths */}
        {/* Core boundary ring with pulse */}
        <circle cx={cx} cy={cy} r={r1} fill="none" stroke="rgba(52, 211, 153, 0.25)" strokeWidth="1.5" className="pulse-core" />
        {/* Ping ring expanding from core */}
        <circle cx={cx} cy={cy} r={r1} fill="none" stroke="rgba(52, 211, 153, 0.2)" strokeWidth="1" className="core-ping" />
        {/* Middle orbit */}
        <circle cx={cx} cy={cy} r={r2} fill="none" stroke="url(#orbit-grad-mid)" strokeWidth="1" strokeDasharray="4 8" />
        {/* Outer orbit */}
        <circle cx={cx} cy={cy} r={r3} fill="none" stroke="url(#orbit-grad-out)" strokeWidth="1" strokeDasharray="5 10" />

        {/* 4. Radar Sweep */}
        <line x1={cx} y1={cy} x2={cx} y2={cy - r3 - 10} stroke="rgba(52, 211, 153, 0.3)" strokeWidth="1.5" className="radar-sweep" />
        <path d={`M ${cx},${cy} L ${cx},${cy - r3 - 10} A ${r3 + 10},${r3 + 10} 0 0,0 ${cx - 80},${cy - r3 + 20} Z`} fill="url(#radar-gradient)" className="radar-sweep" opacity="0.12" />

        {/* 5. Radial Data Bus connectors (core to each node) */}
        <g stroke="rgba(52, 211, 153, 0.06)" strokeWidth="1" fill="none">
          {[...midNodes, ...outNodes].map((n, i) => (
            <line key={`bus-${i}`} x1={cx} y1={cy} x2={n.x} y2={n.y} strokeDasharray={i < 3 ? "none" : "3 5"} />
          ))}
        </g>

        {/* 6. SVG Paths for traveling orbit packets */}
        <path id="orbit-mid-cw" d={`M ${cx}, ${cy - r2} A ${r2},${r2} 0 1,1 ${cx - 0.1},${cy - r2} Z`} fill="none" />
        <path id="orbit-mid-ccw" d={`M ${cx}, ${cy - r2} A ${r2},${r2} 0 1,0 ${cx - 0.1},${cy - r2} Z`} fill="none" />
        <path id="orbit-out-cw" d={`M ${cx}, ${cy - r3} A ${r3},${r3} 0 1,1 ${cx - 0.1},${cy - r3} Z`} fill="none" />
        <path id="orbit-out-ccw" d={`M ${cx}, ${cy - r3} A ${r3},${r3} 0 1,0 ${cx - 0.1},${cy - r3} Z`} fill="none" />

        {/* Data bus paths for traveling signals */}
        {[...midNodes, ...outNodes].map((n, i) => (
          <path key={`bp-${i}`} id={`bus-path-${i}`} d={`M ${cx},${cy} L ${n.x},${n.y}`} fill="none" />
        ))}

        {/* 7. Traveling Data Packets on orbits */}
        <circle r="3.5" fill="#34d399" filter="url(#glow-sm)">
          <animateMotion dur="16s" repeatCount="indefinite">
            <mpath href="#orbit-mid-cw" />
          </animateMotion>
        </circle>
        <circle r="2.5" fill="#a7f3d0" opacity="0.7">
          <animateMotion dur="22s" repeatCount="indefinite">
            <mpath href="#orbit-mid-ccw" />
          </animateMotion>
        </circle>
        <circle r="4" fill="#34d399" filter="url(#glow-sm)">
          <animateMotion dur="28s" repeatCount="indefinite">
            <mpath href="#orbit-out-cw" />
          </animateMotion>
        </circle>
        <circle r="2.5" fill="#a7f3d0" opacity="0.6">
          <animateMotion dur="36s" repeatCount="indefinite">
            <mpath href="#orbit-out-ccw" />
          </animateMotion>
        </circle>

        {/* Radial bus traveling signals */}
        {[...midNodes, ...outNodes].map((_, i) => (
          <circle key={`sig-${i}`} r="2" fill="#34d399" opacity="0.8">
            <animateMotion dur={`${4 + i * 1.3}s`} repeatCount="indefinite">
              <mpath href={`#bus-path-${i}`} />
            </animateMotion>
          </circle>
        ))}

        {/* 8. Static Nodes — precisely placed on orbits */}
        {/* Core */}
        <Node x={cx} y={cy} label="Systems Core" icon={Cpu} isCore />

        {/* Middle orbit nodes */}
        {midNodes.map((n, i) => (
          <Node key={`mid-${i}`} x={n.x} y={n.y} label={n.label} icon={n.icon} />
        ))}

        {/* Outer orbit nodes */}
        {outNodes.map((n, i) => (
          <Node key={`out-${i}`} x={n.x} y={n.y} label={n.label} icon={n.icon} />
        ))}
      </svg>
      <div className="absolute bottom-3 right-5 font-mono text-[9px] text-primary/25 select-none tracking-[0.15em] uppercase">
        interdisciplinary tech orbit
      </div>
    </div>
  );
};

const AboutSection = () => {
  return (
    <section id="about" className="section-spacing border-t border-border overflow-hidden">
      <div className="section-container relative">
        <div className="w-full relative z-10">
          <motion.p
            className="section-label mb-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
          >
            About
          </motion.p>
          
          <motion.h2
            className="text-2xl md:text-3xl font-semibold tracking-[-0.03em] text-foreground mb-8 leading-[1.2] max-w-2xl"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            I'm a Computer Science Engineering student specializing in building software systems and responsive web applications.
          </motion.h2>

          {/* Animated green gradient divider line */}
          <motion.div
            className="w-full h-[1px] bg-gradient-to-r from-primary/30 via-primary/10 to-transparent mb-8"
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ originX: 0 }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 lg:gap-10 items-start w-full">
            <div className="lg:col-span-4 space-y-6">
              <motion.p 
                className="text-[16px] text-foreground/90 leading-[1.8] font-normal"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                I am currently pursuing a Bachelor of Technology in Computer Science and Engineering at MVGR College of Engineering. My academic foundation is built on deep study in Operating Systems, Database Management and AI-ML.
              </motion.p>
              
              <motion.p 
                className="text-[16px] text-muted-foreground leading-[1.8] font-light"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.15 }}
              >
                I actively work on combining software development with computer vision, avionics modeling, and IT systems operations. My technical toolkit ranges from core programming languages to modern frontend design tools and platforms.
              </motion.p>
              
              <motion.p 
                className="text-[16px] text-muted-foreground leading-[1.8] font-light"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                As a Software Engineering Intern, I focus on optimizing frontend platforms and refining user interfaces to deliver responsive, high-performance web structures for production environments.
              </motion.p>
            </div>

            <motion.div 
              className="lg:col-span-6 relative w-full flex justify-center lg:justify-end"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <TechOrbitDiagram />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
