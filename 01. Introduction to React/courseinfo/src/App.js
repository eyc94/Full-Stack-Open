const Header = (props) => {
    return (
        <h1>{props.course}</h1>
    );
};

const Content = (props) => {
    return (
        <div>
            <Part part={props.part1} />
            <Part part={props.part2} />
            <Part part={props.part3} />
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
    return (
        <p>Number of exercises {props.part1.exercises + props.part2.exercises + props.part3.exercises}</p>
    );
};


const App = () => {
    const course = "Half Stack application development";

    const parts = [
        {
            name: "Fundamentals of React",
            exercises: 10
        },
        {
            name: "Using props to pass data",
            exercises: 7
        },
        {
            name: "State of a component",
            exercises: 14
        }
    ];

    return (
        <div>
            <Header course={course} />
            <Content parts={parts} />
            <Total parts={parts} />
        </div>
    );
};

export default App;