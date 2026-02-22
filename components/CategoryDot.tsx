"use client";

import { motion } from "motion/react";
import Link from "next/link";

type CategoryDotProps = {
  id: string;
  label: string;
  colour: string;
};

export function CategoryDot({ id, label, colour }: CategoryDotProps) {
  return (
    <Link href={`/track/${id}`}>
      <motion.div
        className="w-[75vw] max-w-[320px] aspect-square rounded-full
                   md:w-full flex items-center justify-center cursor-pointer select-none"
        style={{ backgroundColor: colour }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <span className="text-white text-xl font-medium tracking-wide">
          {label}
        </span>
      </motion.div>
    </Link>
  );
}
