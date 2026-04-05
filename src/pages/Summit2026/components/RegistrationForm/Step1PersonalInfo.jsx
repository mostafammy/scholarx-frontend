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
import { ENGLISH_LEVEL_OPTIONS, EGYPTIAN_GOVERNORATES } from '../../constants/formConstants';

/**
 * @param {{ form: import('react-hook-form').UseFormReturn }} props
 */
const Step1PersonalInfo = ({ form }) => {
  const { register, control, formState: { errors } } = form;

  return (
    <div role="group" aria-labelledby="step1-title">
      <h3 id="step1-title" className="summit-form-step-title">Simple Registration Form</h3>
      <p className="summit-form-step-subtitle">Fill in your details and secure your seat now.</p>

      {/* Full Name */}
      <div className="summit-form-group">
        <label htmlFor="fullName" className="summit-form-label summit-form-label-required">
          Full Name (Three Names)
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
          WhatsApp Phone Number
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

      {/* University / Major */}
      <div className="summit-form-group">
        <label htmlFor="university" className="summit-form-label summit-form-label-required">
          University / Major
        </label>
        <input
          id="university"
          type="text"
          autoComplete="organization"
          placeholder="e.g. Nile University - Computer Science"
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

      <div className="summit-form-group">
        <label htmlFor="governorate" className="summit-form-label summit-form-label-required">
          Governorate
        </label>
        <select
          id="governorate"
          className={`summit-form-select${errors.governorate ? ' is-error' : ''}`}
          aria-required="true"
          aria-describedby={errors.governorate ? 'governorate-error' : undefined}
          {...register('governorate')}
        >
          <option value="">Select your governorate...</option>
          {EGYPTIAN_GOVERNORATES.map(({ value, label, region }) => (
            <option key={value} value={value}>{label} ({region})</option>
          ))}
        </select>
        {errors.governorate && (
          <p id="governorate-error" className="summit-form-error" role="alert">
            ⚠ {errors.governorate.message}
          </p>
        )}
      </div>

      <div className="summit-form-group">
        <label htmlFor="status" className="summit-form-label summit-form-label-required">
          What best describes you?
        </label>
        <select
          id="status"
          className={`summit-form-select${errors.status ? ' is-error' : ''}`}
          aria-required="true"
          aria-describedby={errors.status ? 'status-error' : undefined}
          {...register('status')}
        >
          <option value="">Select an option...</option>
          <option value="undergraduate">Undergraduate</option>
          <option value="recent-graduate">Graduate</option>
          <option value="professional">Professional</option>
          <option value="other">Other</option>
        </select>
        {errors.status && (
          <p id="status-error" className="summit-form-error" role="alert">
            ⚠ {errors.status.message}
          </p>
        )}
      </div>

      <div className="summit-form-group">
        <label htmlFor="fieldOfStudy" className="summit-form-label summit-form-label-required">
          Academic Major / Field
        </label>
        <input
          id="fieldOfStudy"
          type="text"
          placeholder="e.g. Computer Science"
          className={`summit-form-input${errors.fieldOfStudy ? ' is-error' : ''}`}
          aria-describedby={errors.fieldOfStudy ? 'fieldOfStudy-error' : undefined}
          aria-required="true"
          {...register('fieldOfStudy')}
        />
        {errors.fieldOfStudy && (
          <p id="fieldOfStudy-error" className="summit-form-error" role="alert">
            ⚠ {errors.fieldOfStudy.message}
          </p>
        )}
      </div>

      <div className="summit-form-group">
        <label htmlFor="primaryGoal" className="summit-form-label summit-form-label-required">
          What is your primary goal for attending?
        </label>
        <select
          id="primaryGoal"
          className={`summit-form-select${errors.primaryGoal ? ' is-error' : ''}`}
          aria-required="true"
          aria-describedby={errors.primaryGoal ? 'primaryGoal-error' : undefined}
          {...register('primaryGoal')}
        >
          <option value="">Select your goal...</option>
          <option value="find-scholarship">Finding a scholarship</option>
          <option value="develop-skills">Developing my skills</option>
          <option value="build-network">Building my network</option>
          <option value="other">Other</option>
        </select>
        {errors.primaryGoal && (
          <p id="primaryGoal-error" className="summit-form-error" role="alert">
            ⚠ {errors.primaryGoal.message}
          </p>
        )}
      </div>

      <div className="summit-form-group">
        <label htmlFor="englishLevel" className="summit-form-label summit-form-label-required">
          What is your English level?
        </label>
        <select
          id="englishLevel"
          className={`summit-form-select${errors.englishLevel ? ' is-error' : ''}`}
          aria-required="true"
          aria-describedby={errors.englishLevel ? 'englishLevel-error' : undefined}
          {...register('englishLevel')}
        >
          {ENGLISH_LEVEL_OPTIONS.map(({ value, label }) => (
            <option key={value || 'empty'} value={value}>{label}</option>
          ))}
        </select>
        {errors.englishLevel && (
          <p id="englishLevel-error" className="summit-form-error" role="alert">
            ⚠ {errors.englishLevel.message}
          </p>
        )}
      </div>

      <div className="summit-form-group">
        <label htmlFor="appliedForScholarshipsRecently" className="summit-form-label summit-form-label-required">
          Have you applied for scholarships recently?
        </label>
        <select
          id="appliedForScholarshipsRecently"
          className={`summit-form-select${errors.appliedForScholarshipsRecently ? ' is-error' : ''}`}
          aria-required="true"
          aria-describedby={errors.appliedForScholarshipsRecently ? 'appliedForScholarshipsRecently-error' : undefined}
          {...register('appliedForScholarshipsRecently')}
        >
          <option value="">Select an option...</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        {errors.appliedForScholarshipsRecently && (
          <p id="appliedForScholarshipsRecently-error" className="summit-form-error" role="alert">
            ⚠ {errors.appliedForScholarshipsRecently.message}
          </p>
        )}
      </div>

      <div className="summit-form-group">
        <label htmlFor="biggestScholarshipHurdle" className="summit-form-label summit-form-label-required">
          What is the biggest hurdle you faced?
        </label>
        <textarea
          id="biggestScholarshipHurdle"
          rows={4}
          placeholder="Share your biggest challenge (e.g., essay writing, finding opportunities, interview prep)..."
          className={`summit-form-textarea${errors.biggestScholarshipHurdle ? ' is-error' : ''}`}
          aria-required="true"
          aria-describedby={errors.biggestScholarshipHurdle ? 'biggestScholarshipHurdle-error' : undefined}
          {...register('biggestScholarshipHurdle')}
        />
        {errors.biggestScholarshipHurdle && (
          <p id="biggestScholarshipHurdle-error" className="summit-form-error" role="alert">
            ⚠ {errors.biggestScholarshipHurdle.message}
          </p>
        )}
      </div>

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
            I agree to the Terms and Conditions and consent to data processing for registration.
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

Step1PersonalInfo.propTypes = {
  form: PropTypes.object.isRequired,
};

export default React.memo(Step1PersonalInfo);
