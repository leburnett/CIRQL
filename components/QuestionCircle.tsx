"use client";

import { ReactNode } from "react";

type QuestionCircleProps = {
  colour: string;
  label: string;
  children: ReactNode;
};

export function QuestionCircle({ colour, label, children }: QuestionCircleProps) {
  return (
    <div
      className="w-[85vw] h-[85vw] max-w-[400px] max-h-[400px] rounded-full
                 flex flex-col items-center justify-center gap-4 p-8"
      style={{ backgroundColor: colour }}
    >
      <h2 className="text-white text-lg font-medium tracking-wide text-center">
        {label}
      </h2>
      <div className="flex flex-col items-center justify-center w-full">
        {children}
      </div>
    </div>
  );
}
