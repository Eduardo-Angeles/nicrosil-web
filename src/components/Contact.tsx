import { useState } from "preact/hooks";

interface FormState {
  name: string;
  phone: string;
  message: string;
}

const inputBase =
  "w-full rounded-xl border bg-white px-4 py-3.5 pl-11 text-sm text-zinc-900 transition-all outline-none placeholder:text-zinc-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:bg-white/5 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-cyan-500/70 dark:focus:bg-white/8 dark:focus:ring-cyan-500/20";

const inputNormal = "border-zinc-200 dark:border-white/10";
const inputError = "border-red-500/60 ring-2 ring-red-500/20";

export default function Contact() {
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const next: Partial<FormState> = {};
    if (!form.name.trim()) next.name = "Tu nombre es requerido";
    if (!form.phone.trim() || !/^[+\d\s\-()]{7,}$/.test(form.phone))
      next.phone = "Ingresa un número de teléfono válido";
    if (!form.message.trim()) next.message = "Cuéntame sobre tu proyecto";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: Event) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const subject = encodeURIComponent(`[Nicrosil] Contacto — ${form.name}`);
    const body = encodeURIComponent(
      `Nombre: ${form.name}\nTeléfono: ${form.phone}\n\n${form.message}`,
    );
    window.location.href = `mailto:contacto@nicrosil.com?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 600);
  }

  if (sent) {
    return (
      <div class="flex flex-col items-center justify-center py-16 text-center">
        <div class="relative mb-6">
          <div class="absolute inset-0 rounded-full bg-green-400/20 blur-xl" />
          <div class="relative flex h-16 w-16 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="text-green-400"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>
        <h3 class="mb-2 text-xl font-bold text-zinc-800 dark:text-zinc-50">
          ¡Mensaje listo!
        </h3>
        <p class="max-w-xs text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          Se abrió tu cliente de correo con el mensaje preparado. Te respondo en
          menos de 24 horas.
        </p>
        <button
          onClick={() => {
            setSent(false);
            setForm({ name: "", phone: "", message: "" });
          }}
          class="mt-6 text-xs text-zinc-400 underline-offset-4 transition-colors hover:text-cyan-500 hover:underline dark:text-zinc-500 dark:hover:text-cyan-400"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate class="flex flex-col gap-5">
      {/* Nombre */}
      <div class="group">
        <label
          for="contact-name"
          class="mb-2 block text-xs font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400"
        >
          Nombre
        </label>
        <div class="relative">
          <span class="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-cyan-500 dark:text-zinc-500 dark:group-focus-within:text-cyan-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </span>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            placeholder="¿Cómo te llamas?"
            value={form.name}
            onInput={(e) =>
              setForm({ ...form, name: (e.target as HTMLInputElement).value })
            }
            aria-describedby={errors.name ? "name-error" : undefined}
            aria-invalid={!!errors.name}
            class={`${inputBase} ${errors.name ? inputError : inputNormal}`}
          />
        </div>
        {errors.name && (
          <p
            id="name-error"
            class="mt-1.5 flex items-center gap-1 text-xs text-red-400"
            role="alert"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {errors.name}
          </p>
        )}
      </div>

      {/* Teléfono */}
      <div class="group">
        <label
          for="contact-phone"
          class="mb-2 block text-xs font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400"
        >
          Teléfono
        </label>
        <div class="relative">
          <span class="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-cyan-500 dark:text-zinc-500 dark:group-focus-within:text-cyan-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.36a2 2 0 0 1 1.99-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9c1.27 2.15 2.85 3.73 5 5l.98-.98a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </span>
          <input
            id="contact-phone"
            type="tel"
            autoComplete="tel"
            placeholder="+52 951 000 0000"
            value={form.phone}
            onInput={(e) =>
              setForm({ ...form, phone: (e.target as HTMLInputElement).value })
            }
            aria-describedby={errors.phone ? "phone-error" : undefined}
            aria-invalid={!!errors.phone}
            class={`${inputBase} ${errors.phone ? inputError : inputNormal}`}
          />
        </div>
        {errors.phone && (
          <p
            id="phone-error"
            class="mt-1.5 flex items-center gap-1 text-xs text-red-400"
            role="alert"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {errors.phone}
          </p>
        )}
      </div>

      {/* Separador decorativo */}
      <div class="flex items-center gap-3">
        <div class="h-px flex-1 bg-zinc-200 dark:bg-white/8" />
        <span class="text-[10px] font-semibold tracking-widest text-zinc-400 uppercase dark:text-zinc-600">
          Tu proyecto
        </span>
        <div class="h-px flex-1 bg-zinc-200 dark:bg-white/8" />
      </div>

      {/* Mensaje */}
      <div class="group">
        <div class="mb-2 flex items-center justify-between">
          <label
            for="contact-message"
            class="text-xs font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400"
          >
            Mensaje
          </label>
          <span
            class={`text-xs tabular-nums transition-colors ${
              form.message.length > 480
                ? "text-red-500 dark:text-red-400"
                : form.message.length > 300
                  ? "text-amber-500 dark:text-amber-400"
                  : "text-zinc-400 dark:text-zinc-600"
            }`}
          >
            {form.message.length}/500
          </span>
        </div>
        <div class="relative">
          <span class="pointer-events-none absolute top-3.5 left-3.5 text-zinc-400 transition-colors group-focus-within:text-cyan-500 dark:text-zinc-500 dark:group-focus-within:text-cyan-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </span>
          <textarea
            id="contact-message"
            rows={5}
            maxLength={500}
            placeholder="Cuéntame sobre tu proyecto, qué necesitas, tus ideas..."
            value={form.message}
            onInput={(e) =>
              setForm({
                ...form,
                message: (e.target as HTMLTextAreaElement).value,
              })
            }
            aria-describedby={errors.message ? "message-error" : undefined}
            aria-invalid={!!errors.message}
            class={`${inputBase} resize-none pt-3.5 pl-11 leading-relaxed ${errors.message ? inputError : inputNormal}`}
          />
        </div>
        {errors.message && (
          <p
            id="message-error"
            class="mt-1.5 flex items-center gap-1 text-xs text-red-400"
            role="alert"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {errors.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        class="group relative mt-1 w-full overflow-hidden rounded-xl bg-linear-to-r from-cyan-600 to-cyan-500 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition-all hover:shadow-cyan-500/40 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {/* shimmer */}
        <span
          aria-hidden="true"
          class="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full"
        />
        <span class="relative inline-flex items-center justify-center gap-2">
          {loading ? (
            <>
              <svg
                class="animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                aria-hidden="true"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Preparando mensaje...
            </>
          ) : (
            <>
              Enviar mensaje
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
                class="transition-transform group-hover:translate-x-0.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </>
          )}
        </span>
      </button>

      <p class="text-center text-[11px] text-zinc-400 dark:text-zinc-600">
        Sin spam · Solo te contacto para hablar de tu proyecto
      </p>
    </form>
  );
}
