import { useState, useEffect, useRef } from "preact/hooks";

export type Step = {
  number: string;
  title: string;
  description: string;
  image: string;
  bgLight: string;
  bgDark: string;
  colorLight: string;
  colorDark: string;
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
  const [stepProgress, setStepProgress] = useState(0);
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

  // Scroll tracker: calcula qué paso está activo y el progreso dentro del paso
  useEffect(() => {
    function onScroll() {
      const el = sectionRef.current;
      if (!el) return;
      const scrollRange = el.offsetHeight - window.innerHeight;
      if (scrollRange <= 0) return;
      const scrolled = -el.getBoundingClientRect().top;
      const p = Math.max(0, Math.min(0.9999, scrolled / scrollRange));
      setActive(Math.floor(p * steps.length));
      setStepProgress((p * steps.length) % 1);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [steps.length]);

  const accentColor = isDark ? steps[active].colorDark : steps[active].colorLight;
  const overallProgress = ((active + stepProgress) / steps.length) * 100;
  const total = String(steps.length).padStart(2, "0");

  function goToStep(index: number) {
    const el = sectionRef.current;
    if (!el) return;
    const scrollRange = el.offsetHeight - window.innerHeight;
    const sectionTop = el.getBoundingClientRect().top + window.scrollY;
    if (index >= steps.length) {
      window.scrollTo({ top: sectionTop + scrollRange + 2, behavior: "instant" as ScrollBehavior });
      return;
    }
    setActive(index);
    setStepProgress(0);
    window.scrollTo({ top: sectionTop + (index / steps.length) * scrollRange, behavior: "instant" as ScrollBehavior });
  }

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

        {/* Barra de progreso superior */}
        <div class="absolute top-0 left-0 right-0 z-50 h-[3px] bg-black/[0.06] dark:bg-white/[0.06]">
          <div
            class="h-full transition-[width] duration-150 ease-out"
            style={{ width: `${overallProgress}%`, backgroundColor: accentColor }}
          />
        </div>

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

              {/* Contador de paso — solo mobile */}
              <div class="absolute top-6 right-6 z-10 md:hidden">
                <span
                  class="text-xs font-bold tabular-nums tracking-widest opacity-50"
                  style={{ color: isDark ? step.colorDark : step.colorLight }}
                >
                  {step.number} / {total}
                </span>
              </div>

              {/* Contenido principal */}
              <div class="relative flex h-full items-center px-6">
                <div class="relative mx-auto flex w-full max-w-6xl items-center">
                  <div class="z-10 max-w-lg">
                    <p
                      class="mb-6 text-xs font-semibold uppercase tracking-[0.2em]"
                      style={{ color: isDark ? step.colorDark : step.colorLight }}
                    >
                      Proceso &middot; {step.number}
                    </p>
                    <h3
                      class="mb-5 font-display text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl"
                      style={{ color: isDark ? step.colorDark : step.colorLight }}
                    >
                      {step.title}
                    </h3>
                    <p
                      class="process-desc max-w-sm text-base leading-relaxed text-zinc-600 lg:text-lg dark:text-zinc-400"
                      style={{ "--step-color": isDark ? step.colorDark : step.colorLight } as any}
                      dangerouslySetInnerHTML={{ __html: step.description }}
                    />
                  </div>

                  {/* Flor — desktop */}
                  <div class="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 md:block">
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
              </div>

              {/* Flor — mobile (fondo sutil) */}
              <img
                src={step.image}
                alt=""
                aria-hidden="true"
                class="pointer-events-none absolute right-0 top-1/2 h-[95vw] max-h-[28rem] w-auto -translate-y-1/2 object-contain opacity-30 md:hidden"
                loading="lazy"
                decoding="async"
              />
            </div>
          );
        })}

        {/* Área inferior: navegación circular + dots */}
        <div class="absolute bottom-6 left-0 right-0 z-50 flex flex-col items-center gap-3">

          {/* Botón circular partido — solo mobile */}
          <div class="flex h-16 w-16 flex-col overflow-hidden rounded-full bg-black/5 dark:bg-white/5 md:hidden">
            {/* Mitad superior: paso anterior */}
            <button
              onClick={() => goToStep(active - 1)}
              disabled={active === 0}
              aria-label="Paso anterior"
              class={[
                "flex flex-1 w-full items-center justify-center transition-opacity",
                active === 0 ? "cursor-default opacity-20" : "opacity-70 active:opacity-100",
              ].join(" ")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 text-zinc-600 dark:text-zinc-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </button>

            {/* Divisor */}
            <div class="h-px shrink-0 bg-black/10 dark:bg-white/10" />

            {/* Mitad inferior: siguiente paso / salir del sticky */}
            <button
              onClick={() => goToStep(active + 1)}
              aria-label={active === steps.length - 1 ? "Continuar" : "Siguiente paso"}
              class="flex flex-1 w-full items-center justify-center opacity-70 transition-opacity active:opacity-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 animate-bounce text-zinc-600 dark:text-zinc-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>

          {/* Dots de progreso */}
          <div class="flex justify-center gap-2">
            {steps.map((step, i) => (
              <div
                key={step.number}
                aria-label={`Paso ${step.number}: ${step.title}`}
                aria-current={i === active ? "step" : undefined}
                class={[
                  "h-1.5 rounded-full transition-all duration-500",
                  i === active ? "w-8" : "w-1.5 bg-zinc-400/40 dark:bg-white/20",
                ].join(" ")}
                style={
                  i === active
                    ? { backgroundColor: isDark ? steps[active].colorDark : steps[active].colorLight }
                    : undefined
                }
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
