class Question {
  constructor(question, answer) {
    this.question = question;
    this.answer = answer;
  }

  toJson() {
    return JSON.stringify(this);
  }

  static fromJson(json) {
    const obj = JSON.parse(json);
    return new Question(obj.question, obj.answer);
  }
}
