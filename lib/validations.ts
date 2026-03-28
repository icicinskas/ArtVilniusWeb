import { z } from "zod"

/**
 * Email validacijos schema
 */
export const emailSchema = z
  .string()
  .min(1, "Email yra privalomas")
  .email("Netinkamas email formatas")
  .toLowerCase()
  .trim()

/**
 * Slaptažodžio validacijos schema
 * Reikalavimai:
 * - Minimum 8 simbolių
 * - Bent vienas didžioji raidė
 * - Bent vienas skaičius
 * - Bent vienas specialus simbolis
 */
export const passwordSchema = z
  .string()
  .min(8, "Slaptažodis turi būti bent 8 simbolių")
  .regex(/[A-Z]/, "Slaptažodis turi turėti bent vieną didžiąją raidę")
  .regex(/[0-9]/, "Slaptažodis turi turėti bent vieną skaičių")
  .regex(/[^A-Za-z0-9]/, "Slaptažodis turi turėti bent vieną specialų simbolį")

/**
 * Vardo validacijos schema
 */
export const nameSchema = z
  .string()
  .min(2, "Vardas turi būti bent 2 simbolių")
  .max(100, "Vardas negali būti ilgesnis nei 100 simbolių")
  .trim()
  .optional()

/**
 * Registracijos formos schema
 */
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
})

/**
 * Prisijungimo formos schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Slaptažodis yra privalomas"),
})

/**
 * Tipai iš schemų
 */
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
