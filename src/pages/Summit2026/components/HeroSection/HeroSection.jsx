/**
 * @fileoverview HeroSection — Cinematic full-screen event hero.
 * Responsibilities: stars particle render, countdown display, CTA.
 * All business logic delegated to useCountdown hook.
 */

import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useCountdown } from '../../hooks/useCountdown';
import { EVENT_META } from '../../constants/eventData';

/* ── Star Particles ─────────────────────────────────────────────────────── */

/**
 * Pure CSS star field — generated once via useMemo, never re-renders.
 * @type {React.NamedExoticComponent}
 */
const StarField = React.memo(() => {
  const stars = useMemo(
    () =>
      Array.from({ length: 160 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.6 + 0.2,
        duration: `${(Math.random() * 4 + 2).toFixed(1)}s`,
        delay: `${(Math.random() * 6).toFixed(1)}s`,
      })),
    []
  );

  return (
    <div className="summit-stars-container" aria-hidden="true">
      {stars.map((s) => (
        <span
          key={s.id}
          className="summit-star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.opacity,
            animationDuration: s.duration,
            animationDelay: s.delay,
          }}
        />
      ))}
    </div>
  );
});
StarField.displayName = 'StarField';

/* ── Countdown Unit ─────────────────────────────────────────────────────── */

/**
 * Renders a single time unit (days, hours, etc.) in the countdown.
 * @type {React.NamedExoticComponent<{ value: number, label: string, showSeparator?: boolean }>}
 */
const CountdownUnit = React.memo(({ value, label, showSeparator = true }) => (
  <>
    <div className="summit-countdown-unit" role="timer" aria-label={`${value} ${label}`}>
      <span className="summit-countdown-value">
        {String(value).padStart(2, '0')}
      </span>
      <span className="summit-countdown-unit-label">{label}</span>
    </div>
    {showSeparator && (
      <span className="summit-countdown-separator" aria-hidden="true">:</span>
    )}
  </>
));
CountdownUnit.displayName = 'CountdownUnit';
CountdownUnit.propTypes = {
  value: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  showSeparator: PropTypes.bool,
};

/* ── Hero Section ───────────────────────────────────────────────────────── */

/**
 * @param {{ onRegisterClick: () => void }} props
 */
const HeroSection = ({ onRegisterClick }) => {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(EVENT_META.date);

  const handleRegister = useCallback(
    (e) => {
      e.preventDefault();
      onRegisterClick();
    },
    [onRegisterClick]
  );

  const handleLearnMore = useCallback((e) => {
    e.preventDefault();
    document.getElementById('summit-journey')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <section className="summit-hero" aria-label="Event Hero">
      <StarField />

      {/* Decorative glow orbs */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,197,24,0.07) 0%, transparent 65%)',
          bottom: -100, right: -80, pointerEvents: 'none',
        }}
      />

      <div className="summit-hero-content">
        {/* Organizer pill */}
        <div className="summit-hero-organizers" aria-label="Organized by">
          <div className="summit-hero-org-item">
            <div className="summit-hero-org-logo-wrapper">
              <img
                src="/ScholarX-Logo-Icon-White-Blue-BG_ScholarX.svg"
                alt="ScholarX logo"
                className="summit-hero-org-logo summit-hero-org-logo--scholarx"
                loading="eager"
                decoding="async"
              />
            </div>
            <span className="summit-hero-org-name">ScholarX</span>
          </div>
          <span className="summit-hero-organizers-dot" />
          <div className="summit-hero-org-item">
            <div className="summit-hero-org-logo-wrapper">
              <img
                src="/_Colored, Transparent bkgd- EUJC EUMB logos.png"
                alt="EU Jeel Connect and EU MedBridge logos"
                className="summit-hero-org-logo summit-hero-org-logo--eujc"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
        </div>

        {/* Main title */}
        <h1 className="summit-hero-title">
          {EVENT_META.name}
        </h1>

        {/* Tagline */}
        <p className="summit-hero-tagline" aria-label="Summit theme">
          Your compass to global opportunities: scholarships, future-ready skills, and limitless possibilities.
        </p>

        {/* Event meta */}
        <div className="summit-hero-meta" role="list" aria-label="Event details">
          <div className="summit-hero-meta-item" role="listitem">
            <span className="summit-hero-meta-icon" aria-hidden="true">📅</span>
            <span>May 1, 2026</span>
          </div>
          <div className="summit-hero-meta-item" role="listitem">
            <span className="summit-hero-meta-icon" aria-hidden="true">📍</span>
            <span>Nile University, Giza</span>
          </div>
        </div>

        {/* Countdown */}
        {!isExpired && (
          <div className="summit-countdown" role="timer" aria-live="polite" aria-label="Countdown to summit">
            <p className="summit-countdown-label">Time left until the most important event in your growth journey.</p>
            <CountdownUnit value={days}    label="Days"    />
            <CountdownUnit value={hours}   label="Hours"   />
            <CountdownUnit value={minutes} label="Minutes" />
            <CountdownUnit value={seconds} label="Seconds" showSeparator={false} />
          </div>
        )}

        {/* CTAs */}
        <div className="summit-hero-ctas">
          <a
            href="#registration"
            id="hero-register-btn"
            className="summit-hero-cta"
            onClick={handleRegister}
            aria-label="Register for the summit"
          >
            Register for Free Now
            <span aria-hidden="true">→</span>
          </a>
          <a
            href="#summit-journey"
            id="hero-learn-more-btn"
            className="summit-hero-cta-secondary"
            onClick={handleLearnMore}
            aria-label="Learn more about the summit"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
};

HeroSection.propTypes = {
  onRegisterClick: PropTypes.func.isRequired,
};

export default React.memo(HeroSection);
