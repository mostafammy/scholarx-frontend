/**
 * @fileoverview Step2ProfessionalProfile — Professional background form step.
 */

import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import {
  ATTENDEE_STATUS_OPTIONS,
  REFERRAL_SOURCE_OPTIONS,
  EGYPTIAN_GOVERNORATES,
} from '../../constants/formConstants';

/**
 * Reusable multi-checkbox controller for RHF.
 * Uses Controller so it stays compatible with RHF's array value model.
 */
const MultiCheckboxGroup = React.memo(({ name, control, options, error }) => (
  <Controller
    name={name}
    control={control}
    defaultValue={[]}
    render={({ field: { value = [], onChange } }) => (
      <div
        className="summit-checkbox-group"
        role="group"
        aria-label={name}
      >
        {options.map((opt) => {
          const isChecked = value.includes(opt.value);
          const toggle = () => {
            onChange(
              isChecked
                ? value.filter((v) => v !== opt.value)
                : [...value, opt.value]
            );
          };
          return (
            <label
              key={opt.value}
              className={`summit-checkbox-item${isChecked ? ' is-checked' : ''}`}
              htmlFor={`${name}-${opt.value}`}
            >
              <input
                id={`${name}-${opt.value}`}
                type="checkbox"
                className="summit-checkbox-input"
                checked={isChecked}
                onChange={toggle}
                aria-checked={isChecked}
              />
              <span className="summit-checkbox-label">{opt.label}</span>
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

MultiCheckboxGroup.displayName = 'MultiCheckboxGroup';
MultiCheckboxGroup.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  error: PropTypes.object,
};

/**
 * @param {{ form: import('react-hook-form').UseFormReturn }} props
 */
const Step2ProfessionalProfile = ({ form }) => {
  const { register, control, formState: { errors } } = form;

  return (
    <div role="group" aria-labelledby="step2-title">
      <h3 id="step2-title" className="summit-form-step-title">Professional Profile</h3>
      <p className="summit-form-step-subtitle">Tell us about your academic and professional background.</p>

      {/* Status + Governorate */}
      <div className="summit-form-row">
        <div className="summit-form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="status" className="summit-form-label summit-form-label-required">
            Current Status
          </label>
          <select
            id="status"
            className={`summit-form-select${errors.status ? ' is-error' : ''}`}
            aria-required="true"
            aria-describedby={errors.status ? 'status-error' : undefined}
            {...register('status')}
          >
            {ATTENDEE_STATUS_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          {errors.status && (
            <p id="status-error" className="summit-form-error" role="alert">
              ⚠ {errors.status.message}
            </p>
          )}
        </div>

        <div className="summit-form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="governorate" className="summit-form-label summit-form-label-required">
            Governorate
          </label>
          <select
            id="governorate"
            className={`summit-form-select${errors.governorate ? ' is-error' : ''}`}
            aria-required="true"
            aria-describedby={errors.governorate ? 'gov-error' : undefined}
            {...register('governorate')}
          >
            <option value="">Select your governorate...</option>
            {EGYPTIAN_GOVERNORATES.map(({ value, label, region }) => (
              <option key={value} value={value}>{label} ({region})</option>
            ))}
          </select>
          {errors.governorate && (
            <p id="gov-error" className="summit-form-error" role="alert">
              ⚠ {errors.governorate.message}
            </p>
          )}
        </div>
      </div>

      {/* Field of Study */}
      <div className="summit-form-group">
        <label htmlFor="fieldOfStudy" className="summit-form-label summit-form-label-required">
          Field of Study / Industry
        </label>
        <input
          id="fieldOfStudy"
          type="text"
          placeholder="e.g. Computer Science, Business, Engineering..."
          className={`summit-form-input${errors.fieldOfStudy ? ' is-error' : ''}`}
          aria-required="true"
          aria-describedby={errors.fieldOfStudy ? 'field-error' : undefined}
          {...register('fieldOfStudy')}
        />
        {errors.fieldOfStudy && (
          <p id="field-error" className="summit-form-error" role="alert">
            ⚠ {errors.fieldOfStudy.message}
          </p>
        )}
      </div>

      {/* How did you hear about us */}
      <div className="summit-form-group">
        <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
          <legend className="summit-form-label summit-form-label-required" style={{ marginBottom: 8 }}>
            How did you hear about the summit?
          </legend>
          <MultiCheckboxGroup
            name="referralSources"
            control={control}
            options={REFERRAL_SOURCE_OPTIONS}
            error={errors.referralSources}
          />
        </fieldset>
      </div>
    </div>
  );
};

Step2ProfessionalProfile.propTypes = {
  form: PropTypes.object.isRequired,
};

export default React.memo(Step2ProfessionalProfile);
