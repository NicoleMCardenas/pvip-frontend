
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL =
  process.env.API_URL ?? "http://127.0.0.1:8000";

const REQUEST_TIMEOUT_MS = 10000;

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const token = (await cookies()).get("kairo_session")?.value;

    if (!token) {
      return NextResponse.json(
        {
          detail:
            "Your session has expired. Please log in again.",
        },
        { status: 401 }
      );
    }

    let response: Response;

    try {
      response = await fetch(
        `${API_URL}/clients/${encodeURIComponent(id)}/status`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        }
      );
    } catch (error) {
      console.error(
        "Customer status verification connection error:",
        error
      );

      return NextResponse.json(
        {
          detail:
            "Unable to verify the customer status. Please try again.",
        },
        { status: 504 }
      );
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          detail:
            typeof data?.detail === "string"
              ? data.detail
              : "Unable to verify customer status.",
        },
        { status: response.status }
      );
    }

    if (
      !data ||
      !["new", "active", "at_risk", "archived"].includes(
        data.status
      )
    ) {
      return NextResponse.json(
        {
          detail:
            "The server returned an invalid customer status.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error(
      "Customer status verification error:",
      error
    );

    return NextResponse.json(
      {
        detail: "An unexpected server error occurred.",
      },
      { status: 500 }
    );
  }
}
