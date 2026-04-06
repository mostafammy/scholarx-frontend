/**
 * @fileoverview GovernorateSearch — Apple-caliber searchable combobox for 27 Egyptian governorates.
 * Replaces the native <select> with a live-filtered, keyboard-navigable command palette.
 */
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { EGYPTIAN_GOVERNORATES } from '../../constants/formConstants';

const REGION_ICONS = {
  'Capital':          '🏛️',
  'Greater Cairo':    '🌆',
  'Lower Egypt':      '🌊',
  'Upper Egypt':      '☀️',
  'Middle Egypt':     '🏜️',
  'Canal Zone':       '⚓',
  'Sinai':            '🏔️',
  'Western Desert':   '🌙',
  'Eastern Desert':   '🏕️',
  'Northern Egypt':   '🌅',
};

const dropdownVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } },
  exit:   { opacity: 0, y: -6, scale: 0.97, transition: { duration: 0.15 } },
};

const GovernorateSearch = ({ value, onChange, error }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const containerRef = useRef(null);

  const selected = useMemo(
    () => EGYPTIAN_GOVERNORATES.find((g) => g.value === value),
    [value]
  );

  const filtered = useMemo(() => {
    if (!query) return EGYPTIAN_GOVERNORATES;
    const q = query.toLowerCase();
    return EGYPTIAN_GOVERNORATES.filter(
      (g) => g.label.toLowerCase().includes(q) || g.region.toLowerCase().includes(q)
    );
  }, [query]);

  /* Close on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (!containerRef.current?.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* Reset highlight when filtered list changes */
  useEffect(() => { setHighlighted(0); }, [filtered]);

  const select = useCallback((gov) => {
    onChange(gov.value);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  }, [onChange]);

  const handleKeyDown = useCallback((e) => {
    if (!isOpen) { if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') { setIsOpen(true); e.preventDefault(); } return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlighted((h) => Math.min(h + 1, filtered.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlighted((h) => Math.max(h - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (filtered[highlighted]) select(filtered[highlighted]); }
    else if (e.key === 'Escape') { setIsOpen(false); setQuery(''); }
  }, [isOpen, filtered, highlighted, select]);

  /* Scroll highlighted item into view */
  useEffect(() => {
    const item = listRef.current?.children[highlighted];
    item?.scrollIntoView({ block: 'nearest' });
  }, [highlighted]);

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {/* Trigger / display field */}
      <button
        type="button"
        className={`summit-gov-trigger${error ? ' is-error' : ''}${isOpen ? ' is-open' : ''}`}
        onClick={() => { setIsOpen((o) => !o); setTimeout(() => inputRef.current?.focus(), 50); }}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select your governorate"
      >
        {selected ? (
          <>
            <span className="summit-gov-trigger__icon">{REGION_ICONS[selected.region] || '📍'}</span>
            <span className="summit-gov-trigger__label">{selected.label}</span>
            <span className="summit-gov-trigger__region">{selected.region}</span>
          </>
        ) : (
          <span className="summit-gov-trigger__placeholder">Select your governorate...</span>
        )}
        <motion.span
          className="summit-gov-trigger__arrow"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▾
        </motion.span>
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="summit-gov-dropdown"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-label="Governorate search"
          >
            {/* Search input inside dropdown */}
            <div className="summit-gov-search-wrap">
              <span className="summit-gov-search-icon">🔍</span>
              <input
                ref={inputRef}
                className="summit-gov-search-input"
                type="text"
                placeholder="Search governorates or regions..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                aria-label="Search governorates"
              />
              {query && (
                <button
                  type="button"
                  className="summit-gov-clear"
                  onClick={() => setQuery('')}
                  tabIndex={-1}
                >✕</button>
              )}
            </div>

            {/* List */}
            <ul
              ref={listRef}
              className="summit-gov-list"
              role="listbox"
              aria-label="Governorates"
            >
              {filtered.length === 0 && (
                <li className="summit-gov-empty">No governorates found</li>
              )}
              {filtered.map((gov, i) => {
                const isHighlighted = i === highlighted;
                const isSelected = gov.value === value;
                return (
                  <li
                    key={gov.value}
                    role="option"
                    aria-selected={isSelected}
                    className={[
                      'summit-gov-item',
                      isHighlighted ? 'is-highlighted' : '',
                      isSelected ? 'is-selected' : '',
                    ].filter(Boolean).join(' ')}
                    onClick={() => select(gov)}
                    onMouseEnter={() => setHighlighted(i)}
                  >
                    <span className="summit-gov-item__icon">{REGION_ICONS[gov.region] || '📍'}</span>
                    <span className="summit-gov-item__label">{gov.label}</span>
                    <span className="summit-gov-item__region">{gov.region}</span>
                    {isSelected && <span className="summit-gov-item__check">✓</span>}
                  </li>
                );
              })}
            </ul>

            <div className="summit-gov-footer">
              {filtered.length} governorate{filtered.length !== 1 ? 's' : ''}
            </div>
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

GovernorateSearch.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.object,
};

export default React.memo(GovernorateSearch);
