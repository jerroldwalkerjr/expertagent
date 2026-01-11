"use client";

type TopicSelectorProps = {
  topics: string[];
  selectedTopic: string;
  onSelect: (topic: string) => void;
};

export default function TopicSelector({
  topics,
  selectedTopic,
  onSelect,
}: TopicSelectorProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-slate-700">Topic Selection</h3>
        <p className="text-xs text-slate-500">
          Pick a topic to personalize your learning path.
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {topics.map((topic) => {
          const isSelected = selectedTopic === topic;
          return (
            <button
              key={topic}
              type="button"
              onClick={() => onSelect(topic)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                isSelected
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
              }`}
            >
              {topic}
            </button>
          );
        })}
      </div>
      <div className="mt-4 rounded-xl bg-purple-50 px-4 py-2 text-xs font-semibold text-purple-700">
        Selected Topic: {selectedTopic}
      </div>
    </section>
  );
}
