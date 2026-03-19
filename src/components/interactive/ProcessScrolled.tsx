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

/**
 * getStyle — returns the inline style object for a step panel based on its
 * current state and the chosen transition effect.
 *
 * The visibility trick: when a step becomes active, `visibility` is applied
 * immediately (`0s linear 0s`). When a step becomes inactive, `visibility`
 * is delayed until after the opacity/transform transition finishes
 * (`0s linear ${dur}`), so the element fades out before becoming hidden.
 * This avoids tab-order and click-through issues without using display:none.
 */
function getStyle(state: StepState, effect: Effect): Record<string, string> {
  const dur = "0.7s";
  const ease = "cubic-bezier(0.4,0,0.2,1)";
  const base = `opacity ${dur} ${ease}, transform ${dur} ${ease}, filter ${dur} ${ease}`;

  if (state === "active") {
    const t = `${base}, visibility 0s linear 0s`;
    if (effect === "blink")
      return {
        opacity: "1",
        visibility: "visible",
        filter: "blur(0px) contrast(1)",
        transition: t,
      };
    if (effect === "slide")
      return {
        opacity: "1",
        visibility: "visible",
        transform: "translateX(0%)",
        transition: t,
      };
    // zoom
    return {
      opacity: "1",
      visibility: "visible",
      transform: "scale(1)",
      filter: "blur(0px)",
      transition: t,
    };
  }

  // Inactive: hide AFTER opacity transition finishes
  const t = `${base}, visibility 0s linear ${dur}`;

  if (effect === "blink")
    return {
      opacity: "0",
      visibility: "hidden",
      filter: "blur(16px) contrast(4)",
      transition: t,
    };

  if (effect === "slide") {
    const x = state === "future" ? "translateX(100%)" : "translateX(-100%)";
    return { opacity: "0", visibility: "hidden", transform: x, transition: t };
  }

  // zoom: future steps enter at scale(0.85), past steps exit at scale(1.15)
  const scale = state === "future" ? "scale(0.85)" : "scale(1.15)";
  return {
    opacity: "0",
    visibility: "hidden",
    transform: scale,
    filter: "blur(12px)",
    transition: t,
  };
}

export default function ProcessScrolled({
  steps,
  effect = "zoom",
}: {
  steps: Step[];
  effect?: Effect;
}) {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const progressFillRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  // Update CSS vars on the section element when active step changes.
  // These drive .process-active-bar (progress bar + active dot) via CSS.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const step = steps[active];
    el.style.setProperty("--active-color-l", step.colorLight);
    el.style.setProperty("--active-color-d", step.colorDark);
  }, [active, steps]);

  // Scroll tracker with rAF throttle.
  // Progress bar width is updated via direct DOM manipulation to avoid
  // re-renders on every scroll position; setActive only fires on step change.
  useEffect(() => {
    function compute() {
      const el = sectionRef.current;
      if (!el) return;
      const scrollRange = el.offsetHeight - window.innerHeight;
      if (scrollRange <= 0) return;
      const scrolled = -el.getBoundingClientRect().top;
      const p = Math.max(0, Math.min(0.9999, scrolled / scrollRange));
      const newActive = Math.floor(p * steps.length);
      const stepProgress = (p * steps.length) % 1;
      const overallProgress = ((newActive + stepProgress) / steps.length) * 100;

      if (progressFillRef.current) {
        progressFillRef.current.style.width = `${overallProgress}%`;
      }

      setActive((prev) => (prev !== newActive ? newActive : prev));
    }

    function onScroll() {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        compute();
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    compute();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [steps.length]);

  const total = String(steps.length).padStart(2, "0");

  return (
    <section
      id="proceso"
      ref={sectionRef}
      style={{ height: `${steps.length * 40}vh` }}
      class="relative"
      aria-labelledby="proceso-heading"
    >
      <h2 id="proceso-heading" class="sr-only">
        Proceso
      </h2>

      {/* Stage sticky */}
      <div class="sticky top-0 h-screen overflow-hidden">
        {/* Barra de progreso superior */}
        <div class="absolute top-0 right-0 left-0 z-50 h-[3px] bg-black/[0.06] dark:bg-white/[0.06]">
          <div
            ref={progressFillRef}
            class="process-active-bar h-full"
            style={{ width: "0%" }}
          />
        </div>

        {steps.map((step, i) => {
          const state: StepState =
            i === active ? "active" : i < active ? "past" : "future";

          return (
            <div
              key={step.number}
              class="process-panel absolute inset-0"
              style={{
                "--step-bg": step.bgLight,
                "--step-bg-dark": step.bgDark,
                "--step-color": step.colorLight,
                "--step-color-dark": step.colorDark,
                ...getStyle(state, effect),
              } as any}
            >
              {/* Número decorativo de fondo */}
              <div
                aria-hidden="true"
                class="font-display pointer-events-none absolute bottom-0 left-0 overflow-hidden leading-[0.85] font-black text-black/[0.1] select-none dark:text-white/[0.1]"
                style={{ fontSize: "min(50vw, 44vh)" }}
              >
                {step.number}
              </div>

              {/* Contador de paso — solo mobile */}
              <div class="absolute top-6 right-6 z-10 md:hidden">
                <span class="process-accent text-xs font-bold tracking-widest tabular-nums opacity-50">
                  {step.number} / {total}
                </span>
              </div>

              {/* Contenido principal */}
              <div class="relative flex h-full items-center px-6">
                <div class="relative mx-auto flex w-full max-w-6xl items-center">
                  <div class="z-10 max-w-lg">
                    <p class="process-accent mb-6 text-xs font-semibold tracking-[0.2em] uppercase">
                      Proceso &middot; {step.number}
                    </p>
                    <h3 class="process-accent font-display mb-5 text-5xl leading-[1.05] font-extrabold tracking-tight md:text-6xl">
                      {step.title}
                    </h3>
                    <p
                      class="process-desc max-w-sm text-base leading-relaxed text-zinc-600 lg:text-lg dark:text-zinc-400"
                      dangerouslySetInnerHTML={{ __html: step.description }}
                    />
                  </div>

                  {/* Flor — desktop */}
                  <div class="pointer-events-none absolute top-1/2 right-0 hidden -translate-y-1/2 md:block">
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
                class="pointer-events-none absolute top-1/2 right-0 h-[95vw] max-h-[28rem] w-auto -translate-y-1/2 object-contain opacity-30 md:hidden"
                loading="lazy"
                decoding="async"
              />
            </div>
          );
        })}

        {/* Área inferior: dots de progreso */}
        <div class="absolute right-0 bottom-6 left-0 z-50 flex flex-col items-center gap-3">
          <div class="flex justify-center gap-2">
            {steps.map((step, i) => (
              <div
                key={step.number}
                aria-label={`Paso ${step.number}: ${step.title}`}
                aria-current={i === active ? "step" : undefined}
                class={[
                  "h-1.5 rounded-full transition-all duration-500",
                  i === active
                    ? "process-active-bar w-8"
                    : "w-1.5 bg-zinc-400/40 dark:bg-white/20",
                ].join(" ")}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
