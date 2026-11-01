
import { NextResponse } from "next/server";

const API_URL =
  process.env.API_URL ?? "http://127.0.0.1:8000";

export async function POST() {
  try {
    const response = await fetch(`${API_URL}/auth/demo`, {
      method: "POST",
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { detail: "El acceso a KAIRO Demo no está disponible." },
        { status: 503 }
      );
    }

    const data = await response.json();

    if (typeof data.access_token !== "string") {
      return NextResponse.json(
        { detail: "Respuesta de autenticación inválida." },
        { status: 502 }
      );
    }

    const result = NextResponse.json({
      message: "Acceso a KAIRO Demo habilitado.",
    });

    result.cookies.set("kairo_session", data.access_token, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE === "true",
      sameSite: "lax",
      path: "/",
    });

    return result;
  } catch {
    return NextResponse.json(
      { detail: "No fue posible acceder a KAIRO Demo." },
      { status: 500 }
    );
  }
}
