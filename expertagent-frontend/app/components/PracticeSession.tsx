"use client";

import { useState } from "react";

type PracticeSessionProps = {
  topic: string;
};

type SessionStage = "idle" | "active" | "submitted";

const answerReview = [
  {
    id: "q1",
    question: "What is a key factor that drives effective AI tutoring?",
    status: "correct",
  },
  {
    id: "q2",
    question: "Which metric best captures learner trust calibration?",
    status: "correct",
  },
  {
    id: "q3",
    question: "What is the primary challenge with large models in classrooms?",
    status: "incorrect",
  },
  {
    id: "q4",
    question: "Which component improves retention the most?",
    status: "correct",
  },
];

const studySuggestions = [
  "Review challenges in large language models.",
  "Revisit evaluation criteria for AI-generated feedback.",
  "Compare trust calibration frameworks in recent studies.",
];

const learningTips = [
  "Summarize each concept in your own words before moving on.",
  "Cross-check AI responses with source citations.",
  "Schedule a quick recap session after every quiz attempt.",
];

export default function PracticeSession({ topic }: PracticeSessionProps) {
  const [stage, setStage] = useState<SessionStage>("idle");

  const handleStart = () => {
    // TODO: load quiz questions for the selected topic.
    setStage("active");
  };

  const handleSubmit = () => {
    // TODO: submit answers and compute results via backend.
    setStage("submitted");
  };

  const handleReset = () => {
    // TODO: reset the quiz state when multi-attempt support is added.
    setStage("idle");
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Practice Session
          </h3>
          <p className="text-xs text-slate-500">
            Quiz practice for {topic}.
          </p>
        </div>
        {stage === "submitted" ? (
          <button
            type="button"
            onClick={handleReset}
            className="w-fit rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
          >
            Try Again
          </button>
        ) : null}
      </div>

      {stage === "idle" ? (
        <div className="mt-4 rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-600">
            Total 4 questions, estimated time: 8 minutes.
          </p>
          <button
            type="button"
            onClick={handleStart}
            className="mt-3 rounded-full bg-indigo-600 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow transition hover:bg-indigo-500"
          >
            Start Quiz
          </button>
        </div>
      ) : null}

      {stage === "active" ? (
        <div className="mt-4 space-y-3">
          <div className="rounded-xl bg-indigo-50 p-4">
            <p className="text-sm font-semibold text-indigo-700">
              Practice Content
            </p>
            <p className="mt-1 text-xs text-indigo-600">
              Answer the questions and submit when you are ready.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-full bg-emerald-500 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow transition hover:bg-emerald-400"
          >
            Submit Answers
          </button>
        </div>
      ) : null}

      {stage === "submitted" ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
            <h4 className="text-base font-semibold text-emerald-800">
              Test Completed!
            </h4>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-white px-3 py-2 text-xs text-slate-600">
                <p className="font-semibold text-slate-800">Total Questions</p>
                <p className="text-lg font-semibold text-slate-900">4</p>
              </div>
              <div className="rounded-lg bg-white px-3 py-2 text-xs text-slate-600">
                <p className="font-semibold text-slate-800">Correct Answers</p>
                <p className="text-lg font-semibold text-slate-900">3</p>
              </div>
              <div className="rounded-lg bg-white px-3 py-2 text-xs text-slate-600">
                <p className="font-semibold text-slate-800">Accuracy Rate</p>
                <p className="text-lg font-semibold text-slate-900">75%</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h4 className="text-sm font-semibold text-slate-800">
              Answer Review
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-600">
              {answerReview.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
                >
                  <span>{item.question}</span>
                  <span
                    className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                      item.status === "correct"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {item.status === "correct" ? "Correct" : "Incorrect"}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h4 className="text-sm font-semibold text-slate-800">
                Study Suggestions
              </h4>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-slate-600">
                {studySuggestions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h4 className="text-sm font-semibold text-slate-800">
                AI Learning Tips
              </h4>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-slate-600">
                {learningTips.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
