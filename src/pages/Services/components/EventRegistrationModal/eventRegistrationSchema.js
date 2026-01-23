import { z } from "zod";

/**
 * Zod validation schema for event registration form
 * Implements conditional validation for university and faculty fields
 */
export const eventRegistrationSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name must not exceed 100 characters")
      .regex(
        /^[a-zA-Z\s'-]+$/,
        "Full name can only contain letters, spaces, hyphens, and apostrophes",
      ),

    location: z
      .string()
      .min(2, "Location must be at least 2 characters")
      .max(100, "Location must not exceed 100 characters"),

    age: z
      .number({
        required_error: "Age is required",
        invalid_type_error: "Age must be a number",
      })
      .int("Age must be a whole number")
      .min(17, "You must be at least 17 years old")
      .max(120, "Please enter a valid age"),

    studyLevel: z.enum(["undergraduate", "postgraduate", "professional"], {
      errorMap: () => ({ message: "Please select your study level" }),
    }),

    // Backend requires an eventId (MongoDB ObjectId)
    eventId: z
      .string()
      .regex(/^[a-fA-F0-9]{24}$/, "Event ID must be a valid MongoDB ObjectId"),

    university: z.string().optional(),

    faculty: z.string().optional(),

    email: z
      .string()
      .email("Please enter a valid email address")
      .min(1, "Email is required"),

    whatsAppNumber: z
      .string()
      .min(1, "WhatsApp number is required")
      .regex(
        /^[+]?[1-9]\d{1,14}$/,
        "Please enter a valid phone number in E.164 format (e.g., +491701234567)",
      ),

    interests: z
      .array(z.string())
      .min(1, "Please select at least one interest")
      .max(8, "You can select up to 8 interests"),
  })
  .superRefine((data, ctx) => {
    // Conditional validation: university and faculty are required if studyLevel is undergraduate or postgraduate
    if (
      data.studyLevel === "undergraduate" ||
      data.studyLevel === "postgraduate"
    ) {
      if (!data.university || data.university.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "University is required for undergraduate and graduated students",
          path: ["university"],
        });
      } else if (data.university.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "University name must be at least 2 characters",
          path: ["university"],
        });
      } else if (data.university.length > 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "University name must not exceed 100 characters",
          path: ["university"],
        });
      }

      if (!data.faculty || data.faculty.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Faculty is required for undergraduate and graduated students",
          path: ["faculty"],
        });
      } else if (data.faculty.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Faculty name must be at least 2 characters",
          path: ["faculty"],
        });
      } else if (data.faculty.length > 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Faculty name must not exceed 100 characters",
          path: ["faculty"],
        });
      }
    }
  });

// Export the schema as the default export
export default eventRegistrationSchema;
