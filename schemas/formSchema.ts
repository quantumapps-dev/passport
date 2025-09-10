// @ts-nocheck 
 import { z } from "zod";

function today(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export const FormSchema = z
  .object({
    firstName: z
      .string({ required_error: "First name is required" })
      .trim()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must be at most 50 characters"),

    lastName: z
      .string({ required_error: "Last name is required" })
      .trim()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must be at most 50 characters"),

    dateOfBirth: z.coerce.date({
      required_error: "Date of birth is required",
      invalid_type_error: "Date of birth is invalid",
    }).refine((d) => {
      if (!(d instanceof Date) || isNaN(d.getTime())) return false;
      const now = today();
      const age = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
      return age >= 0 && age <= 120;
    }, { message: "Please enter a valid date of birth" }),

    hasSpouse: z.boolean({ required_error: "Please indicate if you have a spouse" }),

    spouseNames: z
      .array(
        z.object({
          name: z
            .string({ required_error: "Spouse name is required" })
            .trim()
            .min(2, "Spouse name must be at least 2 characters")
            .max(100, "Spouse name must be at most 100 characters"),
        })
      )
      .optional(),

    hasChildren: z.boolean({ required_error: "Please indicate if you have children" }),

    childrenNames: z
      .array(
        z.object({
          name: z
            .string({ required_error: "Child name is required" })
            .trim()
            .min(2, "Child name must be at least 2 characters")
            .max(100, "Child name must be at most 100 characters"),
        })
      )
      .optional(),

    email: z.string({ required_error: "Email is required" }).email("Email must be valid"),

    phone: z
      .string({ required_error: "Phone number is required" })
      .trim()
      .min(7, "Phone number must be at least 7 characters")
      .max(30, "Phone number must be at most 30 characters"),
  })
  .superRefine((data, ctx) => {
    if (data.hasSpouse) {
      if (!data.spouseNames || data.spouseNames.length === 0) {
        ctx.addIssue({ path: ["spouseNames"], code: z.ZodIssueCode.custom, message: "Please provide at least one spouse name" });
      }
    }

    if (!data.hasSpouse && data.spouseNames && data.spouseNames.length > 0) {
      ctx.addIssue({ path: ["spouseNames"], code: z.ZodIssueCode.custom, message: "Spouse names provided but 'Has spouse' is not checked" });
    }

    if (data.hasChildren) {
      if (!data.childrenNames || data.childrenNames.length === 0) {
        ctx.addIssue({ path: ["childrenNames"], code: z.ZodIssueCode.custom, message: "Please provide at least one child name" });
      }
    }

    if (!data.hasChildren && data.childrenNames && data.childrenNames.length > 0) {
      ctx.addIssue({ path: ["childrenNames"], code: z.ZodIssueCode.custom, message: "Children names provided but 'Has children' is not checked" });
    }
  });

export type FormData = z.infer<typeof FormSchema>;
