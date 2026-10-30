
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL =
  process.env.API_URL ?? "http://127.0.0.1:8000";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("kairo_session")?.value;

    if (!token) {
      return NextResponse.json(
        {
          detail:
            "Your session has expired. Please log in again.",
        },
        { status: 401 }
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { detail: "Invalid request." },
        { status: 400 }
      );
    }

    if (
      typeof body !== "object" ||
      body === null ||
      !("staff_id" in body) ||
      typeof body.staff_id !== "string" ||
      !body.staff_id.trim() ||
      !("email" in body) ||
      typeof body.email !== "string" ||
      !body.email.trim() ||
      !("language" in body) ||
      (body.language !== "es" && body.language !== "en")
    ) {
      return NextResponse.json(
        { detail: "Invalid invitation details." },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${API_URL}/auth/staff-invitations`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          staff_id: body.staff_id,
          email: body.email.trim(),
          language: body.language,
        }),
        cache: "no-store",
      }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          detail:
            data?.detail ??
            "Unable to send the invitation.",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Staff invitation error:", error);

    return NextResponse.json(
      {
        detail: "An unexpected server error occurred.",
      },
      { status: 500 }
    );
  }
}

