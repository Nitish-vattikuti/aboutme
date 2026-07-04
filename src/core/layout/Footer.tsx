import { Github, Linkedin } from "lucide-react";
import { motion } from "framer-motion";

const socialLinks = [
  { icon: Github, href: "https://github.com/Nitish-vattikuti", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/nitish-vattikuti-6bba85280", label: "LinkedIn" },
];

const Footer = () => {
  return (
    <motion.footer
      className="border-t border-border py-10"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <div className="section-container flex items-center justify-between">
        <p className="font-mono text-[13px] text-muted-foreground">
          © {new Date().getFullYear()} Nitish Vattikuti
        </p>
        <div className="flex items-center gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground/60 hover:text-foreground transition-colors duration-150"
              aria-label={link.label}
            >
              <link.icon size={18} />
            </a>
          ))}
        </div>
        <p className="font-mono text-[13px] text-muted-foreground hidden sm:block">
          developed by nitish
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;
