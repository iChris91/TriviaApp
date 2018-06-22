import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {QuizProvider} from "../providers/quiz/quiz-provider";
import {Quiz} from "../models/quiz";
import {LocalstorageProvider} from "../providers/localstorage/localstorage";
import {HomePage} from "../home/home";


@IonicPage()
@Component({
  selector: 'page-quiz',
  templateUrl: 'quiz.html',
})
export class QuizPage {
  public questions: Array<Quiz> = [];
  public timer: number = 30;
  public quiz: Quiz;
  public points: number = 0;
  public result: string;
  public gameIsOver: boolean = false;
  public questionIsOver: boolean = false;
  public interval;
  public base64Image;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public quizProvider: QuizProvider,
    public localstorageProvider: LocalstorageProvider) {
  }

  ionViewDidLoad() {
    let nbQuestions = this.navParams.get("nbQuestions");
    let difficulty = this.navParams.get("difficulty");
    this.quizProvider.getQuiz(nbQuestions, difficulty)
      .then((result) => {
        this.questions = result.questions;
        console.log(this.questions);
        this.changeQuestion();
      })
      .catch((error) => {
        this.result = "Impossible de récupérer la liste des questions, veuillez réésayer plus tard.";
        this.gameIsOver = true;
      });
  }

  public changeQuestion() {
    this.timer = 30;
    this.result = "";
    this.questionIsOver = false;
    if (this.questions.length > 0) {
      this.quiz = this.questions[0];
      this.mixAnswers();
      this.questions.shift();
      this.interval = setInterval(() => {
        if (this.timer > 0) {
          this.timer--;
        }
        else {
          this.result = "Temps dépassé !";
          this.questionIsOver = true;
          this.quiz.incorrect_answers = [];
          clearInterval(this.interval);
        }
      }, 1000);
    }
    else
      this.gameOver();
  }

  public mixAnswers() {
    this.quiz.incorrect_answers.push(this.quiz.correct_answer);
    this.quiz.incorrect_answers.sort();
  }

  public checkAnswer(answer) {
    clearInterval(this.interval);
    let difficulty = this.navParams.get("difficulty");

    this.questionIsOver = true;
    //console.log(difficulty)
    if (answer === this.quiz.correct_answer) {
      if (difficulty === "easy") {
        this.points = this.points + 5;
        console.log(this.points)
      }
      if (difficulty === "medium"){
        this.points = this.points + 10;
        console.log(this.points)
      }
      if (difficulty === "hard") {
        this.points = this.points + 20;
        console.log(this.points)
      }
      this.result = "Good !";

    }
    else {
      if (difficulty === "easy") {
        this.points = this.points - 5;
        console.log(this.points)
      }
      if (difficulty === "medium") {
        this.points = this.points - 10;
        console.log(this.points)
      }
      if (difficulty === "hard") {
        this.points = this.points - 20;
        console.log(this.points)
      }
      this.result = "Wrong !";
    }
  }

  public gameOver() {
    this.result = "Game over ! Your score : " + this.points + " point(s) !";
    this.gameIsOver = true;
    this.setScore();
    delete this.quiz;
  }

  public setScore() {
    this.localstorageProvider.getCounter().then((result: number) => {
      this.localstorageProvider.setScore(result + 1, this.points);
      this.localstorageProvider.setCounter(result + 1);

    });
  }

  public shareScore() {
    let user = this.navParams.get("name");
    this.quizProvider.shareScore(user).then(()=>{
      this.navCtrl.setRoot(HomePage, {score: this.points});
    });
  }


  public goBackToMainMenu() {
    this.navCtrl.popToRoot();
  }
}
