import { describe, expect, it } from "vitest";

import { bookingSchema } from "@/lib/schemas";

// A submission as the form sends it: service, motorcycle data, availability.
const valid = {
  service: "Mantenimiento",
  name: "Aina Fullana",
  phone: "663 236 307",
  email: "aina@moto.example",
  bikeMake: "Triumph",
  bikeModel: "Bonneville T120",
  bikeYear: "2019",
  bikeNotes: "Aceite bajo",
  preferredDate: "2026-11-05",
  preferredSlot: "tarde" as const,
  flexibility: "Cualquier tarde menos los viernes",
  notes: "Ruido raro en frío",
};

describe("Booking request validation", () => {
  it("accepts a complete request and keeps the motorcycle data and availability", () => {
    const parsed = bookingSchema.parse(valid);

    expect(parsed.bikeMake).toBe("Triumph");
    expect(parsed.bikeModel).toBe("Bonneville T120");
    expect(parsed.bikeYear).toBe("2019");
    expect(parsed.preferredDate).toBe("2026-11-05");
    expect(parsed.preferredSlot).toBe("tarde");
    expect(parsed.service).toBe("Mantenimiento");
  });

  it("rejects a phone number that is too short to dial", () => {
    expect(bookingSchema.safeParse({ ...valid, phone: "6632363" }).success).toBe(false);
  });

  it("rejects a motorcycle year that is not a plausible four-digit year", () => {
    expect(bookingSchema.safeParse({ ...valid, bikeYear: "19" }).success).toBe(false);
    expect(bookingSchema.safeParse({ ...valid, bikeYear: "1969" }).success).toBe(false);
  });

  it("rejects a missing or malformed email so the owner cannot lose the contact", () => {
    expect(bookingSchema.safeParse({ ...valid, email: "" }).success).toBe(false);
    expect(bookingSchema.safeParse({ ...valid, email: "aina@moto" }).success).toBe(false);
  });

  it("rejects an empty service and an availability slot the workshop does not offer", () => {
    expect(bookingSchema.safeParse({ ...valid, service: "" }).success).toBe(false);
    expect(bookingSchema.safeParse({ ...valid, preferredSlot: "medianoche" }).success).toBe(false);
  });

  it("allows the optional availability notes to be left out entirely", () => {
    const { flexibility, notes, bikeNotes, preferredDate, ...rest } = valid;

    const parsed = bookingSchema.parse(rest);

    expect(parsed.preferredDate).toBeUndefined();
    expect(parsed.flexibility).toBe("");
    expect(parsed.notes).toBe("");
    expect(parsed.bikeNotes).toBe("");
  });
});
