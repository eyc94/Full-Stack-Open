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
        </div>
    );
};

export default App;