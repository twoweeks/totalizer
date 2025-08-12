import { InteractiveFormField } from "./constants";

export type InteractiveFormValues = {
  [InteractiveFormField.countThemselvesVotes]: boolean;
  [InteractiveFormField.hiddenJudges]: number[];
  [InteractiveFormField.hiddenAuthors]: number[];
};
