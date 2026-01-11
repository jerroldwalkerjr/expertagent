"use client";

import { useMemo, useState } from "react";
import BriefSummary from "./BriefSummary";
import ContentTypeSelector from "./ContentTypeSelector";
import FeedbackBar from "./FeedbackBar";
import LearningContent from "./LearningContent";
import PracticeSession from "./PracticeSession";
import SmartChatPanel from "./SmartChatPanel";
import SourcesPanel from "./SourcesPanel";
import TopicSelector from "./TopicSelector";

const TOPICS = [
  "Trust in Educational Tools",
  "Cognitive Workload Analysis",
  "ExpertGen Performance Evaluation",
  "Generative AI in Education",
  "Trust Evaluation Matrix",
  "Experiment Design and Procedures",
  "Comparative Trust Analysis",
  "Learning Outcome Improvement",
];

const CONTENT_TYPES = [
  "Concept Explanation",
  "Step-by-Step Guide",
  "Case Study",
  "Comparison Summary",
];

export default function InteractivePageClient() {
  const [selectedTopic, setSelectedTopic] = useState(TOPICS[0]);
  const [contentType, setContentType] = useState(CONTENT_TYPES[0]);

  const briefSummary = useMemo(
    () =>
      `This overview for ${selectedTopic} highlights the core concepts, current research themes, and practical considerations that matter most for applied learning scenarios. It is intentionally concise so you can decide which sections deserve deeper study.`,
    [selectedTopic],
  );

  const handleSettingsClick = () => {
    // TODO: open proactive teaching settings.
    console.info("Proactive teaching settings clicked");
  };

  const handleContentStart = () => {
    // TODO: trigger content generation for the selected topic and content type.
    console.info("Generate content", { selectedTopic, contentType });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-emerald-700">
              Proactive Teaching
            </h2>
            <p className="text-xs text-slate-500">
              Curated guidance for the selected topic.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSettingsClick}
            className="h-9 w-fit rounded-full border border-emerald-200 bg-emerald-50 px-4 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
          >
            Settings
          </button>
        </div>

        <TopicSelector
          topics={TOPICS}
          selectedTopic={selectedTopic}
          onSelect={setSelectedTopic}
        />
        <BriefSummary summary={briefSummary} />
        <ContentTypeSelector
          value={contentType}
          options={CONTENT_TYPES}
          onChange={setContentType}
          onStart={handleContentStart}
        />
        <LearningContent topic={selectedTopic} />
        <PracticeSession topic={selectedTopic} />
        <FeedbackBar />
      </div>

      <div className="space-y-6">
        <SmartChatPanel selectedTopic={selectedTopic} />
        <SourcesPanel />
      </div>
    </div>
  );
}
