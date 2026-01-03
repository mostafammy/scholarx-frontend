/**
 * About Page
 * Displays the organization's story, mission, founder's journey, impact, and vision
 * Refactored with SOLID principles, CSS Modules, and micro-animations
 */

import React from "react";
import {
  HeroSection,
  ContentRow,
  ImpactSection,
  VisionSection,
} from "./components";
import {
  HERO_SECTION,
  MISSION_SECTION,
  FOUNDER_INTRO,
  FOUNDER_JOURNEY,
  FOUNDER_VISION,
  IMPACT_SECTION,
  VISION_SECTION,
  ANIMATION_TIMINGS,
} from "./constants";
import styles from "./About.module.css";

const About = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.backgroundDecor}></div>
      <div className={styles.whiteArc}></div>

      <div className={styles.page}>
        {/* Hero Section with Gallery */}
        <HeroSection
          label={HERO_SECTION.label}
          title={HERO_SECTION.title}
          gallery={HERO_SECTION.gallery}
        />

        {/* Content Sections */}
        <div className={styles.contentSections}>
          {/* Mission Section */}
          <ContentRow
            label={MISSION_SECTION.label}
            title={MISSION_SECTION.title}
            content={MISSION_SECTION.content}
            image={MISSION_SECTION.image}
            delay={0}
          />

          {/* Founder Introduction - Reversed Layout */}
          <ContentRow
            label={FOUNDER_INTRO.label}
            title={FOUNDER_INTRO.title}
            content={FOUNDER_INTRO.content}
            image={FOUNDER_INTRO.image}
            reversed
            delay={ANIMATION_TIMINGS.stagger}
          />

          {/* Founder Journey - Normal Layout */}
          <ContentRow
            content={FOUNDER_JOURNEY.content}
            image={FOUNDER_JOURNEY.image}
            delay={ANIMATION_TIMINGS.stagger * 2}
          />

          {/* Founder Vision - Reversed Layout */}
          <ContentRow
            content={FOUNDER_VISION.content}
            image={FOUNDER_VISION.image}
            reversed
            delay={ANIMATION_TIMINGS.stagger * 3}
          />

          {/* Impact Section */}
          <ImpactSection
            title={IMPACT_SECTION.title}
            items={IMPACT_SECTION.items}
          />

          {/* Vision Section */}
          <VisionSection
            image={VISION_SECTION.image}
            text={VISION_SECTION.text}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(About);
