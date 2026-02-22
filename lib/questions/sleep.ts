import { CategoryConfig } from "./types";

export const sleepConfig: CategoryConfig = {
  id: "sleep",
  label: "Sleep",
  colour: "#5B6AAF",
  saveMethod: "put",
  apiEndpoint: "/api/sleep",
  questions: [
    { id: "hours", label: "Hours of Sleep", type: "slider", min: 1, max: 12, step: 0.5, unit: "hrs" },
    { id: "restless", label: "Restless?", type: "toggle" },
    { id: "sleepTalking", label: "Sleep Talking?", type: "toggle" },
    { id: "hot", label: "Hot?", type: "toggle" },
  ],
};
