/**
 * @fileoverview BinaryToggle — Apple-style Yes/No toggle switch for boolean questions.
 * Replaces native <select> with a segmented control.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

const OPTIONS = [
  { value: 'yes', label: 'Yes', icon: '✓', color: '#69f0ae' },
  { value: 'no',  label: 'No',  icon: '✕', color: '#ff6b6b' },
];

const BinaryToggle = ({ value, onChange, error }) => (
  <div>
    <div className="summit-binary-toggle" role="radiogroup">
      {OPTIONS.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <motion.button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(opt.value)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="summit-binary-option"
            style={{
              borderColor: isSelected ? `${opt.color}70` : undefined,
              background: isSelected
                ? `linear-gradient(135deg, ${opt.color}18, ${opt.color}08)`
                : undefined,
              boxShadow: isSelected
                ? `0 0 0 1px ${opt.color}40, 0 4px 20px ${opt.color}12`
                : undefined,
            }}
          >
            <motion.span
              className="summit-binary-option__icon"
              animate={{ scale: isSelected ? 1.2 : 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 16 }}
              style={{
                background: isSelected ? opt.color : 'rgba(255,255,255,0.08)',
                color: isSelected ? '#0a0e1a' : 'rgba(255,255,255,0.4)',
              }}
            >
              {opt.icon}
            </motion.span>
            <span
              className="summit-binary-option__label"
              style={{ color: isSelected ? opt.color : undefined, fontWeight: isSelected ? 700 : undefined }}
            >
              {opt.label}
            </span>
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

BinaryToggle.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.object,
};

export default React.memo(BinaryToggle);
