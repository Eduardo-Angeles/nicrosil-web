import { useState } from "preact/hooks";

type ProjectType = "Sitio Web" | "SEO" | "Identidad" | "Mantenimiento" | "";

interface FormState {
  name: string;
  email: string;
  project: ProjectType;
  message: string;
}

const PROJECT_TYPES: ProjectType[] = [
  "Sitio Web",
  "SEO",
  "Identidad",
  "Mantenimiento",
];

export default function Contact() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    project: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [sent, setSent] = useState(false);

  function validate(): boolean {
    const next: Partial<FormState> = {};
    if (!form.name.trim()) next.name = "Tu nombre es requerido";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Ingresa un email válido";
    if (!form.message.trim()) next.message = "Cuéntame sobre tu proyecto";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: Event) {
    e.preventDefault();
    if (!validate()) return;

    const subject = encodeURIComponent(
      `[Nicrosil] ${form.project ? form.project + " — " : ""}${form.name}`
    );
    const body = encodeURIComponent(
      `Nombre: ${form.name}\nEmail: ${form.email}\nTipo de proyecto: ${form.project || "Sin especificar"}\n\n${form.message}`
    );
    window.location.href = `mailto:contacto@nicrosil.com?subject=${subject}&body=${body}`;
    setSent(true);
  }

  if (sent) {
    return (
      <div class="flex flex-col items-center justify-center py-16 text-center">
        <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50 dark:bg-green-500/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-green-600 dark:text-green-400"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 class="mb-2 text-xl font-bold text-zinc-900 dark:text-zinc-50">
          ¡Mensaje listo!
        </h3>
        <p class="text-sm text-zinc-500 dark:text-zinc-400">
          Se abrió tu cliente de correo con el mensaje preparado. Te respondo en
          menos de 24 horas.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate class="flex flex-col gap-5">
      {/* Nombre + Email */}
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label
            for="contact-name"
            class="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Nombre
          </label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            placeholder="Tu nombre"
            value={form.name}
            onInput={(e) =>
              setForm({ ...form, name: (e.target as HTMLInputElement).value })
            }
            aria-describedby={errors.name ? "name-error" : undefined}
            aria-invalid={!!errors.name}
            class={`w-full rounded-xl border px-4 py-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-600 dark:focus:border-green-400 dark:focus:ring-green-400/20 ${
              errors.name
                ? "border-red-400 dark:border-red-500"
                : "border-zinc-200 bg-white dark:border-zinc-700"
            }`}
          />
          {errors.name && (
            <p id="name-error" class="mt-1.5 text-xs text-red-500" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label
            for="contact-email"
            class="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            placeholder="tu@email.com"
            value={form.email}
            onInput={(e) =>
              setForm({ ...form, email: (e.target as HTMLInputElement).value })
            }
            aria-describedby={errors.email ? "email-error" : undefined}
            aria-invalid={!!errors.email}
            class={`w-full rounded-xl border px-4 py-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-600 dark:focus:border-green-400 dark:focus:ring-green-400/20 ${
              errors.email
                ? "border-red-400 dark:border-red-500"
                : "border-zinc-200 bg-white dark:border-zinc-700"
            }`}
          />
          {errors.email && (
            <p
              id="email-error"
              class="mt-1.5 text-xs text-red-500"
              role="alert"
            >
              {errors.email}
            </p>
          )}
        </div>
      </div>

      {/* Tipo de proyecto */}
      <div>
        <p class="mb-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          ¿Qué necesitas? <span class="text-zinc-400">(opcional)</span>
        </p>
        <div class="flex flex-wrap gap-2" role="group" aria-label="Tipo de proyecto">
          {PROJECT_TYPES.map((type) => (
            <button
              type="button"
              onClick={() =>
                setForm({ ...form, project: form.project === type ? "" : type })
              }
              aria-pressed={form.project === type}
              class={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                form.project === type
                  ? "border-green-500 bg-green-50 text-green-700 dark:border-green-400 dark:bg-green-500/10 dark:text-green-400"
                  : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-600"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Mensaje */}
      <div>
        <label
          for="contact-message"
          class="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Mensaje
        </label>
        <textarea
          id="contact-message"
          rows={4}
          placeholder="Cuéntame sobre tu proyecto..."
          value={form.message}
          onInput={(e) =>
            setForm({
              ...form,
              message: (e.target as HTMLTextAreaElement).value,
            })
          }
          aria-describedby={errors.message ? "message-error" : undefined}
          aria-invalid={!!errors.message}
          class={`w-full resize-none rounded-xl border px-4 py-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-600 dark:focus:border-green-400 dark:focus:ring-green-400/20 ${
            errors.message
              ? "border-red-400 dark:border-red-500"
              : "border-zinc-200 bg-white dark:border-zinc-700"
          }`}
        />
        {errors.message && (
          <p
            id="message-error"
            class="mt-1.5 text-xs text-red-500"
            role="alert"
          >
            {errors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        class="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-green-600 px-7 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 dark:bg-green-500"
      >
        Planta tu jardín digital
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
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>
    </form>
  );
}
