import React, { useState } from 'react';

const TestScreen = ({ totalQuestions }) => {
  // Possible statuses for each question
  const STATUS = {
    NOT_VISITED: 'Not Visited',
    NOT_ANSWERED: 'Not Answered',
    ANSWERED: 'Answered',
    MARKED_REVIEW: 'Marked as Review',
    ANSWERED_MARKED_REVIEW: 'Answered and Marked as Review',
  };

  // Initialize status for each question
  const [questionStatus, setQuestionStatus] = useState(
    Array(totalQuestions).fill(STATUS.NOT_VISITED)
  );
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // Update status counts
  const statusCounts = {
    notVisited: questionStatus.filter((status) => status === STATUS.NOT_VISITED).length,
    notAnswered: questionStatus.filter((status) => status === STATUS.NOT_ANSWERED).length,
    answered: questionStatus.filter((status) => status === STATUS.ANSWERED).length,
    markedReview: questionStatus.filter((status) => status === STATUS.MARKED_REVIEW).length,
    answeredMarkedReview: questionStatus.filter((status) => status === STATUS.ANSWERED_MARKED_REVIEW).length,
  };

  // Handle marking the current question as answered
  const handleAnswer = () => {
    const updatedStatus = [...questionStatus];
    updatedStatus[currentQuestion] =
      updatedStatus[currentQuestion] === STATUS.MARKED_REVIEW ||
      updatedStatus[currentQuestion] === STATUS.ANSWERED_MARKED_REVIEW
        ? STATUS.ANSWERED_MARKED_REVIEW
        : STATUS.ANSWERED;
    setQuestionStatus(updatedStatus);
  };

  // Handle marking the current question as review
  const handleMarkAsReview = () => {
    const updatedStatus = [...questionStatus];
    if (updatedStatus[currentQuestion] === STATUS.ANSWERED) {
      updatedStatus[currentQuestion] = STATUS.ANSWERED_MARKED_REVIEW;
    } else {
      updatedStatus[currentQuestion] = STATUS.MARKED_REVIEW;
    }
    setQuestionStatus(updatedStatus);
  };

  // Handle clearing the response
  const handleClearResponse = () => {
    const updatedStatus = [...questionStatus];
    updatedStatus[currentQuestion] = STATUS.NOT_ANSWERED;
    setQuestionStatus(updatedStatus);
  };

  // Move to the next question
  const handleNextQuestion = () => {
    setCurrentQuestion((prev) => (prev + 1) % totalQuestions);
  };

  return (
    <div>
      <h1>Online Test Screen</h1>

      <div>
        <h2>Current Question: {currentQuestion + 1}</h2>
        <p>Status: {questionStatus[currentQuestion]}</p>
      </div>

      <div>
        <button onClick={handleAnswer}>Answer</button>
        <button onClick={handleMarkAsReview}>Mark as Review</button>
        <button onClick={handleClearResponse}>Clear Response</button>
        <button onClick={handleNextQuestion}>Next Question</button>
      </div>

      <div>
        <h3>Status Counts:</h3>
        <ul>
          <li>Not Visited: {statusCounts.notVisited}</li>
          <li>Not Answered: {statusCounts.notAnswered}</li>
          <li>Answered: {statusCounts.answered}</li>
          <li>Marked as Review: {statusCounts.markedReview}</li>
          <li>Answered and Marked as Review: {statusCounts.answeredMarkedReview}</li>
        </ul>
      </div>
    </div>
  );
};

export default TestScreen;
