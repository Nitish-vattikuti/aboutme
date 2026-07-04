import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const focusAreas = [
  "Internal knowledge systems",
  "Document intelligence",
  "Workflow automation",
  "Decision-support products",
  "AI-first MVPs",
];

const availableFor = [
  "Startup collaborations",
  "Founding product-engineer roles",
  "MVP sprint builds",
  "Early technical consulting",
];

const CollabSection = () => {
  return (
    <section id="collab" className="section-spacing border-t border-border">
      <div className="section-container">
        <motion.p
          className="section-label mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          Working with founders
        </motion.p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <h2 className="text-xl md:text-2xl font-semibold tracking-[-0.02em] text-foreground mb-4">
              I help early-stage teams prototype and deploy reliable AI workflow systems quickly.
            </h2>
            
            <div className="mt-8 space-y-6">
              <div>
                <p className="text-[13px] font-medium text-foreground mb-3 font-mono uppercase tracking-wider">Focus Areas</p>
                <ul className="space-y-2 text-[14px] text-muted-foreground leading-[1.65]">
                  {focusAreas.map((text, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary mt-1">
                        <CheckCircle2 size={14} />
                      </span>
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="card-surface p-6 md:p-8"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <p className="text-[13px] font-medium text-foreground mb-4 font-mono uppercase tracking-wider text-primary">Available For:</p>
            <ul className="space-y-3 text-[14px] text-muted-foreground">
              {availableFor.map((text, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                  <span className="font-medium text-foreground">{text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CollabSection;
