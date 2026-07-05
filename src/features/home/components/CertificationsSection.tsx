import { motion } from "framer-motion";
import { ShieldCheck, ExternalLink, Award, Sparkles, Atom } from "lucide-react";
import servicenowIcon from "@/assets/servicenow.png";

interface Certification {
  title: string;
  issuer: string;
  year: string;
  credentialId: string;
  description: string;
  skills: string[];
  verificationUrl?: string;
  color: string;
  logo: any;
}

const certifications: Certification[] = [
  {
    title: "ServiceNow Certified System Administrator (CSA)",
    issuer: "ServiceNow",
    year: "2026",
    credentialId: "2fce68b9-e952-4883-a242-48b70cc234a3",
    description: "Validates system administration, database management, security access (ACLs), user role permissions, Flow Designer automations, and ITSM configurations on the ServiceNow platform.",
    skills: ["System Administration", "Flow Designer", "Platform Security", "ITSM Config", "User Management"],
    verificationUrl: "https://www.credly.com/badges/2fce68b9-e952-4883-a242-48b70cc234a3/public_url",
    color: "from-[#203a3d] to-[#0f1d1e] border-[#3b7b80]/20 hover:border-[#3b7b80]/50 shadow-[#3b7b80]/5 hover:shadow-[#3b7b80]/10",
    logo: servicenowIcon
  },
  {
    title: "ServiceNow Certified Application Developer (CAD)",
    issuer: "ServiceNow",
    year: "2026",
    credentialId: "2cc3c040-1b14-4b83-8cb7-63efd0e5532b",
    description: "Proves skills in designing, building, scripting, and deploying scoped custom applications on the ServiceNow PaaS. Covers Glide APIs, Script Includes, Client/Server Scripting, and IntegrationHub.",
    skills: ["Scoped Architecture", "Client & Server Scripting", "Glide System APIs", "UI Actions & Policies", "IntegrationHub Spokes"],
    verificationUrl: "https://www.credly.com/badges/2cc3c040-1b14-4b83-8cb7-63efd0e5532b/public_url",
    color: "from-[#293e40] to-[#121c1d] border-primary/20 hover:border-primary/50 shadow-primary/5 hover:shadow-primary/10",
    logo: servicenowIcon
  },
  {
    title: "HackerRank Frontend Developer (React)",
    issuer: "HackerRank",
    year: "2026",
    credentialId: "f17a39c89954",
    description: "Validates expertise in React.js frontend development. Covers component state management, hook mechanics (useState, useEffect, custom hooks), rendering performance, and structured UI logic.",
    skills: ["React.js", "Hooks (useEffect/State)", "Props Rendering", "State Management", "UI Lifecycle"],
    verificationUrl: "https://www.hackerrank.com/certificates/f17a39c89954",
    color: "from-[#1c3c2a] to-[#0e1d15] border-emerald-500/20 hover:border-emerald-500/50 shadow-emerald-500/5 hover:shadow-emerald-500/10",
    logo: "https://cdn.simpleicons.org/hackerrank/2EC866"
  },
  {
    title: "HackerRank Software Engineer",
    issuer: "HackerRank",
    year: "2026",
    credentialId: "e889d0ab5422",
    description: "Validates comprehensive software engineering skills. Covers algorithmic problem solving, abstract data structures, relational database querying (SQL), system design paradigms, and OOP principles.",
    skills: ["Problem Solving", "Data Structures", "SQL Querying", "OOP Design", "Algorithms"],
    verificationUrl: "https://www.hackerrank.com/certificates/e889d0ab5422",
    color: "from-[#183626] to-[#0d1c14] border-emerald-500/20 hover:border-emerald-500/50 shadow-emerald-500/5 hover:shadow-emerald-500/10",
    logo: "https://cdn.simpleicons.org/hackerrank/2EC866"
  },
  {
    title: "Wiser Technology Quantum Fundamentals",
    issuer: "Wiser Technology",
    year: "2026",
    credentialId: "B6FE12DD",
    description: "Validates core understanding of quantum computing principles, qubit states, superposition, entanglement, quantum logic gates, and fundamental quantum algorithms.",
    skills: ["Quantum Computing", "Qubits & Superposition", "Entanglement", "Quantum Gates", "Algorithms"],
    color: "from-[#2e1d3d] to-[#160e1f] border-purple-500/20 hover:border-purple-500/50 shadow-purple-500/5 hover:shadow-purple-500/10",
    logo: "atom"
  },
  {
    title: "Microsoft Career Essentials in Generative AI",
    issuer: "Microsoft & LinkedIn",
    year: "2026",
    credentialId: "48b5ea58357af437537df50baafb1d36b843c2d2621223bb8a14cc812bd8e039",
    description: "Validates foundations of generative AI, large language models (LLMs), prompt engineering strategies, ethical AI governance, and applying Microsoft/LinkedIn AI tools in engineering workflows.",
    skills: ["Generative AI", "Prompt Engineering", "Large Language Models", "AI Ethics", "Workflow Automation"],
    verificationUrl: "https://www.linkedin.com/learning/certificates/48b5ea58357af437537df50baafb1d36b843c2d2621223bb8a14cc812bd8e039",
    color: "from-[#3b2b1d] to-[#1c150e] border-amber-500/20 hover:border-amber-500/50 shadow-amber-500/5 hover:shadow-amber-500/10",
    logo: "https://cdn.simpleicons.org/microsoft/F25022"
  },
  {
    title: "HTML, CSS, and Generative AI: Speed Up Your Process",
    issuer: "LinkedIn",
    year: "2026",
    credentialId: "47595de874c194ed924727e1132c6b47a79ee957631dcd92724ca8c55139aba8",
    description: "Focuses on leveraging generative AI tools to accelerate web design workflows, write cleaner HTML5/CSS3 layouts, optimize DOM styling, and automate styling generation.",
    skills: ["HTML5 & CSS3", "Generative AI", "Rapid Prototyping", "Web Design", "Workflow Automation"],
    verificationUrl: "https://www.linkedin.com/learning/certificates/47595de874c194ed924727e1132c6b47a79ee957631dcd92724ca8c55139aba8",
    color: "from-[#1d2d3c] to-[#0e171f] border-sky-500/20 hover:border-sky-500/50 shadow-sky-500/5 hover:shadow-sky-500/10",
    logo: "https://cdn.simpleicons.org/linkedin/0A66C2"
  },
  {
    title: "Further Mathematics for Year 13 (Calculus & Matrices)",
    issuer: "edX / Imperial College",
    year: "2026",
    credentialId: "ccd9b21dbcb64ca580d41abb7ed5e485",
    description: "Validates advanced mathematical foundations covering differential equations, complex numbers, curve sketching, matrix algebra, vector cross products, and advanced integration techniques.",
    skills: ["Advanced Matrices", "Complex Numbers", "Differential Equations", "Further Integration", "Vector Products"],
    verificationUrl: "https://courses.edx.org/certificates/ccd9b21dbcb64ca580d41abb7ed5e485",
    color: "from-[#1c2a38] to-[#0e151e] border-blue-500/20 hover:border-blue-500/50 shadow-blue-500/5 hover:shadow-blue-500/10",
    logo: "https://cdn.simpleicons.org/edx/white"
  }
];

const CertificationsSection = () => {
  return (
    <section id="certifications" className="section-spacing border-t border-border">
      <div className="section-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <motion.p
              className="section-label mb-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
            >
              Credentials
            </motion.p>
            <motion.h2
              className="text-2xl md:text-3xl font-normal font-editorial tracking-[-0.02em] text-foreground"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 }}
            >
              Professional Certifications
            </motion.h2>
          </div>
          <motion.div
            className="flex items-center gap-2 font-mono text-[12px] text-muted-foreground/80"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Sparkles size={14} className="text-primary animate-pulse" />
            <span>Verified Credentials</span>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, i) => (
            <motion.div
              key={cert.title}
              className={`relative overflow-hidden rounded-xl border bg-gradient-to-b ${cert.color} transition-all duration-300 p-6 flex flex-col justify-between group shadow-lg hover:-translate-y-1`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              {/* Pulsing Status Dot */}
              <div className="absolute top-5 right-5 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="font-mono text-[9px] tracking-wider text-primary uppercase font-medium">Active</span>
              </div>

              <div>
                {/* Header Info */}
                <div className="flex items-start gap-3 mb-5">
                  <div className="w-9 h-9 rounded-lg bg-zinc-950/80 border border-border/60 p-1.5 flex items-center justify-center shrink-0 mt-0.5">
                    {cert.logo === "atom" ? (
                      <Atom className="w-full h-full text-purple-400 p-0.5" />
                    ) : (
                      <img 
                        src={cert.logo} 
                        alt={cert.issuer} 
                        className="w-full h-full object-contain" 
                      />
                    )}
                  </div>
                  <div className="pr-8">
                    <span className="font-mono text-[10px] text-primary/80 uppercase tracking-wider font-semibold">
                      {cert.issuer}
                    </span>
                    <h3 className="text-[15px] font-bold tracking-tight text-foreground mt-0.5 leading-snug group-hover:text-primary transition-colors duration-200">
                      {cert.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[13px] text-muted-foreground leading-[1.6] mb-5 font-light">
                  {cert.description}
                </p>

                {/* Skills/Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {cert.skills.map((skill) => (
                    <span 
                      key={skill}
                      className="font-mono text-[10px] px-2 py-0.5 rounded bg-zinc-950/60 text-foreground/80 border border-border/40 hover:border-primary/20 hover:text-primary transition-colors duration-150 cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom section with ID and Action */}
              <div className="flex items-center justify-between pt-3 border-t border-border/20 mt-auto">
                <div className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground/60 max-w-[55%] overflow-hidden">
                  <ShieldCheck size={12} className="text-primary/70 shrink-0" />
                  <span className="truncate" title={cert.credentialId}>ID: {cert.credentialId.slice(0, 10)}{cert.credentialId.length > 10 ? "..." : ""}</span>
                </div>
                {cert.verificationUrl ? (
                  <a
                    href={cert.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-[11px] text-primary hover:text-primary/80 transition-colors duration-150 font-medium shrink-0"
                  >
                    <span>Verify</span>
                    <ExternalLink size={11} />
                  </a>
                ) : (
                  <span className="font-mono text-[10px] text-muted-foreground/40 italic">
                    Self-Verified
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;
