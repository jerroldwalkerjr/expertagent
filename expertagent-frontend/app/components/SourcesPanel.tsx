"use client";

import { useState } from "react";

const sources = [
  {
    id: "source-1",
    title: "Snippet 1",
    origin: "ExpertGen: Comparative Analysis",
    excerpt:
      "Corresponding clusters highlight how trust calibration improves when learners see consistent evaluation criteria.",
  },
  {
    id: "source-2",
    title: "Snippet 2",
    origin: "Learning Outcomes Study",
    excerpt:
      "Performance gains are strongest when feedback cycles include concrete next-step prompts.",
  },
  {
    id: "source-3",
    title: "Snippet 3",
    origin: "Experimental Design Notes",
    excerpt:
      "Participants reported higher confidence when AI explanations referenced domain-specific examples.",
  },
];

export default function SourcesPanel() {
  const [isOpen, setIsOpen] = useState(true);

  const handleOpenSource = (id: string) => {
    // TODO: open the full source in the document viewer.
    console.info("Open source", id);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-700">Sources</h3>
          <p className="text-xs text-slate-500">
            Supporting snippets for the current learning module.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
        >
          {isOpen ? "Collapse" : "Expand"}
        </button>
      </div>
      {isOpen ? (
        <div className="mt-4 space-y-3">
          {sources.map((source) => (
            <details
              key={source.id}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <summary className="cursor-pointer text-sm font-semibold text-slate-700">
                {source.title}
              </summary>
              <p className="mt-2 text-xs text-slate-600">{source.excerpt}</p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                <span>{source.origin}</span>
                <button
                  type="button"
                  onClick={() => handleOpenSource(source.id)}
                  className="rounded-full border border-slate-200 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
                >
                  Open
                </button>
              </div>
            </details>
          ))}
        </div>
      ) : null}
    </section>
  );
}
