
import { NextRequest, NextResponse } from "next/server";

const API_URL =
  process.env.API_URL ?? "http://127.0.0.1:8000";

type RouteContext = {
  params: Promise<{
    token: string;
  }>;
};

export async function GET(
  _request: NextRequest,
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

    const response = await fetch(
      `${API_URL}/surveys/public/${encodeURIComponent(token)}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          detail:
            response.status === 404
              ? "Survey not found."
              : "Unable to load this survey.",
        },
        {
          status: response.status,
        }
      );
    }

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Public survey lookup error:", error);

    return NextResponse.json(
      {
        detail: "Unable to load this survey right now.",
      },
      { status: 500 }
    );
  }
}
