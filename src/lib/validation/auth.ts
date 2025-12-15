import { z } from "zod";

/**
 * Login schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "E-post er påkrevd")
    .email("Ugyldig e-postadresse"),
  password: z.string().min(6, "Passord må ha minst 6 tegn"),
});

export type LoginValues = z.infer<typeof loginSchema>;

/**
 * Register schema
 */
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Navn må ha minst 2 tegn")
      .max(80, "Navn kan ikke være lenger enn 80 tegn"),
    email: z
      .string()
      .min(1, "E-post er påkrevd")
      .email("Ugyldig e-postadresse"),
    password: z
      .string()
      .min(8, "Passord må ha minst 8 tegn")
      .max(128, "Passord kan ikke være lenger enn 128 tegn"),
    confirmPassword: z.string().min(1, "Bekreft passordet ditt"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passordene er ikke like",
  });

export type RegisterValues = z.infer<typeof registerSchema>;
