"use client";

type LearningContentProps = {
  topic: string;
};

export default function LearningContent({ topic }: LearningContentProps) {
  const handleViewFullContent = () => {
    // TODO: open the expanded learning module view.
    console.info("View full content", topic);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{topic}</h3>
          <p className="text-xs text-slate-500">
            Structured learning content for the selected topic.
          </p>
        </div>
        <button
          type="button"
          onClick={handleViewFullContent}
          className="w-fit rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
        >
          View Full Content
        </button>
      </div>
      <div className="mt-4 space-y-4">
        <div className="rounded-xl bg-slate-50 p-4">
          <h4 className="text-sm font-semibold text-slate-800">Definition</h4>
          <p className="mt-2 text-sm text-slate-600">
            {topic} focuses on how AI-driven systems support expert-level
            learning by combining reliable data sources, targeted explanations,
            and adaptive feedback.
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <h4 className="text-sm font-semibold text-slate-800">Features</h4>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
            <li>Domain-specific insights aligned to course objectives.</li>
            <li>Evidence-backed explanations with cited sources.</li>
            <li>Actionable prompts to reinforce retention.</li>
          </ul>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <h4 className="text-sm font-semibold text-slate-800">Importance</h4>
          <p className="mt-2 text-sm text-slate-600">
            Understanding {topic} helps learners connect theory to practice,
            especially when evaluating performance outcomes and trust in AI
            learning systems.
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <h4 className="text-sm font-semibold text-slate-800">Connections</h4>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
            <li>Links to cognitive workload and evaluation metrics.</li>
            <li>Supports experiment design and impact analysis.</li>
            <li>Highlights responsible use and trust calibration.</li>
          </ul>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <h4 className="text-sm font-semibold text-slate-800">Example</h4>
          <p className="mt-2 text-sm text-slate-600">
            A study group compares AI-generated explanations with textbook
            summaries to measure improvements in learner confidence and
            knowledge retention.
          </p>
        </div>
      </div>
    </section>
  );
}
