export type ChatResponse = {
  reply: string;
};

const DEFAULT_BASE_URL = "http://127.0.0.1:8000";
const DEFAULT_TIMEOUT_MS = 12000;

export async function sendChatMessage(
  message: string,
  options?: { timeoutMs?: number },
): Promise<ChatResponse> {
  const baseUrl = (
    process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_BASE_URL
  ).replace(/\/$/, "");
  const url = `${baseUrl}/ai/chat`;
  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
      signal: controller.signal,
    });

    const raw = await response.text();
    let data: unknown = null;

    if (raw) {
      try {
        data = JSON.parse(raw) as unknown;
      } catch {
        data = null;
      }
    }

    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status}.`;

      if (
        data &&
        typeof (data as { detail?: unknown }).detail === "string"
      ) {
        errorMessage = (data as { detail: string }).detail;
      } else if (raw) {
        errorMessage = raw;
      }

      throw new Error(errorMessage);
    }

    if (!data || typeof (data as { reply?: unknown }).reply !== "string") {
      throw new Error("Invalid response from the AI service.");
    }

    return { reply: (data as { reply: string }).reply };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
