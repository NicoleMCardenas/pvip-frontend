
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
    !("password" in body) ||
    typeof body.password !== "string" ||
    body.password.length < 8
  ) {
    return NextResponse.json(
      { detail: "El enlace o la contraseña no son válidos." },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${API_URL}/auth/staff-invitations/accept`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: body.token,
          password: body.password,
        }),
        cache: "no-store",
      }
    );

    if (response.status === 400 || response.status === 422) {
      return NextResponse.json(
        {
          detail:
            "La invitación no es válida o ha expirado.",
        },
        { status: 400 }
      );
    }

    if (!response.ok) {
      throw new Error("Staff invitation activation failed");
    }

    return NextResponse.json({
      message: "Tu cuenta se activó correctamente.",
    });
  } catch {
    return NextResponse.json(
      {
        detail:
          "No fue posible activar la cuenta. Inténtalo nuevamente.",
      },
      { status: 503 }
    );
  }
}

