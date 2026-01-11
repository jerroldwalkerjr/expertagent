"use client";

type ChatBubbleProps = {
  role: "user" | "ai";
  message: string;
  resources?: string[];
};

export default function ChatBubble({
  role,
  message,
  resources,
}: ChatBubbleProps) {
  const isUser = role === "user";
  const showResources = !isUser && resources && resources.length > 0;

  return (
    <div
      className={`bubble-in flex w-full ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div className="max-w-[80%]">
        <div
          className={`whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
            isUser
              ? "bg-slate-900 text-white"
              : "border border-slate-200 bg-white/85 text-slate-900"
          }`}
        >
          {message}
        </div>
        {showResources ? (
          <div className="mt-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-700 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Supplemental Learning Resources
            </p>
            <ul className="mt-2 space-y-1">
              {resources.map((resource) => (
                <li key={resource}>- {resource}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
