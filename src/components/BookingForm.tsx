import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CalendarDays, Loader2, Send } from "lucide-react";
import { submitBookingRequest } from "@/lib/booking.functions";
import { bookingSchema, SERVICE_OPTIONS, SLOT_OPTIONS, type BookingValues } from "@/lib/schemas";

const defaultValues: BookingValues = {
  service: "Mantenimiento",
  name: "",
  phone: "",
  email: "",
  bikeMake: "",
  bikeModel: "",
  bikeYear: "",
  bikeNotes: "",
  preferredDate: "",
  preferredSlot: "indiferente",
  flexibility: "",
  notes: "",
};

export function BookingForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues,
  });

  const onSubmit = handleSubmit(async (values) => {
    const result = await submitBookingRequest({ data: values });
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("¡Solicitud enviada! Te llamamos para confirmar la cita.");
    reset(defaultValues);
  });

  const err = (k: keyof BookingValues) =>
    errors[k]?.message ? (
      <span className="mt-1 block text-xs text-destructive">{errors[k]?.message}</span>
    ) : null;

  return (
    <form onSubmit={onSubmit} noValidate className="booking-card">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="field">
          <span>Servicio</span>
          <select {...register("service")}>
            {SERVICE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {err("service")}
        </label>

        <label className="field">
          <span>Teléfono</span>
          <input
            type="tel"
            autoComplete="tel"
            placeholder="663 236 307"
            {...register("phone")}
          />
          {err("phone")}
        </label>

        <label className="field">
          <span>Nombre</span>
          <input autoComplete="name" placeholder="Tu nombre" {...register("name")} />
          {err("name")}
        </label>

        <label className="field">
          <span>Email</span>
          <input
            type="email"
            autoComplete="email"
            placeholder="tu@email.com"
            {...register("email")}
          />
          {err("email")}
        </label>
      </div>

      <p className="mt-8 font-display text-2xl tracking-wide text-primary">Tu moto</p>
      <div className="mt-4 grid gap-5 md:grid-cols-3">
        <label className="field">
          <span>Marca</span>
          <input placeholder="Triumph" {...register("bikeMake")} />
          {err("bikeMake")}
        </label>
        <label className="field">
          <span>Modelo</span>
          <input placeholder="Bonneville T120" {...register("bikeModel")} />
          {err("bikeModel")}
        </label>
        <label className="field">
          <span>Año</span>
          <input inputMode="numeric" placeholder="2019" {...register("bikeYear")} />
          {err("bikeYear")}
        </label>
      </div>
      <label className="field mt-5">
        <span>Cambios, extras o algo que debamos saber</span>
        <textarea rows={2} placeholder="Escape, filtro, ruido raro en frío…" {...register("bikeNotes")} />
        {err("bikeNotes")}
      </label>

      <p className="mt-8 font-display text-2xl tracking-wide text-primary">Disponibilidad</p>
      <div className="mt-4 grid gap-5 md:grid-cols-2">
        <label className="field">
          <span>
            <CalendarDays className="inline h-4 w-4" /> Día preferido
          </span>
          <input type="date" {...register("preferredDate")} />
          {err("preferredDate")}
        </label>
        <label className="field">
          <span>Franja</span>
          <select {...register("preferredSlot")}>
            {SLOT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {err("preferredSlot")}
        </label>
      </div>
      <label className="field mt-5">
        <span>Si no encaja, ¿qué otros días u horas te van bien?</span>
        <input placeholder="Cualquier día por la tarde, salvo los viernes" {...register("flexibility")} />
        {err("flexibility")}
      </label>
      <label className="field mt-5">
        <span>Qué le pasa a la moto</span>
        <textarea rows={3} placeholder="Cuéntanos qué nota la moto y desde cuándo" {...register("notes")} />
        {err("notes")}
      </label>

      <button type="submit" className="btn-ember mt-8 w-full justify-center" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Send className="h-5 w-5" />
        )}
        {isSubmitting ? "Enviando…" : "Pedir cita"}
      </button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Te llamamos para confirmar día y hora. Sin compromiso.
      </p>
    </form>
  );
}
