import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SocketContext, UserContext, QuizContext } from '../App';
import apiUrl from "../api-config";



const Quiz = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [timer, setTimer] = useState(null);
    const [timeRemaining, setTimeRemaining] = useState(null);
    const [question, setQuestion] = useState([]);
    const { user } = useContext(UserContext);
    const params = useParams();
    const { id } = useParams();
    const socket = useContext(SocketContext)
    const {currentQuestion, setCurrentQuestion} = useContext(QuizContext)

    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };

    useEffect(() => {
        if (socket) {
            console.log("check currentQuestion in Quiz.js: ", currentQuestion)
            const handleNextQuestion = (data) => {
              console.log("next quesion arrived in QUiz.js:", data)
              // send player to main quiz 
              
            };
            socket.on("next_question", handleNextQuestion);
      
            return () => {
              socket.off('next_question', handleNextQuestion);
              console.log("Called")
            };
          }
    },[socket, id])

    useEffect(() => {
        // const fetchQuestion = async () => {
        //     const response = await fetch(`${apiUrl}/quiz/${params.id}/question/${params.num}`);
        //     const data = await response.json();
        //     console.log("quizdata = ", data);
        //     setQuestion(data);
        // };

        // if (user && params) {
        //     fetchQuestion();
        // }
        setQuestion(question3)
    }, [user, params]);


    // DUMMY DATA
    // const question1 = {
    //     question_number: 1,
    //     type: "short",
    //     question: "What is nodeJS used for?",
    //     answer: "to create server-side web applications",
    //     time: 30,
    //     points: 100
    // };
    // const question2 = {
    //     question_number: 2,
    //     type: "multiple",
    //     question: " 2+2 = ?",
    //     option1: "1",
    //     option2: "2",
    //     option3: "3",
    //     option4: "4",
    //     answer: "4",
    //     time: 30,
    //     points: 100
    // };
    // const question3 = {
    //     question_number: 3,
    //     type: "tf",
    //     question: "2+2=4",
    //     optionTrue: "true",
    //     optionFalse: "false",
    //     answer: "true",
    //     time: 10,
    //     points: 10
    // };
    let sortedQuestions = [
        {
            "id": 26,
            "sec": 10,
            "qnum": 0,
            "type": "multiple",
            "answer": "44",
            "points": 100,
            "options": [
                "212",
                "3",
                "44",
                "55"
            ],
            "question": "aopwi03941"
        },
        {
            "id": 15,
            "sec": 11,
            "qnum": 0,
            "type": "tf",
            "answer": "true",
            "points": 11,
            "question": "I like pop music"
        },
        {
            "id": 25,
            "sec": 10,
            "qnum": 2,
            "type": "short",
            "answer": "danchoi",
            "points": 10,
            "question": "who is danchoi"
        }
    ];
    
    let question1 = sortedQuestions[0];
    let question2 = sortedQuestions[1];
    let question3 = sortedQuestions[2];




    // const creator = true;
    const creator = false;

    const box = {
        width: "300px",
        border: "1px solid black",
        padding: "50px",
        margin: "auto",
    };
    return (
        <div className='app'>
            <h1 className="d-flex justify-content-center">Question #{currentQuestion.qnum + 1}</h1>
            <div className="row d-flex justify-content-center align-items-center">
                <div className="col-6 bg-light">
                    <div>
                        <h3 className="row d-flex justify-content-center">{currentQuestion.question}</h3>
                        {currentQuestion.type === "multiple" && (
                            <>
                                <div className=" mt-auto ">
                                    {currentQuestion.options.map((option, index) => (
                                        <div className="row" key={index}>
                                            <p className="col d-flex justify-content-center border border-dark"
                                                onClick={() => handleOptionClick(option)}
                                                style={{ backgroundColor: selectedOption === option ? 'yellow' : 'white' }}>
                                                {option}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                        {currentQuestion.type === "short" && (
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
                        {currentQuestion.type === "tf" && (
                            <>
                                <div className=" mt-auto ">
                                    <div className="row ">
                                        <p className="col d-flex justify-content-center border border-dark "
                                            onClick={() => handleOptionClick("True")}
                                            style={{ backgroundColor: selectedOption === "True" ? 'yellow' : 'white' }}>
                                            True
                                        </p>
                                        <p className="col d-flex justify-content-center border border-dark"
                                            onClick={() => handleOptionClick("False")}
                                            style={{ backgroundColor: selectedOption === "False" ? 'yellow' : 'white' }}>
                                            False
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                        {creator ? (
                            <>
                                <h4>Answer:</h4>
                                <p>{currentQuestion.answer}</p>
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
    
    // return (
    //     <div className='app'>
    //         <h1 className="d-flex justify-content-center">Question #{question.qnum}</h1>
    //         <div className="row d-flex justify-content-center align-items-center">
    //             <div className="col-6 bg-light">
    //                 <div>
    //                     {/* <div className="progress">
    //                         <div
    //                             className="progress-bar"
    //                             role="progressbar"
    //                             style={{ width: `${(timeRemaining / question.time) * 100}%` }}
    //                             aria-valuenow={timeRemaining}
    //                             aria-valuemin="0"
    //                             aria-valuemax={question.time}
    //                         ></div>
    //                     </div> */}
    //                     <h3 className="row d-flex justify-content-center">{question.question}</h3>
    //                     {question.type === "multiple" && (
    //                         <>
    //                             <div className=" mt-auto ">
    //                                 <div className="row ">
    //                                     <p className="col d-flex justify-content-center border border-dark"
    //                                         onClick={() => handleOptionClick(question.option1)}
    //                                         style={{ backgroundColor: selectedOption === question.option1 ? 'yellow' : 'white' }}>
    //                                         {question.option1}
    //                                     </p>
    //                                     <p className="col d-flex justify-content-center border border-dark"
    //                                         onClick={() => handleOptionClick(question.option2)}
    //                                         style={{ backgroundColor: selectedOption === question.option2 ? 'yellow' : 'white' }}>
    //                                         {question.option2}
    //                                     </p>
    //                                 </div>
    //                                 <div className="row ">
    //                                     <p className="col d-flex justify-content-center border border-dark "
    //                                         onClick={() => handleOptionClick(question.option3)}
    //                                         style={{ backgroundColor: selectedOption === question.option3 ? 'yellow' : 'white' }}>
    //                                         {question.option3}
    //                                     </p>
    //                                     <p className="col d-flex justify-content-center border border-dark"
    //                                         onClick={() => handleOptionClick(question.option4)}
    //                                         style={{ backgroundColor: selectedOption === question.option4 ? 'yellow' : 'white' }}>
    //                                         {question.option4}
    //                                     </p>
    //                                 </div>
    //                             </div>
    //                         </>
    //                     )}
    //                     {question.type === "short" && (
    //                         <>
    //                             <div className="row py-1">
    //                                 <textarea 
    //                                     id='answer'
    //                                     name='answer'
    //                                     className='col'
    //                                     style={box}
    //                                     required
    //                                 />
    //                             </div>
    //                         </>
    //                     )}
    //                     {question.type === "tf" && (
    //                         <>
    //                             <div className=" mt-auto ">
    //                                 <div className="row ">
    //                                     <p className="col d-flex justify-content-center border border-dark "
    //                                         onClick={() => handleOptionClick("True")}
    //                                         style={{ backgroundColor: selectedOption === "True" ? 'yellow' : 'white' }}>
    //                                         True
    //                                     </p>
    //                                     <p className="col d-flex justify-content-center border border-dark"
    //                                         onClick={() => handleOptionClick("False")}
    //                                         style={{ backgroundColor: selectedOption === "False" ? 'yellow' : 'white' }}>
    //                                         False
    //                                     </p>
    //                                 </div>
    //                             </div>
    //                         </>
    //                     )}
    //                     {creator ? (
    //                         <>
    //                             <h4>Answer:</h4>
    //                             <p>{question.answer}</p>
    //                         </>
    //                     ) : (
    //                         <>
    //                             <button>Submit</button>
    //                         </>
    //                     )}
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // );
};

export default Quiz;