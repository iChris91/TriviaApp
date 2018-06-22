import { Quiz } from "./quiz";

export class QuizResults {
  public questions: Array<Quiz>;

  constructor(questions: Array<Quiz>) {
    this.questions = questions;
  }
}
