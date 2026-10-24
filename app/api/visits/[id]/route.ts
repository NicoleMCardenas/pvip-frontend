
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL =
  process.env.API_URL ?? "http://127.0.0.1:8000";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function getSessionToken() {
  const cookieStore = await cookies();
  return cookieStore.get("kairo_session")?.value;
}

function unauthorizedResponse() {
  return NextResponse.json(
    {
      detail: "Your session has expired. Please log in again.",
    },
    { status: 401 }
  );
}

function invalidIdResponse() {
  return NextResponse.json(
    { detail: "Visit ID is required." },
    { status: 400 }
  );
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const token = await getSessionToken();

    if (!token) {
      return unauthorizedResponse();
    }

    const { id } = await context.params;

    if (!id) {
      return invalidIdResponse();
    }

    const body = await request.json();

    const response = await fetch(
      `${API_URL}/visits/${encodeURIComponent(id)}`,
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
            data?.detail ?? "Unable to update visit.",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Update visit error:", error);

    return NextResponse.json(
      { detail: "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const token = await getSessionToken();

    if (!token) {
      return unauthorizedResponse();
    }

    const { id } = await context.params;

    if (!id) {
      return invalidIdResponse();
    }

    const response = await fetch(
      `${API_URL}/visits/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (response.ok) {
      return new NextResponse(null, {
        status: 204,
      });
    }

    const data = await response.json().catch(() => null);

    return NextResponse.json(
      {
        detail:
          data?.detail ?? "Unable to delete visit.",
      },
      { status: response.status }
    );
  } catch (error) {
    console.error("Delete visit error:", error);

    return NextResponse.json(
      { detail: "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}
