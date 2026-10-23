import { z } from "zod";

export const SERVICE_OPTIONS = [
  "Mantenimiento",
  "Mecánica",
  "Neumáticos",
  "Diagnóstico",
  "Pre-ITV",
  "Personalización",
  "Otro",
] as const;

export const SLOT_OPTIONS = [
  { value: "manana", label: "Mañana (9:00 – 13:00)" },
  { value: "tarde", label: "Tarde (15:00 – 19:00)" },
  { value: "indiferente", label: "Me da igual" },
] as const;

export const bookingSchema = z.object({
  service: z.string().min(2, "Elige un servicio").max(60),
  name: z.string().trim().min(2, "Dinos tu nombre").max(60),
  phone: z
    .string()
    .trim()
    .regex(/^[+0-9()\s-]{6,20}$/, "Teléfono no válido")
    .refine((v) => v.replace(/\D/g, "").length >= 9, "Faltan dígitos en el teléfono"),
  email: z.string().trim().min(1, "Necesitamos tu email").max(120).email("Email no válido"),
  bikeMake: z.string().trim().min(1, "Indica la marca").max(40),
  bikeModel: z.string().trim().min(1, "Indica el modelo").max(60),
  bikeYear: z
    .string()
    .trim()
    .regex(/^\d{4}$/, "Año con 4 dígitos")
    .refine((v) => {
      const y = Number(v);
      const now = new Date().getFullYear();
      return y >= 1970 && y <= now + 1;
    }, "Año fuera de rango"),
  bikeNotes: z.string().trim().max(300).optional().default(""),
  preferredDate: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha no válida")
    .optional()
    .or(z.literal("")),
  preferredSlot: z.enum(["manana", "tarde", "indiferente"]),
  flexibility: z.string().trim().max(200).optional().default(""),
  notes: z.string().trim().max(600).optional().default(""),
});

export type BookingValues = z.infer<typeof bookingSchema>;
