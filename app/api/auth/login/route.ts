
import { NextRequest, NextResponse } from "next/server";

const API_URL =
  process.env.API_URL ?? "http://127.0.0.1:8000";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return NextResponse.json(
        { detail: "Correo y contraseña son obligatorios." },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { detail: "Correo o contraseña incorrectos." },
        { status: response.status === 401 ? 401 : 502 }
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
      message: "Inicio de sesión exitoso.",
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
      { detail: "No fue posible iniciar sesión." },
      { status: 500 }
    );
  }
}
