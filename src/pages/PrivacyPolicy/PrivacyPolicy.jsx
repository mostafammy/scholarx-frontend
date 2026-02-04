/**
 * Privacy Policy Page
 * Main page component displaying privacy policy with table of contents
 * Following SOLID principles with modular, reusable components
 */

import React, { memo } from "react";
import { HeroSection, TableOfContents, PolicySection } from "./components";
import {
  PRIVACY_HERO,
  TABLE_OF_CONTENTS,
  PRIVACY_SECTIONS,
  ANIMATION_TIMINGS,
} from "./constants";
import styles from "./PrivacyPolicy.module.css";

const PrivacyPolicy = memo(function PrivacyPolicy() {
  return (
    <main className={styles.page}>
      {/* Hero Section */}
      <HeroSection
        label={PRIVACY_HERO.label}
        title={PRIVACY_HERO.title}
        subtitle={PRIVACY_HERO.subtitle}
        lastUpdated={PRIVACY_HERO.lastUpdated}
        description={PRIVACY_HERO.description}
      />

      {/* Main Content Area */}
      <div className={styles.container}>
        {/* Sidebar with Table of Contents */}
        <aside className={styles.sidebar}>
          <TableOfContents
            items={TABLE_OF_CONTENTS}
            offsetTop={ANIMATION_TIMINGS.tocHighlightOffset}
          />
        </aside>

        {/* Policy Sections */}
        <div className={styles.content}>
          {PRIVACY_SECTIONS.map((section, index) => (
            <PolicySection
              key={section.id}
              id={section.id}
              icon={section.icon}
              title={section.title}
              content={section.content}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Background Decorations */}
      <div className={styles.backgroundDecor}>
        <div className={styles.gradientOrb1}></div>
        <div className={styles.gradientOrb2}></div>
      </div>
    </main>
  );
});

export default PrivacyPolicy;
