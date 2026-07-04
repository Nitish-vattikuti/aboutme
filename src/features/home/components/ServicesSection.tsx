import { Code, AppWindow, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface Service {
  title: string;
  description: string;
  tag: string;
  icon: any;
}

const services: Service[] = [
  {
    title: "Web Development",
    description: "Plan, create and code internet sites and web pages with modern, artful, and highly responsive user interfaces.",
    tag: "FRONTEND & BACKEND",
    icon: Code,
  },
  {
    title: "Software Development",
    description: "Provide technical software consultancy and development support for academic and final year engineering projects.",
    tag: "SYSTEMS & CONSULTANCY",
    icon: AppWindow,
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="section-spacing border-t border-border">
      <div className="section-container">
        <div className="flex items-end justify-between mb-12">
          <div>
            <motion.p
              className="section-label mb-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
            >
              Services
            </motion.p>
            <motion.h2
              className="text-2xl md:text-3xl font-normal font-editorial tracking-[-0.02em] text-foreground"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 }}
            >
              What I Offer
            </motion.h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {services.map((service, i) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={service.title}
                className="group flex flex-col transition-all duration-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] tracking-widest text-primary/70">
                    #{service.tag}
                  </span>
                  <IconComponent size={20} className="text-primary/60 group-hover:text-primary transition-colors duration-200" />
                </div>
                <div className="flex flex-col flex-1">
                  <h3 className="text-[16px] font-semibold text-foreground group-hover:text-primary transition-colors duration-150 mb-2 leading-snug">
                    {service.title}
                  </h3>
                  <p className="text-[14px] text-muted-foreground leading-[1.7] mb-4 flex-1 font-light">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-border/20">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-primary group-hover:gap-2.5 transition-all duration-200">
                      <ArrowRight size={12} />
                      Enquire about this
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
