// @ts-nocheck 
 import { z } from "zod";

function today() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export const FormSchema = z.object({
  firstName: z
    .string({ required_error: "First name is required" })
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be at most 50 characters"),

  middleName: z
    .string()
    .trim()
    .min(1, "Middle name must be at least 1 character")
    .max(50, "Middle name must be at most 50 characters")
    .optional(),

  lastName: z
    .string({ required_error: "Last name is required" })
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be at most 50 characters"),

  dateOfBirth: z.coerce.date({
    required_error: "Date of birth is required",
    invalid_type_error: "Date of birth is invalid",
  }).refine((d) => {
    const now = today();
    if (!(d instanceof Date) || isNaN(d.getTime())) return false;
    const age = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
    return age >= 0 && age <= 120;
  }, {
    message: "Please enter a valid date of birth",
  }),

  gender: z.enum(["Male", "Female", "X", "PreferNotToSay"], {
    required_error: "Gender is required",
  }),

  email: z.string({ required_error: "Email is required" }).email("Email must be valid"),

  phone: z
    .string({ required_error: "Phone number is required" })
    .regex(/^\+?1?\s*\-?\(?\d{3}\)?\s*\-?\d{3}\s*\-?\d{4}$/, "Phone number must be a valid US phone number"),

  ssn: z
    .string()
    .regex(/^\d{3}-?\d{2}-?\d{4}$/, "SSN must be 9 digits (with or without dashes)")
    .optional(),

  address: z.object({
    street: z
      .string({ required_error: "Street address is required" })
      .trim()
      .min(5, "Street must be at least 5 characters")
      .max(100, "Street must be at most 100 characters"),
    city: z
      .string({ required_error: "City is required" })
      .trim()
      .min(2, "City must be at least 2 characters")
      .max(50, "City must be at most 50 characters"),
    state: z
      .string({ required_error: "State is required" })
      .trim()
      .min(2, "State must be at least 2 characters")
      .max(50, "State must be at most 50 characters"),
    zip: z
      .string({ required_error: "ZIP code is required" })
      .regex(/^\d{5}(-\d{4})?$/, "ZIP code must be 5 digits or ZIP+4"),
    country: z
      .string({ required_error: "Country is required" })
      .trim()
      .min(2, "Country must be at least 2 characters")
      .max(56, "Country must be at most 56 characters"),
  }),

  passportType: z.enum(["Book", "Card", "BookAndCard"], { required_error: "Passport type is required" }),

  applicationType: z.enum(["New", "Renewal", "Replacement"], { required_error: "Application type is required" }),

  previousPassportNumber: z
    .string()
    .trim()
    .min(5, "Passport number must be at least 5 characters")
    .max(30, "Passport number must be at most 30 characters")
    .optional(),

  agreeToDeclaration: z
    .boolean({ required_error: "You must accept the declaration" })
    .refine((v) => v === true, { message: "You must accept the declaration" }),
});

export type FormData = z.infer<typeof FormSchema>;