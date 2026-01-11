"use client";

import { useEffect, useRef, useState } from "react";
import { sendChatMessage } from "../lib/api";
import ChatBubble from "./ChatBubble";

type ChatMessage = {
  id: string;
  role: "user" | "ai";
  content: string;
};

const createMessageId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export default function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
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
      const response = await sendChatMessage(trimmedInput);
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
    <section className="flex min-h-[520px] w-full flex-1 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white/80 shadow-xl backdrop-blur">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">Live Chat</p>
          <p className="text-xs text-slate-500">
            Messages stay here while you explore new topics.
          </p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          Online
        </span>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
        {messages.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 px-6 py-8 text-sm text-slate-500">
            <p className="font-semibold text-slate-700">
              Start the conversation by sending a message.
            </p>
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

      <form onSubmit={handleSubmit} className="border-t border-slate-200 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            name="message"
            placeholder="Type your question and press Send..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="h-11 flex-1 rounded-full border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            disabled={isSending}
            aria-label="Chat message"
          />
          <button
            type="submit"
            disabled={isSending || input.trim().length === 0}
            className="h-11 rounded-full bg-slate-900 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </div>
        {error ? (
          <p className="mt-3 text-sm text-rose-600" role="alert">
            {error}
          </p>
        ) : null}
      </form>
    </section>
  );
}
