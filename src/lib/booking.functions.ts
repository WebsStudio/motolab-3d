import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { bookingSchema, type BookingValues } from "./schemas";

type BookingResult = { ok: true } | { ok: false; error: string };

function publishableClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    // Opaque sb_ keys aren't JWTs; send only apikey, not the default Authorization bearer.
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const submitBookingRequest = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => bookingSchema.parse(data))
  .handler(async ({ data }: { data: BookingValues }): Promise<BookingResult> => {
    const supabase = publishableClient();

    const phone = data.phone.replace(/[()\s-]/g, "");

    const { data: allowed, error: rateError } = await supabase.rpc("booking_rate_ok", {
      _phone: phone,
    });
    if (rateError) {
      console.error("booking rate check failed", rateError);
      return { ok: false, error: "No pudimos registrar la solicitud. Prueba en un momento." };
    }
    if (!allowed) {
      return {
        ok: false,
        error: "Ya tenemos una solicitud tuya hace unos minutos. Te llamamos enseguida.",
      };
    }

    const { error } = await supabase.from("booking_requests").insert({
      service: data.service,
      name: data.name,
      phone,
      email: data.email.toLowerCase(),
      bike_make: data.bikeMake,
      bike_model: data.bikeModel,
      bike_year: data.bikeYear,
      bike_notes: data.bikeNotes ?? "",
      preferred_date: data.preferredDate || null,
      preferred_slot: data.preferredSlot,
      flexibility: data.flexibility ?? "",
      notes: data.notes ?? "",
    });

    if (error) {
      console.error("booking insert failed", error);
      return {
        ok: false,
        error: "No pudimos guardar tu solicitud. Llámanos al 663 236 307 y te la apuntamos.",
      };
    }

    return { ok: true };
  });
