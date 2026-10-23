
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = "http://127.0.0.1:8000";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("kairo_session")?.value;

    if (!token) {
      return NextResponse.json(
        { detail: "Your session has expired. Please log in again." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const response = await fetch(`${API_URL}/clients/`, {
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
      return NextResponse.json(
        {
          detail:
            data?.detail ??
            "Unable to create customer.",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, {
      status: 201,
    });
  } catch (error) {
    console.error("Create customer error:", error);

    return NextResponse.json(
      { detail: "An unexpected server error occurred." },
      { status: 500 }
    );
  }
  
}
