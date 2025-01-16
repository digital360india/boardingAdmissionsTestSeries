const passageQuestionModel = {
  questionId: "",
  heading: "",
  sno: "",
  question: "",
  questionType: "passage",
  passageContent: "",
  answers: {
    a: "",
    b: "",
    c: "",
    d: "",
  },
  answer: "",
  totalmarks: "",
  solutions:[],
  subject:""
};
const numericalQuestionModel = {
  questionId: "",
  heading: "",
  sno: "",
  questionType: "numerical",
  question: "",
  imageUrl:"",
  answerinput: "",
  correctAnswer: "",
  totalmarks: "",
  neg_marks:0,
  createdBy: "",
  createdAt:"",
  updatedBy: "",
  updatedAt: "",
  solutions:[],
  subject:""

};
const mcqQuestionModel = {
  question: "",
  questionType: "mcq",
  heading: "",
  answers: {
    a: "",
    b: "",
    c: "",
    d: "",
  },
  correctAnswer: "",
  imageUrl:"",
  totalmarks: "",
  createdBy: "",
  createdAt:"",
  updatedBy: "",
  updatedAt: "",
  neg_marks: "",
  sno: "",
  solutions:[],
  subject:""

};

export {
  passageQuestionModel,
  mcqQuestionModel,
  
  numericalQuestionModel,
  
};
