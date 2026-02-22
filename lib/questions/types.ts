export type QuestionConfig = {
  id: string;
  label: string;
  type:
    | "slider"
    | "dropdown"
    | "multiselect"
    | "counter"
    | "toggle"
    | "flowIndicator"
    | "text";
  options?: string[];
  customOptionsCategory?: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number | string | boolean;
  dependsOn?: { field: string; notEqual?: string; equals?: string };
  unit?: string;
};

export type CategoryConfig = {
  id: string;
  label: string;
  colour: string;
  saveMethod: "post" | "put";
  apiEndpoint: string;
  questions: QuestionConfig[];
  subFlows?: SubFlowConfig[];
};

export type SubFlowConfig = {
  id: string;
  label: string;
  apiEndpoint: string;
  saveMethod: "post" | "put";
  questions: QuestionConfig[];
  addAnotherLabel: string;
};
