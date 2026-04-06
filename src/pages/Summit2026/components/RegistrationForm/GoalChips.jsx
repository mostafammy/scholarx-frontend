/**
 * @fileoverview GoalChips — Animated chip/pill toggle system for multi-select goals.
 * Replaces plain HTML checkboxes with premium interactive chips.
 * Single Responsibility: visual selection UX only.
 */

import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

/** @type {readonly { value: string, label: string, icon: string }[]} */
const GOAL_OPTIONS = Object.freeze([
  { value: 'find-scholarship', label: 'Find a Scholarship', icon: '🎓' },
  { value: 'develop-skills', label: 'Develop My Skills', icon: '⚡' },
  { value: 'build-network', label: 'Build My Network', icon: '🤝' },
  { value: 'career-growth', label: 'Accelerate My Career', icon: '🚀' },
  { value: 'meet-experts', label: 'Meet Industry Experts', icon: '💡' },
  { value: 'other', label: 'Something Else', icon: '✨' },
]);

const chipVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 10 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] },
  }),
};

const checkmarkPath = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
};

/**
 * @param {{
 *   value: string[],
 *   onChange: (val: string[]) => void,
 *   error?: object,
 * }} props
 */
const GoalChips = ({ value: selected = [], onChange, error }) => {
  const toggle = useCallback((chipValue) => {
    const next = selected.includes(chipValue)
      ? selected.filter((v) => v !== chipValue)
      : [...selected, chipValue];
    onChange(next);
  }, [selected, onChange]);

  return (
    <div>
      <motion.div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
        }}
        role="group"
        aria-label="Your goals for attending"
        initial="hidden"
        animate="visible"
      >
        {GOAL_OPTIONS.map((goal, i) => {
          const isSelected = selected.includes(goal.value);

          return (
            <motion.button
              key={goal.value}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              custom={i}
              variants={chipVariants}
              onClick={() => toggle(goal.value)}
              whileHover={{ y: -2, transition: { duration: 0.15 } }}
              whileTap={{ scale: 0.95 }}
              className="summit-goal-chip"
              style={{
                borderColor: isSelected ? 'rgba(245,197,24,0.6)' : undefined,
                background: isSelected
                  ? 'linear-gradient(135deg, rgba(245,197,24,0.15), rgba(255,159,28,0.08))'
                  : undefined,
                color: isSelected ? '#f5c518' : undefined,
                boxShadow: isSelected
                  ? '0 0 0 1px rgba(245,197,24,0.3), 0 4px 16px rgba(245,197,24,0.12)'
                  : undefined,
              }}
            >
              {/* Animated SVG checkmark */}
              <span className="summit-goal-chip__check" aria-hidden="true">
                <AnimatePresence mode="wait">
                  {isSelected ? (
                    <motion.svg
                      key="check"
                      viewBox="0 0 16 16"
                      width="14"
                      height="14"
                      fill="none"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <motion.path
                        d="M3 8l3.5 3.5L13 4"
                        stroke="#f5c518"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        variants={checkmarkPath}
                        initial="hidden"
                        animate="visible"
                      />
                    </motion.svg>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="summit-goal-chip__empty-dot"
                    />
                  )}
                </AnimatePresence>
              </span>

              <span className="summit-goal-chip__icon">{goal.icon}</span>
              <span className="summit-goal-chip__label">{goal.label}</span>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Selection count feedback */}
      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              marginTop: '10px',
              fontSize: '0.78rem',
              color: 'rgba(245,197,24,0.7)',
              fontWeight: 600,
            }}
          >
            {selected.length} goal{selected.length !== 1 ? 's' : ''} selected ✓
          </motion.div>
        )}
      </AnimatePresence>

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

GoalChips.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  error: PropTypes.object,
};

export default React.memo(GoalChips);
