import { z } from "zod";

/**
 * Zod validation schema for course enrollment application form
 * Matches the backend EnrollmentApplication model fields
 */
export const courseEnrollmentSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name must not exceed 100 characters")
      .regex(
        /^[a-zA-Z\s'-]+$/,
        "Full name can only contain letters, spaces, hyphens, and apostrophes",
      ),

    email: z
      .string()
      .email("Please enter a valid email address")
      .min(1, "Email is required"),

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
      .min(16, "You must be at least 16 years old")
      .max(100, "Please enter a valid age"),

    studyLevel: z.enum(["undergraduate", "postgraduate", "professional"], {
      errorMap: () => ({ message: "Please select your study level" }),
    }),

    university: z.string().optional(),

    faculty: z.string().optional(),

    whatsAppNumber: z
      .string()
      .min(1, "WhatsApp number is required")
      .regex(
        /^\+?[1-9]\d{1,14}$/,
        "Please enter a valid phone number in E.164 format (e.g., +201234567890)",
      ),

    courseId: z.string().min(1, "Course ID is required"),
  })
  .superRefine((data, ctx) => {
    // Conditional validation: university and faculty required for undergraduate and postgraduate
    if (
      data.studyLevel === "undergraduate" ||
      data.studyLevel === "postgraduate"
    ) {
      if (!data.university || data.university.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "University is required for undergraduate and postgraduate students",
          path: ["university"],
        });
      } else if (data.university.length > 200) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "University name must not exceed 200 characters",
          path: ["university"],
        });
      }

      if (!data.faculty || data.faculty.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Faculty is required for undergraduate and postgraduate students",
          path: ["faculty"],
        });
      } else if (data.faculty.length > 200) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Faculty name must not exceed 200 characters",
          path: ["faculty"],
        });
      }
    }
  });

export default courseEnrollmentSchema;
