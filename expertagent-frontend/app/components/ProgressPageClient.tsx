"use client";

const summaryCards = [
  { label: "Overall Mastery", value: "68%" },
  { label: "Weekly Streak", value: "4 days" },
  { label: "Topics Completed", value: "12" },
];

export default function ProgressPageClient() {
  const handleExport = () => {
    // TODO: export progress report as PDF.
    console.info("Export report clicked");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Track My Progress
          </h2>
          <p className="text-sm text-slate-500">
            Monitor learning milestones and mastery trends.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="w-fit rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow transition hover:bg-indigo-500"
        >
          Export Report
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {card.label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-700">
            Knowledge Growth
          </h3>
          <div className="mt-4 h-44 rounded-xl bg-gradient-to-r from-indigo-100 via-blue-50 to-emerald-50" />
          <p className="mt-3 text-xs text-slate-500">
            Placeholder chart for mastery over time.
          </p>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-700">
            Topic Confidence Map
          </h3>
          <div className="mt-4 h-44 rounded-xl bg-gradient-to-r from-amber-100 via-rose-50 to-purple-50" />
          <p className="mt-3 text-xs text-slate-500">
            Placeholder visualization for topic confidence.
          </p>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700">
          Recent Activity
        </h3>
        <div className="mt-4 space-y-3 text-xs text-slate-600">
          <div className="rounded-lg bg-slate-50 px-4 py-3">
            Completed practice session on Generative AI in Education.
          </div>
          <div className="rounded-lg bg-slate-50 px-4 py-3">
            Reviewed sources for Trust Evaluation Matrix.
          </div>
          <div className="rounded-lg bg-slate-50 px-4 py-3">
            Asked 6 questions in Smart Chatbot.
          </div>
        </div>
      </section>
    </div>
  );
}
