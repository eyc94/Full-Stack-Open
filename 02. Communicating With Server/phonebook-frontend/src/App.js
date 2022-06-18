import React, { useState } from "react";

const App = () => {
    const [persons, setPersons] = useState([
        { name: "Arto Hellas", number: "040-1234567" }
    ]);
    const [newName, setNewName] = useState("");
    const [newNumber, setNewNumber] = useState("");

    const addPerson = (event) => {
        event.preventDefault();

        const personObject = {
            name: newName,
            number: newNumber
        };

        if (persons.filter(person => person.name.toLowerCase() === newName.toLowerCase()).length > 0) {
            alert(`${newName} is already added to the phonebook!`);
        } else {
            setPersons(persons.concat(personObject));
        }

        setNewName("");
        setNewNumber("");
    }

    const handleNameChange = (event) => {
        setNewName(event.target.value);
    };

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value);
    };

    return (
        <div>
            <h2>Phonebook</h2>
            <form onSubmit={addPerson}>
                <div>Name: <input value={newName} onChange={handleNameChange} /></div>
                <div>Number: <input value={newNumber} onChange={handleNumberChange} /></div>
                <div><button type="submit">Add</button></div>
            </form>
            <h2>Numbers</h2>
            {persons.map(person =>
                <div key={person.name}>{person.name} {person.number}</div>
            )}
        </div>
    );
};

export default App;
