import Navbar from "@/core/layout/Navbar";
import HeroSection from "@/features/home/components/HeroSection";

import AboutSection from "@/features/home/components/AboutSection";
import ExperienceSection from "@/features/home/components/ExperienceSection";
import EngineeringApproachSection from "@/features/home/components/EngineeringApproachSection";
import ProjectsSection from "@/features/home/components/ProjectsSection";
import TechStackSection from "@/features/home/components/TechStackSection";

import ServicesSection from "@/features/home/components/ServicesSection";
import ContactSection from "@/features/home/components/ContactSection";
import Footer from "@/core/layout/Footer";
import ScrollReveal from "@/components/shared/ScrollReveal";
import ScrollToTop from "@/components/shared/ScrollToTop";
import MouseGlow from "@/components/shared/MouseGlow";
import AIChatBot from "@/features/ai-chat/components/AIChatBot";

const Index = () => {
  return (
    <div className="min-h-screen text-foreground grid-bg relative">
      <MouseGlow />
      <AIChatBot />
      <ScrollToTop />
      <Navbar />
      <HeroSection />

      <ScrollReveal>
        <AboutSection />
      </ScrollReveal>
      <ScrollReveal>
        <ExperienceSection />
      </ScrollReveal>
      <ScrollReveal>
        <EngineeringApproachSection />
      </ScrollReveal>
      <ScrollReveal>
        <ProjectsSection />
      </ScrollReveal>
      <ScrollReveal>
        <TechStackSection />
      </ScrollReveal>

      <ScrollReveal>
        <ServicesSection />
      </ScrollReveal>
      <ScrollReveal>
        <ContactSection />
      </ScrollReveal>
      <ScrollReveal>
        <Footer />
      </ScrollReveal>
    </div>
  );
};

export default Index;
