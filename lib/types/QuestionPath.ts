type QuestionPath =
  | MultiselectQuestionPath
  | AnswerQuestionPath
  | AnswerWithActionQuestionPath
  | AnswerActionPath;

interface AnswerQuestionPath {
  label: string;
  type: "answer";
  text: string;
  emoji: string;
}

interface AnswerWithActionQuestionPath {
  label: string;
  type: "answerWithAction";
  onPress(): void;
  emoji: string;
  text: string;
  actionLabel: string;
}

interface AnswerActionPath {
  label: string;
  type: "answerAction";
  onPress(): void;

  emoji: string;
}

interface MultiselectQuestionPath {
  label: string;
  title: string;
  type: "multiselect";
  options: QuestionPath[];
  emoji: string;
}
export default QuestionPath;
export type {
  AnswerQuestionPath,
  AnswerWithActionQuestionPath,
  AnswerActionPath,
  MultiselectQuestionPath,
};
