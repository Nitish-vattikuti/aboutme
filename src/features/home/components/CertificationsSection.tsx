import { motion } from "framer-motion";
import { ShieldCheck, ExternalLink, Award, Sparkles } from "lucide-react";
import servicenowIcon from "@/assets/servicenow.png";

interface Certification {
  title: string;
  issuer: string;
  year: string;
  credentialId: string;
  description: string;
  skills: string[];
  verificationUrl: string;
  color: string;
}

const certifications: Certification[] = [
  {
    title: "ServiceNow Certified Application Developer (CAD)",
    issuer: "ServiceNow",
    year: "2026",
    credentialId: "CAD-2026-ACTIVE",
    description: "Validates advanced skills in designing, scripting, configuring, and deploying scoped custom applications on the ServiceNow PaaS. Demonstrates mastery of both client and server-side scripting APIs, UI customizations, Script Includes, and IntegrationHub configurations.",
    skills: ["Scoped Architecture", "Client & Server Scripting", "Glide System APIs", "UI Actions & Policies", "IntegrationHub Spokes"],
    verificationUrl: "https://drive.google.com/file/d/1YWxkSYy0Uc1yHMIZVNFOItWxh7xBzqnR/view?usp=sharing",
    color: "from-[#293e40] to-[#121c1d] border-primary/20 hover:border-primary/50 shadow-primary/5 hover:shadow-primary/10"
  },
  {
    title: "ServiceNow Certified System Administrator (CSA)",
    issuer: "ServiceNow",
    year: "2026",
    credentialId: "CSA-2026-ACTIVE",
    description: "Proves comprehensive knowledge of ServiceNow system configuration, user administration, database management, and platform security. Validates expertise in configuring business rules, UI policies, list layouts, and flow designers for IT Service Management (ITSM).",
    skills: ["System Administration", "Flow Designer", "Database & Security (ACLs)", "User & Role Configuration", "ITSM Workflows"],
    verificationUrl: "https://drive.google.com/file/d/1YWxkSYy0Uc1yHMIZVNFOItWxh7xBzqnR/view?usp=sharing",
    color: "from-[#203a3d] to-[#0f1d1e] border-[#3b7b80]/20 hover:border-[#3b7b80]/50 shadow-[#3b7b80]/5 hover:shadow-[#3b7b80]/10"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {certifications.map((cert, i) => (
            <motion.div
              key={cert.title}
              className={`relative overflow-hidden rounded-xl border bg-gradient-to-b ${cert.color} transition-all duration-300 p-6 md:p-8 flex flex-col justify-between group shadow-lg hover:-translate-y-1`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              {/* Pulsing Status Dot */}
              <div className="absolute top-6 right-6 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="font-mono text-[10px] tracking-wider text-primary uppercase font-medium">Active</span>
              </div>

              <div>
                {/* Header Info */}
                <div className="flex items-center gap-3.5 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-zinc-950/80 border border-border/60 p-1.5 flex items-center justify-center shrink-0">
                    <img 
                      src={servicenowIcon} 
                      alt="ServiceNow" 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                  <div>
                    <span className="font-mono text-[11px] text-primary/80 uppercase tracking-wider font-semibold">
                      {cert.issuer} Certification
                    </span>
                    <h3 className="text-lg md:text-xl font-bold tracking-tight text-foreground mt-0.5 leading-snug group-hover:text-primary transition-colors duration-200">
                      {cert.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[14px] text-muted-foreground leading-[1.65] mb-6 font-light">
                  {cert.description}
                </p>

                {/* Skills/Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {cert.skills.map((skill) => (
                    <span 
                      key={skill}
                      className="font-mono text-[11px] px-2.5 py-1 rounded bg-zinc-950/60 text-foreground/90 border border-border/40 hover:border-primary/20 hover:text-primary transition-colors duration-150 cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom section with ID and Action */}
              <div className="flex items-center justify-between pt-4 border-t border-border/20 mt-auto">
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground/60">
                  <ShieldCheck size={13} className="text-primary/70" />
                  <span>ID: {cert.credentialId}</span>
                </div>
                <a
                  href={cert.verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-[12px] text-primary hover:text-primary/80 transition-colors duration-150 font-medium"
                >
                  <span>Verify credential</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;
