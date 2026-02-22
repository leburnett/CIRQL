import { CategoryConfig } from "./types";

export const exerciseConfig: CategoryConfig = {
  id: "exercise",
  label: "Exercise",
  colour: "#C2555A",
  saveMethod: "post",
  apiEndpoint: "/api/exercise",
  questions: [
    {
      id: "type",
      label: "Exercise",
      type: "dropdown",
      options: ["running", "cycling", "yoga", "strength"],
      customOptionsCategory: "exercise",
    },
    {
      id: "durationMins",
      label: "Duration",
      type: "slider",
      min: 0,
      max: 180,
      step: 5,
      defaultValue: 30,
      unit: "mins",
    },
  ],
  subFlows: [
    {
      id: "exercise-another",
      label: "Exercise",
      apiEndpoint: "/api/exercise",
      saveMethod: "post",
      addAnotherLabel: "Add another exercise?",
      questions: [
        {
          id: "type",
          label: "Exercise",
          type: "dropdown",
          options: ["running", "cycling", "yoga", "strength"],
          customOptionsCategory: "exercise",
        },
        {
          id: "durationMins",
          label: "Duration",
          type: "slider",
          min: 0,
          max: 180,
          step: 5,
          defaultValue: 30,
          unit: "mins",
        },
      ],
    },
  ],
};
