/**
 * @fileoverview RegistrationForm — Multi-step form orchestrator.
 * Delegates: step state to useRegistration, validation to Yup schemas,
 * persistence to RegistrationRepository. This component is ONLY a UI shell.
 * Open/Closed: adding a new step requires only a new StepN component + constants update.
 */

import React, { useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRegistration } from '../../hooks/useRegistration';
import StepIndicator from './StepIndicator';
import Step1PersonalInfo from './Step1PersonalInfo';
import { FORM_TOTAL_STEPS } from '../../constants/formConstants';

/** Step component registry — OCP: add steps without modifying this orchestrator */
const STEP_COMPONENTS = {
  1: Step1PersonalInfo,
};

const stepVariants = {
  enter: (dir) => ({ 
    opacity: 0, 
    x: dir > 0 ? 30 : -30,
    scale: 0.98,
    filter: 'blur(4px)'
  }),
  center: { 
    opacity: 1, 
    x: 0,
    scale: 1,
    filter: 'blur(0px)'
  },
  exit: (dir) => ({ 
    opacity: 0, 
    x: dir > 0 ? -30 : 30,
    scale: 1.02,
    filter: 'blur(8px)'
  }),
};

const RegistrationForm = () => {
  const {
    currentStep,
    isFirstStep,
    isLastStep,
    isSubmitting,
    form,
    onNext,
    onBack,
    isSuccess,
  } = useRegistration();

  const [direction, setDirection] = React.useState(1);

  const handleNext = useCallback(() => {
    setDirection(1);
    form.handleSubmit(onNext)();
  }, [form, onNext]);

  const handleBack = useCallback(() => {
    setDirection(-1);
    onBack();
  }, [onBack]);

  const ActiveStep = useMemo(() => STEP_COMPONENTS[currentStep], [currentStep]);

  if (isSuccess) {
    return (
      <section id="registration" className="summit-section summit-registration" aria-label="Registration confirmed">
        <div className="summit-container">
          <div className="summit-form-container">
            <div className="summit-form-card summit-form-success">
              <div className="summit-form-success-icon" aria-hidden="true">🎉</div>
              <h2 className="summit-section-title" style={{ marginTop: 24 }}>
                You're Registered!
              </h2>
              <p className="summit-section-subtitle" style={{ marginTop: 12 }}>
                We've received your registration for{' '}
                <strong style={{ color: 'var(--s-gold-400)' }}>Next Scholar Summit 2026</strong>.
                We'll be in touch with more details soon.
              </p>
              <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
                <a href="#summit-tracks" className="summit-hero-cta-secondary">Explore Tracks</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="registration"
      className="summit-section summit-registration"
      aria-labelledby="registration-heading"
    >
      <div className="summit-container">
        <div className="summit-section-header">
          <div className="summit-badge" aria-hidden="true">📝 Free Registration</div>
          <h2 id="registration-heading" className="summit-section-title">
            Confirm Your Registration and Join the Summit
          </h2>
          <p className="summit-section-subtitle">
            Seats are very limited and reserved for the most committed participants.
            Do not miss your chance to be where opportunities are created.
          </p>
        </div>

        <div className="summit-form-container">
          <StepIndicator currentStep={currentStep} />

          <div className="summit-form-card">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <ActiveStep form={form} />
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="summit-form-nav">
              <div>
                {!isFirstStep && (
                  <button
                    type="button"
                    id="form-back-btn"
                    className="summit-btn-secondary"
                    onClick={handleBack}
                    aria-label="Go to previous step"
                  >
                    ← Back
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--s-text-400)' }}>
                  Step {currentStep} of {FORM_TOTAL_STEPS}
                </span>
                <button
                  type="button"
                  id="form-next-btn"
                  className="summit-btn-primary"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  aria-label={isLastStep ? 'Submit registration' : 'Continue to next step'}
                  aria-busy={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span style={{ display: 'inline-block', animation: 'summitSpin 0.8s linear infinite' }}>⏳</span>
                      Submitting...
                    </>
                  ) : isLastStep ? (
                    <>Confirm Registration and Join the Summit</>
                  ) : (
                    <>Continue →</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(RegistrationForm);
