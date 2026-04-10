/**
 * @fileoverview HostingPartnersSection — Minimalist Logo Grid with Aceternity UI-style Spotlight.
 */

import React, { useRef, useCallback } from "react";
import { motion } from "framer-motion";

const HOSTING_PARTNERS_GRID = [
  {
    id: "kelloggs",
    name: "Kellogg's",
    desc: "A global leader in cereal and snack production, supporting youth and community growth.",
    logoSrc: "/kelloggs-logo.png",
    color: "#D31245",
  },
  {
    id: "msc-nu",
    name: "Microsoft Students Club - NU",
    desc: "Empowering students at Nile University through technology, innovation, and community-driven learning.",
    logoSrc: "/microsoft-students-club-nile-university.png",
    color: "#00A4EF",
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * useSpotlight hook (Principal Engineer Pattern)
 * Uses requestAnimationFrame to throttle 1000Hz+ mouse events, saving CPU cycles.
 */
const useSpotlight = (ref) => {
  const rafRef = useRef(null);
  
  const onMouseMove = useCallback((e) => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      if (!ref.current) {
        rafRef.current = null;
        return;
      }
      const rect = ref.current.getBoundingClientRect();
      ref.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      ref.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      rafRef.current = null;
    });
  }, [ref]);
  
  return { onMouseMove };
};

const SpotlightCard = ({ partner }) => {
  const cardRef = useRef(null);
  const { onMouseMove } = useSpotlight(cardRef);

  return (
    <motion.article
      ref={cardRef}
      className={`summit-spotlight-card`}
      onMouseMove={onMouseMove}
      variants={cardVariants}
      aria-label={partner.name}
    >
      <div className="summit-spotlight-glow" />
      
      <div className="summit-spotlight-content">
        <div className="summit-spotlight-logo-wrap">
          <img
            src={partner.logoSrc}
            alt={`${partner.name} logo`}
            className={`summit-spotlight-logo`}
            loading="lazy"
            decoding="async"
          />
        </div>
        
        {/* Hover Reveal Content */}
        <div className="summit-spotlight-hover-reveal">
          <h3 className="summit-spotlight-name" style={{ color: partner.color }}>
            {partner.name}
          </h3>
          <p className="summit-spotlight-desc">{partner.desc}</p>
        </div>
      </div>
    </motion.article>
  );
};

const HostingPartnersSection = () => (
  <section
    id="summit-hosting-partners"
    className="summit-section summit-partners"
    aria-labelledby="hosting-partners-heading"
  >
    <div className="summit-container">
      <div className="summit-section-header">
        <div className="summit-badge" aria-hidden="true">
          🏢 Hosting Partners
        </div>
        <h2 id="hosting-partners-heading" className="summit-section-title">
          Hosting Partners
        </h2>
        <p className="summit-section-subtitle">✨</p>
      </div>

      <motion.div
        className="summit-spotlights-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {HOSTING_PARTNERS_GRID.map((partner) => (
          <SpotlightCard key={partner.id} partner={partner} />
        ))}
      </motion.div>
    </div>
  </section>
);

export default React.memo(HostingPartnersSection);
