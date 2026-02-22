"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { QuestionFlow } from "@/components/QuestionFlow";
import { categories, CategoryConfig, SubFlowConfig } from "@/lib/questions";

type FlowPhase = "main" | "subflow" | "addAnother";

export default function TrackCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.category as string;
  const config = categories[categoryId];

  const [loading, setLoading] = useState(true);
  const [initialAnswers, setInitialAnswers] = useState<Record<string, unknown>>({});
  const [customOptions, setCustomOptions] = useState<Record<string, string[]>>({});
  const [flowPhase, setFlowPhase] = useState<FlowPhase>("main");
  const [currentSubFlowIndex, setCurrentSubFlowIndex] = useState(0);
  const [subFlowEntries, setSubFlowEntries] = useState<Record<string, unknown>[]>([]);

  const fetchExistingData = useCallback(async () => {
    if (!config) return;

    const today = new Date().toISOString().split("T")[0];

    try {
      // Fetch existing data for the category
      const dataRes = await fetch(`${config.apiEndpoint}?date=${today}`);
      if (dataRes.ok) {
        const { data } = await dataRes.json();
        if (data) {
          if (Array.isArray(data) && data.length > 0) {
            // For mood/exercise (multiple entries), don't pre-fill — create new
          } else if (!Array.isArray(data)) {
            setInitialAnswers(data);
          }
        }
      }

      // Fetch custom options for all question categories
      const optionCategories = new Set<string>();
      config.questions.forEach((q) => {
        if (q.customOptionsCategory) optionCategories.add(q.customOptionsCategory);
      });
      config.subFlows?.forEach((sf) => {
        sf.questions.forEach((q) => {
          if (q.customOptionsCategory) optionCategories.add(q.customOptionsCategory);
        });
      });

      const optionsMap: Record<string, string[]> = {};
      await Promise.all(
        Array.from(optionCategories).map(async (cat) => {
          const res = await fetch(`/api/options?category=${cat}`);
          if (res.ok) {
            const { data } = await res.json();
            if (data?.customOptions) {
              optionsMap[cat] = data.customOptions.map(
                (o: { value: string }) => o.value
              );
            }
          }
        })
      );
      setCustomOptions(optionsMap);
    } catch {
      // Silently fail — user can still enter data
    } finally {
      setLoading(false);
    }
  }, [config]);

  useEffect(() => {
    fetchExistingData();
  }, [fetchExistingData]);

  if (!config) {
    router.push("/");
    return null;
  }

  const handleAddCustomOption = async (category: string, value: string) => {
    try {
      await fetch("/api/options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, value }),
      });
      setCustomOptions((prev) => ({
        ...prev,
        [category]: [...(prev[category] ?? []), value],
      }));
    } catch {
      // Silently fail
    }
  };

  const handleMainComplete = async (answers: Record<string, unknown>) => {
    const today = new Date().toISOString().split("T")[0];

    try {
      await fetch(config.apiEndpoint, {
        method: config.saveMethod === "post" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...answers, date: today }),
      });
    } catch {
      // Silently fail
    }

    // If there are sub-flows, start them
    if (config.subFlows && config.subFlows.length > 0) {
      setFlowPhase("subflow");
      setCurrentSubFlowIndex(0);
    } else {
      router.push("/");
    }
  };

  const handleSubFlowComplete = async (answers: Record<string, unknown>) => {
    const today = new Date().toISOString().split("T")[0];
    const subFlow = config.subFlows![currentSubFlowIndex];

    // Check if user selected "none" — skip saving
    const firstQ = subFlow.questions[0];
    const firstAnswer = answers[firstQ.id];
    if (firstAnswer === "none") {
      // Move to next sub-flow or go home
      if (currentSubFlowIndex < (config.subFlows?.length ?? 0) - 1) {
        setCurrentSubFlowIndex((i) => i + 1);
        setSubFlowEntries([]);
      } else {
        router.push("/");
      }
      return;
    }

    try {
      await fetch(subFlow.apiEndpoint, {
        method: subFlow.saveMethod === "post" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...answers, date: today }),
      });
      setSubFlowEntries((prev) => [...prev, answers]);
    } catch {
      // Silently fail
    }

    // Show "add another?" prompt
    setFlowPhase("addAnother");
  };

  const handleAddAnother = () => {
    setFlowPhase("subflow");
  };

  const handleDoneWithSubFlow = () => {
    if (currentSubFlowIndex < (config.subFlows?.length ?? 0) - 1) {
      setCurrentSubFlowIndex((i) => i + 1);
      setSubFlowEntries([]);
      setFlowPhase("subflow");
    } else {
      router.push("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div
          className="w-16 h-16 rounded-full animate-pulse"
          style={{ backgroundColor: config.colour }}
        />
      </div>
    );
  }

  // Main question flow
  if (flowPhase === "main") {
    return (
      <QuestionFlow
        questions={config.questions}
        colour={config.colour}
        initialAnswers={initialAnswers}
        customOptions={customOptions}
        onComplete={handleMainComplete}
        onAddCustomOption={handleAddCustomOption}
      />
    );
  }

  // Sub-flow (tea, alcohol, extra exercise)
  if (flowPhase === "subflow" && config.subFlows) {
    const subFlow = config.subFlows[currentSubFlowIndex];
    return (
      <QuestionFlow
        key={`subflow-${currentSubFlowIndex}-${subFlowEntries.length}`}
        questions={subFlow.questions}
        colour={config.colour}
        customOptions={customOptions}
        onComplete={handleSubFlowComplete}
        onAddCustomOption={handleAddCustomOption}
      />
    );
  }

  // "Add another?" prompt
  if (flowPhase === "addAnother" && config.subFlows) {
    const subFlow = config.subFlows[currentSubFlowIndex];
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6">
        <div
          className="w-48 h-48 rounded-full flex items-center justify-center"
          style={{ backgroundColor: config.colour }}
        >
          <span className="text-white text-lg font-medium text-center px-4">
            {subFlow.addAnotherLabel}
          </span>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleAddAnother}
            className="px-6 py-2 rounded-full text-sm font-medium text-white"
            style={{ backgroundColor: config.colour }}
          >
            Yes
          </button>
          <button
            onClick={handleDoneWithSubFlow}
            className="px-6 py-2 rounded-full text-sm font-medium border"
            style={{ color: config.colour, borderColor: config.colour }}
          >
            No, done
          </button>
        </div>
      </div>
    );
  }

  return null;
}
