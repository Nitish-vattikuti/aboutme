import { Radio } from "lucide-react";
import { motion } from "framer-motion";

const NowSection = () => {
  return (
    <section id="now" className="section-spacing border-t border-border">
      <div className="section-container">
        <motion.p
          className="section-label mb-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          Now
        </motion.p>
        <motion.h2
          className="text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-foreground mb-10"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          Currently Working On
        </motion.h2>

        <motion.div
          className="card-surface p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-start gap-4">
            <div className="mt-1 flex-shrink-0">
              <div className="relative">
                <Radio size={18} className="text-primary" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-[15px] font-medium text-foreground">
                Research-Aware Outreach Engine
              </h3>
              <p className="text-[14px] text-muted-foreground leading-[1.7]">
                Building an AI pipeline that reads published research papers, detects instrumentation bottlenecks and unmet experimental needs, maps them to relevant product offerings, and generates highly contextual outbound outreach for scientific equipment distributors.
                <br /><br />
                Designed to replace generic cold outreach with evidence-grounded, research-specific communication that improves reply quality and sales relevance.
               </p>
              <motion.div
                className="flex items-center gap-2 pt-1"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  in progress
                </span>
                <span className="font-mono text-[10px] text-muted-foreground/50">
                  updated recently
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NowSection;
