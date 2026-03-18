import { useState, useEffect, useRef } from "preact/hooks";
import { useDarkMode } from "@hooks/useDarkMode";

export type Service = {
  badge: string;
  title: string;
  description: string;
  image: string;
  iconHtml: string;
  colorLight: string;
  colorDark: string;
};

// ─── Desktop card ─────────────────────────────────────────────────────────────

function DesktopCard({
  badge, title, description, image, iconHtml,
  accentColor, isActive, onClick,
}: Service & { accentColor: string; isActive: boolean; onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const [hovered, setHovered] = useState(false);
  const [shine, setShine] = useState({ x: 50, y: 50 });

  function onMouseMove(e: MouseEvent) {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      setShine({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
    });
  }

  const lit = hovered || isActive;

  return (
    <article
      ref={ref}
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      class="group relative cursor-pointer overflow-hidden rounded-3xl"
      style={{
        boxShadow: lit
          ? `0 28px 56px -10px ${accentColor}44, 0 16px 32px -14px rgba(0,0,0,0.5)`
          : "0 8px 28px -8px rgba(0,0,0,0.3)",
        outline: isActive ? `2px solid ${accentColor}66` : "2px solid transparent",
        transition: "box-shadow 0.4s ease, outline 0.4s ease",
      }}
    >
      {/* Imagen */}
      <div class="absolute inset-0 overflow-hidden">
        <img
          src={image}
          alt={title}
          class="h-full w-full object-cover transition-transform duration-700 ease-out"
          style={{ transform: lit ? "scale(1.07)" : "scale(1)" }}
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Gradiente base */}
      <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
      <div class="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />

      {/* Shine — radial highlight that follows the cursor position */}
      <div
        class="absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.10), transparent 52%)`,
        }}
      />

      {/* Glow de color en la base */}
      <div
        class="absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: lit ? 1 : 0,
          background: `radial-gradient(ellipse 90% 45% at 50% 100%, ${accentColor}38, transparent 70%)`,
        }}
      />

      {/* Contenido */}
      <div class="relative flex min-h-[400px] flex-col justify-end">
        {/* Badge */}
        <div class="absolute left-6 top-6">
          <span
            class="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md transition-colors duration-400"
            style={{
              borderColor: isActive ? accentColor + "60" : "rgba(255,255,255,0.2)",
              backgroundColor: isActive ? accentColor + "25" : "rgba(0,0,0,0.4)",
              color: isActive ? accentColor : "rgba(255,255,255,0.7)",
            }}
          >
            <span
              style={{ color: isActive ? accentColor : undefined }}
              dangerouslySetInnerHTML={{ __html: iconHtml }}
            />
            {badge}
          </span>
        </div>

        {/* Panel inferior */}
        <div class="bg-gradient-to-t from-black/50 to-transparent p-7 pt-12">
          <h3 class="mb-3 text-2xl font-bold leading-tight text-white drop-shadow-lg">
            {title}
          </h3>

          {/* Línea de acento — expande de 2rem a 3.5rem cuando la card está activa/hovered */}
          <div
            class="mb-4 h-0.5 rounded-full transition-all duration-500"
            style={{
              width: lit ? "3.5rem" : "2rem",
              backgroundColor: accentColor,
            }}
          />

          {/* Descripción — aparece solo en hover */}
          <div
            class="overflow-hidden transition-all duration-500 ease-out"
            style={{ maxHeight: hovered ? "6rem" : "0", opacity: hovered ? 1 : 0 }}
          >
            <p class="text-sm leading-relaxed text-white/75">{description}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

// ─── Mobile card ──────────────────────────────────────────────────────────────

function MobileCard({ badge, title, description, image, iconHtml, accentColor }: Service & { accentColor: string }) {
  return (
    <article class="relative overflow-hidden rounded-3xl select-none">
      <div class="aspect-[3/4]">
        <img src={image} alt={title} class="h-full w-full object-cover" loading="lazy" decoding="async" />
      </div>
      <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
      <div class="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />

      <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/45 to-transparent p-6 pt-10">
        <div class="mb-3 flex items-center gap-2">
          <div
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl backdrop-blur-sm"
            style={{ backgroundColor: accentColor + "30", color: accentColor, border: `1px solid ${accentColor}50` }}
            dangerouslySetInnerHTML={{ __html: iconHtml }}
          />
          <span
            class="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm"
            style={{ backgroundColor: accentColor + "25", color: accentColor, border: `1px solid ${accentColor}50` }}
          >
            {badge}
          </span>
        </div>
        <h3 class="mb-2 text-xl font-bold text-white drop-shadow-lg">{title}</h3>
        <div class="mb-3 h-0.5 w-8 rounded-full" style={{ backgroundColor: accentColor }} />
        <p class="text-sm leading-relaxed text-white/80">{description}</p>
      </div>
    </article>
  );
}

// ─── Mobile carousel ──────────────────────────────────────────────────────────
//
// Uses CSS scroll-snap (scrollSnapType: "x mandatory") to lock each card into
// position. The onScroll handler derives the active index by dividing
// scrollLeft by (cardWidth + gap). Dots navigate by calling scrollIntoView.

function MobileCarousel({ services, activeIndex, onChangeIndex, isDark }: {
  services: Service[];
  activeIndex: number;
  onChangeIndex: (i: number) => void;
  isDark: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function onScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = (el.firstElementChild as HTMLElement)?.offsetWidth ?? 0;
    if (cardWidth === 0) return;
    const i = Math.round(el.scrollLeft / (cardWidth + 16));
    onChangeIndex(i);
  }

  function goTo(index: number) {
    onChangeIndex(index);
    const el = scrollRef.current;
    if (!el) return;
    const card = el.children[index] as HTMLElement;
    card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  }

  return (
    <div>
      <div
        ref={scrollRef}
        onScroll={onScroll}
        class="flex gap-4 overflow-x-auto scroll-smooth pl-4"
        style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as any}
      >
        {services.map((s, i) => (
          <div key={i} class="w-[88%] flex-shrink-0" style={{ scrollSnapAlign: "start" }}>
            <MobileCard
              {...s}
              accentColor={isDark ? s.colorDark : s.colorLight}
            />
          </div>
        ))}
        <div class="w-4 flex-shrink-0" aria-hidden="true" />
      </div>

      <div class="mt-5 flex items-center justify-center gap-4">
        <div class="flex items-center gap-2">
          {services.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ver servicio ${i + 1}`}
              class="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === activeIndex ? "1.5rem" : "0.375rem",
                backgroundColor: isDark ? s.colorDark : s.colorLight,
                opacity: i === activeIndex ? 1 : 0.3,
              }}
            />
          ))}
        </div>
        <span class="text-xs font-medium text-zinc-400">
          {activeIndex + 1} / {services.length}
        </span>
      </div>
    </div>
  );
}

// ─── Principal ────────────────────────────────────────────────────────────────

export default function ServicesCards({ services }: { services: Service[] }) {
  const [active, setActive] = useState(0);
  // useDarkMode subscribes to class changes on <html> via MutationObserver
  const isDark = useDarkMode();

  // Propaga el color del servicio activo a la sección entera via CSS vars.
  // --service-accent is consumed by the section header eyebrow and h2 span.
  // background-color uses color-mix() to tint the section bg subtly with the
  // active service color (5% tint over the base section color).
  useEffect(() => {
    const section = document.getElementById("servicios");
    if (!section) return;
    const color = isDark ? services[active].colorDark : services[active].colorLight;
    section.style.setProperty("--service-accent", color);
    section.style.setProperty(
      "background-color",
      `color-mix(in srgb, ${color} 5%, ${isDark ? "#060B0D" : "#F0FBFC"})`
    );
    section.style.transition = "background-color 0.5s ease";
  }, [active, isDark, services]);

  return (
    <>
      {/* Desktop */}
      <div class="hidden gap-5 md:grid md:grid-cols-2">
        {services.map((s, i) => (
          <DesktopCard
            key={i}
            {...s}
            accentColor={isDark ? s.colorDark : s.colorLight}
            isActive={i === active}
            onClick={() => setActive(i)}
          />
        ))}
      </div>

      {/* Mobile */}
      <div class="md:hidden">
        <MobileCarousel
          services={services}
          activeIndex={active}
          onChangeIndex={setActive}
          isDark={isDark}
        />
      </div>
    </>
  );
}
