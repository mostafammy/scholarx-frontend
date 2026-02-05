/**
 * Terms of Service Page
 * Main page component displaying terms of service with table of contents
 * Following SOLID principles with modular, reusable components
 */

import React, { memo } from "react";
import {
  HeroSection,
  TableOfContents,
  PolicySection,
} from "../PrivacyPolicy/components";
import {
  TOS_HERO,
  TABLE_OF_CONTENTS,
  TOS_SECTIONS,
  ANIMATION_TIMINGS,
} from "./constants";
import styles from "./TermsOfService.module.css";

const TermsOfService = memo(function TermsOfService() {
  return (
    <main className={styles.page}>
      {/* Hero Section */}
      <HeroSection
        label={TOS_HERO.label}
        title={TOS_HERO.title}
        subtitle={TOS_HERO.subtitle}
        lastUpdated={TOS_HERO.lastUpdated}
        description={TOS_HERO.description}
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

        {/* Terms Sections */}
        <div className={styles.content}>
          {TOS_SECTIONS.map((section, index) => (
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

export default TermsOfService;
