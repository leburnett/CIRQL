"use client";

import { motion } from "motion/react";

type ProgressBarProps = {
  total: number;
  current: number;
  answered: Set<number>;
  colour: string;
};

export function ProgressBar({ total, current, answered, colour }: ProgressBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 pb-8 pt-4 bg-white/80 backdrop-blur-sm">
      <div className="flex items-center justify-center px-8 max-w-md mx-auto">
        <div className="relative flex items-center w-full">
          {/* Background line */}
          <div className="absolute h-0.5 w-full bg-gray-200" />

          {/* Coloured line segments */}
          {Array.from({ length: total - 1 }, (_, i) => {
            const segmentFilled = answered.has(i) && answered.has(i + 1);
            return (
              <div
                key={`line-${i}`}
                className="absolute h-0.5 transition-colors duration-300"
                style={{
                  left: `${(i / (total - 1)) * 100}%`,
                  width: `${(1 / (total - 1)) * 100}%`,
                  backgroundColor: segmentFilled ? colour : "#E0E0E0",
                }}
              />
            );
          })}

          {/* Dot indicators */}
          {Array.from({ length: total }, (_, i) => {
            const isAnswered = answered.has(i);
            const isCurrent = i === current;

            return (
              <div
                key={`dot-${i}`}
                className="absolute flex items-center justify-center"
                style={{
                  left: `${(i / (total - 1)) * 100}%`,
                  transform: "translateX(-50%)",
                }}
              >
                {isCurrent && (
                  <motion.div
                    className="absolute w-5 h-5 rounded-full"
                    style={{ backgroundColor: colour, opacity: 0.2 }}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                )}
                <motion.div
                  className="w-3 h-3 rounded-full border-2 transition-colors duration-200"
                  style={{
                    backgroundColor: isAnswered ? colour : "white",
                    borderColor: isAnswered || isCurrent ? colour : "#E0E0E0",
                  }}
                  animate={isAnswered ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.2 }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
