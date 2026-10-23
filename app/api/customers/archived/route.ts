
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL =
  process.env.API_URL ?? "http://127.0.0.1:8000";

// Get archived customers
export async function GET(request: NextRequest) {
  try {
    const token = (await cookies()).get("kairo_session")?.value;

    if (!token) {
      return NextResponse.json(
        {
          detail: "Your session has expired. Please log in again.",
        },
        { status: 401 }
      );
    }

    const search = request.nextUrl.searchParams.get("search");

    const url = new URL(`${API_URL}/clients/archived`);

    if (search) {
      url.searchParams.set("search", search);
    }

    const response = await fetch(url.toString(), {
      method: "GET",
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
            typeof data?.detail === "string"
              ? data.detail
              : "Unable to load archived customers.",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Get archived customers error:", error);

    return NextResponse.json(
      {
        detail: "An unexpected server error occurred.",
      },
      { status: 500 }
    );
  }
}
