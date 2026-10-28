
import { NextResponse } from "next/server";

const API_URL =
  process.env.API_URL ?? "http://127.0.0.1:8000";

type Language = "es" | "en";

const MESSAGES = {
  es: {
    generic:
      "Si el correo está registrado, recibirás instrucciones para recuperar tu contraseña.",
    invalidRequest: "Solicitud inválida.",
    invalidEmail: "Ingresa un correo electrónico válido.",
    serviceError:
      "No fue posible procesar la solicitud. Inténtalo nuevamente.",
  },
  en: {
    generic:
      "If the email is registered, you will receive instructions to reset your password.",
    invalidRequest: "Invalid request.",
    invalidEmail: "Enter a valid email address.",
    serviceError:
      "We couldn't process your request. Please try again.",
  },
} as const;

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { detail: MESSAGES.es.invalidRequest },
      { status: 400 }
    );
  }

  const language: Language =
    typeof body === "object" &&
    body !== null &&
    "language" in body &&
    body.language === "en"
      ? "en"
      : "es";

  const messages = MESSAGES[language];

  if (
    typeof body !== "object" ||
    body === null ||
    !("email" in body) ||
    typeof body.email !== "string" ||
    !body.email.trim()
  ) {
    return NextResponse.json(
      { detail: messages.invalidEmail },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: body.email.trim(),
        language,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 422) {
        return NextResponse.json(
          { detail: messages.invalidEmail },
          { status: 400 }
        );
      }

      throw new Error("Password recovery service failed");
    }

    return NextResponse.json({
      message: messages.generic,
    });
  } catch {
    return NextResponse.json(
      {
        detail: messages.serviceError,
      },
      { status: 503 }
    );
  }
}
