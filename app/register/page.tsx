
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import RegisterForm from "@/components/auth/RegisterForm";

const API_URL =
  process.env.API_URL ?? "http://127.0.0.1:8000";

export default async function RegisterPage() {
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
      if (
        error &&
        typeof error === "object" &&
        "digest" in error &&
        typeof error.digest === "string" &&
        error.digest.startsWith("NEXT_REDIRECT")
      ) {
        throw error;
      }
    }
  }

  return <RegisterForm />;
}
