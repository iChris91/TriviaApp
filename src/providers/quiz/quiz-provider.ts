import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { QuizResults } from "../../models/quizResults";


@Injectable()
export class QuizProvider {

  constructor(public http: HttpClient) {

  }

  public getQuiz(nbQuestions: number, difficulty: string):
    Promise<QuizResults> {
    return new Promise((resolve, reject) => {
      let params = new HttpParams();
      params = params.append("amount", nbQuestions.toString());
      params = params.append("difficulty", difficulty);
      this.http.get("https://opentdb.com/api.php?", {
        params: params
      }).toPromise()
        .then((response) => {
          if (response['results']) {
            resolve(new QuizResults(response['results']));
          } else {
            reject("Le serveur a renvoyé une réponse innatendue");
          }
        })
        .catch((error) => {
          reject(error);
        })
    });
  }

  public getLeaderBoard() {
    return new Promise(resolve => {
      this
        .http
        .get('https://leaderboard.lp1.eu/api/json')
        .subscribe(data => {
          resolve(data);
        });
    });
  }

  public shareScore(user) {
    return new Promise(resolve => {
      this
        .http
        .post('https://leaderboard.lp1.eu/api/score', user)
        .subscribe(data => {
          resolve(data);
        });
    });
  }
}
