
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL =
  process.env.API_URL ?? "http://127.0.0.1:8000";

export async function POST(request: NextRequest) {
  try {
    const token = (await cookies()).get(
      "kairo_session"
    )?.value;

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

    const response = await fetch(`${API_URL}/services/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const detail = data?.detail;

      return NextResponse.json(
        {
          detail:
            typeof detail === "string"
              ? detail
              : "Unable to create service.",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Create service error:", error);

    return NextResponse.json(
      {
        detail: "An unexpected server error occurred.",
      },
      { status: 500 }
    );
  }
}
