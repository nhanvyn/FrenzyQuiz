import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../App';
import apiUrl from "../api-config";
import Timer from './Timer';

const Quiz = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [question, setQuestion] = useState([]);
    const [timer, setTimer] = useState(null);
    const { user } = useContext(UserContext);
    const params = useParams();
    const navigate = useNavigate();

    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };

    useEffect(() => {
        const fetchQuestion = async () => {
            const response = await fetch(`${apiUrl}/quiz/${params.id}/question/${params.num}`);
            const data = await response.json();
            console.log("quizdata = ", data);
            setQuestion(data);
            setTimer(data.sec * 1000); // convert s -> ms
        };

        if (user && params) {
            fetchQuestion();
        }
    }, [user, params]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        var target = event.target;
        var input;
        if (question.type === 'tf') {
            // input = { submitted: selectedOption, correct: selectedOption === question.answer ? true : false };
        } else if (question.type === 'multiple') {
            // input = { submitted: selectedOption, correct: selectedOption === question.answer ? true : false };
        } else if (question.type === 'short') {
            // input = { submitted: selectedOption, correct: selectedOption === question.answer ? true : false };
        }
        var data = JSON.stringify(input);

        try {
            await fetch(`${apiUrl}/quiz/${params.id}/question/${params.num}/submitAnswer`, {
                method: "POST",
                headers: {
                  "Content-type": "application/json; charset=UTF-8",
                },
                body: data,
            });

            const response = await fetch(`${apiUrl}/quiz/${params.id}/question/${params.num}/submitAnswer`);
            const data = await response.json();
            console.log("quizdata = ", data);
        } catch (err) {
            console.error(err);
            console.log("Error Submitting question answer");
        }
        // navigate('/Quiz/65/Question/1');
    }

    // DUMMY DATA
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
            <h1 className="d-flex justify-content-center">Question #{question.qnum}</h1>
            <form onSubmit={handleSubmit}>
                <div className="row d-flex justify-content-center align-items-center">
                    <div className="col-6 bg-light">
                        <div>
                            <Timer totalTime={timer} />
                            <h3 className="row d-flex justify-content-center">{question.question}</h3>
                            {question.type === "multiple" && (
                                <>
                                    <div className=" mt-auto ">
                                        <div className="row ">
                                            <p className={`col d-flex justify-content-center border border-dark 
                                                            ${creator && question.option1 === question.answer ? 'bg-success' : ''}`}
                                                onClick={creator ? null : () => handleOptionClick(question.option1)}
                                                style={{ backgroundColor: selectedOption === question.option1 ? 'yellow' : 'white' }}>
                                                {question.option1}
                                            </p>
                                            <p className={`col d-flex justify-content-center border border-dark 
                                                            ${creator && question.option2 === question.answer ? 'bg-success' : ''}`}
                                                onClick={creator ? null : () => handleOptionClick(question.option2)}
                                                style={{ backgroundColor: selectedOption === question.option2 ? 'yellow' : 'white' }}>
                                                {question.option2}
                                            </p>
                                        </div>
                                        <div className="row ">
                                            <p className={`col d-flex justify-content-center border border-dark 
                                                            ${creator && question.option3 === question.answer ? 'bg-success' : ''}`}
                                                onClick={creator ? null : () => handleOptionClick(question.option3)}
                                                style={{ backgroundColor: selectedOption === question.option3 ? 'yellow' : 'white' }}>
                                                {question.option3}
                                            </p>
                                            <p className={`col d-flex justify-content-center border border-dark 
                                                            ${creator && question.option4 === question.answer ? 'bg-success' : ''}`}
                                                onClick={creator ? null : () => handleOptionClick(question.option4)}
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
                                            <p className={`col d-flex justify-content-center border border-dark 
                                                            ${creator && question.answer === "true" ? 'bg-success' : ''}`}
                                                onClick={creator ? null : () => handleOptionClick("True")}
                                                style={{ backgroundColor: selectedOption === "true" ? 'yellow' : 'white' }}>
                                                true
                                            </p>
                                            <p className={`col d-flex justify-content-center border border-dark 
                                                            ${creator && question.answer === "false" ? 'bg-success' : ''}`}
                                                onClick={creator ? null : () => handleOptionClick("False")}
                                                style={{ backgroundColor: selectedOption === "false" ? 'yellow' : 'white' }}>
                                                false
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
                                    <button type="submit" className="btn btn-primary btn-sm mt-2 ml-2">Submit</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Quiz;