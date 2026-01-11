"use client";

type ContentTypeSelectorProps = {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  onStart?: () => void;
};

export default function ContentTypeSelector({
  value,
  options,
  onChange,
  onStart,
}: ContentTypeSelectorProps) {
  const handleStart = () => {
    // TODO: trigger content generation pipeline when available.
    onStart?.();
    console.info("Content generation requested");
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-slate-700">
          Content Type Selection
        </h3>
        <p className="text-xs text-slate-500">
          Choose how you want the content explained.
        </p>
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 flex-1 rounded-full border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleStart}
          className="h-10 rounded-full bg-indigo-600 px-6 text-xs font-semibold uppercase tracking-wide text-white shadow transition hover:bg-indigo-500"
        >
          Let's Get Started
        </button>
      </div>
    </section>
  );
}
