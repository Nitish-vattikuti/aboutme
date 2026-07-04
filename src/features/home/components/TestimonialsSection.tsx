import { motion } from "framer-motion";

const values = [
  "Reliable AI systems",
  "Evaluation-driven development",
  "Retrieval over hallucination",
  "Shipping systems that run outside notebooks",
];

const TestimonialsSection = () => {
  return (
    <section id="values" className="section-spacing border-t border-border">
      <div className="section-container">
        <motion.p
          className="section-label mb-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          Principles
        </motion.p>
        <motion.h2
          className="text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-foreground mb-10"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          What I Care About
        </motion.h2>

        <div className="space-y-3">
          {values.map((v, i) => (
            <motion.div
              key={v}
              className="card-surface px-5 py-4 flex items-center gap-3"
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              <span className="text-[14px] text-foreground font-medium">
                {v}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
