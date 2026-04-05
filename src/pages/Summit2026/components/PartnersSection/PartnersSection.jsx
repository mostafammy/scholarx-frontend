/**
 * @fileoverview PartnersSection — ScholarX × EU Jeel Connect partnership showcase.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { SUMMIT_PARTNERS } from '../../constants/eventData';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

/** Partner logo icons — maps partner ID to visual */
const PARTNER_ICONS = { scholarx: '🎓', 'eu-jeel-connect': '🇪🇺' };

const PartnersSection = () => (
  <section
    id="summit-partners"
    className="summit-section summit-partners"
    aria-labelledby="partners-heading"
  >
    <div className="summit-container">
      <div className="summit-section-header">
        <div className="summit-badge" aria-hidden="true">🤝 Strategic Partnership</div>
        <h2 id="partners-heading" className="summit-section-title">
          Powered By Two Forces
        </h2>
        <p className="summit-section-subtitle">
          A collaboration that bridges national ambition and international excellence.
        </p>
      </div>

      <motion.div
        className="summit-partners-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {SUMMIT_PARTNERS.map((partner) => (
          <motion.article
            key={partner.id}
            className={`summit-glass-card summit-partner-card summit-partner-card--${partner.id}`}
            variants={cardVariants}
            aria-label={partner.name}
          >
            <div className="summit-partner-logo-area">
              <div
                className="summit-partner-logo-icon"
                style={{ background: `${partner.accentColor}18`, border: `1px solid ${partner.accentColor}30` }}
                aria-hidden="true"
              >
                {PARTNER_ICONS[partner.id]}
              </div>
              <div>
                <h3 className="summit-partner-name">{partner.name}</h3>
                <p className="summit-partner-tagline" style={{ color: partner.accentColor }}>
                  {partner.tagline}
                </p>
              </div>
            </div>
            <p className="summit-partner-desc">{partner.description}</p>
          </motion.article>
        ))}
      </motion.div>

      {/* Partnership statement */}
      <motion.div
        style={{
          textAlign: 'center', marginTop: 48,
          padding: '32px', borderRadius: 20,
          background: 'linear-gradient(135deg, rgba(245,197,24,0.06), rgba(0,61,165,0.06))',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <p style={{ color: 'var(--s-text-300)', fontSize: '1rem', lineHeight: 1.8, maxWidth: 640, margin: '0 auto' }}>
          This partnership ensures a{' '}
          <strong style={{ color: 'var(--s-gold-400)' }}>high-level exchange of expertise</strong> and{' '}
          <strong style={{ color: 'var(--s-blue-400)' }}>direct access to international networks</strong>{' '}
          — connecting Egyptian youth to the European Union and beyond.
        </p>
      </motion.div>
    </div>
  </section>
);

export default React.memo(PartnersSection);
