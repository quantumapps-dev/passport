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
  }, {
    message: "Please enter a valid date of birth",
  }),

  email: z.string({ required_error: "Email is required" }).email("Email must be valid"),

  citizenshipCertificate: z.instanceof(FileList, {
    required_error: "Citizenship certificate file is required",
    invalid_type_error: "Invalid file input",
  })
    .refine((fl) => fl.length === 1, { message: "Please upload one file" })
    .refine((fl) => {
      const f = fl[0];
      if (!f) return false;
      return f.type === "image/jpeg" || f.type === "application/pdf";
    }, { message: "File must be a JPEG image or PDF" })
    .refine((fl) => {
      const f = fl[0];
      if (!f) return false;
      return f.size <= 5 * 1024 * 1024;
    }, { message: "File must be 5MB or smaller" }),

  agreeToDeclaration: z
    .boolean({ required_error: "You must accept the declaration" })
    .refine((v) => v === true, { message: "You must accept the declaration" }),
});

export type FormData = z.infer<typeof FormSchema>;