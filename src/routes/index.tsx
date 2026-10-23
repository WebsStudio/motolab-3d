import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense, useRef, type MouseEvent, type ReactNode } from "react";
import { Phone, MessageCircle, Wrench, Gauge, CircleDot, ScanLine, ClipboardCheck, Sparkles, MapPin, Clock } from "lucide-react";
import { Reviews } from "@/components/Reviews";

const Moto3D = lazy(() => import("@/components/Moto3D"));

const TEL = "tel:+34663236307";
const WA = "https://wa.me/34663236307?text=Hola%20BLACKSHIFT%2C%20quiero%20pedir%20cita";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BLACKSHIFT Moto · Taller de motos en Inca, Mallorca" },
      { name: "description", content: "Taller de motos en Inca: mantenimiento, mecánica, neumáticos, diagnóstico e ITV. Llama o escríbenos por WhatsApp al 663 236 307." },
      { property: "og:title", content: "BLACKSHIFT Moto · Taller de motos en Inca" },
      { property: "og:description", content: "Mecánica de motos con pasión en Inca, Mallorca. Pide cita por teléfono o WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const SERVICES = [
  { icon: Wrench, t: "Mantenimiento", d: "Aceite, filtros, frenos y revisiones oficiales." },
  { icon: Gauge, t: "Mecánica", d: "Motor, transmisión y embrague de cualquier marca." },
  { icon: CircleDot, t: "Neumáticos", d: "Montaje, equilibrado y las mejores marcas." },
  { icon: ScanLine, t: "Diagnóstico", d: "Diagnosis electrónica y localización de averías." },
  { icon: ClipboardCheck, t: "Pre-ITV", d: "Te la dejamos lista para pasar a la primera." },
  { icon: Sparkles, t: "Personalización", d: "Escapes, iluminación y piezas a medida." },
];

function TiltCard({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: MouseEvent) => {
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateY(${x * 16}deg) rotateX(${-y * 16}deg) translateZ(10px)`;
  };
  return (
    <div className="[perspective:900px]">
      <div ref={ref} onMouseMove={move} onMouseLeave={() => ref.current && (ref.current.style.transform = "")} className="service-card">
        {children}
      </div>
    </div>
  );
}

function Index() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border/50 bg-background/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#" className="font-display text-3xl tracking-wider">BLACK<span className="text-primary">SHIFT</span></a>
          <nav className="hidden gap-8 text-sm uppercase tracking-widest text-muted-foreground md:flex">
            <a href="#servicios" className="hover:text-primary">Servicios</a>
            <a href="#resenas" className="hover:text-primary">Reseñas</a>
            <a href="#visitanos" className="hover:text-primary">Visítanos</a>
          </nav>
          <a href={TEL} className="btn-ember !py-2 !text-sm"><Phone className="h-4 w-4" /> 663 236 307</a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative h-[100svh] min-h-[640px]">
        <div className="absolute inset-0">
          <ClientOnly fallback={null}>
            <Suspense fallback={null}><Moto3D /></Suspense>
          </ClientOnly>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-hero-fade" />
        <div className="pointer-events-none relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-6 pb-16">
          <p className="eyebrow">Taller de motos · Inca, Mallorca</p>
          <h1 className="font-display text-[22vw] leading-[0.8] md:text-[11rem]">
            BLACK<span className="text-stroke">SHIFT</span>
          </h1>
          <p className="mt-4 max-w-md text-lg text-muted-foreground">Mecánica de precisión para quien vive sobre dos ruedas. Tu moto, en las mejores manos.</p>
          <div className="pointer-events-auto mt-8 flex flex-wrap gap-4">
            <a href={TEL} className="btn-ember"><Phone className="h-5 w-5" /> Llamar ahora</a>
            <a href={WA} target="_blank" rel="noreferrer" className="btn-ghost"><MessageCircle className="h-5 w-5" /> WhatsApp</a>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="overflow-hidden border-y border-border bg-primary py-3 text-primary-foreground">
        <div className="marquee font-display text-3xl tracking-wider whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k} className="inline-block">MANTENIMIENTO ✦ MECÁNICA ✦ NEUMÁTICOS ✦ DIAGNÓSTICO ✦ PRE-ITV ✦ PERSONALIZACIÓN ✦&nbsp;</span>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <section id="servicios" className="mx-auto max-w-6xl px-6 py-28">
        <p className="eyebrow">Qué hacemos</p>
        <h2 className="font-display text-6xl leading-none md:text-8xl">Servicios</h2>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({ icon: Icon, t, d }, k) => (
            <TiltCard key={t}>
              <span className="font-display text-5xl text-muted">0{k + 1}</span>
              <Icon className="mt-4 h-9 w-9 text-primary" />
              <h3 className="mt-4 font-display text-3xl tracking-wide">{t}</h3>
              <p className="mt-2 text-muted-foreground">{d}</p>
            </TiltCard>
          ))}
        </div>
      </section>

      <Reviews />

      {/* STATS */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-16 md:grid-cols-4">
          {[["12", "años de experiencia"], ["4.500+", "motos reparadas"], ["24h", "revisiones express"], ["100%", "marcas atendidas"]].map(([n, l]) => (
            <div key={l}>
              <div className="font-display text-6xl text-primary md:text-7xl">{n}</div>
              <div className="text-sm uppercase tracking-widest text-muted-foreground">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* VISIT */}
      <section id="visitanos" className="mx-auto grid max-w-6xl gap-10 px-6 py-28 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Ven a vernos</p>
          <h2 className="font-display text-6xl leading-none md:text-8xl">Visítanos</h2>
          <div className="mt-10 space-y-6">
            <div className="flex gap-4"><MapPin className="h-6 w-6 shrink-0 text-primary" /><div><p className="font-semibold">Inca, Mallorca</p><p className="text-muted-foreground">Illes Balears, España</p></div></div>
            <div className="flex gap-4"><Clock className="h-6 w-6 shrink-0 text-primary" />
              <div className="w-full max-w-xs text-muted-foreground">
                <div className="flex justify-between"><span>Lunes – Viernes</span><span className="text-foreground">8:30 – 13:30 · 15:30 – 19:00</span></div>
                <div className="flex justify-between"><span>Sábado</span><span className="text-foreground">9:00 – 13:00</span></div>
                <div className="flex justify-between"><span>Domingo</span><span>Cerrado</span></div>
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href={TEL} className="btn-ember"><Phone className="h-5 w-5" /> 663 236 307</a>
            <a href={WA} target="_blank" rel="noreferrer" className="btn-ghost"><MessageCircle className="h-5 w-5" /> Escríbenos</a>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border shadow-ember">
          <iframe title="Mapa BLACKSHIFT Moto Inca" src="https://www.google.com/maps?q=Inca,+Mallorca&output=embed" className="map-frame h-full min-h-[380px] w-full" loading="lazy" />
        </div>
      </section>

      <footer className="border-t border-border py-10 text-center text-sm text-muted-foreground">
        <p className="font-display text-2xl tracking-wider text-foreground">BLACK<span className="text-primary">SHIFT</span> MOTO</p>
        <p className="mt-2">Inca, Mallorca · 663 236 307 · © {new Date().getFullYear()}</p>
      </footer>

      <a href={WA} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="wa-float"><MessageCircle className="h-7 w-7" /></a>
    </main>
  );
}
