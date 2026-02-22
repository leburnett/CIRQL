import { CategoryConfig } from "./types";

export const dietConfig: CategoryConfig = {
  id: "diet",
  label: "Diet",
  colour: "#4A7C59",
  saveMethod: "put",
  apiEndpoint: "/api/diet",
  questions: [
    {
      id: "breakfast",
      label: "Breakfast",
      type: "multiselect",
      options: ["oats", "bread", "fruit", "juice", "eggs", "other"],
      customOptionsCategory: "breakfast",
    },
    {
      id: "lunch",
      label: "Lunch",
      type: "dropdown",
      options: [
        "salad", "sandwich", "soup", "pasta", "rice dish",
        "meat & veg", "takeaway", "leftovers", "skipped", "other",
      ],
      customOptionsCategory: "lunch",
    },
    {
      id: "dinner",
      label: "Dinner",
      type: "dropdown",
      options: [
        "salad", "sandwich", "soup", "pasta", "rice dish",
        "meat & veg", "takeaway", "leftovers", "skipped", "other",
      ],
      customOptionsCategory: "dinner",
    },
    {
      id: "snacks",
      label: "Snacks",
      type: "dropdown",
      options: [
        "fruit", "crisps", "chocolate", "biscuits", "nuts",
        "yoghurt", "other", "none",
      ],
      customOptionsCategory: "snacks",
    },
    { id: "coffeeCount", label: "Coffee", type: "counter", min: 0, max: 20 },
    { id: "waterCount", label: "Water", type: "counter", min: 0, max: 20 },
  ],
  subFlows: [
    {
      id: "tea",
      label: "Tea",
      apiEndpoint: "/api/tea",
      saveMethod: "put",
      addAnotherLabel: "Add another tea?",
      questions: [
        {
          id: "teaType",
          label: "Tea",
          type: "dropdown",
          options: ["black", "green", "peppermint", "chamomile", "lemon & ginger", "none"],
          customOptionsCategory: "tea",
        },
        {
          id: "teaCups",
          label: "How many cups?",
          type: "slider",
          min: 1,
          max: 10,
          step: 1,
          defaultValue: 1,
          unit: "cups",
          dependsOn: { field: "teaType", notEqual: "none" },
        },
      ],
    },
    {
      id: "alcohol",
      label: "Alcohol",
      apiEndpoint: "/api/alcohol",
      saveMethod: "put",
      addAnotherLabel: "Add another drink?",
      questions: [
        {
          id: "alcoholType",
          label: "Alcohol",
          type: "dropdown",
          options: ["beer", "wine", "spirits", "none"],
          customOptionsCategory: "alcohol",
        },
        {
          id: "alcoholUnits",
          label: "How many?",
          type: "slider",
          min: 1,
          max: 15,
          step: 1,
          defaultValue: 1,
          unit: "units",
          dependsOn: { field: "alcoholType", notEqual: "none" },
        },
      ],
    },
  ],
};
