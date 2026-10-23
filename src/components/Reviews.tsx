import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const REVIEWS = [
  { name: "Toni M.", bike: "Yamaha MT-07", text: "Me dejaron la moto como nueva en un día. Trato cercano y precio honesto. Repetiré seguro." },
  { name: "Laura P.", bike: "Vespa GTS 300", text: "Explican todo lo que hacen y por qué. Por fin un taller de confianza en Inca." },
  { name: "Miquel R.", bike: "Ducati Monster", text: "Diagnóstico rapidísimo de una avería que otros no encontraban. Auténticos profesionales." },
  { name: "Sergio G.", bike: "Honda CB650R", text: "Revisión y neumáticos en tiempo récord. La moto va finísima. 100% recomendable." },
  { name: "Aina F.", bike: "KTM Duke 390", text: "Me prepararon la ITV y pasó a la primera. Atención de diez, muy amables." },
  { name: "Pere J.", bike: "BMW R nineT", text: "Personalización impecable, cuidan cada detalle. Se nota la pasión por las motos." },
];

export function Reviews() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = REVIEWS.length;
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((v) => v + 1), 4000);
    return () => clearInterval(t);
  }, [paused]);
  const step = 360 / n;
  const active = ((i % n) + n) % n;

  return (
    <section id="resenas" className="relative overflow-hidden py-28">
      <div className="pointer-events-none absolute inset-0 bg-ember-radial" />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid items-end gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <p className="eyebrow">Lo que dicen los moteros</p>
            <h2 className="font-display text-6xl leading-none md:text-8xl">Reseñas <span className="text-primary">reales</span></h2>
          </div>
          <div className="flex items-center gap-5 rounded-2xl border border-border bg-card/70 p-5 backdrop-blur">
            <span className="font-display text-7xl leading-none text-primary">4.9</span>
            <div>
              <div className="flex gap-1 text-primary">{Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-5 w-5 fill-current" />)}</div>
              <p className="mt-1 text-sm text-muted-foreground">+180 opiniones de clientes</p>
            </div>
          </div>
        </div>

        <div
          className="relative mt-16 h-[380px] [perspective:1400px]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            className="absolute left-1/2 top-0 h-full w-[280px] transition-transform duration-1000 ease-out [transform-style:preserve-3d] md:w-[340px]"
            style={{ transform: `translateX(-50%) translateZ(-420px) rotateY(${-i * step}deg)` }}
          >
            {REVIEWS.map((r, k) => (
              <article
                key={r.name}
                className={`review-card absolute inset-x-0 top-6 [backface-visibility:hidden] ${k === active ? "is-active" : ""}`}
                style={{ transform: `rotateY(${k * step}deg) translateZ(420px)` }}
              >
                <span className="font-display text-7xl leading-none text-primary/40">“</span>
                <p className="-mt-6 text-lg leading-relaxed text-foreground">{r.text}</p>
                <div className="mt-6 flex gap-1 text-primary">{Array.from({ length: 5 }).map((_, s) => <Star key={s} className="h-4 w-4 fill-current" />)}</div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-display text-2xl tracking-wide">{r.name}</span>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">{r.bike}</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-4">
          <button aria-label="Anterior" onClick={() => setI((v) => v - 1)} className="icon-btn"><ChevronLeft /></button>
          <div className="flex gap-2">
            {REVIEWS.map((_, k) => (
              <span key={k} className={`h-1.5 rounded-full transition-all ${k === active ? "w-8 bg-primary" : "w-3 bg-muted"}`} />
            ))}
          </div>
          <button aria-label="Siguiente" onClick={() => setI((v) => v + 1)} className="icon-btn"><ChevronRight /></button>
        </div>
      </div>
    </section>
  );
}
