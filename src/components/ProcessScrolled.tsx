import { useState, useEffect, useRef } from "preact/hooks";

export type Step = {
  number: string;
  title: string;
  description: string;
  image: string;
  bgLight: string;
  bgDark: string;
};

export type Effect = "blink" | "slide" | "zoom";

type StepState = "active" | "past" | "future";

function getStyle(state: StepState, effect: Effect): Record<string, string> {
  const dur = "0.7s";
  const ease = "cubic-bezier(0.4,0,0.2,1)";
  const base = `opacity ${dur} ${ease}, transform ${dur} ${ease}, filter ${dur} ${ease}`;

  if (state === "active") {
    const t = `${base}, visibility 0s linear 0s`;
    if (effect === "blink")
      return { opacity: "1", visibility: "visible", filter: "blur(0px) contrast(1)", transition: t };
    if (effect === "slide")
      return { opacity: "1", visibility: "visible", transform: "translateX(0%)", transition: t };
    // zoom
    return { opacity: "1", visibility: "visible", transform: "scale(1)", filter: "blur(0px)", transition: t };
  }

  // Inactive: hide AFTER opacity transition finishes
  const t = `${base}, visibility 0s linear ${dur}`;

  if (effect === "blink")
    return { opacity: "0", visibility: "hidden", filter: "blur(16px) contrast(4)", transition: t };

  if (effect === "slide") {
    const x = state === "future" ? "translateX(100%)" : "translateX(-100%)";
    return { opacity: "0", visibility: "hidden", transform: x, transition: t };
  }

  // zoom
  const scale = state === "future" ? "scale(0.85)" : "scale(1.15)";
  return { opacity: "0", visibility: "hidden", transform: scale, filter: "blur(12px)", transition: t };
}

export default function ProcessScrolled({
  steps,
  effect = "zoom",
}: {
  steps: Step[];
  effect?: Effect;
}) {
  const [active, setActive] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  // Reactivo al cambio de dark mode
  useEffect(() => {
    const update = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  // Scroll tracker: calcula qué paso está activo
  useEffect(() => {
    function onScroll() {
      const el = sectionRef.current;
      if (!el) return;
      const scrollRange = el.offsetHeight - window.innerHeight;
      if (scrollRange <= 0) return;
      const scrolled = -el.getBoundingClientRect().top;
      const p = Math.max(0, Math.min(0.9999, scrolled / scrollRange));
      setActive(Math.floor(p * steps.length));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [steps.length]);

  return (
    <section
      id="proceso"
      ref={sectionRef}
      style={{ height: `${steps.length * 100}vh` }}
      class="relative"
      aria-labelledby="proceso-heading"
    >
      <h2 id="proceso-heading" class="sr-only">Proceso</h2>

      {/* Stage sticky */}
      <div class="sticky top-0 h-screen overflow-hidden">

        {steps.map((step, i) => {
          const state: StepState =
            i === active ? "active" : i < active ? "past" : "future";

          return (
            <div
              key={step.number}
              class="absolute inset-0"
              style={{
                backgroundColor: isDark ? step.bgDark : step.bgLight,
                ...getStyle(state, effect),
              }}
            >
              {/* Número decorativo de fondo */}
              <div
                aria-hidden="true"
                class="pointer-events-none absolute bottom-0 left-0 select-none overflow-hidden font-display font-black leading-[0.85] text-black/[0.045] dark:text-white/[0.045]"
                style={{ fontSize: "min(50vw, 44vh)" }}
              >
                {step.number}
              </div>

              {/* Contenido principal */}
              <div class="relative flex h-full items-center px-8 md:px-16 lg:px-24 xl:px-32">
                <div class="z-10 max-w-lg">
                  <p class="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-green-600 dark:text-green-400">
                    Proceso &middot; {step.number}
                  </p>
                  <h3 class="mb-5 font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-zinc-900 md:text-6xl dark:text-zinc-50">
                    {step.title}
                  </h3>
                  <p class="max-w-sm text-base leading-relaxed text-zinc-600 lg:text-lg dark:text-zinc-400">
                    {step.description}
                  </p>
                </div>

                {/* Flor — desktop */}
                <div class="pointer-events-none absolute right-8 top-1/2 hidden -translate-y-1/2 md:right-16 md:block lg:right-24 xl:right-32">
                  <img
                    src={step.image}
                    alt=""
                    aria-hidden="true"
                    class="h-[55vh] w-auto object-contain drop-shadow-2xl"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>

              {/* Flor — mobile (fondo sutil) */}
              <img
                src={step.image}
                alt=""
                aria-hidden="true"
                class="pointer-events-none absolute right-0 top-1/2 h-[45vw] max-h-56 w-auto -translate-y-1/2 object-contain opacity-[0.07] md:hidden"
                loading="lazy"
                decoding="async"
              />
            </div>
          );
        })}

        {/* Dots de progreso */}
        <div class="absolute bottom-8 left-0 right-0 z-50 flex justify-center gap-2">
          {steps.map((step, i) => (
            <div
              key={step.number}
              aria-label={`Paso ${step.number}: ${step.title}`}
              aria-current={i === active ? "step" : undefined}
              class={[
                "h-1.5 rounded-full transition-all duration-500",
                i === active
                  ? "w-8 bg-cyan-600 dark:bg-cyan-400"
                  : "w-1.5 bg-zinc-400/40 dark:bg-white/20",
              ].join(" ")}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
