/**
 * Unit Tests for errorUtils.js
 *
 * Run with: npx vitest run src/utils/errorUtils.test.js
 * Or: npm test -- errorUtils
 */

import { describe, it, expect } from "vitest";
import { extractErrorMessage, isEmailRelatedError } from "./errorUtils";

describe("extractErrorMessage", () => {
  it("returns the message directly if error is a string", () => {
    expect(extractErrorMessage("Direct error message")).toBe(
      "Direct error message",
    );
  });

  it("handles JSend error format with top-level message", () => {
    const error = {
      response: {
        data: {
          status: "error",
          message: "User already exists",
        },
      },
    };
    expect(extractErrorMessage(error)).toBe("User already exists");
  });

  it("handles JSend fail format with string data", () => {
    const error = {
      response: {
        data: {
          status: "fail",
          data: "Invalid email format",
        },
      },
    };
    expect(extractErrorMessage(error)).toBe("Invalid email format");
  });

  it("handles nested data.message format", () => {
    const error = {
      response: {
        data: {
          status: "fail",
          data: {
            message: "Email is already registered",
          },
        },
      },
    };
    expect(extractErrorMessage(error)).toBe("Email is already registered");
  });

  it("handles standard Error object", () => {
    const error = new Error("Network Error");
    expect(extractErrorMessage(error)).toBe("Network Error");
  });

  it("handles Axios network errors without response", () => {
    const error = {
      message: "Network Error",
      code: "ERR_NETWORK",
    };
    expect(extractErrorMessage(error)).toBe("Network Error");
  });

  it("returns fallback for null/undefined", () => {
    expect(extractErrorMessage(null)).toBe("An unexpected error occurred.");
    expect(extractErrorMessage(undefined)).toBe(
      "An unexpected error occurred.",
    );
  });

  it("returns custom fallback when provided", () => {
    expect(extractErrorMessage(null, "Custom fallback")).toBe(
      "Custom fallback",
    );
  });

  it("ignores empty string messages", () => {
    const error = {
      response: {
        data: {
          message: "   ",
        },
      },
    };
    expect(extractErrorMessage(error, "Fallback")).toBe("Fallback");
  });
});

describe("isEmailRelatedError", () => {
  it('returns true for messages containing "email"', () => {
    expect(isEmailRelatedError("Invalid email format")).toBe(true);
    expect(isEmailRelatedError("Email is required")).toBe(true);
  });

  it('returns true for messages containing "already exists"', () => {
    expect(isEmailRelatedError("User already exists")).toBe(true);
  });

  it('returns true for messages containing "already registered"', () => {
    expect(isEmailRelatedError("This account is already registered")).toBe(
      true,
    );
  });

  it("returns false for unrelated messages", () => {
    expect(isEmailRelatedError("Invalid password")).toBe(false);
    expect(isEmailRelatedError("Network Error")).toBe(false);
  });

  it("returns false for non-string input", () => {
    expect(isEmailRelatedError(null)).toBe(false);
    expect(isEmailRelatedError(undefined)).toBe(false);
    expect(isEmailRelatedError(123)).toBe(false);
  });

  it("is case-insensitive", () => {
    expect(isEmailRelatedError("EMAIL IS INVALID")).toBe(true);
    expect(isEmailRelatedError("Already Exists")).toBe(true);
  });
});
