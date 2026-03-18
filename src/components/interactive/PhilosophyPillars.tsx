import { useState, useEffect } from "preact/hooks";
import { useDarkMode } from "@hooks/useDarkMode";

export type Pillar = {
  number: string;
  title: string;
  description: string;
  iconHtml: string;
  colorLight: string;
  colorDark: string;
};

export default function PhilosophyPillars({ pillars }: { pillars: Pillar[] }) {
  const [active, setActive] = useState(0);
  // useDarkMode subscribes to class changes on <html> via MutationObserver
  const isDark = useDarkMode();
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(
      () => setActive((a) => (a + 1) % pillars.length),
      3200,
    );
    return () => clearInterval(id);
  }, [paused, pillars.length]);

  return (
    <div
      class="flex flex-col gap-3"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {pillars.map((pillar, i) => {
        const isActive = i === active;
        const color = isDark ? pillar.colorDark : pillar.colorLight;

        return (
          <button
            key={pillar.number}
            onClick={() => { setActive(i); setPaused(true); }}
            aria-pressed={isActive}
            class={[
              "relative overflow-hidden rounded-2xl border text-left transition-all duration-500 cursor-pointer w-full",
              isActive
                ? "shadow-lg"
                : "border-white/80 bg-white/60 shadow-sm backdrop-blur-md dark:border-white/5 dark:bg-zinc-950/50 hover:shadow-md",
            ].join(" ")}
            style={
              isActive
                ? {
                    borderColor: color + "50",
                    backgroundColor: color + "12",
                    boxShadow: `0 4px 24px 0 ${color}22`,
                  }
                : {}
            }
          >
            {/* Número decorativo de fondo — solo activo */}
            <div
              aria-hidden="true"
              class="font-display pointer-events-none absolute right-3 bottom-0 overflow-hidden leading-[0.8] font-black select-none transition-all duration-500"
              style={{
                fontSize: "6.5rem",
                color,
                opacity: isActive ? 0.1 : 0,
                transform: isActive ? "translateY(8px)" : "translateY(20px)",
              }}
            >
              {pillar.number}
            </div>

            {/* Barra lateral de acento */}
            <div
              class="absolute top-0 left-0 h-full w-1 rounded-l-2xl transition-all duration-500"
              style={{
                backgroundColor: color,
                opacity: isActive ? 1 : 0,
                transform: isActive ? "scaleY(1)" : "scaleY(0.3)",
                transformOrigin: "top",
              }}
            />

            <div class="flex gap-4 p-5 pl-6">
              {/* Ícono */}
              <div
                class="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300"
                style={{
                  backgroundColor: isActive ? color + "22" : undefined,
                  color: isActive ? color : undefined,
                }}
              >
                <span
                  class={
                    isActive ? "" : "text-cyan-600 dark:text-cyan-400"
                  }
                  dangerouslySetInnerHTML={{ __html: pillar.iconHtml }}
                />
              </div>

              <div class="flex-1 min-w-0">
                {/* Etiqueta numerada */}
                <p
                  class="mb-0.5 text-[10px] font-bold tracking-[0.2em] uppercase transition-colors duration-300"
                  style={{ color: isActive ? color : undefined }}
                >
                  <span
                    class={
                      isActive
                        ? ""
                        : "text-zinc-400 dark:text-zinc-600"
                    }
                  >
                    {pillar.number}
                  </span>
                </p>

                {/* Título */}
                <h3
                  class="font-bold transition-all duration-300 text-zinc-900 dark:text-zinc-50"
                  style={isActive ? { color } : {}}
                >
                  {pillar.title}
                </h3>

                {/* Descripción — expande al activarse */}
                <div
                  class="overflow-hidden transition-all duration-500"
                  style={{
                    maxHeight: isActive ? "16rem" : "0px",
                    opacity: isActive ? 1 : 0,
                    marginTop: isActive ? "0.375rem" : "0px",
                  }}
                >
                  <p class="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                    {pillar.description}
                  </p>
                </div>
              </div>

              {/* Chevron */}
              <div
                class="mt-1 shrink-0 transition-all duration-300"
                style={{
                  color: isActive ? color : undefined,
                  opacity: isActive ? 1 : 0.3,
                  transform: isActive ? "rotate(90deg)" : "rotate(0deg)",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>
            </div>
          </button>
        );
      })}

      {/* Dots de progreso */}
      <div class="mt-1 flex justify-center gap-2">
        {pillars.map((_, i) => (
          <button
            key={i}
            onClick={() => { setActive(i); setPaused(true); }}
            aria-label={`Pilar ${i + 1}`}
            class="h-1.5 rounded-full transition-all duration-500"
            style={{
              width: i === active ? "2rem" : "0.375rem",
              backgroundColor:
                i === active
                  ? (isDark ? pillars[active].colorDark : pillars[active].colorLight)
                  : undefined,
            }}
          >
            <span
              class={
                i === active ? "" : "block h-full w-full rounded-full bg-zinc-400/40 dark:bg-white/20"
              }
            />
          </button>
        ))}
      </div>
    </div>
  );
}
