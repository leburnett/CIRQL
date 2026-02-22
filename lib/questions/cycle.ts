import { CategoryConfig } from "./types";

export const cycleConfig: CategoryConfig = {
  id: "cycle",
  label: "Cycle",
  colour: "#9B5F8A",
  saveMethod: "put",
  apiEndpoint: "/api/cycle",
  questions: [
    { id: "onPeriod", label: "On Period?", type: "toggle" },
    {
      id: "flow",
      label: "Flow",
      type: "flowIndicator",
      options: ["light", "medium", "heavy"],
      dependsOn: { field: "onPeriod", equals: "true" },
    },
    {
      id: "cramps",
      label: "Cramps",
      type: "slider",
      min: 1,
      max: 10,
      step: 1,
      dependsOn: { field: "onPeriod", equals: "true" },
    },
    {
      id: "notes",
      label: "Notes",
      type: "text",
      dependsOn: { field: "onPeriod", equals: "true" },
    },
  ],
};
