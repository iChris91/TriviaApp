import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {QuizPage} from "../quiz/quiz";
import {LocalstorageProvider} from "../providers/localstorage/localstorage";
import { QuizProvider } from "../providers/quiz/quiz-provider";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public name: string;
  public nbQuestions: number;
  public difficulty: string;
  public error: string;
  public scores = [];
  public results;

  constructor(public navCtrl: NavController, public localstorageProvider: LocalstorageProvider, public quizprovider: QuizProvider) {
    this.getLeaderBoard();
  }

  public checkValues() {

    if (this.nbQuestions <= 10 && this.nbQuestions >= 5) {
      if (this.difficulty === "easy" || this.difficulty === "medium" || this.difficulty === "hard") {
        this.error = "";
        this.startGame();
      }
      else
        this.error = "Paramètres invalides."
    }
    else
      this.error = "Paramètres invalides."
  }

  public startGame() {
    this.navCtrl.push(QuizPage, {
      name: this.name,
      nbQuestions: this.nbQuestions,
      difficulty: this.difficulty
    });
  }

  public displayScores() {
    this.localstorageProvider.getCounter().then((result: number) => {
      this.scores = [];
      this.localstorageProvider.getScore(result)
        .then((result) => {
          if (result) {
            this.scores.push(result)
            console.log(result)
          }})
        .catch((error) =>
          console.log(error)
        );
      let i = 0;
      while (i < 10) {
        i++;
        this.localstorageProvider.getScore(result-i)
          .then((result) => {
              if (result) {
                this.scores.push(result)
              }})
          .catch((error) =>
            console.log(error)
          );
      }
    });

  }

  getLeaderBoard(){
    this.quizprovider.getLeaderBoard().then(data=>{
      this.results = data;
      console.log(this.results)
    });
  }
}
