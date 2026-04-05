/**
 * @fileoverview Step1PersonalInfo — Personal information form step.
 * Receives RHF form instance via props (Interface Segregation: only what it needs).
 * Validation handled by Yup schema in validators.js.
 */

import React from 'react';
import PropTypes from 'prop-types';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Controller } from 'react-hook-form';
import { GRADUATION_YEAR_OPTIONS } from '../../constants/formConstants';

/**
 * @param {{ form: import('react-hook-form').UseFormReturn }} props
 */
const Step1PersonalInfo = ({ form }) => {
  const { register, control, formState: { errors } } = form;

  return (
    <div role="group" aria-labelledby="step1-title">
      <h3 id="step1-title" className="summit-form-step-title">Personal Information</h3>
      <p className="summit-form-step-subtitle">Let's start with your basic details.</p>

      {/* Full Name */}
      <div className="summit-form-group">
        <label htmlFor="fullName" className="summit-form-label summit-form-label-required">
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          autoComplete="name"
          placeholder="e.g. Ahmed Mohamed Hassan"
          className={`summit-form-input${errors.fullName ? ' is-error' : ''}`}
          aria-describedby={errors.fullName ? 'fullName-error' : undefined}
          aria-required="true"
          {...register('fullName')}
        />
        {errors.fullName && (
          <p id="fullName-error" className="summit-form-error" role="alert">
            ⚠ {errors.fullName.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="summit-form-group">
        <label htmlFor="email" className="summit-form-label summit-form-label-required">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="your@email.com"
          className={`summit-form-input${errors.email ? ' is-error' : ''}`}
          aria-describedby={errors.email ? 'email-error' : undefined}
          aria-required="true"
          {...register('email')}
        />
        {errors.email && (
          <p id="email-error" className="summit-form-error" role="alert">
            ⚠ {errors.email.message}
          </p>
        )}
      </div>

      {/* Phone */}
      <div className="summit-form-group">
        <label htmlFor="phone" className="summit-form-label summit-form-label-required">
          Phone Number
        </label>
        <div className="summit-phone-wrap">
          <Controller
            name="phone"
            control={control}
            render={({ field: { onChange, value } }) => (
              <PhoneInput
                country="eg"
                value={value}
                onChange={onChange}
                inputProps={{
                  id: 'phone',
                  name: 'phone',
                  required: true,
                  'aria-required': 'true',
                  'aria-describedby': errors.phone ? 'phone-error' : undefined,
                }}
                enableSearch
                searchPlaceholder="Search country..."
              />
            )}
          />
        </div>
        {errors.phone && (
          <p id="phone-error" className="summit-form-error" role="alert">
            ⚠ {errors.phone.message}
          </p>
        )}
      </div>

      {/* University + Graduation Year */}
      <div className="summit-form-row">
        <div className="summit-form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="university" className="summit-form-label summit-form-label-required">
            University / Institution
          </label>
          <input
            id="university"
            type="text"
            autoComplete="organization"
            placeholder="e.g. Cairo University"
            className={`summit-form-input${errors.university ? ' is-error' : ''}`}
            aria-describedby={errors.university ? 'university-error' : undefined}
            aria-required="true"
            {...register('university')}
          />
          {errors.university && (
            <p id="university-error" className="summit-form-error" role="alert">
              ⚠ {errors.university.message}
            </p>
          )}
        </div>

        <div className="summit-form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="graduationYear" className="summit-form-label summit-form-label-required">
            Graduation Year
          </label>
          <input
            id="graduationYear"
            type="number"
            placeholder="e.g. 2025"
            min="1990"
            max="2035"
            className={`summit-form-input${errors.graduationYear ? ' is-error' : ''}`}
            aria-describedby={errors.graduationYear ? 'year-error' : undefined}
            aria-required="true"
            {...register('graduationYear')}
          />
          {errors.graduationYear && (
            <p id="year-error" className="summit-form-error" role="alert">
              ⚠ {errors.graduationYear.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

Step1PersonalInfo.propTypes = {
  form: PropTypes.object.isRequired,
};

export default React.memo(Step1PersonalInfo);
