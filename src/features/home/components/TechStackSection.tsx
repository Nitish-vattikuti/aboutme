import { lazy, Suspense } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import servicenowIcon from "@/assets/servicenow.png";

const TechGlobe = lazy(() => import("@/features/home/components/TechGlobe"));

interface StackItem {
  name: string;
  icon?: string;
  desc: string;
}

interface StackCategory {
  label: string;
  items: StackItem[];
}

const stack: StackCategory[] = [
  {
    label: "Programming Languages",
    items: [
      { name: "Python", icon: "python", desc: "General-purpose programming language used for ML, scripting, and simulation." },
      { name: "SQL", icon: "mysql", desc: "Structured query language for managing relational databases." },
      { name: "Java", icon: "java", desc: "Object-oriented language used for systems development." },
      { name: "C/C++", icon: "cplusplus", desc: "System-level languages used for efficiency and performance." },
      { name: "JavaScript", icon: "javascript", desc: "Web scripting language used to build interactive websites." },
    ],
  },
  {
    label: "Frameworks & Libraries",
    items: [
      { name: "NumPy", icon: "numpy", desc: "Scientific computing library for array processing in Python." },
      { name: "OpenCV", icon: "opencv", desc: "Open-source computer vision library for image and video processing." },
      { name: "TensorFlow.js", icon: "tensorflow", desc: "Machine learning library for training and running models in-browser." },
      { name: "Zustand", icon: "react", desc: "Lightweight state management library for React applications." },
      { name: "HTML5", icon: "html5", desc: "Standard markup language used to structure web content." },
      { name: "CSS3", icon: "css3", desc: "Style sheet language used to create responsive web layouts." },
    ],
  },
  {
    label: "Tools & Systems",
    items: [
      { name: "ServiceNow (CSA/CAD)", icon: servicenowIcon, desc: "Certified ServiceNow System Administrator & Application Developer (CSA/CAD)." },
      { name: "Docker", icon: "docker", desc: "Containerization platform to build, share, and run applications." },
      { name: "Linux", icon: "linux", desc: "Open-source Unix-like operating system." },
      { name: "Git", icon: "git", desc: "Distributed version control system for tracking source code changes." },
      { name: "GitHub", icon: "github", desc: "Cloud platform used for hosting code repositories and collaboration." },
      { name: "MySQL", icon: "mysql", desc: "Relational database management system." },
      { name: "PowerBI", icon: "powerbi", desc: "Business intelligence and data visualization platform." },
      { name: "Figma", icon: "figma", desc: "Collaborative interface design tool." },
    ],
  },
];
const TechIcon = ({ slug }: { slug: string }) => {
  const isUrl = slug.startsWith("http") || slug.startsWith("/") || slug.startsWith("data:");
  const isLobe = slug.startsWith("lobehub:");

  const getIconUrl = (s: string) => {
    if (isLobe) {
      return `https://unpkg.com/@lobehub/icons-static-svg@latest/icons/${s.split(":")[1]}.svg`;
    }
    if (s === "amazonwebservices" || s === "amazonaws") return "https://cdn.simpleicons.org/amazonaws/FF9900";
    return `https://cdn.simpleicons.org/${s}/currentColor`;
  };

  return (
    <img
      src={isUrl ? slug : getIconUrl(slug)}
      alt=""
      className={cn(
        "w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity duration-150",
        !isUrl && !isLobe && slug !== "amazonwebservices" && "dark:invert",
        isLobe && "dark:invert invert" 
      )}
      loading="lazy"
    />
  );
};

const LetterIcon = ({ name }: { name: string }) => {
  const initials = name.split(/[\s.]+/).map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-[3px] border border-border text-[7px] font-mono font-medium leading-none text-muted-foreground group-hover:text-foreground group-hover:border-muted-foreground/50 transition-colors duration-150 select-none">
      {initials}
    </span>
  );
};

const TechStackSection = () => {
  return (
    <TooltipProvider delayDuration={200}>
      <section id="stack" className="section-spacing border-t border-border">
        <div className="section-container">
          <p className="section-label mb-3">Tech Stack</p>
          <h2 className="text-2xl md:text-3xl font-normal font-editorial tracking-[-0.02em] text-foreground mb-12">
            Tools I Use
          </h2>
          {/* Mobile globe - above the list */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="block md:hidden mb-8"
          >
            <Suspense fallback={<div className="w-full h-[400px]" />}>
              <TechGlobe compact />
            </Suspense>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div className="grid gap-10">
              {stack.map((category, catIdx) => (
                <motion.div
                  key={category.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: catIdx * 0.08 }}
                >
                  <p className="text-[13px] font-medium text-foreground mb-3.5">{category.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {category.items.map((item, itemIdx) => (
                      <Tooltip key={item.name}>
                        <TooltipTrigger asChild>
                          <motion.span
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.25, delay: catIdx * 0.08 + itemIdx * 0.03 }}
                            className="group inline-flex items-center gap-2.5 font-mono text-[13px] px-4 py-2.5 rounded-md bg-card text-foreground border border-border hover:text-primary hover:border-primary/30 transition-all duration-150 cursor-default"
                          >
                            {item.icon ? <TechIcon slug={item.icon} /> : <LetterIcon name={item.name} />}
                            {item.name}
                          </motion.span>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[220px] text-xs">
                          {item.desc}
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
            {/* Desktop globe - side by side */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden md:block sticky top-24 -mt-32"
            >
              <Suspense fallback={<div className="w-full h-[750px]" />}>
                <TechGlobe />
              </Suspense>
            </motion.div>
          </div>
        </div>
      </section>
    </TooltipProvider>
  );
};

export default TechStackSection;
