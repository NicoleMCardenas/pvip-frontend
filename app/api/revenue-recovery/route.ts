import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL =
  process.env.API_URL ?? "http://127.0.0.1:8000";

export async function POST(request: NextRequest) {
  try {
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
      return NextResponse.json(
        { detail: "A valid JSON request body is required." },
        { status: 400 }
      );
    }

    if (
      typeof body !== "object" ||
      body === null ||
      !("case_id" in body) ||
      !("visit_id" in body) ||
      typeof body.case_id !== "string" ||
      typeof body.visit_id !== "string" ||
      !body.case_id.trim() ||
      !body.visit_id.trim()
    ) {
      return NextResponse.json(
        {
          detail:
            "A retention case and a visit are required.",
        },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${API_URL}/revenue-recovery/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          case_id: body.case_id,
          visit_id: body.visit_id,
        }),
        cache: "no-store",
      }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          detail:
            typeof data?.detail === "string"
              ? data.detail
              : response.status === 409
                ? "This visit has already been attributed."
                : response.status === 422
                  ? "This visit is not eligible for attribution."
                  : "Unable to attribute recovered revenue.",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Revenue attribution error:", error);

    return NextResponse.json(
      {
        detail:
          "An unexpected server error occurred. Please try again.",
      },
      { status: 500 }
    );
  }
}
