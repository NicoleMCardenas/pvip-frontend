
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL =
  process.env.API_URL ?? "http://127.0.0.1:8000";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// Edit customer
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
          detail: "Your session has expired. Please log in again.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const response = await fetch(
      `${API_URL}/clients/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
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
              : "Unable to update customer.",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Update customer error:", error);

    return NextResponse.json(
      {
        detail: "An unexpected server error occurred.",
      },
      { status: 500 }
    );
  }
}

// Archive customer (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const token = (await cookies()).get("kairo_session")?.value;

    if (!token) {
      return NextResponse.json(
        {
          detail: "Your session has expired. Please log in again.",
        },
        { status: 401 }
      );
    }

    const response = await fetch(
      `${API_URL}/clients/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const data = await response.json().catch(() => null);

      return NextResponse.json(
        {
          detail:
            typeof data?.detail === "string"
              ? data.detail
              : "Unable to archive customer.",
        },
        { status: response.status }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Archive customer error:", error);

    return NextResponse.json(
      {
        detail: "An unexpected server error occurred.",
      },
      { status: 500 }
    );
  }
}
