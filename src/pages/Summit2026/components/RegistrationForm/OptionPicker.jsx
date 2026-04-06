/**
 * @fileoverview OptionPicker — Generic horizontal pill-tab selector for small option sets.
 * Used for: highSchoolYear, undergraduateYear.
 * OCP: fully data-driven, no hardcoded options.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

const OptionPicker = ({ options, value, onChange, error, name }) => {
  // Filter out the empty placeholder option (value === '')
  const items = options.filter((o) => o.value !== '');

  return (
    <div>
      <div
        className="summit-option-picker"
        role="radiogroup"
        aria-label={name}
      >
        {items.map((opt, i) => {
          const isSelected = value === opt.value;
          return (
            <motion.button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(opt.value)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              className="summit-option-pill"
              style={{
                borderColor:  isSelected ? 'rgba(245,197,24,0.7)' : undefined,
                background:   isSelected ? 'linear-gradient(135deg, rgba(245,197,24,0.18), rgba(255,159,28,0.08))' : undefined,
                color:        isSelected ? '#f5c518' : undefined,
                boxShadow:    isSelected ? '0 0 0 1px rgba(245,197,24,0.25), 0 4px 16px rgba(245,197,24,0.1)' : undefined,
                fontWeight:   isSelected ? 700 : undefined,
              }}
            >
              {isSelected && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                  style={{ fontSize: '0.7rem', marginRight: 4 }}
                >
                  ✓
                </motion.span>
              )}
              {opt.label}
            </motion.button>
          );
        })}
      </div>

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

OptionPicker.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.object,
  name: PropTypes.string,
};

export default React.memo(OptionPicker);
