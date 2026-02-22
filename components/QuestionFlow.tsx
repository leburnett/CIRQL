"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { QuestionCircle } from "./QuestionCircle";
import { ProgressBar } from "./ProgressBar";
import { SwipeHandler } from "./SwipeHandler";
import { Slider } from "./ui/Slider";
import { Dropdown } from "./ui/Dropdown";
import { MultiSelect } from "./ui/MultiSelect";
import { Counter } from "./ui/Counter";
import { Toggle } from "./ui/Toggle";
import { FlowIndicator } from "./ui/FlowIndicator";
import { TextInput } from "./ui/TextInput";
import { QuestionConfig } from "@/lib/questions";

type QuestionFlowProps = {
  questions: QuestionConfig[];
  colour: string;
  initialAnswers?: Record<string, unknown>;
  customOptions?: Record<string, string[]>;
  onComplete: (answers: Record<string, unknown>) => void;
  onAddCustomOption?: (category: string, value: string) => void;
};

export function QuestionFlow({
  questions,
  colour,
  initialAnswers = {},
  customOptions = {},
  onComplete,
  onAddCustomOption,
}: QuestionFlowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>(initialAnswers);
  const [answered, setAnswered] = useState<Set<number>>(() => {
    const initial = new Set<number>();
    questions.forEach((q, i) => {
      if (initialAnswers[q.id] !== undefined && initialAnswers[q.id] !== null) {
        initial.add(i);
      }
    });
    return initial;
  });
  const [direction, setDirection] = useState(0);
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Filter questions based on dependsOn conditions
  const visibleQuestions = questions.filter((q) => {
    if (!q.dependsOn) return true;
    const depValue = String(answers[q.dependsOn.field] ?? "");
    if (q.dependsOn.equals !== undefined) return depValue === q.dependsOn.equals;
    if (q.dependsOn.notEqual !== undefined) return depValue !== q.dependsOn.notEqual;
    return true;
  });

  const currentQuestion = visibleQuestions[currentIndex];
  const totalVisible = visibleQuestions.length;

  const clearAutoAdvance = useCallback(() => {
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearAutoAdvance();
  }, [clearAutoAdvance]);

  const goToNext = useCallback(() => {
    clearAutoAdvance();
    if (currentIndex >= totalVisible - 1) {
      onComplete(answers);
    } else {
      setDirection(1);
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, totalVisible, answers, onComplete, clearAutoAdvance]);

  const goToPrev = useCallback(() => {
    clearAutoAdvance();
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex, clearAutoAdvance]);

  const handleAnswer = useCallback(
    (questionId: string, value: unknown) => {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
      const qIdx = visibleQuestions.findIndex((q) => q.id === questionId);
      if (qIdx >= 0) {
        setAnswered((prev) => new Set(prev).add(qIdx));
      }

      // Auto-advance for most input types (not counter, multiselect, or text)
      const q = visibleQuestions.find((q) => q.id === questionId);
      if (q && q.type !== "counter" && q.type !== "multiselect" && q.type !== "text") {
        clearAutoAdvance();
        autoAdvanceTimer.current = setTimeout(goToNext, 500);
      }
    },
    [visibleQuestions, goToNext, clearAutoAdvance]
  );

  if (!currentQuestion) {
    onComplete(answers);
    return null;
  }

  // Merge custom options with defaults
  const getOptions = (q: QuestionConfig) => {
    const base = q.options ?? [];
    if (q.customOptionsCategory && customOptions[q.customOptionsCategory]) {
      return [...base, ...customOptions[q.customOptionsCategory]];
    }
    return base;
  };

  const renderInput = () => {
    const q = currentQuestion;
    const val = answers[q.id];

    switch (q.type) {
      case "slider":
        return (
          <Slider
            value={val as number | null ?? null}
            onChange={(v) => handleAnswer(q.id, v)}
            min={q.min ?? 1}
            max={q.max ?? 10}
            step={q.step ?? 1}
            unit={q.unit}
            colour={colour}
          />
        );
      case "counter":
        return (
          <Counter
            value={(val as number) ?? q.defaultValue ?? q.min ?? 0}
            onChange={(v) => handleAnswer(q.id, v)}
            min={q.min ?? 0}
            max={q.max ?? 20}
            colour={colour}
          />
        );
      case "toggle":
        return (
          <Toggle
            value={(val as boolean) ?? false}
            onChange={(v) => handleAnswer(q.id, v)}
            colour={colour}
          />
        );
      case "dropdown":
        return (
          <Dropdown
            value={(val as string) ?? null}
            onChange={(v) => handleAnswer(q.id, v)}
            options={getOptions(q)}
            customOptionsCategory={q.customOptionsCategory}
            onAddCustomOption={onAddCustomOption}
            colour={colour}
          />
        );
      case "multiselect":
        return (
          <MultiSelect
            value={(val as string[]) ?? []}
            onChange={(v) => handleAnswer(q.id, v)}
            options={getOptions(q)}
            customOptionsCategory={q.customOptionsCategory}
            onAddCustomOption={onAddCustomOption}
            colour={colour}
          />
        );
      case "flowIndicator":
        return (
          <FlowIndicator
            value={(val as string) ?? null}
            onChange={(v) => handleAnswer(q.id, v)}
            options={q.options ?? []}
            colour={colour}
          />
        );
      case "text":
        return (
          <TextInput
            value={(val as string) ?? ""}
            onChange={(v) => handleAnswer(q.id, v)}
            colour={colour}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SwipeHandler onSwipeLeft={goToNext} onSwipeRight={goToPrev}>
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentQuestion.id}
            custom={direction}
            initial={{ opacity: 0, y: direction >= 0 ? 20 : -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: direction >= 0 ? -20 : 20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col items-center"
          >
            <QuestionCircle colour={colour} label={currentQuestion.label}>
              {renderInput()}
            </QuestionCircle>
          </motion.div>
        </AnimatePresence>

        {/* Manual advance for counter/multiselect/text */}
        {(currentQuestion.type === "counter" ||
          currentQuestion.type === "multiselect" ||
          currentQuestion.type === "text") && (
          <button
            onClick={goToNext}
            className="mt-6 px-6 py-2 rounded-full text-sm font-medium transition-colors"
            style={{ color: colour, border: `1.5px solid ${colour}` }}
          >
            {currentIndex >= totalVisible - 1 ? "Done" : "Next"}
          </button>
        )}

        <ProgressBar
          total={totalVisible}
          current={currentIndex}
          answered={answered}
          colour={colour}
        />
      </div>
    </SwipeHandler>
  );
}
