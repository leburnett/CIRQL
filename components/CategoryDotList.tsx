"use client";

import { CategoryDot } from "./CategoryDot";
import { categoryList } from "@/lib/questions";

export function CategoryDotList() {
  return (
    <div className="flex flex-col items-center gap-8 py-12 px-4 md:grid md:grid-cols-2 md:gap-12 md:max-w-3xl md:mx-auto md:px-10 lg:grid-cols-3 lg:max-w-5xl">
      {categoryList.map((category) => (
        <div key={category.id} className="flex justify-center">
          <CategoryDot
            id={category.id}
            label={category.label}
            colour={category.colour}
          />
        </div>
      ))}
    </div>
  );
}
