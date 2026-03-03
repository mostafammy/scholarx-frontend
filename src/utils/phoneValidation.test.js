/**
 * phoneValidation.test.js
 *
 * Unit tests for the phoneValidation utility.
 * Run with: npx vitest run src/utils/phoneValidation.test.js
 */

import { describe, it, expect } from "vitest";
import {
  isValidE164Phone,
  normalisePhoneNumber,
  PREFERRED_COUNTRIES,
} from "./phoneValidation";

// ─────────────────────────────────────────────────────────────
// isValidE164Phone
// ─────────────────────────────────────────────────────────────

describe("isValidE164Phone", () => {
  // ── Valid numbers ──────────────────────────────────────────
  it("accepts a valid Egyptian number with + prefix", () => {
    expect(isValidE164Phone("+201012345678")).toBe(true);
  });

  it("accepts a valid US number with + prefix", () => {
    expect(isValidE164Phone("+12025550100")).toBe(true);
  });

  it("accepts a valid UK number with + prefix", () => {
    expect(isValidE164Phone("+447911123456")).toBe(true);
  });

  it("accepts a valid Saudi number with + prefix", () => {
    expect(isValidE164Phone("+966512345678")).toBe(true);
  });

  it("accepts a number WITHOUT + prefix (normalises internally)", () => {
    // react-phone-input-2 emits without +; we still want isValidE164Phone
    // to return true after internal normalisation so Yup doesn't reject it
    // before the + is added.
    expect(isValidE164Phone("12025550100")).toBe(true);
  });

  it("accepts short but valid number (7-digit subscriber)", () => {
    // E.164 minimum: +1 + 6 digits = 8 chars total
    expect(isValidE164Phone("+1234567")).toBe(true);
  });

  // ── Invalid numbers ────────────────────────────────────────
  it("rejects old 11-digit Egyptian format without country code", () => {
    expect(isValidE164Phone("01012345678")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(isValidE164Phone("")).toBe(false);
  });

  it("rejects null", () => {
    expect(isValidE164Phone(null)).toBe(false);
  });

  it("rejects undefined", () => {
    expect(isValidE164Phone(undefined)).toBe(false);
  });

  it("rejects too-short number", () => {
    expect(isValidE164Phone("+123")).toBe(false);
  });

  it("rejects number starting with zero after +", () => {
    // Country codes never start with 0
    expect(isValidE164Phone("+0123456789")).toBe(false);
  });

  it("rejects non-numeric characters", () => {
    expect(isValidE164Phone("+1 (202) 555-0100")).toBe(false);
  });

  it("rejects number that is too long (16+ digits)", () => {
    expect(isValidE164Phone("+1234567890123456")).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────
// normalisePhoneNumber
// ─────────────────────────────────────────────────────────────

describe("normalisePhoneNumber", () => {
  it("prepends + when missing", () => {
    expect(normalisePhoneNumber("12025550100")).toBe("+12025550100");
  });

  it("is idempotent when + is already present", () => {
    expect(normalisePhoneNumber("+12025550100")).toBe("+12025550100");
  });

  it("trims whitespace before normalising", () => {
    expect(normalisePhoneNumber("  12025550100  ")).toBe("+12025550100");
  });

  it("returns empty string for falsy input", () => {
    expect(normalisePhoneNumber("")).toBe("");
    expect(normalisePhoneNumber(null)).toBe("");
    expect(normalisePhoneNumber(undefined)).toBe("");
  });
});

// ─────────────────────────────────────────────────────────────
// PREFERRED_COUNTRIES
// ─────────────────────────────────────────────────────────────

describe("PREFERRED_COUNTRIES", () => {
  it("is a non-empty array", () => {
    expect(Array.isArray(PREFERRED_COUNTRIES)).toBe(true);
    expect(PREFERRED_COUNTRIES.length).toBeGreaterThan(0);
  });

  it("contains Egypt as the first entry", () => {
    expect(PREFERRED_COUNTRIES[0]).toBe("eg");
  });

  it("contains all lowercase ISO 3166-1 alpha-2 codes", () => {
    for (const code of PREFERRED_COUNTRIES) {
      expect(code).toMatch(/^[a-z]{2}$/);
    }
  });
});
