/**
 * @fileoverview SummitPage — Root page for the Next Scholar Summit 2026 event.
 * Acts as a composition root: imports and arranges all section components.
 * Scroll-to-form ref is passed down to HeroSection CTA (Dependency Injection).
 */

import React, { useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import HeroSection         from './components/HeroSection/HeroSection';
import JourneySection      from './components/JourneySection/JourneySection';
import RoundtableSection   from './components/RoundtableSection/RoundtableSection';
import StatsBar            from './components/StatsBar/StatsBar';
import TracksSection       from './components/TracksSection/TracksSection';
import PartnersSection     from './components/PartnersSection/PartnersSection';
import RegistrationForm    from './components/RegistrationForm/RegistrationForm';
import SummitFooter        from './components/SummitFooter/SummitFooter';
import { EVENT_META }      from './constants/eventData';
import './SummitPage.css';

/**
 * SEO description for the summit page.
 * @type {string}
 */
const SEO_DESCRIPTION =
  'Register for Next Scholar Summit 2026 — Egypt\'s largest gathering for global education and career excellence. May 1st, 2026 at Nile University, Giza. 1200+ attendees, 70+ speakers, 16 workshops. Organized by ScholarX & EU Jeel Connect.';

const SummitPage = () => {
  const registrationRef = useRef(null);

  const scrollToRegistration = useCallback(() => {
    registrationRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, []);

  return (
    <>
      {/* SEO */}
      <Helmet>
        <title>{EVENT_META.name} | {EVENT_META.tagline}</title>
        <meta name="description" content={SEO_DESCRIPTION} />
        <meta property="og:title" content={EVENT_META.name} />
        <meta property="og:description" content={SEO_DESCRIPTION} />
        <meta property="og:type" content="event" />
        <meta name="theme-color" content="#050911" />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </Helmet>

      <main className="summit-page" id="summit-main">
        {/* 1. Hero — full-screen cinematic */}
        <HeroSection onRegisterClick={scrollToRegistration} />

        {/* 2. Journey — 10 governorates */}
        <JourneySection />

        {/* 3. Roundtable — pre-summit exclusive */}
        <RoundtableSection />

        {/* 4. Stats — animated counters */}
        <StatsBar />

        {/* 5. Tracks — strategic pillars */}
        <TracksSection />

        {/* 6. Partners — ScholarX × EU Jeel Connect */}
        <PartnersSection />

        {/* 7. Registration — 3-step form (ref for scroll-to) */}
        <div ref={registrationRef}>
          <RegistrationForm />
        </div>

        {/* 8. Footer */}
        <SummitFooter />
      </main>
    </>
  );
};

export default SummitPage;
