/**
 * @fileoverview RegistrationForm — Multi-step form orchestrator.
 * Delegates: step state to useRegistration, validation to Yup schemas,
 * persistence to RegistrationRepository. This component is ONLY a UI shell.
 * Open/Closed: adding a new step requires only a new StepN component + constants update.
 */

import React, { useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRegistration } from "../../hooks/useRegistration";
import StepIndicator from "./StepIndicator";
import Step1PersonalInfo from "./Step1PersonalInfo";
import { FORM_TOTAL_STEPS } from "../../constants/formConstants";

/** Step component registry — OCP: add steps without modifying this orchestrator */
const STEP_COMPONENTS = {
  1: Step1PersonalInfo,
};

const stepVariants = {
  enter: (dir) => ({
    opacity: 0,
    x: dir > 0 ? 30 : -30,
    scale: 0.98,
    filter: "blur(4px)",
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: (dir) => ({
    opacity: 0,
    x: dir > 0 ? -30 : 30,
    scale: 1.02,
    filter: "blur(8px)",
  }),
};

const RegistrationForm = () => {
  const {
    currentStep,
    isFirstStep,
    isLastStep,
    isSubmitting,
    form,
    showProfileSwitchNotice,
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
      <section
        id="registration"
        className="summit-section summit-registration"
        aria-label="Registration confirmed"
      >
        <div className="summit-container">
          <div className="summit-form-container">
            <div className="summit-form-card summit-form-success">
              <div className="summit-form-success-icon" aria-hidden="true">
                🎉
              </div>
              <h2 className="summit-section-title" style={{ marginTop: 24 }}>
                You're Registered!
              </h2>
              <p className="summit-section-subtitle" style={{ marginTop: 12 }}>
                We've received your registration for{" "}
                <strong style={{ color: "var(--s-gold-400)" }}>
                  Next Scholar Summit 2026
                </strong>
                . We'll be in touch with more details soon.
              </p>
              <div
                style={{
                  marginTop: 32,
                  display: "flex",
                  justifyContent: "center",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <a href="#summit-tracks" className="summit-hero-cta-secondary">
                  Explore Tracks
                </a>
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
          <div className="summit-badge" aria-hidden="true">
            📝 Free Registration
          </div>
          <h2 id="registration-heading" className="summit-section-title">
            Confirm Your Registration and Join the Summit
          </h2>
          <p className="summit-section-subtitle">
            Seats are very limited and reserved for the most committed
            participants. Do not miss your chance to be where opportunities are
            created.
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
                <ActiveStep
                  form={form}
                  showProfileSwitchNotice={showProfileSwitchNotice}
                />
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

              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span
                  style={{ fontSize: "0.8rem", color: "var(--s-text-400)" }}
                >
                  Step {currentStep} of {FORM_TOTAL_STEPS}
                </span>
                <button
                  type="button"
                  id="form-next-btn"
                  className="summit-btn-primary"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  aria-label={
                    isLastStep ? "Submit registration" : "Continue to next step"
                  }
                  aria-busy={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span
                        style={{
                          display: "inline-block",
                          animation: "summitSpin 0.8s linear infinite",
                        }}
                      >
                        ⏳
                      </span>
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

        {/* Beautiful Support / Help Contact Block */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          style={{ marginTop: 40, display: "flex", justifyContent: "center" }}
        >
          <div style={{ 
            background: "rgba(255,255,255,0.02)", 
            border: "1px solid rgba(255,255,255,0.06)", 
            borderRadius: 100, 
            padding: "10px 24px 10px 10px", 
            display: "inline-flex", 
            alignItems: "center", 
            gap: 16,
            backdropFilter: "blur(12px)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
            transition: "all 0.3s ease",
            cursor: "default"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
            e.currentTarget.style.borderColor = "rgba(245,197,24,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.02)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
          }}
          >
            <div style={{ 
              width: 48, 
              height: 48, 
              borderRadius: "50%", 
              background: "linear-gradient(135deg, rgba(245,197,24,0.15), rgba(255,159,28,0.05))", 
              border: "1px solid rgba(245,197,24,0.2)",
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              fontSize: "1.3rem", 
              color: "#f5c518",
              boxShadow: "0 4px 12px rgba(245,197,24,0.15)"
            }}>
              🎧
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>
                Facing any issues?
              </div>
              <div style={{ fontSize: "1rem", color: "#e2e8f0", fontWeight: 500 }}>
                We're here to help! <a href="https://wa.me/201012072516" target="_blank" rel="noreferrer" style={{ color: "#f5c518", textDecoration: "none", marginLeft: 4, fontWeight: 700, transition: "color 0.2s ease" }} onMouseEnter={(e) => e.target.style.color = "#ff9f1c"} onMouseLeave={(e) => e.target.style.color = "#f5c518"}>Contact 01012072516</a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default React.memo(RegistrationForm);
