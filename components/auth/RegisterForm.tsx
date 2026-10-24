
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type RegisterData = {
  business_name: string;
  industry: string;
  business_email: string;
  business_phone: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const initialData: RegisterData = {
  business_name: "",
  industry: "",
  business_email: "",
  business_phone: "",
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const inputClass =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

const labelClass = "mb-2 block text-sm font-medium text-slate-300";

export default function RegisterForm() {
  const router = useRouter();

  const [form, setForm] = useState<RegisterData>(initialData);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(
    field: keyof RegisterData,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setError("");

    if (form.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          business_name: form.business_name.trim(),
          industry: form.industry.trim(),
          business_email: form.business_email.trim(),
          business_phone: form.business_phone.trim() || null,
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          typeof data?.detail === "string"
            ? data.detail
            : "No fue posible crear la cuenta. Inténtalo nuevamente."
        );
      }

      router.push("/login?registered=1");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error inesperado."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-white">
      <div className="mx-auto w-full max-w-2xl">
        <header className="mb-8 text-center">
          <Link
            href="/login"
            className="text-3xl font-bold tracking-tight text-white"
          >
            KAIRO
          </Link>
          <p className="mt-2 text-sm text-slate-400">
            Customer Intelligence Platform
          </p>
        </header>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-10">
          <div className="mb-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-400">
              Comienza con KAIRO
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">
              Crea tu cuenta
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Registra tu negocio y configura tu acceso a la
              plataforma de inteligencia de clientes.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-9">
            <section>
              <div className="mb-5 border-b border-slate-800 pb-3">
                <h2 className="font-semibold text-white">
                  01. Información del negocio
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Identifica el negocio que administrará KAIRO.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="business_name" className={labelClass}>
                    Nombre del negocio
                  </label>
                  <input
                    id="business_name"
                    name="business_name"
                    required
                    maxLength={120}
                    autoComplete="organization"
                    value={form.business_name}
                    onChange={(event) =>
                      updateField("business_name", event.target.value)
                    }
                    placeholder="Ej. Studio Wellness"
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="industry" className={labelClass}>
                    Industria o sector
                  </label>
                  <input
                    id="industry"
                    name="industry"
                    required
                    maxLength={100}
                    value={form.industry}
                    onChange={(event) =>
                      updateField("industry", event.target.value)
                    }
                    placeholder="Ej. Belleza y bienestar"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="business_email" className={labelClass}>
                    Correo del negocio
                  </label>
                  <input
                    id="business_email"
                    name="business_email"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.business_email}
                    onChange={(event) =>
                      updateField("business_email", event.target.value)
                    }
                    placeholder="contacto@negocio.com"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="business_phone" className={labelClass}>
                    Teléfono (opcional)
                  </label>
                  <input
                    id="business_phone"
                    name="business_phone"
                    type="tel"
                    autoComplete="tel"
                    maxLength={30}
                    value={form.business_phone}
                    onChange={(event) =>
                      updateField("business_phone", event.target.value)
                    }
                    placeholder="Ej. 222 123 4567"
                    className={inputClass}
                  />
                </div>
              </div>
            </section>

            <section>
              <div className="mb-5 border-b border-slate-800 pb-3">
                <h2 className="font-semibold text-white">
                  02. Tu cuenta de administrador
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Utilizarás estos datos para iniciar sesión.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="name" className={labelClass}>
                    Nombre completo
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    maxLength={120}
                    autoComplete="name"
                    value={form.name}
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    placeholder="Tu nombre completo"
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="email" className={labelClass}>
                    Correo para iniciar sesión
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    placeholder="tu@correo.com"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="password" className={labelClass}>
                    Contraseña
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(event) =>
                      updateField("password", event.target.value)
                    }
                    placeholder="Mínimo 8 caracteres"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className={labelClass}>
                    Confirmar contraseña
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={(event) =>
                      updateField("confirmPassword", event.target.value)
                    }
                    placeholder="Repite tu contraseña"
                    className={inputClass}
                  />
                </div>
              </div>
            </section>

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-800 bg-red-950/50 p-4 text-sm text-red-300"
              >
                {error}
              </p>
            )}

            <div className="space-y-5 border-t border-slate-800 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 px-4 py-3.5 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creando cuenta..." : "Crear mi cuenta"}
              </button>

              <p className="text-center text-sm text-slate-400">
                ¿Ya tienes una cuenta?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-blue-400 transition hover:text-blue-300"
                >
                  Iniciar sesión
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
