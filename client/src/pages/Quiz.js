import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SocketContext, UserContext } from '../App';
import apiUrl from "../api-config";

const Quiz = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [timer, setTimer] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(null);
    const { user } = useContext(UserContext);
    const { quiz_id } = useParams();

    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };

    // DUMMY DATA
    const question1 = {
        question_number: 1,
        type: "short",
        question: "What is nodeJS used for?",
        answer: "to create server-side web applications",
        time: 30,
        points: 100
    };
    const question2 = {
        question_number: 2,
        type: "multiple",
        question: " 2+2 = ?",
        option1: "1",
        option2: "2",
        option3: "3",
        option4: "4",
        answer: "4",
        time: 30,
        points: 100
    };
    const question = {
        question_number: 3,
        type: "tf",
        question: "2+2=4",
        optionTrue: "true",
        optionFalse: "false",
        answer: "true",
        time: 10,
        points: 10
    };
    // const creator = true;
    const creator = false;

    const box = {
        width: "300px",
        border: "1px solid black",
        padding: "50px",
        margin: "auto",
    };

    useEffect(() => {
        // GET QUESTION HERE
        setTimeRemaining(question.time);
    }, [user]);

    useEffect(() => {
        if (timeRemaining === 0) {
          // Timer has reached 0, perform action (e.g., submit quiz)
          handleTimerFinish();
        }
    }, [timeRemaining]);

    useEffect(() => {
        if (timeRemaining !== null) {
          setTimer(setInterval(() => {
            setTimeRemaining(prevTime => prevTime - 1);
          }, 1000));
        }
    
        return () => {
          clearInterval(timer);
        };
    }, [timeRemaining]);

    const handleTimerFinish = () => {
        // Perform action when timer finishes (e.g., submit quiz)
        clearInterval(timer);
        // ...
    };

    return (
        <div className='app'>
            <h1 className="d-flex justify-content-center">Question #{question.question_number}</h1>
            <div className="row d-flex justify-content-center align-items-center">
                <div className="col-6 bg-light">
                    <div>
                    <div className="progress">
                        <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: `${(timeRemaining / question.time) * 100}%` }}
                            aria-valuenow={timeRemaining}
                            aria-valuemin="0"
                            aria-valuemax={question.time}
                        ></div>
                    </div>
                        <h3 className="row d-flex justify-content-center">{question.question}</h3>
                        {question.type === "multiple" && (
                            <>
                                <div className=" mt-auto ">
                                    <div className="row ">
                                        <p className="col d-flex justify-content-center border border-dark"
                                            onClick={() => handleOptionClick(question.option1)}
                                            style={{ backgroundColor: selectedOption === question.option1 ? 'yellow' : 'white' }}>
                                            {question.option1}
                                        </p>
                                        <p className="col d-flex justify-content-center border border-dark"
                                            onClick={() => handleOptionClick(question.option2)}
                                            style={{ backgroundColor: selectedOption === question.option2 ? 'yellow' : 'white' }}>
                                            {question.option2}
                                        </p>
                                    </div>
                                    <div className="row ">
                                        <p className="col d-flex justify-content-center border border-dark "
                                            onClick={() => handleOptionClick(question.option3)}
                                            style={{ backgroundColor: selectedOption === question.option3 ? 'yellow' : 'white' }}>
                                            {question.option3}
                                        </p>
                                        <p className="col d-flex justify-content-center border border-dark"
                                            onClick={() => handleOptionClick(question.option4)}
                                            style={{ backgroundColor: selectedOption === question.option4 ? 'yellow' : 'white' }}>
                                            {question.option4}
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                        {question.type === "short" && (
                            <>
                                <div className="row py-1">
                                    <textarea 
                                        id='answer'
                                        name='answer'
                                        className='col'
                                        style={box}
                                        required
                                    />
                                </div>
                            </>
                        )}
                        {question.type === "tf" && (
                            <>
                                <div className=" mt-auto ">
                                    <div className="row ">
                                        <p className="col d-flex justify-content-center border border-dark "
                                            onClick={() => handleOptionClick(question.optionTrue)}
                                            style={{ backgroundColor: selectedOption === question.optionTrue ? 'yellow' : 'white' }}>
                                            True
                                        </p>
                                        <p className="col d-flex justify-content-center border border-dark"
                                            onClick={() => handleOptionClick(question.optionFalse)}
                                            style={{ backgroundColor: selectedOption === question.optionFalse ? 'yellow' : 'white' }}>
                                            False
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                        {creator ? (
                            <>
                                <h4>Answer:</h4>
                                <p>{question.answer}</p>
                            </>
                        ) : (
                            <>
                                <button>Submit</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Quiz;