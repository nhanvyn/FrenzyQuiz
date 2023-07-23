import React, { useState, useEffect } from 'react';
import { ProgressBar } from 'react-bootstrap';

const Timer = ({ totalTime }) => {
    const [currentTime, setCurrentTime] = useState(totalTime);
    const interval = 1000; // 1 second

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime((prevTime) => prevTime - interval);
        }, interval);

        return () => clearInterval(timer);
    }, [interval]);

    useEffect(() => {
        setCurrentTime(totalTime);
    }, [totalTime]);

    useEffect(() => {
        const handleBeforeUnload = () => {
          setCurrentTime(totalTime);
        };
    
        window.addEventListener('beforeunload', handleBeforeUnload);
    
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [totalTime]);

    return (
        <ProgressBar now={(currentTime / totalTime) * 100} label={`${currentTime/1000}s`} /> 
    );
};

export default Timer;