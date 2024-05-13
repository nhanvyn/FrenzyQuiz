# FrenzyQuiz

FrenzyQuiz is an real-time interactive quiz platform that enables users to create, manage, and engage with a variety of quiz formats including multiple-choice, true/false, and short-answer questions. It provides real-time feedback and a final leaderboard, enhancing the interactive experience for both hosts and players.

## Features

### For All Users
- **Registration and Login**: Secure sign-up and login functionality, with token-based authentication across devices.
- **Quiz Management**: Users can create, update, and manage quizzes. Hosts can control quiz flow, including starting the quiz and moving to the next question.
- **Room Management**: Hosts can open a quiz room by generating a QR code. Players can join a room either by scanning the QR code or entering a quiz ID.
- **Persistent Sessions**: If a user exits a quiz room, their session is saved, allowing them to rejoin without re-entering the quiz ID.

### For Players
- **Real-time Interaction**: Players receive questions and submit answers in real-time. Feedback is provided after each question and at the end of the quiz.
- **Leaderboard**: Post-quiz, players can view their rankings and quiz results.
- **Quiz Review**: Players can access past quizzes to review their performance and answers.

### For Hosts
- **Question Control**: Hosts send questions to players and control the quiz pace by moving to subsequent questions.
- **Performance Insights**: After each question and at the end of the quiz, hosts can view a detailed leaderboard and performance metrics.

## Technology Stack

- **Frontend**: React JS
- **Real-time Communication**: Socket.io
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **Authentication**: Firebase Authentication
- **Hosting**: GCP Windows-based virtual machine

## Database Schema

- **Users**: `uid, role, email, fname, lname`
- **Quizzes**: `quizid, tname, created, uid`
- **Question and Answer Models** for multiple-choice, true/false, and short-answer questions.

## Running the Application

### Prerequisites

- Node.js installed
- PostgreSQL installed and running
- Firebase project set up

### Running the Client

```bash
cd client
npm install
npm start
