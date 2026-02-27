import { useState, useEffect } from "preact/hooks";

type Slide = {
  src: string;
  alt: string;
  label: string;
  category: string;
};

export default function HeroSlider({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  // Avanza automáticamente cada 3 s; se pausa al hacer hover
  useEffect(() => {
    if (paused) return;
    const id = setInterval(
      () => setCurrent((c) => (c + 1) % slides.length),
      3000,
    );
    return () => clearInterval(id);
  }, [slides.length, paused]);

  return (
    <div
      class="w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Contenedor de imágenes */}
      <div class="relative aspect-847/700 overflow-hidden rounded-2xl shadow-[0_24px_48px_-12px_rgba(0,0,0,0.14)] ring-1 ring-zinc-900/6 dark:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.55)] dark:ring-white/6">
        {slides.map((slide, i) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            width={847}
            height={804}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            class={[
              "absolute inset-0 h-full w-full object-contain transition-opacity duration-700 ease-in-out",
              i === current ? "opacity-100" : "opacity-0",
            ].join(" ")}
          />
        ))}
      </div>

      {/* Dots — cada uno en un wrapper de ancho fijo para evitar reflow */}
      <div class="mt-4 flex items-center justify-center gap-2">
        {slides.map((slide, i) => (
          <div key={i} class="flex h-1.5 w-6 items-center justify-center">
            <button
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`Ver proyecto ${slide.label}`}
              class={[
                "h-1.5 rounded-full bg-green-600 transition-all duration-300 dark:bg-green-400",
                i === current ? "w-6 opacity-100" : "w-1.5 opacity-30",
              ].join(" ")}
            />
          </div>
        ))}
      </div>

      {/* Caption — render directo desde estado, sin animación CSS */}
      <p class="mt-2 text-center text-xs font-medium text-zinc-500 dark:text-zinc-400">
        {slides[current].label}
        <span class="mx-1.5 opacity-40" aria-hidden="true">
          ·
        </span>
        {slides[current].category}
      </p>
    </div>
  );
}
