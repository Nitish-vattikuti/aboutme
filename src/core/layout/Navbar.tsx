import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { User, FolderOpen, Layers, Mail, Compass, Wrench, Briefcase } from "lucide-react";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "about", href: "#about", icon: User },
  { label: "experience", href: "#experience", icon: Briefcase },
  { label: "approach", href: "#approach", icon: Compass },
  { label: "projects", href: "#projects", icon: FolderOpen },
  { label: "stack", href: "#stack", icon: Layers },
  { label: "services", href: "#services", icon: Wrench },
  { label: "contact", href: "#contact", icon: Mail },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const updateActiveSection = useCallback(() => {
    const sections = navLinks.map((l) => l.href.slice(1));
    let current = "";
    for (const id of sections) {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 100) current = id;
      }
    }
    setActiveSection(current);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      updateActiveSection();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    updateActiveSection();
    return () => window.removeEventListener("scroll", onScroll);
  }, [updateActiveSection]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled || mobileOpen
            ? "bg-background/40 backdrop-blur-xl border-b border-border/50"
            : "bg-transparent"
        )}
      >
        <div className="section-container flex items-center justify-between h-14">
          {/* Logo */}
          <a
            href="#"
            className="font-mono text-[15px] font-medium text-white hover:text-primary transition-colors duration-150"
          >
            nitish
          </a>

          {/* Desktop: Apple Glass Nav (Pill Shape) */}
          <div className="hidden md:flex items-center">
            <nav className="flex p-1 gap-1 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl ring-1 ring-white/5">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.slice(1);
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative px-4 py-1.5 font-mono text-[13px] font-medium transition-colors duration-300",
                      isActive ? "text-white" : "text-white/60 hover:text-white"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="glass-active"
                        className="absolute inset-0 bg-white/15 shadow-sm rounded-full border border-white/10"
                        transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Mobile buttons */}
          <div className="flex md:hidden items-center gap-1">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-1 rounded-md text-white hover:text-primary transition-colors duration-150"
              aria-label="Toggle menu"
            >
              <MenuToggleIcon open={mobileOpen} className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed top-14 left-0 right-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border md:hidden"
          >
            <div className="section-container py-4 flex flex-col gap-0.5">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.slice(1);
                const Icon = link.icon;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 font-mono text-sm px-3 py-2.5 rounded-md transition-colors duration-150",
                      isActive
                        ? "text-foreground bg-secondary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon size={15} />
                    {link.label}
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
