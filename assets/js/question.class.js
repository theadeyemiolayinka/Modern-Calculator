class Question {
  constructor(question, answer, index = 0) {
    this.index = index;
    this.question = question;
    this.answer = answer;
  }

  toJson() {
    return JSON.stringify(this);
  }

  static fromJson(json, index) {
    const obj = JSON.parse(json);
    return new Question(obj.question, obj.answer, index);
  }
}
