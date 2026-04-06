/**
 * @fileoverview StatusPickerCard — Apple-caliber interactive card selector
 * for the "What best describes you?" field. Replaces the native <select>.
 * Single Responsibility: ONLY handles the visual card grid and selection state.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

/** @type {readonly { value: string, label: string, icon: string, description: string, accent: string }[]} */
const STATUS_CARDS = Object.freeze([
  {
    value: 'highSchool',
    label: 'High School',
    icon: '🏫',
    description: 'Current school student',
    accent: '#69f0ae',
  },
  {
    value: 'undergraduate',
    label: 'Undergraduate',
    icon: '🎓',
    description: 'Studying at university',
    accent: '#4fc3f7',
  },
  {
    value: 'graduate',
    label: 'Graduate',
    icon: '📜',
    description: 'Completed my degree',
    accent: '#f5c518',
  },
  {
    value: 'professional',
    label: 'Professional',
    icon: '💼',
    description: 'Working in industry',
    accent: '#ff9f1c',
  },
  {
    value: 'other',
    label: 'Other',
    icon: '✨',
    description: 'Something different',
    accent: '#a55eea',
  },
]);

const cardItemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] },
  }),
};

/**
 * @param {{
 *   value: string,
 *   onChange: (val: string) => void,
 *   error?: object,
 * }} props
 */
const StatusPickerCard = ({ value: selectedValue, onChange, error }) => {
  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '10px',
        }}
        role="radiogroup"
        aria-label="What best describes you?"
        aria-required="true"
      >
        {STATUS_CARDS.map((card, i) => {
          const isSelected = selectedValue === card.value;

          return (
            <motion.button
              key={card.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              custom={i}
              variants={cardItemVariants}
              initial="hidden"
              animate="visible"
              onClick={() => onChange(card.value)}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.97 }}
              className="summit-status-card"
              style={{
                '--accent': card.accent,
                borderColor: isSelected ? card.accent : undefined,
                background: isSelected
                  ? `radial-gradient(ellipse at top, ${card.accent}14, transparent 70%), rgba(255,255,255,0.03)`
                  : undefined,
                boxShadow: isSelected
                  ? `0 0 0 1px ${card.accent}60, 0 8px 24px ${card.accent}18`
                  : undefined,
              }}
            >
              {/* Selection ring indicator */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    key="ring"
                    className="summit-status-card__ring"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    style={{ background: card.accent }}
                  />
                )}
              </AnimatePresence>

              <motion.span
                className="summit-status-card__icon"
                animate={{ scale: isSelected ? 1.15 : 1 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  filter: isSelected
                    ? `drop-shadow(0 0 8px ${card.accent}80)`
                    : undefined,
                }}
              >
                {card.icon}
              </motion.span>

              <span
                className="summit-status-card__label"
                style={{ color: isSelected ? card.accent : undefined }}
              >
                {card.label}
              </span>

              <span className="summit-status-card__desc">
                {card.description}
              </span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="summit-form-error"
            role="alert"
          >
            ⚠ {error.message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

StatusPickerCard.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.object,
};

export default React.memo(StatusPickerCard);
