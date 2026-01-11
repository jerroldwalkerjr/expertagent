"use client";

import { useState } from "react";

type FeedbackOption = "helpful" | "needs-work" | null;

export default function FeedbackBar() {
  const [feedback, setFeedback] = useState<FeedbackOption>(null);

  const handleFeedback = (value: Exclude<FeedbackOption, null>) => {
    setFeedback(value);
    // TODO: send feedback to analytics when the endpoint is ready.
    console.info("Feedback submitted", value);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-700">
        How was this content?
      </h3>
      <div className="mt-3 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => handleFeedback("helpful")}
          className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
            feedback === "helpful"
              ? "bg-emerald-500 text-white"
              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          }`}
        >
          Helpful
        </button>
        <button
          type="button"
          onClick={() => handleFeedback("needs-work")}
          className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
            feedback === "needs-work"
              ? "bg-rose-500 text-white"
              : "bg-rose-50 text-rose-700 hover:bg-rose-100"
          }`}
        >
          Needs work
        </button>
      </div>
      {feedback ? (
        <p className="mt-2 text-xs text-slate-500">
          Thanks for the feedback! We will use it to improve this module.
        </p>
      ) : null}
    </section>
  );
}
