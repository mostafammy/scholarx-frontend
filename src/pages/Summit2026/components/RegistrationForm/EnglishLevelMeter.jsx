/**
 * @fileoverview EnglishLevelMeter — Visual 5-step level selector with animated fill bar.
 * Replaces the native <select> for English level.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

const LEVELS = [
  { value: 'beginner',          label: 'Beginner',          bar: 1, color: '#ff6b6b' },
  { value: 'intermediate',      label: 'Intermediate',      bar: 2, color: '#ff9f1c' },
  { value: 'upper-intermediate',label: 'Upper-Int.',        bar: 3, color: '#f5c518' },
  { value: 'advanced',          label: 'Advanced',          bar: 4, color: '#69f0ae' },
  { value: 'fluent',            label: 'Fluent',            bar: 5, color: '#4fc3f7' },
];

const EnglishLevelMeter = ({ value, onChange, error }) => {
  const selectedIndex = LEVELS.findIndex((l) => l.value === value);
  const selected = selectedIndex >= 0 ? LEVELS[selectedIndex] : null;

  return (
    <div>
      {/* Level cards row */}
      <div className="summit-level-meter" role="radiogroup" aria-label="English proficiency level">
        {LEVELS.map((level, i) => {
          const isSelected = value === level.value;
          const isPast = selectedIndex >= 0 && i <= selectedIndex;

          return (
            <motion.button
              key={level.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(level.value)}
              whileHover={{ y: -3, transition: { duration: 0.15 } }}
              whileTap={{ scale: 0.96 }}
              className="summit-level-card"
              style={{
                borderColor: isPast ? `${level.color}60` : undefined,
                background: isSelected
                  ? `radial-gradient(ellipse at bottom, ${level.color}20, transparent 80%)`
                  : isPast
                  ? `rgba(255,255,255,0.02)`
                  : undefined,
              }}
            >
              {/* Bar segment at top */}
              <div className="summit-level-card__bars">
                {Array.from({ length: level.bar }).map((_, bi) => (
                  <motion.div
                    key={bi}
                    className="summit-level-card__bar"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: isPast ? 1 : 0.25 }}
                    transition={{ duration: 0.4, delay: bi * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      background: isPast ? level.color : 'rgba(255,255,255,0.12)',
                      boxShadow: isPast ? `0 0 8px ${level.color}50` : 'none',
                    }}
                  />
                ))}
              </div>

              <span
                className="summit-level-card__label"
                style={{ color: isSelected ? level.color : undefined }}
              >
                {level.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Current selection feedback strip */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key={selected.value}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="summit-level-feedback"
            style={{ '--level-color': selected.color }}
          >
            <span
              className="summit-level-feedback__dot"
              style={{ background: selected.color }}
            />
            <span style={{ color: selected.color, fontWeight: 700 }}>
              {selected.label}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
              — {selectedIndex + 1} of 5
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
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

EnglishLevelMeter.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.object,
};

export default React.memo(EnglishLevelMeter);
