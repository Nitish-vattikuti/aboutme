import { Briefcase, Calendar, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import drdoLogo from "@/assets/drdo.svg";
import vantirisLogo from "@/assets/vantiris.png";

interface ExperienceItem {
  company: string;
  role: string;
  location: string;
  duration: string;
  highlights: string[];
  url?: string;
  logo?: string;
}

const experiences: ExperienceItem[] = [
  {
    company: "DRDO – Centre for Airborne Systems (CABS)",
    role: "Technical Intern",
    location: "Bengaluru, India",
    duration: "July 2026 – Present",
    url: "https://drdo.gov.in/drdo/en/organisation/centre-air-borne-system",
    logo: drdoLogo,
    highlights: [
      "Contributing to the development of a C++ and Qt-based software application for processing and interpreting machine-generated data into a structured, human-readable format.",
      "Developing graphical user interface components using Qt and implementing core data-processing and application logic in C++.",
      "Working with Go2Monitor as part of the data monitoring, visualization, and analysis workflow.",
      "Gaining hands-on experience in GUI development, data interpretation, software integration, debugging, and the development of engineering software systems under technical guidance."
    ]
  },
  {
    company: "Vantiris Technologies LLP",
    role: "Software Engineering Intern",
    location: "Remote, India",
    duration: "Feb 2026 – Present",
    url: "https://vantiris.com/",
    logo: vantirisLogo,
    highlights: [
      "Web Optimization & Scaling: Developed and deployed responsive frontend architectures for international logistics platforms (APET Logistics, Marine Commercial Ltd), expanding deployment infrastructure across optimized Netlify environments.",
      "UI/UX Redesign: Spearheaded a comprehensive user interface overhaul of legacy, raw HTML client applications into responsive, multi-viewport web structures engineered for cross-device compatibility.",
      "Technical Workflows: Leveraged Git/GitHub version control workflows to collaborate seamlessly during weekly engineering synchronization meetings, accelerating iterative feature deployments.",
      "Project Architecture: Documented comprehensive project lifecycles, backend logic structures, and technical architectural tradeoffs to establish long-term engineering documentation guidelines."
    ]
  }
];

const ExperienceSection = () => {
  return (
    <section id="experience" className="section-spacing border-t border-border">
      <div className="section-container">
        <motion.p
          className="section-label mb-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          Experience
        </motion.p>
        <motion.h2
          className="text-2xl md:text-3xl font-normal font-editorial tracking-[-0.02em] text-foreground mb-12"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          Work History
        </motion.h2>

        <div className="space-y-6">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.company}
              className="relative group transition-all duration-300 pb-4 border-b border-border/30 last:border-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg md:text-xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                    <span className={`flex items-center justify-center w-8 h-8 overflow-hidden shrink-0 ${
                      exp.logo 
                        ? (exp.company.includes("DRDO") ? "rounded-full bg-transparent p-0" : "rounded-md bg-zinc-950 border border-border/30 p-0.5")
                        : "rounded-md bg-primary/10 text-primary border border-border/30 p-1.5"
                    }`}>
                      {exp.logo ? (
                        <img 
                          src={exp.logo} 
                          alt={exp.company} 
                          className="w-full h-full object-contain" 
                          style={exp.company.includes("DRDO") ? { clipPath: "circle(48.5%)" } : undefined}
                        />
                      ) : (
                        <Briefcase size={18} />
                      )}
                    </span>
                    {exp.role}
                  </h3>
                  {exp.url ? (
                    <a
                      href={exp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-[14px] font-mono text-primary mt-2 font-medium hover:underline underline-offset-4"
                    >
                      {exp.company}
                    </a>
                  ) : (
                    <p className="text-[14px] font-mono text-primary mt-2 font-medium">
                      {exp.company}
                    </p>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[12px] text-muted-foreground/80 md:self-start">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} className="text-muted-foreground/50" />
                    {exp.duration}
                  </span>
                  <span className="hidden md:inline text-muted-foreground/30">•</span>
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-muted-foreground/50" />
                    {exp.location}
                  </span>
                </div>
              </div>

              <div className="space-y-3.5 pl-1.5 border-l-2 border-primary/20">
                {exp.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start gap-3 group/item">
                    <ArrowRight size={12} className="text-primary/40 mt-[5px] shrink-0 group-hover/item:text-primary group-hover/item:translate-x-0.5 transition-all duration-200" />
                    <p className="text-[14px] text-muted-foreground group-hover/item:text-foreground transition-colors duration-200 leading-[1.65]">
                      {highlight}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
