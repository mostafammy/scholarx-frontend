/**
 * @fileoverview Step1PersonalInfo — Personal information form step.
 * Receives RHF form instance via props (Interface Segregation: only what it needs).
 * Validation handled by Yup schema in validators.js.
 */

import React from "react";
import PropTypes from "prop-types";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Controller, useWatch } from "react-hook-form";
import {
  ENGLISH_LEVEL_OPTIONS,
  EGYPTIAN_GOVERNORATES,
  HIGH_SCHOOL_YEAR_OPTIONS,
  UNDERGRADUATE_YEAR_OPTIONS,
} from "../../constants/formConstants";
import { normalizeProfileType } from "../../utils/profileDrafts";

/**
 * @param {{ form: import('react-hook-form').UseFormReturn }} props
 */
const Step1PersonalInfo = ({ form, showProfileSwitchNotice = false }) => {
  const {
    register,
    control,
    formState: { errors },
  } = form;
  const selectedStatus = useWatch({ control, name: "status" });
  const profileType = normalizeProfileType(selectedStatus);

  return (
    <div role="group" aria-labelledby="step1-title">
      <h3 id="step1-title" className="summit-form-step-title">
        Simple Registration Form
      </h3>
      <p className="summit-form-step-subtitle">
        Fill in your details and secure your seat now.
      </p>

      {/* Full Name */}
      <div className="summit-form-group">
        <label
          htmlFor="fullName"
          className="summit-form-label summit-form-label-required"
        >
          Full Name (Three Names)
        </label>
        <input
          id="fullName"
          type="text"
          autoComplete="name"
          placeholder="e.g. Ahmed Mohamed Hassan"
          className={`summit-form-input${errors.fullName ? " is-error" : ""}`}
          aria-describedby={errors.fullName ? "fullName-error" : undefined}
          aria-required="true"
          {...register("fullName")}
        />
        {errors.fullName && (
          <p id="fullName-error" className="summit-form-error" role="alert">
            ⚠ {errors.fullName.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="summit-form-group">
        <label
          htmlFor="email"
          className="summit-form-label summit-form-label-required"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="your@email.com"
          className={`summit-form-input${errors.email ? " is-error" : ""}`}
          aria-describedby={errors.email ? "email-error" : undefined}
          aria-required="true"
          {...register("email")}
        />
        {errors.email && (
          <p id="email-error" className="summit-form-error" role="alert">
            ⚠ {errors.email.message}
          </p>
        )}
      </div>

      {/* Phone */}
      <div className="summit-form-group">
        <label
          htmlFor="phone"
          className="summit-form-label summit-form-label-required"
        >
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
                  id: "phone",
                  name: "phone",
                  required: true,
                  "aria-required": "true",
                  "aria-describedby": errors.phone ? "phone-error" : undefined,
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

      <div className="summit-form-group">
        <label
          htmlFor="governorate"
          className="summit-form-label summit-form-label-required"
        >
          Governorate
        </label>
        <select
          id="governorate"
          className={`summit-form-select${errors.governorate ? " is-error" : ""}`}
          aria-required="true"
          aria-describedby={
            errors.governorate ? "governorate-error" : undefined
          }
          {...register("governorate")}
        >
          <option value="">Select your governorate...</option>
          {EGYPTIAN_GOVERNORATES.map(({ value, label, region }) => (
            <option key={value} value={value}>
              {label} ({region})
            </option>
          ))}
        </select>
        {errors.governorate && (
          <p id="governorate-error" className="summit-form-error" role="alert">
            ⚠ {errors.governorate.message}
          </p>
        )}
      </div>

      <div className="summit-form-group">
        <label
          htmlFor="status"
          className="summit-form-label summit-form-label-required"
        >
          What best describes you?
        </label>
        <select
          id="status"
          className={`summit-form-select${errors.status ? " is-error" : ""}`}
          aria-required="true"
          aria-describedby={errors.status ? "status-error" : undefined}
          {...register("status", {
            setValueAs: (value) => normalizeProfileType(value),
          })}
        >
          <option value="">Select an option...</option>
          <option value="highSchool">High School</option>
          <option value="undergraduate">Undergraduate</option>
          <option value="graduate">Graduate</option>
          <option value="professional">Professional</option>
          <option value="other">Other</option>
        </select>
        {errors.status && (
          <p id="status-error" className="summit-form-error" role="alert">
            ⚠ {errors.status.message}
          </p>
        )}
      </div>

      {showProfileSwitchNotice && (
        <div className="summit-form-group" role="status" aria-live="polite">
          <p className="summit-form-step-subtitle" style={{ marginTop: 0 }}>
            We saved your previous answers for this path. Only fields for your
            current selection will be submitted.
          </p>
        </div>
      )}

      {profileType === "highSchool" && (
        <>
          <div className="summit-form-group">
            <label
              htmlFor="highSchoolName"
              className="summit-form-label summit-form-label-required"
            >
              High School Name
            </label>
            <input
              id="highSchoolName"
              type="text"
              autoComplete="organization"
              placeholder="e.g. STEM High School for Boys - 6th of October"
              className={`summit-form-input${errors.highSchoolName ? " is-error" : ""}`}
              aria-describedby={
                errors.highSchoolName ? "highSchoolName-error" : undefined
              }
              aria-required="true"
              {...register("highSchoolName")}
            />
            {errors.highSchoolName && (
              <p
                id="highSchoolName-error"
                className="summit-form-error"
                role="alert"
              >
                ⚠ {errors.highSchoolName.message}
              </p>
            )}
          </div>

          <div className="summit-form-group">
            <label
              htmlFor="highSchoolYear"
              className="summit-form-label summit-form-label-required"
            >
              Current High School Year
            </label>
            <select
              id="highSchoolYear"
              className={`summit-form-select${errors.highSchoolYear ? " is-error" : ""}`}
              aria-required="true"
              aria-describedby={
                errors.highSchoolYear ? "highSchoolYear-error" : undefined
              }
              {...register("highSchoolYear")}
            >
              {HIGH_SCHOOL_YEAR_OPTIONS.map(({ value, label }) => (
                <option key={value || "empty"} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {errors.highSchoolYear && (
              <p
                id="highSchoolYear-error"
                className="summit-form-error"
                role="alert"
              >
                ⚠ {errors.highSchoolYear.message}
              </p>
            )}
          </div>
        </>
      )}

      {(profileType === "undergraduate" || profileType === "graduate") && (
        <>
          <div className="summit-form-group">
            <label
              htmlFor="universityName"
              className="summit-form-label summit-form-label-required"
            >
              University Name
            </label>
            <input
              id="universityName"
              type="text"
              autoComplete="organization"
              placeholder="e.g. Nile University"
              className={`summit-form-input${errors.universityName ? " is-error" : ""}`}
              aria-describedby={
                errors.universityName ? "universityName-error" : undefined
              }
              aria-required="true"
              {...register("universityName")}
            />
            {errors.universityName && (
              <p
                id="universityName-error"
                className="summit-form-error"
                role="alert"
              >
                ⚠ {errors.universityName.message}
              </p>
            )}
          </div>

          <div className="summit-form-group">
            <label
              htmlFor="major"
              className="summit-form-label summit-form-label-required"
            >
              Major / Specialization
            </label>
            <input
              id="major"
              type="text"
              placeholder="e.g. Computer Science"
              className={`summit-form-input${errors.major ? " is-error" : ""}`}
              aria-describedby={errors.major ? "major-error" : undefined}
              aria-required="true"
              {...register("major")}
            />
            {errors.major && (
              <p id="major-error" className="summit-form-error" role="alert">
                ⚠ {errors.major.message}
              </p>
            )}
          </div>

          {profileType === "undergraduate" && (
            <div className="summit-form-group">
              <label
                htmlFor="undergraduateYear"
                className="summit-form-label summit-form-label-required"
              >
                Current University Year
              </label>
              <select
                id="undergraduateYear"
                className={`summit-form-select${errors.undergraduateYear ? " is-error" : ""}`}
                aria-required="true"
                aria-describedby={
                  errors.undergraduateYear
                    ? "undergraduateYear-error"
                    : undefined
                }
                {...register("undergraduateYear")}
              >
                {UNDERGRADUATE_YEAR_OPTIONS.map(({ value, label }) => (
                  <option key={value || "empty"} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {errors.undergraduateYear && (
                <p
                  id="undergraduateYear-error"
                  className="summit-form-error"
                  role="alert"
                >
                  ⚠ {errors.undergraduateYear.message}
                </p>
              )}
            </div>
          )}
        </>
      )}

      {profileType === "professional" && (
        <>
          <div className="summit-form-group">
            <label
              htmlFor="jobTitle"
              className="summit-form-label summit-form-label-required"
            >
              Current Job Title
            </label>
            <input
              id="jobTitle"
              type="text"
              placeholder="e.g. Product Manager"
              className={`summit-form-input${errors.jobTitle ? " is-error" : ""}`}
              aria-describedby={errors.jobTitle ? "jobTitle-error" : undefined}
              aria-required="true"
              {...register("jobTitle")}
            />
            {errors.jobTitle && (
              <p id="jobTitle-error" className="summit-form-error" role="alert">
                ⚠ {errors.jobTitle.message}
              </p>
            )}
          </div>

          <div className="summit-form-group">
            <label
              htmlFor="yearsOfExperience"
              className="summit-form-label summit-form-label-required"
            >
              Years of Experience
            </label>
            <input
              id="yearsOfExperience"
              type="number"
              min="0"
              max="50"
              step="1"
              placeholder="e.g. 4"
              className={`summit-form-input${errors.yearsOfExperience ? " is-error" : ""}`}
              aria-describedby={
                errors.yearsOfExperience ? "yearsOfExperience-error" : undefined
              }
              aria-required="true"
              {...register("yearsOfExperience")}
            />
            {errors.yearsOfExperience && (
              <p
                id="yearsOfExperience-error"
                className="summit-form-error"
                role="alert"
              >
                ⚠ {errors.yearsOfExperience.message}
              </p>
            )}
          </div>
        </>
      )}

      {profileType === "other" && (
        <div className="summit-form-group">
          <label
            htmlFor="profileDescription"
            className="summit-form-label summit-form-label-required"
          >
            Tell us about your current profile
          </label>
          <textarea
            id="profileDescription"
            rows={3}
            placeholder="Briefly describe your current background"
            className={`summit-form-textarea${errors.profileDescription ? " is-error" : ""}`}
            aria-describedby={
              errors.profileDescription ? "profileDescription-error" : undefined
            }
            aria-required="true"
            {...register("profileDescription")}
          />
          {errors.profileDescription && (
            <p
              id="profileDescription-error"
              className="summit-form-error"
              role="alert"
            >
              ⚠ {errors.profileDescription.message}
            </p>
          )}
        </div>
      )}

      <div className="summit-form-group">
        <span className="summit-form-label summit-form-label-required">
          What are your goals for attending? (Select all that apply)
        </span>
        <div
          role="group"
          aria-describedby={
            errors.primaryGoals ? "primaryGoals-error" : undefined
          }
        >
          <label
            className="summit-checkbox-item"
            htmlFor="goal-find-scholarship"
          >
            <input
              id="goal-find-scholarship"
              type="checkbox"
              value="find-scholarship"
              className="summit-checkbox-input"
              {...register("primaryGoals")}
            />
            <span className="summit-checkbox-label">Finding a scholarship</span>
          </label>
          <label className="summit-checkbox-item" htmlFor="goal-develop-skills">
            <input
              id="goal-develop-skills"
              type="checkbox"
              value="develop-skills"
              className="summit-checkbox-input"
              {...register("primaryGoals")}
            />
            <span className="summit-checkbox-label">Developing my skills</span>
          </label>
          <label className="summit-checkbox-item" htmlFor="goal-build-network">
            <input
              id="goal-build-network"
              type="checkbox"
              value="build-network"
              className="summit-checkbox-input"
              {...register("primaryGoals")}
            />
            <span className="summit-checkbox-label">Building my network</span>
          </label>
          <label className="summit-checkbox-item" htmlFor="goal-other">
            <input
              id="goal-other"
              type="checkbox"
              value="other"
              className="summit-checkbox-input"
              {...register("primaryGoals")}
            />
            <span className="summit-checkbox-label">Other</span>
          </label>
        </div>
        {errors.primaryGoals && (
          <p id="primaryGoals-error" className="summit-form-error" role="alert">
            ⚠ {errors.primaryGoals.message}
          </p>
        )}
      </div>

      <div className="summit-form-group">
        <label
          htmlFor="englishLevel"
          className="summit-form-label summit-form-label-required"
        >
          What is your English level?
        </label>
        <select
          id="englishLevel"
          className={`summit-form-select${errors.englishLevel ? " is-error" : ""}`}
          aria-required="true"
          aria-describedby={
            errors.englishLevel ? "englishLevel-error" : undefined
          }
          {...register("englishLevel")}
        >
          {ENGLISH_LEVEL_OPTIONS.map(({ value, label }) => (
            <option key={value || "empty"} value={value}>
              {label}
            </option>
          ))}
        </select>
        {errors.englishLevel && (
          <p id="englishLevel-error" className="summit-form-error" role="alert">
            ⚠ {errors.englishLevel.message}
          </p>
        )}
      </div>

      <div className="summit-form-group">
        <label
          htmlFor="appliedForScholarshipsRecently"
          className="summit-form-label summit-form-label-required"
        >
          Have you applied for scholarships recently?
        </label>
        <select
          id="appliedForScholarshipsRecently"
          className={`summit-form-select${errors.appliedForScholarshipsRecently ? " is-error" : ""}`}
          aria-required="true"
          aria-describedby={
            errors.appliedForScholarshipsRecently
              ? "appliedForScholarshipsRecently-error"
              : undefined
          }
          {...register("appliedForScholarshipsRecently")}
        >
          <option value="">Select an option...</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        {errors.appliedForScholarshipsRecently && (
          <p
            id="appliedForScholarshipsRecently-error"
            className="summit-form-error"
            role="alert"
          >
            ⚠ {errors.appliedForScholarshipsRecently.message}
          </p>
        )}
      </div>

      <div className="summit-form-group">
        <label
          htmlFor="biggestScholarshipHurdle"
          className="summit-form-label summit-form-label-required"
        >
          What is the biggest hurdle you faced?
        </label>
        <textarea
          id="biggestScholarshipHurdle"
          rows={4}
          placeholder="Share your biggest challenge (e.g., essay writing, finding opportunities, interview prep)..."
          className={`summit-form-textarea${errors.biggestScholarshipHurdle ? " is-error" : ""}`}
          aria-required="true"
          aria-describedby={
            errors.biggestScholarshipHurdle
              ? "biggestScholarshipHurdle-error"
              : undefined
          }
          {...register("biggestScholarshipHurdle")}
        />
        {errors.biggestScholarshipHurdle && (
          <p
            id="biggestScholarshipHurdle-error"
            className="summit-form-error"
            role="alert"
          >
            ⚠ {errors.biggestScholarshipHurdle.message}
          </p>
        )}
      </div>

      <div className="summit-form-group">
        <label
          className={`summit-checkbox-item${errors.acceptTerms ? " is-error" : ""}`}
          htmlFor="acceptTerms"
          style={{
            border: errors.acceptTerms
              ? "1px solid rgba(255,107,107,0.4)"
              : undefined,
          }}
        >
          <input
            id="acceptTerms"
            type="checkbox"
            className="summit-checkbox-input"
            aria-required="true"
            aria-describedby={errors.acceptTerms ? "terms-error" : undefined}
            {...register("acceptTerms")}
          />
          <span className="summit-checkbox-label">
            I agree to the Terms and Conditions and consent to data processing
            for registration.
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
  showProfileSwitchNotice: PropTypes.bool,
};

export default Step1PersonalInfo;
