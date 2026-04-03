"use client";

import { useScroll, useSpring, motion } from "framer-motion";

import AboutHeroSection from "@/components/about/HeroSection";
import MissionSection from "@/components/about/MissionSection";
import WhyChooseUsSection from "@/components/about/WhyChooseUsSection";
import TeamSection from "@/components/about/TeamSection";
import GlobalPresenceSection from "@/components/about/GlobalPresenceSection";
import CtaSection from "@/components/about/CtaSection";

export default function AboutClient() {
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
        style={{ scaleX }}
      />

      <AboutHeroSection />
      <MissionSection />
      <WhyChooseUsSection />
      <TeamSection />
      <GlobalPresenceSection />
      <CtaSection />
    </>
  );
}
