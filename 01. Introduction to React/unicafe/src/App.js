import React, { useState } from "react";

const StatisticLine = ({ text, value }) => {
    if (text === "positive") {
        return (
            <tr>
                <td>{text}</td>
                <td>{value} %</td>
            </tr>
        );
    }

    return (
        <tr>
            <td>{text}</td>
            <td>{value}</td>
        </tr>
    );
};

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
            <table>
                <tbody>
                    <StatisticLine text="good" value={good} />
                    <StatisticLine text="neutral" value={neutral} />
                    <StatisticLine text="bad" value={bad} />
                    <StatisticLine text="all" value={total} />
                    <StatisticLine text="average" value={(good - bad) / total} />
                    <StatisticLine text="positive" value={(good / total) * 100} />
                </tbody>
            </table>
        </>
    );
};

const Button = ({ handleClick, text }) => {
    return (
        <button onClick={handleClick}>
            {text}
        </button>
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
            <Button handleClick={handleGoodClick} text="good" />
            <Button handleClick={handleNeutralClick} text="neutral" />
            <Button handleClick={handleBadClick} text="bad" />
            <Statistics good={good} neutral={neutral} bad={bad} />
        </div>
    );
};

export default App;
