const Hello = () => {
    return (
        <div>
            <p>Hello world</p>
        </div>
    )
};

const App = () => {
    return (
        <div>
            <p>Greetings</p>
            <Hello />
            <Hello />
            <Hello />
        </div>
    );
};

export default App;