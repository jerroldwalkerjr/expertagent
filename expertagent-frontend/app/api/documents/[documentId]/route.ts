const DEFAULT_BASE_URL = "http://127.0.0.1:8000";
const BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_BASE_URL
).replace(/\/$/, "");

type RouteContext = {
  params: {
    documentId: string;
  };
};

export async function PUT(request: Request, context: RouteContext) {
  try {
    const payload = await request.json();
    const response = await fetch(
      `${BASE_URL}/documents/${context.params.documentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    const responseBody = await response.text();

    return new Response(responseBody, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") ?? "application/json",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to reach the document service.";
    return Response.json({ detail: message }, { status: 502 });
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  try {
    const response = await fetch(
      `${BASE_URL}/documents/${context.params.documentId}`,
      { method: "DELETE" }
    );
    const responseBody = await response.text();

    return new Response(responseBody, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") ?? "application/json",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to reach the document service.";
    return Response.json({ detail: message }, { status: 502 });
  }
}
