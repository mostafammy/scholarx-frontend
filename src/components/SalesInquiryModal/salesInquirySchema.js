import { z } from "zod";

/**
 * Validation schema for the Sales Inquiry form.
 *
 * Phone number validation uses E.164 international format:
 *   + followed by 7–15 digits (country code + subscriber number).
 *   Examples: +201012345678 (Egypt), +12025550100 (USA), +447911123456 (UK).
 *
 * We accept both:
 *   - "+201012345678" (with + prefix, as returned by react-phone-input-2 after
 *     normalisation) — validated against E.164_REGEX directly.
 *   - "201012345678"  (without +) — the backend adds the + before forwarding
 *     to WhatsApp; our regex strips a leading + when present.
 *
 * This mirrors the backend Zod schema in salesInquiry.validator.ts.
 */

/** E.164: optional leading +, then 7–15 digits, first digit 1–9 */
const E164_DIGITS_REGEX = /^\+?[1-9]\d{6,14}$/;

export const salesInquirySchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters"),

  email: z.string().email("Please enter a valid email address"),

  // Accepts E.164 with or without the leading +.
  // react-phone-input-2 emits digits without +; normalisePhoneNumber() in the
  // component prepends it before form submission.
  whatsAppNumber: z
    .string()
    .min(1, "WhatsApp number is required")
    .regex(
      E164_DIGITS_REGEX,
      "Please enter a valid international phone number, e.g. +1 202 555 0100",
    ),

  company: z
    .string()
    .max(100, "Company name must be less than 100 characters")
    .optional()
    .or(z.literal("")),

  message: z
    .string()
    .max(1000, "Message must be less than 1000 characters")
    .optional()
    .or(z.literal("")),
});
