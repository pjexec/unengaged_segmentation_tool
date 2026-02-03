"use client";

import * as React from "react";
import { ToolInput, ToolOutput } from "@/lib/types";
import { buildSegmentationPlan } from "@/lib/segmentation-logic";
import { InputForm } from "@/components/tool/input-form";
import { ResultsPanel } from "@/components/tool/results-panel";
import { initAnalytics, trackEvent } from "@/lib/analytics";
import { ModeToggle } from "@/components/mode-toggle";
import { Toaster } from "sonner";

const DEFAULT_INPUT: ToolInput = {
  primarySignal: "opens_clicks",
  reliability: "somewhat_reliable",
  timeWindow: "90",
  frequency: "weekly",
  businessType: "ecommerce",
  listMaturity: "mixed",
};

export default function Home() {
  const [input, setInput] = React.useState<ToolInput>(DEFAULT_INPUT);
  const [output, setOutput] = React.useState<ToolOutput | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);

  React.useEffect(() => {
    initAnalytics();
    trackEvent("tool_viewed");
  }, []);

  const handleChange = (key: keyof ToolInput, value: any) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  const handleGenerate = () => {
    setIsGenerating(true);

    // Simulate slight delay for "calculating" feel
    setTimeout(() => {
      const plan = buildSegmentationPlan(input);
      setOutput(plan);
      setIsGenerating(false);
      trackEvent("tool_generated", { ...input });

      // Scroll to top of results on mobile
      if (window.innerWidth < 768) {
        const resultsElement = document.getElementById("results-panel");
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: "smooth" });
        }
      }
    }, 600);
  };

  const handleReset = () => {
    setInput(DEFAULT_INPUT);
    setOutput(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 sm:pb-0 transition-colors duration-300">
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
              UAI: Unengaged Audience Intelligence
            </h1>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              Stop guessing. Start retaining. Define your unengaged segment in seconds.
            </p>
          </div>
          <div className="self-end sm:self-start">
            <ModeToggle />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Left: Input Form */}
          <div className="lg:col-span-4 xl:col-span-4">
            <InputForm
              input={input}
              onChange={handleChange}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          </div>

          {/* Right: Results Panel */}
          <div id="results-panel" className="lg:col-span-8 xl:col-span-8 scroll-mt-8">
            {output ? (
              <ResultsPanel output={output} onReset={handleReset} />
            ) : (
              <div className="hidden lg:flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl h-[600px] text-slate-400 bg-white/50 dark:bg-slate-900/50">
                <div className="max-w-xs space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-slate-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">Ready to Segment?</h3>
                  <p>Configure your list profile on the left and click Generate to see your custom segmentation plan.</p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
      <Toaster richColors position="top-center" />
    </div>
  );
}
