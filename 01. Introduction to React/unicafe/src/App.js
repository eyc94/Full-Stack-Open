import React, { useState } from "react";

const Statistics = ({ good, neutral, bad }) => {
    const total = good + neutral + bad;
    if (good === 0 && neutral === 0 && bad === 0) {
        return (
            <div>
                <h2>Statistics</h2>
                No feedback given
            </div>
        );
    }
    return (
        <>
            <h2>Statistics</h2>
            <div>good {good}</div>
            <div>neutral {neutral}</div>
            <div>bad {bad}</div>
            <div>all {total}</div>
            <div>average {(good - bad) / total}</div>
            <div>positive {(good / total) * 100} %</div>
        </>
    );
};

const App = () => {
    const [good, setGood] = useState(0);
    const [neutral, setNeutral] = useState(0);
    const [bad, setBad] = useState(0);

    const handleGoodClick = () => {
        setGood(good + 1);
    };

    const handleNeutralClick = () => {
        setNeutral(neutral + 1);
    };

    const handleBadClick = () => {
        setBad(bad + 1);
    };

    return (
        <div>
            <h2>Give Feedback</h2>
            <button onClick={handleGoodClick}>good</button>
            <button onClick={handleNeutralClick}>neutral</button>
            <button onClick={handleBadClick}>bad</button>
            <Statistics good={good} neutral={neutral} bad={bad} />
        </div>
    );
};

export default App;
