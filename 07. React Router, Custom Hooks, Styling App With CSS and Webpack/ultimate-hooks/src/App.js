import { useState, useEffect } from "react";
import axios from "axios";

const useField = (type) => {
    const [value, setValue] = useState("");

    const onChange = (event) => {
        setValue(event.target.value);
    };

    return {
        type,
        value,
        onChange
    };
};

const useResource = (baseUrl) => {
    const [resources, setResources] = useState([]);

    // ...

    const create = (resource) => {
        // ...
    };

    const service = {
        create
    };

    return [
        resources, service
    ];
};

const App = () => {
    const content = useField("text");
    const name = useField("text");
    const number = useField("text");

    const [notes, noteService] = useResource("http://localhost:3001/notes");
    const [persons, personService] = useResource("http://localhost:3001/persons");

    const handleNoteSubmit = (event) => {
        event.preventDefault();
        noteService.create({ content: content.value });
    };

    const handlePersonSubmit = (event) => {
        event.preventDefault();
        personService.create({ name: name.value, number: number.value });
    };

    return (
        <div>
            <h2>Notes</h2>
            <form onSubmit={handleNoteSubmit}>
                <input {...content} />
                <button>Create</button>
            </form>
            {notes.map(n => <p key={n.id}>{n.content}</p>)}

            <h2>Persons</h2>
            <form onSubmit={handlePersonSubmit}>
                Name: <input {...name} /> <br />
                Number: <input {...number} />
                <button>Create</button>
            </form>
            {persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)}
        </div>
    );
};

export default App;
