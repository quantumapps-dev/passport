import { z } from "zod";

// Address schema for US addresses only
export const AddressSchema = z.object({
	line1: z
		.string()
		.min(1, "Address Line 1 is required.")
		.describe(
			"Primary street address line. Include house/building number and street name (e.g., 123 Main St).",
		),
	line2: z
		.string()
		.optional()
		.describe(
			"Additional address information such as apartment, suite, unit, or floor (optional).",
		),
	street: z
		.string()
		.min(1, "Street is required.")
		.describe(
			"Street name if captured separately (e.g., Main St). If already in Line 1, repeat here for clarity.",
		),
	city: z
		.string()
		.min(1, "City is required.")
		.describe("City name within the United States (e.g., San Francisco)."),
	state: z
		.string()
		.min(1, "State is required.")
		.describe("State name within the United States (e.g., California)."),
	country: z
		.string()
		.describe(
			"Country must be the United States. Accepted inputs: United States, US, USA, unitedstates, us, usa.",
		),
	zipCode: z
		.string()
		.trim()
		.regex(/^[0-9]{5}(?:-[0-9]{4})?$/, "Enter a valid US ZIP code (e.g., 94103 or 94103-1234).")
		.describe(
			"5-digit US ZIP code, with optional 4-digit extension (ZIP+4). Will be verified against a postal API.",
		),
});

export const FormSchema = z.object({
	name: z
		.string()
		.min(1, "Name is required.")
		.describe("Full legal name of the person filling out the form."),
	email: z
		.string()
		.email("Enter a valid email address.")
		.describe(
			"Primary contact email address. Must be a valid format (e.g., name@example.com).",
		),
	address: AddressSchema.describe("Mailing address located in the United States."),
});

export type AddressData = z.infer<typeof AddressSchema>;
export type FormData = z.infer<typeof FormSchema>;


