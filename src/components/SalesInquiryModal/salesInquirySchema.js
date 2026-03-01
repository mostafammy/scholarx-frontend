import { z } from "zod";

/**
 * Validation schema for the Sales Inquiry form.
 * Aligns with backend validation rules from the API spec.
 */
export const salesInquirySchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters"),

  email: z.string().email("Please enter a valid email address"),

  // Digits only (no + prefix). Strip spaces/dashes before sending.
  // API handles the + prefix server-side.
  whatsAppNumber: z
    .string()
    .regex(
      /^\d{7,15}$/,
      "Enter digits only, no spaces or dashes (e.g. 201012345678)",
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
