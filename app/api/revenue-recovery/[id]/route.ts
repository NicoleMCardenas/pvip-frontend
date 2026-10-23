import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL =
  process.env.API_URL ?? "http://127.0.0.1:8000";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
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

    const { id } = await context.params;

    if (!id?.trim()) {
      return NextResponse.json(
        {
          detail: "Revenue attribution ID is required.",
        },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${API_URL}/revenue-recovery/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (response.status === 204) {
      return new NextResponse(null, {
        status: 204,
      });
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          detail:
            typeof data?.detail === "string"
              ? data.detail
              : response.status === 404
                ? "This revenue attribution was not found."
                : "Unable to remove revenue attribution.",
        },
        { status: response.status }
      );
    }

    return new NextResponse(null, {
      status: 204,
    });
  } catch (error) {
    console.error("Remove revenue attribution error:", error);

    return NextResponse.json(
      {
        detail:
          "An unexpected server error occurred. Please try again.",
      },
      { status: 500 }
    );
  }
}
