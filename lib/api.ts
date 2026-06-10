const API_URL = "http://127.0.0.1:8000";

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NDk5NWYxMi00NDA0LTQ2ZmMtOGYwZS05YTczMGRiMjQ3MGQiLCJlbWFpbCI6Im5pY29sZUBnbG93d2VsbG5lc3MuY29tIiwicm9sZSI6Im93bmVyIiwiZXhwIjoxNzgxMDU0MjI4fQ.MIXXQNJYK9F1SqxTjc3SJ2uZZnc3CQmf817lil4U-Us";

export async function apiFetch(
  endpoint: string,
  options?: RequestInit
) {
  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
        ...(options?.headers || {})
      }
    }
  );

  if (!response.ok) {
    throw new Error("API request failed");
  }

  return response.json();
}