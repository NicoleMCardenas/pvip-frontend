
import { NextRequest, NextResponse } from "next/server";

const API_URL =
  process.env.API_URL ?? "http://127.0.0.1:8000";

type RouteContext = {
  params: Promise<{
    token: string;
  }>;
};

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { token } = await context.params;

    if (!token || token.length > 128) {
      return NextResponse.json(
        { detail: "Invalid survey link." },
        { status: 404 }
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { detail: "Invalid request body." },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${API_URL}/surveys/public/${encodeURIComponent(token)}/responses`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
      }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const detail =
        response.status === 404
          ? "Survey not found."
          : response.status === 409
            ? "This survey has already been completed or is unavailable."
            : response.status === 422
              ? "Please check your survey answers."
              : "Unable to submit your survey.";

      return NextResponse.json(
        { detail },
        { status: response.status }
      );
    }

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Public survey submission error:", error);

    return NextResponse.json(
      {
        detail: "Unable to submit your survey right now.",
      },
      { status: 500 }
    );
  }
}
