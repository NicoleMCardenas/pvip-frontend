
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import LoginForm from "@/components/auth/LoginForm";

const API_URL =
  process.env.API_URL ?? "http://127.0.0.1:8000";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("kairo_session")?.value;

  if (token) {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (response.ok) {
        redirect("/");
      }
    } catch (error) {
      // Las redirecciones de Next.js deben propagarse.
      if (
        error &&
        typeof error === "object" &&
        "digest" in error &&
        typeof error.digest === "string" &&
        error.digest.startsWith("NEXT_REDIRECT")
      ) {
        throw error;
      }

      // Si FastAPI no responde, permitimos mostrar el login.
    }
  }

  return <LoginForm />;
}
