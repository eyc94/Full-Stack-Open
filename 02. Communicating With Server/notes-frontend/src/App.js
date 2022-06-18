import React from "react";

const App = (props) => {
    const { notes } = props;

    return (
        <div>
            <h1>Notes</h1>
            <ul>
                <li>{notes[0].content}</li>
                <li>{notes[0].content}</li>
                <li>{notes[0].content}</li>
            </ul>
        </div>
    );
};

export default App;
