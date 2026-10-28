
import { NextResponse } from "next/server";

const API_URL =
  process.env.API_URL ?? "http://127.0.0.1:8000";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { detail: "Solicitud inválida." },
      { status: 400 }
    );
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("token" in body) ||
    typeof body.token !== "string" ||
    !body.token.trim() ||
    !("new_password" in body) ||
    typeof body.new_password !== "string" ||
    body.new_password.length < 8
  ) {
    return NextResponse.json(
      { detail: "El enlace o la contraseña no son válidos." },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: body.token,
        new_password: body.new_password,
      }),
      cache: "no-store",
    });

    if (response.status === 400 || response.status === 422) {
      return NextResponse.json(
        {
          detail:
            "El enlace de recuperación no es válido o ha expirado.",
        },
        { status: 400 }
      );
    }

    if (!response.ok) {
      throw new Error("Password reset service failed");
    }

    return NextResponse.json({
      message: "Tu contraseña se actualizó correctamente.",
    });
  } catch {
    return NextResponse.json(
      {
        detail:
          "No fue posible actualizar la contraseña. Inténtalo nuevamente.",
      },
      { status: 503 }
    );
  }
}
