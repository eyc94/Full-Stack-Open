import React from "react";

const Course = (props) => {
    return (
        <div>
            <Header course={props.course} />
            <Content course={props.course} />
            <Total course={props.course} />
        </div>
    );
};

const Header = (props) => {
    return (
        <h1>{props.course.name}</h1>
    );
};

const Content = (props) => {
    return (
        <div>
            {props.course.parts.map(part =>
                <Part key={part.id} part={part} />
            )}
        </div>
    );
};

const Part = (props) => {
    return (
        <p>
            {props.part.name} {props.part.exercises}
        </p>
    );
};

const Total = (props) => {
    const initialValue = 0;
    const sumWithInitialValue = props.course.parts.reduce(
        (previousValue, currentValue) => previousValue + currentValue.exercises,
        initialValue
    );

    return (
        <p><strong>Total of {sumWithInitialValue}</strong></p>
    );
};

export default Course;
