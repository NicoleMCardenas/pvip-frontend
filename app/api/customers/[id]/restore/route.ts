
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL =
  process.env.API_URL ?? "http://127.0.0.1:8000";

const REQUEST_TIMEOUT_MS = 10000;

type RouteContext = {
  params: Promise<{ id: string }>;
};

type RestoreStatus = "new" | "active" | "at_risk";

const validStatuses: RestoreStatus[] = [
  "new",
  "active",
  "at_risk",
];

export async function PATCH(
  request: NextRequest,
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

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      body = {};
    }

    if (
      typeof body !== "object" ||
      body === null ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        {
          detail: "Invalid request body.",
        },
        { status: 400 }
      );
    }

    const fallbackStatus = (
      body as { fallback_status?: unknown }
    ).fallback_status;

    if (
      fallbackStatus != null &&
      !validStatuses.includes(
        fallbackStatus as RestoreStatus
      )
    ) {
      return NextResponse.json(
        {
          detail: "Invalid restoration status.",
        },
        { status: 400 }
      );
    }

    let response: Response;

    try {
      response = await fetch(
        `${API_URL}/clients/${encodeURIComponent(id)}/restore`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fallback_status: fallbackStatus ?? null,
          }),
          cache: "no-store",
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        }
      );
    } catch (error) {
      console.error(
        "Restore customer connection error:",
        error
      );

      return NextResponse.json(
        {
          detail:
            "Could not confirm the restoration. The server may be unavailable or the request may have timed out. Refresh the archived and active customer lists to check the customer's status before trying again.",
          outcome_unknown: true,
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
              : "Unable to restore customer.",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Restore customer error:", error);

    return NextResponse.json(
      {
        detail:
          "An unexpected server error occurred.",
      },
      { status: 500 }
    );
  }
}
