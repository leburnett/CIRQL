import { CategoryConfig } from "./types";

export const energyConfig: CategoryConfig = {
  id: "energy",
  label: "Energy",
  colour: "#D4943A",
  saveMethod: "put",
  apiEndpoint: "/api/energy",
  questions: [
    { id: "level", label: "Energy Level", type: "slider", min: 1, max: 10, step: 1 },
  ],
};
