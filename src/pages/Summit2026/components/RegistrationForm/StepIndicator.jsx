/**
 * @fileoverview StepIndicator — Multi-step form progress indicator.
 * Pure UI component — receives step state via props (no internal state).
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FORM_STEPS_META } from '../../constants/formConstants';

/**
 * @param {{ currentStep: number }} props
 */
const StepIndicator = ({ currentStep }) => (
  <nav className="summit-step-indicator" aria-label="Registration form steps">
    {FORM_STEPS_META.map(({ step, title }) => {
      const isActive    = step === currentStep;
      const isCompleted = step < currentStep;
      const className = [
        'summit-step',
        isActive    ? 'is-active'    : '',
        isCompleted ? 'is-completed' : '',
      ].filter(Boolean).join(' ');

      return (
        <div
          key={step}
          className={className}
          role="listitem"
          aria-current={isActive ? 'step' : undefined}
          aria-label={`Step ${step}: ${title}${isCompleted ? ' (completed)' : isActive ? ' (current)' : ''}`}
        >
          <div className="summit-step-circle">
            {isCompleted ? '✓' : step}
          </div>
          <span className="summit-step-title">{title}</span>
        </div>
      );
    })}
  </nav>
);

StepIndicator.propTypes = {
  currentStep: PropTypes.number.isRequired,
};

export default React.memo(StepIndicator);
