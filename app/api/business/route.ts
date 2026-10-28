
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL =
  process.env.API_URL ?? "http://127.0.0.1:8000";

async function getSessionToken() {
  const cookieStore = await cookies();
  return cookieStore.get("kairo_session")?.value;
}

export async function GET() {
  try {
    const token = await getSessionToken();

    if (!token) {
      return NextResponse.json(
        {
          detail:
            "Your session has expired. Please log in again.",
        },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_URL}/business/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          detail:
            data?.detail ??
            "Unable to load business information.",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Get business error:", error);

    return NextResponse.json(
      {
        detail: "An unexpected server error occurred.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = await getSessionToken();

    if (!token) {
      return NextResponse.json(
        {
          detail:
            "Your session has expired. Please log in again.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const response = await fetch(`${API_URL}/business/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          detail:
            data?.detail ??
            "Unable to update business information.",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Update business error:", error);

    return NextResponse.json(
      {
        detail: "An unexpected server error occurred.",
      },
      { status: 500 }
    );
  }
}
