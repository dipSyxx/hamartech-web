import { z } from "zod";

/**
 * Login schema
 */
export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(3, "E-post eller telefon er påkrevd"),
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
    phone: z
      .string()
      .trim()
      .min(4, "Telefonnummer er for kort")
      .max(30, "Telefonnummer er for langt"),
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
