import React, { useState } from "react";

import Persons from "./components/Persons";

const App = () => {
    const [persons, setPersons] = useState([
        { name: "Arto Hellas", number: "040-1234567", id: 1 },
        { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
        { name: "Dan Abramov", number: "12-43-234345", id: 3 },
        { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 }
    ]);

    const [newName, setNewName] = useState("");
    const [newNumber, setNewNumber] = useState("");
    const [newFilter, setNewFilter] = useState("");

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

    const handleFilterChange = (event) => {
        setNewFilter(event.target.value);
    }

    const personsToShow = persons.filter(person => person.name.toLowerCase().includes(newFilter));

    return (
        <div>
            <h2>Phonebook</h2>
            <div>Filter shown with <input value={newFilter} onChange={handleFilterChange} /></div>
            <h2>Add New</h2>
            <form onSubmit={addPerson}>
                <div>Name: <input value={newName} onChange={handleNameChange} /></div>
                <div>Number: <input value={newNumber} onChange={handleNumberChange} /></div>
                <div><button type="submit">Add</button></div>
            </form>
            <h2>Numbers</h2>
            <Persons persons={personsToShow} />
        </div>
    );
};

export default App;
