import React from 'react';

const HomePage = () => {
  const quizzes = [
    {
      id: "123",
      name: "quiz1"
    },
    {
      id: "456",
      name: "quiz2"
    }
  ]
  return (
    <div className='app'>
      <div className="container w-75">
        <h3>Current quizzes (just ui for now)</h3>
        <div className="list-group">
          {
            quizzes.map((quiz, index) => (
              <div key={index} className="list-group-item list-group-item-action flex-column align-items-start">
                <div className="d-flex w-100 justify-content-between">
                  <h5 className="mb-1">{quiz.name + " - id: " + quiz.id} </h5>
                  <div>
                    <button type="button" name="edit" className="btn btn-success btn-sm mt-2">Rejoin</button>
                    <button type="button" name="start" className="btn btn-danger btn-sm mt-2 ml-2">Leave</button>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default HomePage;