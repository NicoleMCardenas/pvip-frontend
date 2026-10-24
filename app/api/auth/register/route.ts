
import { NextRequest, NextResponse } from "next/server";

const API_URL =
  process.env.API_URL ?? "http://127.0.0.1:8000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { detail: "Los datos del registro no son válidos." },
        { status: 400 }
      );
    }

    const requiredFields = [
      "business_name",
      "industry",
      "business_email",
      "name",
      "email",
      "password",
    ] as const;

    for (const field of requiredFields) {
      if (
        typeof body[field] !== "string" ||
        !body[field].trim()
      ) {
        return NextResponse.json(
          { detail: "Completa todos los campos obligatorios." },
          { status: 400 }
        );
      }
    }

    if (body.password.length < 8) {
      return NextResponse.json(
        { detail: "La contraseña debe tener al menos 8 caracteres." },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        business_name: body.business_name.trim(),
        industry: body.industry.trim(),
        business_email: body.business_email.trim(),
        business_phone:
          typeof body.business_phone === "string"
            ? body.business_phone.trim() || null
            : null,
        name: body.name.trim(),
        email: body.email.trim(),
        password: body.password,
      }),
      cache: "no-store",
    });

    if (response.status === 409) {
      const data = await response.json().catch(() => null);

      return NextResponse.json(
        {
          detail:
            typeof data?.detail === "string"
              ? data.detail
              : "El correo ya está registrado.",
        },
        { status: 409 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          detail:
            "No fue posible completar el registro. Inténtalo nuevamente.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { message: "Tu cuenta se creó correctamente." },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        detail:
          "No fue posible conectar con el servicio de registro.",
      },
      { status: 500 }
    );
  }
}
