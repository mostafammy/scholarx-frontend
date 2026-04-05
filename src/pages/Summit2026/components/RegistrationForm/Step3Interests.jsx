/**
 * @fileoverview Step3Interests — Summit interests & workshop selection step.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { TRACK_OPTIONS, WORKSHOP_OPTIONS } from '../../constants/formConstants';

/** Reusable multi-checkbox (duplicated pattern for encapsulation per file) */
const MultiCheckbox = React.memo(({ name, control, options, error, maxCount }) => (
  <Controller
    name={name}
    control={control}
    defaultValue={[]}
    render={({ field: { value = [], onChange } }) => (
      <div className="summit-checkbox-group" role="group" aria-label={name}>
        {options.map((opt) => {
          const isChecked = value.includes(opt.value);
          const isDisabled = maxCount && !isChecked && value.length >= maxCount;
          const toggle = () => {
            if (isDisabled) return;
            onChange(
              isChecked
                ? value.filter((v) => v !== opt.value)
                : [...value, opt.value]
            );
          };
          return (
            <label
              key={opt.value}
              className={`summit-checkbox-item${isChecked ? ' is-checked' : ''}${isDisabled ? ' is-disabled' : ''}`}
              style={isDisabled ? { opacity: 0.45, cursor: 'not-allowed' } : {}}
              htmlFor={`${name}-${opt.value}`}
            >
              <input
                id={`${name}-${opt.value}`}
                type="checkbox"
                className="summit-checkbox-input"
                checked={isChecked}
                onChange={toggle}
                disabled={isDisabled}
                aria-checked={isChecked}
                aria-disabled={isDisabled}
              />
              <span className="summit-checkbox-label">
                {opt.label}
                {opt.track && (
                  <span style={{ fontSize: '0.72rem', color: 'var(--s-text-400)', marginLeft: 6 }}>
                    — {opt.track}
                  </span>
                )}
              </span>
            </label>
          );
        })}
        {error && (
          <p className="summit-form-error" role="alert">⚠ {error.message}</p>
        )}
      </div>
    )}
  />
));
MultiCheckbox.displayName = 'MultiCheckbox';
MultiCheckbox.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  options: PropTypes.array.isRequired,
  error: PropTypes.object,
  maxCount: PropTypes.number,
};

/**
 * @param {{ form: import('react-hook-form').UseFormReturn }} props
 */
const Step3Interests = ({ form }) => {
  const { register, control, formState: { errors }, watch } = form;
  const selectedWorkshops = watch('workshops') ?? [];

  return (
    <div role="group" aria-labelledby="step3-title">
      <h3 id="step3-title" className="summit-form-step-title">Summit Interests</h3>
      <p className="summit-form-step-subtitle">Help us personalize your summit experience.</p>

      {/* Tracks */}
      <div className="summit-form-group">
        <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
          <legend className="summit-form-label summit-form-label-required" style={{ marginBottom: 8 }}>
            Tracks of Interest
          </legend>
          <MultiCheckbox
            name="tracks"
            control={control}
            options={TRACK_OPTIONS}
            error={errors.tracks}
          />
        </fieldset>
      </div>

      {/* Workshops (max 5) */}
      <div className="summit-form-group">
        <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
          <legend className="summit-form-label" style={{ marginBottom: 4 }}>
            Workshop Preferences
            <span style={{ color: 'var(--s-text-400)', fontSize: '0.8rem', fontWeight: 400, marginLeft: 8 }}>
              (Select up to 5 — {selectedWorkshops.length}/5 selected)
            </span>
          </legend>
          <MultiCheckbox
            name="workshops"
            control={control}
            options={WORKSHOP_OPTIONS}
            error={errors.workshops}
            maxCount={5}
          />
        </fieldset>
      </div>

      {/* Special Accommodations */}
      <div className="summit-form-group">
        <label htmlFor="specialAccommodations" className="summit-form-label">
          Special Accommodations <span style={{ color: 'var(--s-text-400)', fontWeight: 400 }}>(Optional)</span>
        </label>
        <textarea
          id="specialAccommodations"
          rows={3}
          placeholder="Any accessibility needs, dietary requirements, or other requests..."
          className={`summit-form-textarea${errors.specialAccommodations ? ' is-error' : ''}`}
          aria-describedby={errors.specialAccommodations ? 'accommodations-error' : undefined}
          {...register('specialAccommodations')}
        />
        {errors.specialAccommodations && (
          <p id="accommodations-error" className="summit-form-error" role="alert">
            ⚠ {errors.specialAccommodations.message}
          </p>
        )}
      </div>

      {/* Terms & Conditions */}
      <div className="summit-form-group">
        <label
          className={`summit-checkbox-item${errors.acceptTerms ? ' is-error' : ''}`}
          htmlFor="acceptTerms"
          style={{ border: errors.acceptTerms ? '1px solid rgba(255,107,107,0.4)' : undefined }}
        >
          <input
            id="acceptTerms"
            type="checkbox"
            className="summit-checkbox-input"
            aria-required="true"
            aria-describedby={errors.acceptTerms ? 'terms-error' : undefined}
            {...register('acceptTerms')}
          />
          <span className="summit-checkbox-label">
            I agree to the{' '}
            <a
              href="/terms-of-service"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--s-gold-400)' }}
            >
              Terms & Conditions
            </a>{' '}
            and consent to my data being used to manage event registration. *
          </span>
        </label>
        {errors.acceptTerms && (
          <p id="terms-error" className="summit-form-error" role="alert">
            ⚠ {errors.acceptTerms.message}
          </p>
        )}
      </div>
    </div>
  );
};

Step3Interests.propTypes = {
  form: PropTypes.object.isRequired,
};

export default React.memo(Step3Interests);
