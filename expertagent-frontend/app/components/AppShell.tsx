import type { ReactNode } from "react";
import TopNav from "./TopNav";
import TabsNav from "./TabsNav";

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#f4f1fb] text-slate-900">
      <div className="mx-auto max-w-6xl px-6 pt-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#a36de6] via-[#8b5cf6] to-[#6d4cc3] px-8 py-8 shadow-lg">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_60%)]" />
          <TopNav />
        </div>
        <div className="mt-6">
          <TabsNav />
        </div>
      </div>
      <main className="mx-auto max-w-6xl px-6 pb-16 pt-6">{children}</main>
    </div>
  );
}
