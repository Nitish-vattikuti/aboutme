import { motion } from "framer-motion";

const principles = [
  { label: "Systems over demos", detail: "Production reliability matters more than impressive prototypes" },
  { label: "Evaluation before scaling", detail: "Measure what works before building more of it" },
  { label: "Retrieval before prompting", detail: "Better context beats better prompts every time" },
  { label: "Observability for every AI system", detail: "If you can't monitor it, you can't trust it" },
];

const EngineeringApproachSection = () => {
  return (
    <section id="approach" className="section-spacing border-t border-border">
      <div className="section-container">
        <motion.p
          className="section-label mb-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          Engineering Approach
        </motion.p>
        <motion.h2
          className="text-2xl md:text-3xl font-normal font-editorial tracking-[-0.02em] text-foreground mb-10"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          How I Think
        </motion.h2>

        <div className="border-t border-border mt-8">
          {principles.map((p, i) => (
            <motion.div
              key={p.label}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 py-8 border-b border-border/85 items-start group hover:bg-white/[0.01] px-4 transition-colors duration-200"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="md:col-span-1 font-mono text-[13px] text-primary/60 tracking-wider">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="md:col-span-4">
                <h4 className="text-[15px] font-medium text-foreground leading-snug group-hover:text-primary transition-colors duration-150">
                  {p.label}
                </h4>
              </div>
              <div className="md:col-span-7">
                <p className="text-[13px] text-muted-foreground leading-[1.6] font-light">
                  {p.detail}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EngineeringApproachSection;
