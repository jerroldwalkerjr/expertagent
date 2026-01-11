"use client";

export default function TopNav() {
  const handleSettingsClick = () => {
    // TODO: open settings panel when available.
    console.info("Settings clicked");
  };

  return (
    <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-semibold text-white sm:text-4xl">
          Expert Agent
        </h1>
        <p className="mt-2 text-sm text-white/80">
          AI-powered learning with personalized content generation
        </p>
      </div>
      <button
        type="button"
        onClick={handleSettingsClick}
        className="w-fit rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur transition hover:bg-white/25"
      >
        Settings
      </button>
    </div>
  );
}
