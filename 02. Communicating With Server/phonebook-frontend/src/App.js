import React, { useState } from "react";

const App = () => {
    const [persons, setPersons] = useState([
        { name: "Arto Hellas" }
    ]);
    const [newName, setNewName] = useState("");

    return (
        <div>
            <h2>Phonebook</h2>
            <form>
                <div>
                    Name: <input />
                </div>
                <div>
                    <button type="submit">Add</button>
                </div>
            </form>
            <h2>Numbers</h2>
            {persons.map(person =>
                <div key={person.name}>{person.name}</div>
            )}
        </div>
    );
};

export default App;
