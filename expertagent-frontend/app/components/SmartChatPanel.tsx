"use client";

import { useEffect, useRef, useState } from "react";
import { sendChatMessage } from "../lib/api";
import ChatBubble from "./ChatBubble";

type ChatMessage = {
  id: string;
  role: "user" | "ai";
  content: string;
};

type SmartChatPanelProps = {
  selectedTopic?: string;
};

const createMessageId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export default function SmartChatPanel({ selectedTopic }: SmartChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: createMessageId(),
      role: "ai",
      content:
        "Hi! Ask me anything about your learning topic and I will respond with focused guidance.",
    },
  ]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedInput = input.trim();
    if (!trimmedInput || isSending) {
      return;
    }

    const messageWithContext = selectedTopic
      ? `Topic: ${selectedTopic}

${trimmedInput}`
      : trimmedInput;

    setError(null);
    setInput("");
    setIsSending(true);

    const userMessage: ChatMessage = {
      id: createMessageId(),
      role: "user",
      content: trimmedInput,
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await sendChatMessage(messageWithContext);
      const aiMessage: ChatMessage = {
        id: createMessageId(),
        role: "ai",
        content: response.reply,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong while contacting the AI service.";
      setError(message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="rounded-2xl border border-amber-200 bg-white shadow-sm md:sticky md:top-6">
      <div className="flex items-center justify-between border-b border-amber-100 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-amber-700">Smart Chatbot</p>
          <p className="text-xs text-slate-500">
            Ask questions and get focused guidance.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="rounded-full border border-amber-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-700 transition hover:bg-amber-50 md:hidden"
        >
          {isCollapsed ? "Show" : "Hide"}
        </button>
      </div>
      <div className={isCollapsed ? "hidden md:block" : "block"}>
        {selectedTopic ? (
          <div className="mx-4 mt-4 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700">
            Context: {selectedTopic}
          </div>
        ) : null}
        <div className="max-h-[420px] space-y-4 overflow-y-auto px-4 py-4">
          {messages.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-6 text-xs text-slate-500">
              Start the conversation by sending a message.
            </div>
          ) : (
            messages.map((message) => (
              <ChatBubble
                key={message.id}
                role={message.role}
                message={message.content}
              />
            ))
          )}
          <div ref={endRef} />
        </div>
        <form onSubmit={handleSubmit} className="border-t border-amber-100 p-4">
          <div className="flex flex-col gap-3">
            <input
              type="text"
              name="message"
              placeholder="Type your question and press Send..."
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="h-11 w-full rounded-full border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-100"
              disabled={isSending}
              aria-label="Chat message"
            />
            <button
              type="submit"
              disabled={isSending || input.trim().length === 0}
              className="h-11 rounded-full bg-amber-500 px-6 text-sm font-semibold text-white transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-amber-200"
            >
              {isSending ? "Sending..." : "Send"}
            </button>
          </div>
          {error ? (
            <p className="mt-3 text-xs text-rose-600" role="alert">
              {error}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
