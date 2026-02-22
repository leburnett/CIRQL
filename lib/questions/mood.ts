import { CategoryConfig } from "./types";

export const moodConfig: CategoryConfig = {
  id: "mood",
  label: "Mood",
  colour: "#2D2D2D",
  saveMethod: "post",
  apiEndpoint: "/api/mood",
  questions: [
    { id: "positivity", label: "Positivity", type: "slider", min: 1, max: 10, step: 1 },
    { id: "melancholy", label: "Melancholy", type: "slider", min: 1, max: 10, step: 1 },
    { id: "tiredness", label: "Tiredness", type: "slider", min: 1, max: 10, step: 1 },
    { id: "focus", label: "Focus", type: "slider", min: 1, max: 10, step: 1 },
    { id: "socialWilling", label: "Willingness to Socialise", type: "slider", min: 1, max: 10, step: 1 },
    { id: "creativity", label: "Creativity", type: "slider", min: 1, max: 10, step: 1 },
    { id: "anxiety", label: "Anxiety", type: "slider", min: 1, max: 10, step: 1 },
    { id: "calm", label: "Calm", type: "slider", min: 1, max: 10, step: 1 },
    { id: "motivation", label: "Motivation", type: "slider", min: 1, max: 10, step: 1 },
    { id: "gratitude", label: "Gratitude", type: "slider", min: 1, max: 10, step: 1 },
  ],
};
