import { moodConfig } from "./mood";
import { dietConfig } from "./diet";
import { exerciseConfig } from "./exercise";
import { sleepConfig } from "./sleep";
import { energyConfig } from "./energy";
import { cycleConfig } from "./cycle";
import { CategoryConfig } from "./types";

export const categories: Record<string, CategoryConfig> = {
  mood: moodConfig,
  diet: dietConfig,
  exercise: exerciseConfig,
  sleep: sleepConfig,
  energy: energyConfig,
  cycle: cycleConfig,
};

export const categoryList = Object.values(categories);

export type { QuestionConfig, CategoryConfig, SubFlowConfig } from "./types";
