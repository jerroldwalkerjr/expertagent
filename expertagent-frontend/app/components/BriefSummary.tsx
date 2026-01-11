"use client";

type BriefSummaryProps = {
  summary: string;
};

export default function BriefSummary({ summary }: BriefSummaryProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-700">Brief Summary</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{summary}</p>
    </section>
  );
}
