import { mcqQuestionModel, numericalQuestionModel, passageQuestionModel } from "@/models/QuestionModel";

export const getQuestionModel = (type) => {
    switch (type) {
     case "passage":
        return { questionType: "passage", ...passageQuestionModel };
      case "mcq":
        return { questionType: "mcq", ...mcqQuestionModel };

      case "numerical":
        return { questionType: "numerical", ...numericalQuestionModel };

      default:
        return {};
    }
  };
  