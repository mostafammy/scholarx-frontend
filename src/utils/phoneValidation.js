/**
 * phoneValidation.js
 *
 * Centralised phone-number validation utilities for ScholarX frontend.
 *
 * WHY THIS EXISTS:
 *   The original Signup form hard-coded Egyptian 11-digit logic directly inside
 *   the Yup schema and inside the `react-phone-input-2` component props.  This
 *   coupled UI configuration to business rules and prevented international users
 *   from registering with valid numbers from any other country.
 *
 * DESIGN (SOLID):
 *   - SRP : This file owns all phone-number validation logic. No component
 *           validates phone numbers independently.
 *   - OCP : New validation presets (e.g. "require MENA number") can be added
 *           as new exported functions without changing existing callers.
 *   - DIP : Components depend on the abstractions exported here, not on
 *           inline regex or hard-coded country rules.
 *
 * STANDARD: E.164 (https://en.wikipedia.org/wiki/E.164)
 *   +<country_code><subscriber_number>
 *   - Starts with +
 *   - Country code: 1–3 digits, first digit 1–9
 *   - Total digits (excl. +): 7–15
 *   - Examples: +201012345678 (EG), +12025550100 (US), +447911123456 (UK)
 *
 * NOTE ON react-phone-input-2:
 *   The component's `value` prop holds the number WITHOUT the leading "+".
 *   Our `normalisePhoneNumber()` helper re-adds it before validation/storage.
 */

/**
 * E.164 regular expression.
 * + followed by 1-3 digit country code, then 4-12 subscriber digits.
 * Total length (including +): 8–16 characters.
 */
const E164_REGEX = /^\+[1-9]\d{6,14}$/;

/**
 * Validates whether a string is a valid E.164 international phone number.
 *
 * Strict mode: does NOT strip formatting characters (spaces, dashes, parentheses).
 * Formatting characters are the caller's responsibility to remove BEFORE validation.
 * Use `normalisePhoneNumber()` for the + prefix, and strip any other formatting
 * yourself if needed.
 *
 * `react-phone-input-2` always emits clean digits (no spaces or dashes), so in
 * normal UI flows this validator receives a clean string.
 *
 * @param {string | null | undefined} value - The phone number to validate.
 * @returns {boolean} true if valid E.164, false otherwise.
 *
 * @example
 * isValidE164Phone("+12025550100")     // true  — clean US number
 * isValidE164Phone("+201012345678")    // true  — clean Egyptian number
 * isValidE164Phone("12025550100")      // true  — no + (normalised internally)
 * isValidE164Phone("+1 (202) 555-0100") // false — formatting chars not stripped
 * isValidE164Phone("01012345678")      // false — missing country code
 * isValidE164Phone("+1")              // false — too short
 */
export function isValidE164Phone(value) {
  if (!value || typeof value !== "string") return false;
  // Prepend + if missing so callers don't have to; this is the ONLY
  // normalisation we perform — we do NOT strip spaces or punctuation.
  const normalised = value.startsWith("+") ? value : `+${value}`;
  return E164_REGEX.test(normalised);
}

/**
 * Normalises a phone number string to E.164 format.
 * react-phone-input-2 emits values WITHOUT the leading "+"; this helper
 * ensures the "+" is always present before the value is stored or validated.
 *
 * @param {string} rawValue - The raw value from react-phone-input-2.
 * @returns {string} The E.164 normalised number (e.g. "+12025550100").
 *
 * @example
 * normalisePhoneNumber("12025550100")  // → "+12025550100"
 * normalisePhoneNumber("+12025550100") // → "+12025550100" (idempotent)
 */
export function normalisePhoneNumber(rawValue) {
  if (!rawValue) return "";
  const trimmed = rawValue.trim();
  return trimmed.startsWith("+") ? trimmed : `+${trimmed}`;
}

/**
 * Yup-compatible test function for E.164 phone validation.
 * Use directly inside `.test("e164", message, isValidE164YupTest)`.
 *
 * @param {string | null | undefined} value
 * @returns {boolean}
 *
 * @example
 * phoneNumber: Yup.string()
 *   .required("Phone number is required")
 *   .test("e164", "Please enter a valid international phone number (e.g. +1 202 555 0100)", isValidE164YupTest)
 */
export function isValidE164YupTest(value) {
  return isValidE164Phone(value);
}

/**
 * Country codes to show at the top of the react-phone-input-2 dropdown.
 * This is a soft hint only — the user can still select any country.
 * Order: Egypt first, then major Gulf / Arab countries, then global defaults.
 */
export const PREFERRED_COUNTRIES = ["eg", "sa", "ae", "kw", "qa", "us", "gb"];
