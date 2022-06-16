import React, { useState } from "react";

const App = () => {
    // Save clicks of each button to its own state.
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

    const total = good + neutral + bad;

    return (
        <div>
            <h2>Give Feedback</h2>
            <button onClick={handleGoodClick}>good</button>
            <button onClick={handleNeutralClick}>neutral</button>
            <button onClick={handleBadClick}>bad</button>

            <h2>Statistics</h2>
            <div>good {good}</div>
            <div>neutral {neutral}</div>
            <div>bad {bad}</div>
            <div>all {good + neutral + bad}</div>
            <div>average {(good - bad) / total}</div>
            <div>positive {(good / total) * 100} %</div>
        </div>
    );
};

export default App;
